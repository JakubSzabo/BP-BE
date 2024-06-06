import {NextFunction, Router} from "express";
import asyncHandler from "express-async-handler";
import {ContactModel} from "../models/contact.model";
import {StatusCodes} from "../enums/statusCode.model";
import authenticateToken from "../authenticateToken.service";

const router = Router();

// Get all contacts
router.get('', asyncHandler(
    async (req: any, res: any) => {
        const contacts = await ContactModel.find();
        if (contacts.length < 1) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }
        res.send(contacts);
    }
));

// Create a new contact
router.post('', authenticateToken, asyncHandler(
    async (req: any, res: any, next: NextFunction) => {
        const { name, logo, link, category } = req.body;
        if (!name || !logo || !category) {
            return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
        }
        try {
            const newContact = await ContactModel.create({ name, logo, link, category });
            res.status(StatusCodes.Created.code).json(newContact);
        } catch (error) {
            next(error);
        }
    }
));

// Delete a contact by ID
router.delete('/:id', authenticateToken, asyncHandler(
    async (req: any, res: any) => {
        const contactId = req.params.id;
        try {
            const deletedContact = await ContactModel.findByIdAndDelete(contactId);
            if (!deletedContact) {
                return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
            }
            res.send({ message: "Contact deleted successfully", deletedContact });
        } catch (error) {
            console.error("Error deleting contact by ID:", error);
            res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
        }
    }
));
export default router;