import {NextFunction, Request, Router} from "express";
import {FileModel} from "../models/file.model";
import asyncHandler from "express-async-handler";
import {StatusCodes} from "../enums/statusCode.model";
import authenticateToken from "../authenticateToken.service";

const router = Router();

// GET ALL
router.get("", asyncHandler(
    async (req: Request, res: any) => {
        const files = await FileModel.find();
        if (files.length < 1) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }
        res.send(files);
    }
));

// Create new
router.post("", authenticateToken, asyncHandler(
    async (req: Request, res: any, next: NextFunction) => {
        try {
            const { name, data, language } = req.body;
            if (!name || !data || !language) {
                return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
            }
            const newFile = await FileModel.create({ name, data, language });
            res.status(StatusCodes.Created.code).json(
                { id: newFile._id, title: newFile.name, data: newFile.data, language: newFile.language }
            );
        } catch (error) {
            next(error);
        }
    }
));

// Delete
router.delete("/:id", authenticateToken, asyncHandler(
    async (req: Request, res: any) => {
        const fileId = req.params.id;

        try {
            const deletedFile = await FileModel.findByIdAndDelete(fileId);

            if (!deletedFile) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }

            res.send({message: StatusCodes.OK.code, deletedFile});
        } catch (error) {
            console.error("Error deleting file by ID:", error);
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
));
export default router;
