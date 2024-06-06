import {NextFunction, Request, Router} from "express";
import asyncHandler from "express-async-handler";
import {StatusCodes} from "../enums/statusCode.model";
import {PhotoModel} from "../models/photo.model";
import authenticateToken from "../authenticateToken.service";

const router = Router();

//GET All
router.get("", asyncHandler(
    async (req: Request, res: any) => {
        try {
            const photos = await PhotoModel.find();
            if (photos.length < 1) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }
            res.send(photos);
        } catch (error) {
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
));

//Category
router.get("/categories", asyncHandler(
    async (req: Request, res: any) => {
        try {
            const categories = await PhotoModel.aggregate([
                { $match: { category: { $nin: ["aboutSD", "loga"] } } },
                { $group: { _id: "$category" } },
                { $project: { _id: 0, category: "$_id" } }
            ]);

            if (categories.length < 1) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }

            res.send(categories.map(cat => cat.category));
        } catch (error) {
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
));

router.get("/category/:category", asyncHandler(
    async (req: Request, res: any) => {
        const category = req.params.category;
        const photos = await PhotoModel.find({ category });

        if (photos.length < 1) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }

        res.send(photos);
    }
));

//Create
router.post("", authenticateToken, asyncHandler(
    async (req: Request, res: any, next: NextFunction) => {
        try {
            const { data, category } = req.body;
            if ( !data || !category) {
                return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
            }
            const newPhoto = await PhotoModel.create({ data, category });
            res.status(StatusCodes.Created.code).json(
                { id: newPhoto._id, data: newPhoto.data, category: newPhoto.category }
            );
        } catch (error) {
            next(error);
        }
    }
));

//Delete
router.delete("/:id", authenticateToken, asyncHandler(
    async (req: Request, res: any) => {
        const photoId = req.params.id;

        try {
            const deletedPhoto = await PhotoModel.findByIdAndDelete(photoId);

            if (!deletedPhoto) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }

            res.send({message: StatusCodes.OK.code, deletedPhoto});
        } catch (error) {
            console.error("Error deleting photo by ID:", error);
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
))

export default router;