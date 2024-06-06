import { Router, Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import { MemberModel, Member } from '../models/member.model';
import { StatusCodes } from '../enums/statusCode.model';
import authenticateToken from "../authenticateToken.service";

const router = Router();

// Get All Members
router.get('', authenticateToken, asyncHandler(async (req: Request, res: Response) => {
    const members = await MemberModel.find();
    res.send(members);
}));

// Get Member by ID
router.get('/:id', authenticateToken, asyncHandler(async (req: Request, res: any) => {
    const memberId = req.params.id;
    try {
        const member = await MemberModel.findById(memberId);
        if (!member) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }
        res.send(member);
    } catch (error) {
        console.error('Error fetching member by ID:', error);
        res.status(StatusCodes.ServerError.code).send(StatusCodes.ServerError.description);
    }
}));

// Create New Member
router.post('', authenticateToken, asyncHandler(async (req: Request, res: any) => {
    const { name, room, role, phoneNumber } = req.body;
    if (!name) {
        return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
    }
    try {
        const newMember = await MemberModel.create({ name, room, role, phoneNumber });
        res.status(StatusCodes.Created.code).json(newMember);
    } catch (error) {
        console.error('Error creating new member:', error);
        res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
    }
}));

// Update Member by ID
router.put('/:id', authenticateToken, asyncHandler(async (req: Request, res: any) => {
    const memberId = req.params.id;
    const updates = req.body;
    try {
        const updatedMember = await MemberModel.findByIdAndUpdate(memberId, updates, { new: true });
        if (!updatedMember) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }
        res.send(updatedMember);
    } catch (error) {
        console.error('Error updating member by ID:', error);
        res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
    }
}));

// Delete Member by ID
router.delete('/:id', authenticateToken, asyncHandler(async (req: Request, res: any) => {
    const memberId = req.params.id;
    try {
        const deletedMember = await MemberModel.findByIdAndDelete(memberId);
        if (!deletedMember) {
            return res.status(StatusCodes.NotFound.code).send(StatusCodes.NotFound.description);
        }
        res.send({ message: 'Member deleted successfully', deletedMember });
    } catch (error) {
        console.error('Error deleting member by ID:', error);
        res.status(StatusCodes.InternalServerError.code).send(StatusCodes.InternalServerError.description);
    }
}));

export default router;
