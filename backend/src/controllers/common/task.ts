import { Request, Response, NextFunction } from "express";
import { Task } from "../../models/Task";
import { Site } from "../../models/Site";
import { User } from "../../models/User";
import { Types } from "mongoose";

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
      supervisors,
      images,
      site,
      assignedTo,
      status,
      priority,
      due,
      inventoryUsed,
      description,
      attachment,
    } = req.body;

    const user = (req as any).dbUser;

    if (!title || !site) {
      return res.status(400).json({
        success: false,
        message: "Title and site are required fields",
      });
    }

    // Validate assigned user belongs to same organization
    if (assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser || String(assignedUser.orgId) !== String(user.orgId)) {
        return res.status(400).json({
          success: false,
          message: "Assigned user not found or not in your organization",
        });
      }
    }

    // Validate supervisors belong to same organization
    if (supervisors && supervisors.length > 0) {
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

    const newTask = await Task.create({
      title,
      supervisors: supervisors || [],
      images: images || [],
      site,
      createdBy: user._id,
      assignedTo,
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
      .populate("assignedTo", "fName lName email")
      .populate("supervisors", "fName lName email");

    return res.status(201).json({
      success: true,
      message: "Task created successfully",
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

// Get Task by ID
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

// Update Task
export const updateTask = async (req: Request, res: Response) => {
  try {
    const task = (req as any).task;
    const user = (req as any).dbUser;
    const {
      title,
      supervisors,
      images,
      assignedTo,
      status,
      priority,
      due,
      inventoryUsed,
      description,
      attachment,
    } = req.body;

    // Check permissions - only creator, assigned user, or supervisors can update
    const canUpdate =
      task.createdBy.equals(user._id) ||
      (task.assignedTo && task.assignedTo.equals(user._id)) ||
      task.supervisors.some((supervisor: Types.ObjectId) =>
        supervisor.equals(user._id)
      ) ||
      user.role === "promoter";

    if (!canUpdate) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to update this task",
      });
    }

    // Validate assigned user if being updated
    if (assignedTo && assignedTo !== task.assignedTo) {
      const assignedUser = await User.findById(assignedTo);
      if (!assignedUser || String(assignedUser.orgId) !== String(user.orgId)) {
        return res.status(400).json({
          success: false,
          message: "Assigned user not found or not in your organization",
        });
      }
    }

    // Validate supervisors if being updated
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

    // Update task
    const updatedTask = await Task.findByIdAndUpdate(
      task._id,
      {
        ...(title && { title }),
        ...(supervisors && { supervisors }),
        ...(images && { images }),
        ...(assignedTo !== undefined && { assignedTo }),
        ...(status && { status }),
        ...(priority && { priority }),
        ...(due && { due }),
        ...(inventoryUsed !== undefined && { inventoryUsed }),
        ...(description !== undefined && { description }),
        ...(attachment !== undefined && { attachment }),
      },
      { new: true }
    )
      .populate("site", "name location")
      .populate("createdBy", "fName lName email")
      .populate("assignedTo", "fName lName email")
      .populate("supervisors", "fName lName email")
      .populate("inventoryUsed", "name quantity");

    return res.status(200).json({
      success: true,
      message: "Task updated successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Delete Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const task = (req as any).task;
    const user = (req as any).dbUser;

    // Only creator or promoter can delete task
    if (!task.createdBy.equals(user._id) && user.role !== "promoter") {
      return res.status(403).json({
        success: false,
        message: "Only task creator or promoter can delete this task",
      });
    }

    await Task.findByIdAndDelete(task._id);

    return res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Get Tasks by Status
export const getTasksByStatus = async (req: Request, res: Response) => {
  try {
    const user = (req as any).dbUser;
    const { status } = req.params;

    if (
      ![
        "open",
        "in_progress",
        "completed",
        "verified",
        "closed",
        "cancelled",
      ].includes(status)
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid status value",
      });
    }

    // Get sites that belong to user's organization
    const userSites = await Site.find({ organisationId: user.orgId }).select(
      "_id"
    );
    const siteIds = userSites.map((site) => site._id);

    const tasks = await Task.find({
      site: { $in: siteIds },
      status: status,
    })
      .populate("site", "name location")
      .populate("createdBy", "fName lName email")
      .populate("assignedTo", "fName lName email")
      .populate("supervisors", "fName lName email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: `Tasks with status '${status}' retrieved successfully`,
      data: tasks,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

// Assign Task to User
export const assignTask = async (req: Request, res: Response) => {
  try {
    const task = (req as any).task;
    const user = (req as any).dbUser;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: "Assigned user ID is required",
      });
    }

    // Only creator, supervisor, or promoter can assign task
    const canAssign =
      task.createdBy.equals(user._id) ||
      task.supervisors.some((supervisor: Types.ObjectId) =>
        supervisor.equals(user._id)
      ) ||
      user.role === "promoter";

    if (!canAssign) {
      return res.status(403).json({
        success: false,
        message: "You don't have permission to assign this task",
      });
    }

    // Validate assigned user
    const assignedUser = await User.findById(assignedTo);
    if (!assignedUser || String(assignedUser.orgId) !== String(user.orgId)) {
      return res.status(400).json({
        success: false,
        message: "Assigned user not found or not in your organization",
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      task._id,
      { assignedTo, status: "in_progress" },
      { new: true }
    )
      .populate("site", "name location")
      .populate("createdBy", "fName lName email")
      .populate("assignedTo", "fName lName email")
      .populate("supervisors", "fName lName email");

    return res.status(200).json({
      success: true,
      message: "Task assigned successfully",
      data: updatedTask,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
