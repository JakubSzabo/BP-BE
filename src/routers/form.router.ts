import { Router, Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { FormModel } from "../models/form.model";
import { StatusCodes } from "../enums/statusCode.model";
import authenticateToken from "../authenticateToken.service";

const router = Router();

// Get All
router.get("", asyncHandler(
    async (req: any, res: any) => {
        const forms = await FormModel.find();
        if (forms.length < 1) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }
        res.send(forms);
    }
));

// Get By ID
router.get("/:id", asyncHandler(
    async (req: any, res: any) => {
        const formId = req.params.id;
        try {
            const form = await FormModel.findById(formId);
            if (!form) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }
            res.send(form);
        } catch (error) {
            console.error("Error fetching form by ID:", error);
            res.status(StatusCodes.ServerError.code).send(StatusCodes.ServerError.description);
        }
    }
));

// Create new
router.post("", authenticateToken, asyncHandler(
    async (req: any, res: any, next: NextFunction) => {
        try {
            const { maxAnswers, endDate, form } = req.body;
            if (!maxAnswers || !endDate || !form) {
                return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
            }
            const newForm = await FormModel.create({ maxAnswers, endDate, form });
            res.status(StatusCodes.Created.code).json(newForm);
        } catch (error) {
            next(error);
        }
    }
));

// Update by ID
router.put("/:id", authenticateToken, asyncHandler(
    async (req: any, res: any) => {
        const formId = req.params.id;
        const updates = req.body;

        try {
            const updatedForm = await FormModel.findByIdAndUpdate(formId, updates, { new: true });

            if (!updatedForm) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }

            res.send(updatedForm);
        } catch (error) {
            console.error("Error updating form by ID:", error);
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
));

// Delete by ID
router.delete("/:id", authenticateToken, asyncHandler(
    async (req: any, res: any) => {
        const formId = req.params.id;

        try {
            const deletedForm = await FormModel.findByIdAndDelete(formId);

            if (!deletedForm) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }

            res.send({ message: "Form deleted successfully", deletedForm });
        } catch (error) {
            console.error("Error deleting form by ID:", error);
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
));

export default router;
