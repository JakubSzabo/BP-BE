import {Router} from "express";
import asyncHandler from "express-async-handler";
import {AboutSDModel} from "../models/aboutSD.model";
import {StatusCodes} from "../enums/statusCode.model";
import authenticateToken from "../authenticateToken.service";

const router = Router();

// Get All
router.get("", asyncHandler(
    async (req: any, res: any) => {
        const aboutSDs = await AboutSDModel.findOne();
        if (!aboutSDs) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }
        res.send(aboutSDs);
    }
));


// Create new
router.post("", authenticateToken, asyncHandler(
    async (req: any, res: any, next: any) => {
        try {
            const { title, text, map } = req.body;
            if (!title || !text || !map) {
                return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
            }
            const newAboutSD = await AboutSDModel.create({ title, text, map });
            res.status(StatusCodes.Created.code).json({ id: newAboutSD._id, title: newAboutSD.title, text: newAboutSD.text, map: newAboutSD.map });
        } catch (error) {
            next(error);
        }
    }
));

// Update by ID
router.put("/:id", authenticateToken, asyncHandler(
    async (req: any, res: any) => {
        const aboutSDId = req.params.id;
        const updates = req.body;

        try {
            const updatedAboutSD = await AboutSDModel.findByIdAndUpdate(aboutSDId, updates, { new: true });

            if (!updatedAboutSD) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }

            res.send(updatedAboutSD);
        } catch (error) {
            console.error("Error updating aboutSD by ID:", error);
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
));

export default router;