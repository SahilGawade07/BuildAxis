// controllers/promoter/task.ts
import { Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../../models/User";
import { Labour } from "../../models/Labour";
import { Site } from "../../models/Site";
import { Task } from "../../models/Task";
import { Inventory } from "../../models/Inventory";


// Interface for request body
interface CreateTaskBody {
  title: string;
  site: string;
  supervisors?: string[];
  labourers?: string[];
  status:
    | "open"
    | "in_progress"
    | "completed"
    | "verified"
    | "closed"
    | "cancelled";
  priority: "low" | "medium" | "high" | "urgent";
  due: string;
  description?: string;
  attachment?: string;
  images?: string[];
}

export const createTask = async (req: Request, res: Response) => {
  try {
    const promoterId = new mongoose.Types.ObjectId((req as any).user.id);

    const {
      title,
      site,
      supervisors = [],
      labourers = [],
      status,
      priority,
      due,
      description = "",
      attachment = "",
      images = [],
    } = req.body as CreateTaskBody;

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
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Status must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const validPriorities = ["low", "medium", "high", "urgent"];
    if (!priority || !validPriorities.includes(priority)) {
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
        message:
          "Invalid due date format. Use ISO string (e.g., 2025-04-10T09:00:00Z).",
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

    // 3. Validate supervisors (if any)
    const supervisorIds: mongoose.Types.ObjectId[] = [];
    if (supervisors.length > 0) {
      const validIds = supervisors.every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (!validIds) {
        return res.status(400).json({
          success: false,
          message: "One or more supervisor IDs are invalid.",
        });
      }

      const ids = supervisors.map((id) => new mongoose.Types.ObjectId(id));
      const supervisorCount = await User.countDocuments({
        _id: { $in: ids },
        role: "supervisor",
      });

      if (supervisorCount !== ids.length) {
        return res.status(400).json({
          success: false,
          message: "One or more supervisors not found or invalid.",
        });
      }
      supervisorIds.push(...ids);
    }

    // 4. Validate labourers (if any)
    const labourerIds: mongoose.Types.ObjectId[] = [];
    if (labourers.length > 0) {
      const validIds = labourers.every((id) =>
        mongoose.Types.ObjectId.isValid(id)
      );
      if (!validIds) {
        return res.status(400).json({
          success: false,
          message: "One or more labourer IDs are invalid.",
        });
      }

      const ids = labourers.map((id) => new mongoose.Types.ObjectId(id));
      const labourerCount = await Labour.countDocuments({ _id: { $in: ids } });

      if (labourerCount !== ids.length) {
        return res.status(400).json({
          success: false,
          message: "One or more labourers not found.",
        });
      }
      labourerIds.push(...ids);
    }


    // Validate images
    if (!Array.isArray(images)) {
      return res.status(400).json({
        success: false,
        message: "Images must be an array of URLs.",
      });
    }

    const cleanedImages = images
      .filter((url): url is string => typeof url === "string")
      .map((url) => url.trim())
      .filter((url) => url !== "");

    // 7. Create task
    const newTask = new Task({
      title: title.trim(),
      site: new mongoose.Types.ObjectId(site),
      createdBy: promoterId,
      supervisors: supervisorIds,
      labourers: labourerIds,
      status,
      priority,
      due: dueDate,
      description: description.trim(),
      attachment: attachment.trim() || undefined,
      images: cleanedImages,
    });

    const savedTask = await newTask.save();

    // 8. Populate and return response
    const populatedTask = await Task.findById(savedTask._id)
      .populate("site", "name location")
      .populate("createdBy", "name phone role")
      .populate("supervisors", "name phone")
      .populate("labourers", "name phone skill")
      .lean(); // Use lean() for better performance

    return res.status(201).json({
      success: true,
      message: "Task created successfully.",
      task: populatedTask,
    });
  } catch (error: any) {
    console.error("Error in createTask:", error);

    // Handle invalid ObjectId format (CastError)
    if (error.name === "CastError") {
      return res.status(400).json({
        success: false,
        message: "Invalid ID format detected.",
      });
    }

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Validation failed.",
        details: error.message,
      });
    }

    // Generic server error
    return res.status(500).json({
      success: false,
      message: "Internal server error.",
      error: error.message,
    });
  }
};




