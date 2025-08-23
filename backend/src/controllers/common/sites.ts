import { Request, Response } from "express";
import mongoose from "mongoose";
import { Site } from "../../models/Site";

export const getsites = async (req: Request, res: Response) => {
    const { orgId } = req.params;

    try {
      
        const objectId = new mongoose.Types.ObjectId(orgId);

        const sites = await Site.find({ orgId: objectId });
        console.log(orgId)
        console.log(objectId)
        if (!sites || sites.length === 0) {
            return res.status(404).json({ message: "No sites found for this orgId" });
        }

        res.json(sites);
    } catch (err: any) {
        res.status(500).json({ error: err.message });
    }
};
