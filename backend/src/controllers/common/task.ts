import { Request, Response, NextFunction } from "express";
import { Task } from "../../models/Task";
import { Site } from "../../models/Site";
import { User } from "../../models/User";
import { Labour } from "../../models/Labour";
import mongoose, { Types } from "mongoose";
import { Inventory } from "../../models/Inventory";

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

// Create Task
export const createTask = async (req: Request, res: Response) => {
  try {
    const {
      title,
      site,
      supervisors,
      assignedToSupervisors,
      assignedToLabourers,
      status,
      priority,
      due,
      inventoryUsed,
      description,
      attachment,
    } = req.body;

    const user = (req as any).dbUser;

    // ✅ Validate required fields
    if (!title || !site) {
      return res.status(400).json({
        success: false,
        message: "Title and site are required fields",
      });
    }

    const supervisorAssignIds = Array.isArray(assignedToSupervisors)
      ? assignedToSupervisors
      : [];

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

    // --- Validate assignedToLabourers ---
    const labourerAssignIds = Array.isArray(assignedToLabourers)
      ? assignedToLabourers
      : [];

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

    // --- Validate supervisors (task overseers) ---
    const supervisorIds = Array.isArray(supervisors) ? supervisors : [];
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

    // --- Create the task ---
    const newTask = await Task.create({
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
      attachment,
    });

    const populatedTask = await Task.findById(newTask._id)
      .populate("site", "name location")
      .populate("createdBy", "fName lName email")
      .populate("assignedToSupervisors", "fName lName email role") // Populate assigned supervisors
      .populate("assignedToLabourers", "fName lName phone email") // Adjust fields as per Labour schema
      .populate("supervisors", "fName lName email"); // Task overseers

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
      data: populatedTask,
    });
  } catch (error) {
    console.error("Error creating task:", error);
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

// Get All Tasks (with filters)
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
      .populate("assignedTo", "fName lName email")
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
    const isSupervisor =
      Array.isArray(task.supervisors) &&
      task.supervisors.some((id) => id.toString() === userId);

    if (
      !(
        isCreator ||
        (userRole === "supervisor" && isSupervisor) ||
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
      // Ensure task.attachment is always an array
      if (!Array.isArray(task.attachment)) {
        // If it's a string (old data), convert to array
        task.attachment = task.attachment ? [task.attachment] : [];
      }

      if (Array.isArray(attachment)) {
        task.attachment.push(
          ...attachment.filter(
            (url: string) => typeof url === "string" && url.trim() !== ""
          )
        );
      } else if (typeof attachment === "string") {
        task.attachment.push(attachment.trim());
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
