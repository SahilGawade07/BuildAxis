import { Request, Response } from "express";
import { Service } from "../../models/Services";

export const addService = async (req: Request, res: Response) => {
  try {
    const { serviceName } = req.body;

    if (!serviceName || typeof serviceName !== "string") {
      return res.status(400).json({
        success: false,
        message: "Service name is required and must be a string.",
      });
    }

    const existingService = await Service.findOne({
      serviceName: { $regex: new RegExp("^" + serviceName + "$", "i") },
    });
    if (existingService) {
      return res.status(409).json({
        success: false,
        message: "Service with this name already exists.",
      });
    }

    const newService = await Service.create({ serviceName });

    return res.status(201).json({
      success: true,
      message: "Service added successfully.",
      data: {
        serviceId: newService._id,
        serviceName: newService.serviceName,
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error while adding service.",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
