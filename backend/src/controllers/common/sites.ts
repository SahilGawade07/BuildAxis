import { Request, Response } from "express";
import mongoose from "mongoose";
import { Site } from "../../models/Site";

export const getsites = async (req: Request, res: Response) => {
    const { orgId } = req.params;

    try {
      
    
        const sites = await Site.find({ orgId: orgId });
        console.log(orgId)
        console.log("request are resived")
        if (!sites || sites.length === 0) {
            
            return res.status(404).json({ message: "No sites found for this orgId" });
        }
console.log("return the data")
        res.json(sites);
    } catch (err: any) {
        console.log("error")
        res.status(500).json({ error: err.message });
    }
};
