// controllers/supervisor/task.controller.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../../models/User";
import { Labour } from "../../models/Labour";
import { Site } from "../../models/Site";
import { Inventory } from "../../models/Inventory";
import { Task } from "../../models/Task";

// Request body interface
interface CreateTaskBody {
  title: string;
  site: string; // Site ID
  labourers: string[]; // Labourer IDs
  status:
    | "open"
    | "in_progress"
    | "completed"
    | "verified"
    | "closed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due: string; // ISO date string
  inventoryUsed?: string[];
  description?: string;
  attachment?: string;
  images?: string[];
}

/**
 * Controller: createTaskS
 * Description: Allows a supervisor to create a task and assign it to labourers.
 * Requires middleware chain: authenticateJWT → isAuthenticated → isSupervisor
 */
export const createTaskS = async (req: Request, res: Response) => {
  try {
    // ✅ Trusted: supervisorId from JWT, validated by middleware
    const supervisorId = new mongoose.Types.ObjectId((req as any).user.id);

    const {
      title,
      site,
      labourers = [],
      status = "open", // default to 'open'
      priority = "medium", // default
      due,
      inventoryUsed = [],
      description = "",
      attachment = "",
      images = [],
    } = req.body as CreateTaskBody;

    // 1. Validate required fields
    if (!title?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Task title is required.",
      });
    }

    if (!site || !mongoose.Types.ObjectId.isValid(site)) {
      return res.status(400).json({
        success: false,
        message: "Valid site ID is required.",
      });
    }

    const validStatuses = [
      "open",
      "in_progress",
      "completed",
      "verified",
      "closed",
      "cancelled",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const validPriorities = ["low", "medium", "high", "urgent"];
    if (!validPriorities.includes(priority)) {
      return res.status(400).json({
        success: false,
        message: `Priority must be one of: ${validPriorities.join(", ")}`,
      });
    }

    if (!due) {
      return res.status(400).json({
        success: false,
        message: "Due date is required.",
      });
    }

    const dueDate = new Date(due);
    if (isNaN(dueDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Invalid due date format. Use ISO string.",
      });
    }

    // 2. Validate site exists
    const siteExists = await Site.findById(site);
    if (!siteExists) {
      return res.status(400).json({
        success: false,
        message: "Site not found.",
      });
    }

    // 🔒 Optional: Ensure supervisor has access to this site
    // Example: if you have a `supervisorSites` field in User model
    // if (!siteExists.assignedSupervisors?.includes(supervisorId)) {
    //   return res.status(403).json({
    //     success: false,
    //     message: "You are not authorized to create tasks for this site.",
    //   });
    // }

    // 3. Validate labourers
    if (labourers.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one labourer must be assigned.",
      });
    }

    const validLabourerIds = labourers.every((id) =>
      mongoose.Types.ObjectId.isValid(id)
    );
    if (!validLabourerIds) {
      return res.status(400).json({
        success: false,
        message: "One or more labourer IDs are invalid.",
      });
    }

    const labourerIds = labourers.map((id) => new mongoose.Types.ObjectId(id));
    const foundLabourers = await Labour.find({
      _id: { $in: labourerIds },
    }).select("_id");

    if (foundLabourers.length !== labourerIds.length) {
      return res.status(400).json({
        success: false,
        message: "One or more labourers not found.",
      });
    }

    // 4. Validate inventoryUsed (if provided)
    const inventoryIds: mongoose.Types.ObjectId[] = [];
    if (inventoryUsed.length > 0) {
      const validIds = inventoryUsed.every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (!validIds) {
        return res.status(400).json({
          success: false,
          message: "One or more inventory IDs are invalid.",
        });
      }

      const ids = inventoryUsed.map((id) => new mongoose.Types.ObjectId(id));
      const inventoryCount = await Inventory.countDocuments({
        _id: { $in: ids },
      });

      if (inventoryCount !== ids.length) {
        return res.status(400).json({
          success: false,
          message: "One or more inventory items not found.",
        });
      }
      inventoryIds.push(...ids);
    }

    // 5. Validate images
    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array.",
      });
    }

    const cleanedImages = images
      .filter((url): url is string => typeof url === "string")
      .map((url) => url.trim())
      .filter((url) => url !== "");

    // 6. Create new task
    const newTask = new Task({
      title: title.trim(),
      site: new mongoose.Types.ObjectId(site),
      createdBy: supervisorId,
      supervisors: [supervisorId], // Optional: auto-add self as supervisor
      labourers: labourerIds,
      status,
      priority,
      due: dueDate,
      inventoryUsed: inventoryIds,
      description: description.trim(),
      attachment: attachment.trim() || undefined,
      images: cleanedImages,
    });

    const savedTask = await newTask.save();

    // 7. Populate and return response
    const populatedTask = await Task.findById(savedTask._id)
      .populate("site", "name location")
      .populate("createdBy", "name phone role")
      .populate("supervisors", "name phone")
      .populate("labourers", "name phone skill")
      .populate("inventoryUsed", "itemName quantity unit")
      .lean();

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task: populatedTask,
    });
  } catch (error: any) {
    console.error("Error in createTaskS:", error);

    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format detected.",
      });
    }

    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        details: error.message,
      });
    }

    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};
