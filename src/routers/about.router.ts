import { Router, Request, Response, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { AboutModel } from "../models/about.model";
import { StatusCodes } from "../enums/statusCode.model";
import authenticateToken from "../authenticateToken.service";

const router = Router();

// Get All
router.get("", asyncHandler(
    async (req: Request, res: any) => {
        const abouts = await AboutModel.find();
        if (abouts.length < 1) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }
        res.send(abouts);
    }
));

// Create new
router.post("", authenticateToken, asyncHandler(
    async (req: Request, res: any, next: NextFunction) => {
        try {
            const { firstText, secondText, firstPhotos, secondPhotos } = req.body;
            if ( !firstText || !secondText || !firstPhotos || !secondPhotos ) {
                return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
            }
            const newAbout = await AboutModel.create({ firstText, secondText, firstPhotos, secondPhotos });
            res.status(StatusCodes.Created.code).json(newAbout);
        } catch (error) {
            next(error);
        }
    }
));

// Update by ID
router.put("/:id", authenticateToken, asyncHandler(
    async (req: Request, res: any) => {
        const aboutId = req.params.id;
        const updates = req.body;

        try {
            const updatedAbout = await AboutModel.findByIdAndUpdate(aboutId, updates, { new: true });

            if (!updatedAbout) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }

            res.send(updatedAbout);
        } catch (error) {
            console.error("Error updating about by ID:", error);
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
));

export default router;
