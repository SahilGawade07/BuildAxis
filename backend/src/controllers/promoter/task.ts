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



export const updateTask = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user.id;
    const userRole = (req as any).user.role; // "promoter" or "supervisor"
    const { taskId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(taskId)) {
      return res.status(400).json({ success: false, message: "Invalid task ID" });
    }

    const task = await Task.findById(taskId).populate("site");
    if (!task) {
      return res.status(404).json({ success: false, message: "Task not found" });
    }

    // Check role permission: only promoter (creator) or assigned supervisor can update
    if (
      !(
        task.createdBy.toString() === userId ||
        (userRole === "supervisor" && task.supervisors.some(id => id.toString() === userId))
      )
    ) {
      return res.status(403).json({ success: false, message: "Not authorized to update this task" });
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
      usedInventory, // [{ inventoryId, usedQuantity }]
    } = req.body;

    // ✅ Update general fields if provided
    if (title) task.title = title.trim();
    if (description) task.description = description.trim();
    if (status) task.status = status;
    if (priority) task.priority = priority;
    if (due) task.due = new Date(due);
    if (progress !== undefined) task.progress = progress;
    if (attachment) task.attachment = attachment;

    // ✅ Handle images (append instead of replacing)
    if (Array.isArray(images) && images.length > 0) {
      task.images.push(...images.filter((url: string) => typeof url === "string" && url.trim() !== ""));
    }

    // ✅ Handle Inventory usage
    if (Array.isArray(usedInventory) && usedInventory.length > 0) {
      for (const item of usedInventory) {
        const { inventoryId, usedQuantity } = item;

        if (!mongoose.Types.ObjectId.isValid(inventoryId)) {
          return res.status(400).json({ success: false, message: `Invalid inventory ID: ${inventoryId}` });
        }

        const inventory = await Inventory.findById(inventoryId);
        if (!inventory) {
          return res.status(404).json({ success: false, message: `Inventory not found: ${inventoryId}` });
        }

        // Ensure same site inventory
        if (inventory.siteId.toString() !== task.site.toString()) {
          return res.status(400).json({ success: false, message: "Inventory does not belong to this task's site" });
        }

        // Check stock availability
        if (usedQuantity > inventory.quantity) {
          return res.status(400).json({
            success: false,
            message: `Not enough stock for ${inventory.name}. Available: ${inventory.quantity}, requested: ${usedQuantity}`,
          });
        }

        // Deduct stock
        inventory.quantity -= usedQuantity;
        await inventory.save();

        // Add to task’s inventoryUsed if not already there
        if (!task.inventoryUsed.some(id => id.toString() === inventoryId)) {
          task.inventoryUsed.push(new mongoose.Types.ObjectId(inventoryId));
        }
      }
    }

    await task.save();

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
    return res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
