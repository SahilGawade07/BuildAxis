import { Request, Response, NextFunction } from "express";
import { Task } from "../../models/Task";
import { Site } from "../../models/Site";
import { User } from "../../models/User";
import { Labour } from "../../models/Labour";
import { Types } from "mongoose";
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
    const { taskId } = req.params;
    const user = (req as any).dbUser;

    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    }

    const {
      title,
      supervisors,
      images,
      status,
      priority,
      due,
      inventoryUsed, // expected: [{ inventoryId, quantity }]
      description,
      attachment,
      progress,
    } = req.body;

    // ✅ Permission Check
    const canUpdate =
      task.createdBy.equals(user._id) ||
      task.supervisors.some((sup: Types.ObjectId) => sup.equals(user._id)) ||
      user.role === "promoter";

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this task",
      });
    }

    // ✅ Validate supervisors if updated
    if (supervisors) {
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
    }

    // ✅ Handle inventory usage (decrement stock)
    if (Array.isArray(inventoryUsed)) {
      for (const item of inventoryUsed) {
        const { inventoryId, quantity } = item;

        if (!Types.ObjectId.isValid(inventoryId)) {
          return res.status(400).json({
            success: false,
            message: `Invalid inventoryId: ${inventoryId}`,
          });
        }

        const inventory = await Inventory.findById(inventoryId);
        if (!inventory) {
          return res.status(404).json({
            success: false,
            message: `Inventory item not found: ${inventoryId}`,
          });
        }

        if (inventory.quantity < quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for ${inventory.name}. Available: ${inventory.quantity}, Requested: ${quantity}`,
          });
        }

        inventory.quantity -= quantity;
        await inventory.save();
      }
    }

    // ✅ Update Task
    const updatedTask = await Task.findByIdAndUpdate(
      task._id,
      {
        ...(title && { title }),
        ...(supervisors && { supervisors }),
        ...(images && { images }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(due && { due }),
        ...(description !== undefined && { description }),
        ...(attachment !== undefined && { attachment }),
        ...(progress !== undefined && { progress }),
        ...(inventoryUsed && { inventoryUsed }),
      },
      { new: true }
    )
      .populate("site", "name location")
      .populate("createdBy", "fName lName email")
      .populate("supervisors", "fName lName email")
      .populate("inventoryUsed.inventoryId", "name quantity unit");

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    console.error("Error updating task:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
