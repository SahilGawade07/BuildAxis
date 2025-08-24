import { Request, Response, NextFunction } from "express";
import { Task } from "../../models/Task";
import { Site } from "../../models/Site";
import { User } from "../../models/User";
import { Labour } from "../../models/Labour";
import mongoose, { Types } from "mongoose";
import { Inventory } from "../../models/Inventory";
import { uploadOnCloudinary } from "../../utils/cloudinary";

export const checkSiteAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).dbUser;
    const siteId = req.body.site || req.query.siteId || req.params.siteId;

    if (!siteId) {
      return res.status(400).json({
        success: false,
        message: "Site ID is required",
      });
    }

    const site = await Site.findById(siteId);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    // Check if user has access to this site (same organization)
    if (String(site.orgId) !== String(user.orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this site",
      });
    }

    (req as any).site = site;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const checkTaskAccess = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const user = (req as any).dbUser;
    const taskId = req.params.taskId;

    if (!taskId) {
      return res.status(400).json({
        success: false,
        message: "Task ID is required",
      });
    }

    const task = await Task.findById(taskId).populate("site");
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const site = task.site as any;

    // Check if user has access to this task's site
    if (String(site.organisationId) !== String(user.orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this task",
      });
    }

    (req as any).task = task;
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Create Task with file upload support
export const createTask = async (req: Request, res: Response) => {
  try {
    console.log("Create task request body:", req.body); // Debug log
    console.log("Create task user:", (req as any).dbUser); // Debug log
    console.log("Create task files:", req.files); // Debug log for files

    const {
      title,
      site,
      supervisors,
      assignedToSupervisors,
      assignedToLabourers,
      status,
      priority,
      due,
      inventoryUsed = [],
      description,
      materials,
    } = req.body;

    const user = (req as any).dbUser;

    // ✅ Validate required fields
    if (!title || !title.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required",
      });
    }

    if (!site) {
      return res.status(400).json({
        success: false,
        message: "Site ID is required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(site)) {
      return res.status(400).json({
        success: false,
        message: "Invalid site ID format",
      });
    }

    // Validate that the site exists and user has access to it
    const siteExists = await Site.findById(site);
    if (!siteExists) {
      return res.status(404).json({
        success: false,
        message: "Site not found",
      });
    }

    // Check if user has access to this site
    if (String(siteExists.orgId) !== String(user.orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this site",
      });
    }

    // Handle file uploads - upload to Cloudinary and store URLs
    const attachments: string[] = [];
    const images: string[] = [];

    console.log("Files received:", req.files); // Debug log

    if (req.files && Array.isArray(req.files)) {
      for (const file of req.files as Express.Multer.File[]) {
        try {
          console.log("Processing file:", file.originalname, "Path:", file.path);

          // Upload file to Cloudinary
          const uploadResult = await uploadOnCloudinary(file.path);

          if (uploadResult?.secure_url) {
            // Determine if it's an image or document based on mimetype
            if (file.mimetype.startsWith("image/")) {
              images.push(uploadResult.secure_url);
              console.log(
                "Image uploaded to Cloudinary:",
                uploadResult.secure_url
              );
            } else {
              attachments.push(uploadResult.secure_url);
              console.log(
                "Document uploaded to Cloudinary:",
                uploadResult.secure_url
              );
            }
          } else {
            console.error(
              "Failed to upload file to Cloudinary:",
              file.originalname
            );
          }
        } catch (uploadError) {
          console.error("Error uploading file to Cloudinary:", uploadError);
          // Continue with other files
        }
      }
    } else {
      console.log("No files received or files is not an array");
    }

    // Parse arrays from JSON strings
    const supervisorAssignIds = Array.isArray(assignedToSupervisors)
      ? assignedToSupervisors
      : assignedToSupervisors
      ? JSON.parse(assignedToSupervisors)
      : [];

    const labourerAssignIds = Array.isArray(assignedToLabourers)
      ? assignedToLabourers
      : assignedToLabourers
      ? JSON.parse(assignedToLabourers)
      : [];

    const supervisorIds = Array.isArray(supervisors)
      ? supervisors
      : supervisors
      ? JSON.parse(supervisors)
      : [];

    // Validate assignedToSupervisors
    if (supervisorAssignIds.length > 0) {
      const supervisorsToAssign = await User.find({
        _id: { $in: supervisorAssignIds },
        orgId: user.orgId,
        role: "supervisor",
      });

      if (supervisorsToAssign.length !== supervisorAssignIds.length) {
        return res.status(400).json({
          success: false,
          message:
            "One or more assigned supervisors are invalid, not in your organization, or not supervisors",
        });
      }
    }

    // Validate assignedToLabourers
    if (labourerAssignIds.length > 0) {
      const labourersToAssign = await Labour.find({
        _id: { $in: labourerAssignIds },
        orgId: user.orgId,
      });

      if (labourersToAssign.length !== labourerAssignIds.length) {
        return res.status(400).json({
          success: false,
          message:
            "One or more assigned labourers are invalid or not in your organization",
        });
      }
    }

    // Validate due date
    if (!due) {
      return res.status(400).json({
        success: false,
        message: "Due date is required",
      });
    }

    const dueDate = new Date(due);
    if (isNaN(dueDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date format",
      });
    }

    // Validate supervisors (task overseers)
    if (supervisorIds.length > 0) {
      const validSupervisors = await User.find({
        _id: { $in: supervisorIds },
        orgId: user.orgId,
        role: "supervisor",
      });

      if (validSupervisors.length !== supervisorIds.length) {
        return res.status(400).json({
          success: false,
          message:
            "One or more supervisors (overseers) are invalid or not in your organization",
        });
      }
    }

    // Parse materials safely
    let parsedMaterials = [];
    if (materials) {
      try {
        parsedMaterials =
          typeof materials === "string" ? JSON.parse(materials) : materials;

        // Validate materials structure
        if (Array.isArray(parsedMaterials)) {
          for (const material of parsedMaterials) {
            if (
              !material.name ||
              typeof material.quantity !== "number" ||
              !material.unit
            ) {
              return res.status(400).json({
                success: false,
                message:
                  "Invalid material format. Each material must have name, quantity, and unit",
              });
            }
          }
        } else {
          return res.status(400).json({
            success: false,
            message: "Materials must be an array",
          });
        }
      } catch (parseError) {
        console.error("Error parsing materials:", parseError);
        return res.status(400).json({
          success: false,
          message: "Invalid materials format",
        });
      }
    }

    console.log("Creating task with data:", {
      title,
      supervisors: supervisorIds,
      site,
      createdBy: user._id,
      assignedToSupervisors: supervisorAssignIds,
      assignedToLabourers: labourerAssignIds,
      status: status || "open",
      priority: priority || "medium",
      due,
      inventoryUsed,
      description,
      attachments,
      images,
      materials: parsedMaterials,
    });

    // Create the task
    console.log("About to create task with validated data:", {
      title: title.trim(),
      supervisors: supervisorIds.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      ),
      site: new mongoose.Types.ObjectId(site),
      createdBy: user._id,
      assignedToSupervisors: supervisorAssignIds.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      ),
      assignedToLabourers: labourerAssignIds.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      ),
      status: status || "open",
      priority: priority || "medium",
      due: dueDate,
      inventoryUsed: [],
      description: description || "",
      attachments,
      images,
      materials: parsedMaterials,
    });

    const newTask = await Task.create({
      title: title.trim(),
      supervisors: supervisorIds.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      ), // Task overseers (only for promoters)
      site: new mongoose.Types.ObjectId(site),
      createdBy: user._id,
      assignedToSupervisors: supervisorAssignIds.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      ), // Supervisors assigned to work on task
      assignedToLabourers: labourerAssignIds.map(
        (id: string) => new mongoose.Types.ObjectId(id)
      ),
      status: status || "open",
      priority: priority || "medium",
      due: dueDate, // This should be the validated dueDate
      inventoryUsed: [],
      description: description || "",
      attachments, // Store Cloudinary URLs
      images, // Store Cloudinary URLs
      materials: parsedMaterials,
    });

    console.log("Task created successfully:", newTask._id);

    const populatedTask = await Task.findById(newTask._id)
      .populate("site", "name location")
      .populate("createdBy", "fName lName email")
      .populate("assignedToSupervisors", "fName lName email role")
      .populate("assignedToLabourers", "fName lName phone email")
      .populate("supervisors", "fName lName email");

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: populatedTask,
    });
  } catch (error: any) {
    console.error("Error creating task:", error);
    console.error("Error details:", {
      name: error.name,
      message: error.message,
      stack: error.stack,
    });

    // Handle specific error types
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        error: error.message,
      });
    }

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format",
        error: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getTask = async (req: Request, res: Response) => {
  try {
    const task = (req as any).task;

    const populatedTask = await Task.findById(task._id)
      .populate("site", "name location")
      .populate("createdBy", "fName lName email")
      .populate("assignedTo", "fName lName email")
      .populate("supervisors", "fName lName email")
      .populate("inventoryUsed", "name quantity");

    return res.status(200).json({
      success: true,
      message: "Task retrieved successfully",
      data: populatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get All Tasks (with filters and role-based visibility)
export const getAllTasks = async (req: Request, res: Response) => {
  try {
    const user = (req as any).dbUser;
    const {
      siteId,
      status,
      priority,
      assignedTo,
      createdBy,
      page = 1,
      limit = 10,
      sortBy = "createdAt",
      sortOrder = "desc",
    } = req.query;

    // Build filter query
    const filter: any = {};

    // Get sites that belong to user's organization
    const userSites = await Site.find({ organisationId: user.orgId }).select(
      "_id"
    );
    const siteIds = userSites.map((site) => site._id);
    filter.site = { $in: siteIds };

    // Role-based filtering
    if (user.role === "supervisor") {
      // Supervisors can only see tasks they are assigned to or created by them
      filter.$or = [
        { createdBy: user._id },
        { assignedToSupervisors: user._id },
        {
          assignedToLabourers: {
            $in: await getLabourIdsForSupervisor(user._id),
          },
        },
      ];
    }
    // Promoters can see all tasks in their organization

    if (siteId) filter.site = siteId;
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (assignedTo) filter.assignedTo = assignedTo;
    if (createdBy) filter.createdBy = createdBy;

    const skip = (Number(page) - 1) * Number(limit);
    const sortOptions: any = {};
    sortOptions[sortBy as string] = sortOrder === "desc" ? -1 : 1;

    const tasks = await Task.find(filter)
      .populate("site", "name location")
      .populate("createdBy", "fName lName email")
      .populate("assignedToSupervisors", "fName lName email role")
      .populate("assignedToLabourers", "fName lName phone")
      .populate("supervisors", "fName lName email")
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(filter);

    return res.status(200).json({
      success: true,
      message: "Tasks retrieved successfully",
      data: {
        tasks,
        pagination: {
          current: Number(page),
          total: Math.ceil(total / Number(limit)),
          count: tasks.length,
          totalTasks: total,
        },
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Helper function to get labour IDs that a supervisor manages
async function getLabourIdsForSupervisor(
  supervisorId: string
): Promise<string[]> {
  try {
    // This would need to be implemented based on your labour-supervisor relationship
    // For now, returning empty array - you can implement this based on your data model
    return [];
  } catch (error) {
    console.error("Error getting labour IDs for supervisor:", error);
    return [];
  }
}

// ✅ Update Task Controller
export const updateTask = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user; // { id, role, orgId }
    const userId = user.id;
    const userRole = user.role; // "promoter" or "supervisor"
    const { taskId } = req.params;

    // ✅ Validate taskId
    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findById(taskId).populate("site");
    if (!task) {
      return res
        .status(404)
        .json({ success: false, message: "Task not found" });
    }

    // ✅ Safe permission check
    const isCreator = task.createdBy && task.createdBy.toString() === userId;
    const isAssignedSupervisor =
      Array.isArray(task.assignedToSupervisors) &&
      task.assignedToSupervisors.some((id) => id.toString() === userId);
    const isTaskOverseer =
      Array.isArray(task.supervisors) &&
      task.supervisors.some((id) => id.toString() === userId);

    // Promoters can update any task in their organization
    // Supervisors can only update tasks they are assigned to or created by them
    if (
      !(
        isCreator ||
        (userRole === "supervisor" &&
          (isAssignedSupervisor || isTaskOverseer)) ||
        userRole === "promoter"
      )
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized to update this task",
      });
    }

    const {
      title,
      description,
      status,
      priority,
      due,
      progress,
      attachment,
      images,
      supervisors,
      inventoryUsed, // [{ inventoryId, usedQuantity/quantity }]
    } = req.body;

    // ✅ Update general fields
    if (title) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (due) task.due = new Date(due);
    if (progress !== undefined) task.progress = progress;
    if (attachment !== undefined) {
      // Handle file attachments - store URLs directly
      if (Array.isArray(attachment)) {
        const attachmentUrls = attachment.filter(
          (url: string) => typeof url === "string" && url.trim() !== ""
        );

        if (!Array.isArray(task.attachments)) {
          task.attachments = [];
        }
        task.attachments.push(...attachmentUrls);
      } else if (typeof attachment === "string" && attachment.trim() !== "") {
        if (!Array.isArray(task.attachments)) {
          task.attachments = [];
        }
        task.attachments.push(attachment);
      }
    }

    // ✅ Handle images (append instead of replacing)
    if (Array.isArray(images) && images.length > 0) {
      task.images.push(
        ...images.filter(
          (url: string) => typeof url === "string" && url.trim() !== ""
        )
      );
    }

    // ✅ Update supervisors if provided
    if (Array.isArray(supervisors)) {
      const supervisorUsers = await User.find({
        _id: { $in: supervisors },
        orgId: user.orgId,
        role: "supervisor",
      });

      if (supervisorUsers.length !== supervisors.length) {
        return res.status(400).json({
          success: false,
          message:
            "One or more supervisors not found or not in your organization",
        });
      }

      task.supervisors = supervisors;
    }

    // ✅ Handle inventory usage
    if (Array.isArray(inventoryUsed) && inventoryUsed.length > 0) {
      for (const item of inventoryUsed) {
        const inventoryId = item.inventoryId;
        const usedQuantity = item.usedQuantity ?? item.quantity; // support both naming

        if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid inventory ID: ${inventoryId}`,
          });
        }

        const inventory = await Inventory.findById(inventoryId);
        if (!inventory) {
          return res.status(404).json({
            success: false,
            message: `Inventory not found: ${inventoryId}`,
          });
        }
        if (
          !inventory.siteId ||
          !task.site ||
          inventory.siteId.toString() !== task.site._id.toString()
        ) {
          return res.status(400).json({
            success: false,
            message: "Inventory does not belong to this task's site",
          });
        }

        // Check stock availability
        if (usedQuantity > inventory.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for ${inventory.name}. Available: ${inventory.quantity}, requested: ${usedQuantity}`,
          });
        }

        inventory.quantity -= usedQuantity;
        await inventory.save();

        // Add to task.inventoryUsed if not already there
        if (!task.inventoryUsed.some((id) => id.toString() === inventoryId)) {
          task.inventoryUsed.push(new mongoose.Types.ObjectId(inventoryId));
        }
      }
    }

    await task.save();

    // ✅ Populate detailed references
    const updatedTask = await Task.findById(task._id)
      .populate("site", "name location")
      .populate("createdBy", "name role phone")
      .populate("supervisors", "name phone")
      .populate("labourers", "name phone skill")
      .populate("inventoryUsed", "name specification quantity unit");

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task: updatedTask,
    });
  } catch (error: any) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
