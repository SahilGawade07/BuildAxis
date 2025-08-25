import { Request, Response } from "express";
import { Expense } from "../../models/Expense";
import { Site } from "../../models/Site";

export const updateExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.expenseId;
    const {
      description,
      amount,
      date,
      paidBy,
      paymentMethod,
      category,
      status,
      vendor,
      note,
      dueAmount,
      orgId,
    } = req.body;

    const dbUser = (req as any).dbUser;

    if (!expenseId) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required",
      });
    }

    //  Find expense
    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    //  Validate site & organisation access
    const site = await Site.findById(expense.siteId);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Associated site not found",
      });
    }

    if (String(site.orgId) !== String(orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organisation",
      });
    }

    // ✅ Update allowed fields
    expense.description = description || expense.description;
    expense.amount = amount ?? expense.amount;
    expense.date = date || expense.date;
    expense.paidBy = paidBy || expense.paidBy;
    expense.paymentMethod = paymentMethod || expense.paymentMethod;
    expense.category = category || expense.category;
    // Handle receiptUrls array - for now, keep it simple
    // In a real implementation, you might want to handle file uploads here too
    expense.status = status || expense.status;
    expense.vendor = vendor || expense.vendor;
    expense.note = note || expense.note;
    expense.dueAmount = dueAmount ?? expense.dueAmount;

    await expense.save();

    return res.status(200).json({
      success: true,
      message: "Expense updated successfully",
      data: expense,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteExpense = async (req: Request, res: Response) => {
  try {
    const expenseId = req.params.expenseId;
    const orgId = req.body.orgId;
    const dbUser = (req as any).dbUser;

    if (!expenseId) {
      return res.status(400).json({
        success: false,
        message: "Expense ID is required",
      });
    }

    const expense = await Expense.findById(expenseId);
    if (!expense) {
      return res.status(404).json({
        success: false,
        message: "Expense not found",
      });
    }

    const site = await Site.findById(expense.siteId);
    if (!site) {
      return res.status(404).json({
        success: false,
        message: "Associated site not found",
      });
    }

    if (String(site.orgId) !== String(orgId)) {
      return res.status(403).json({
        success: false,
        message: "You do not have access to this organisation",
      });
    }

    // Optional: role check for promoter
    if (dbUser.role !== "promoter") {
      return res.status(403).json({
        success: false,
        message: "Only promoters can delete expenses",
      });
    }

    await Expense.findByIdAndDelete(expenseId);

    return res.status(200).json({
      success: true,
      message: "Expense deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
