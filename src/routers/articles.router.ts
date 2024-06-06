import { Router, Request, NextFunction } from "express";
import asyncHandler from "express-async-handler";
import { ArticlesModel } from "../models/articles.model";
import { StatusCodes } from "../enums/statusCode.model";
import authenticateToken from "../authenticateToken.service";

const router = Router();

// Get All
router.get("", asyncHandler(
    async (req: Request, res: any) => {
        const articles = await ArticlesModel.find();
        if (articles.length < 1) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }
        res.send(articles);
    }
));

router.get("/favorites", async (req: Request, res: any) => {
    try {
        const articles = await ArticlesModel.find({ favorite: true });

        console.log(articles)

        if (articles.length < 1) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }

        res.send(articles);
    } catch (error) {
        console.error("Error fetching articles:", error);
        res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
    }
});

// Get By ID
router.get("/:id", asyncHandler(
    async (req: Request, res: any) => {
        const articleId = req.params.id; // Extract article ID from URL parameter
        try {
            const article = await ArticlesModel.findById(articleId);
            if (!article) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }
            res.send(article);
        } catch (error) {
            console.error("Error fetching article by ID:", error);
            res.status(StatusCodes.ServerError.code).send(StatusCodes.ServerError.description);
        }
    }
));

// Create new
router.post("", authenticateToken, asyncHandler(
    async (req: Request, res: any, next: NextFunction) => {
        try {
            const { title, text, favorite } = req.body;
            if (!title || !text) {
                return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
            }
            const newArticle = await ArticlesModel.create({ title, text, favorite });
            res.status(StatusCodes.Created.code).json({ id: newArticle._id, title: newArticle.title, text: newArticle.text, favorite: favorite });
        } catch (error) {
            next(error);
        }
    }
));

// Update by ID
router.put("/:id", authenticateToken, asyncHandler(
    async (req: Request, res: any) => {
        const articleId = req.params.id;
        const updates = req.body;

        try {
            const updatedArticle = await ArticlesModel.findByIdAndUpdate(articleId, updates, { new: true });

            if (!updatedArticle) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }

            res.send(updatedArticle);
        } catch (error) {
            console.error("Error updating article by ID:", error);
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
));

// Delete by ID
router.delete("/:id", authenticateToken, asyncHandler(
    async (req: Request, res: any) => {
        const articleId = req.params.id;

        try {
            const deletedArticle = await ArticlesModel.findByIdAndDelete(articleId);

            if (!deletedArticle) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }

            res.send({ message: "Article deleted successfully", deletedArticle });
        } catch (error) {
            console.error("Error deleting article by ID:", error);
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
));

export default router;
