import {NextFunction, Request, Router} from "express";
import asyncHandler from "express-async-handler";
import {StatusCodes} from "../enums/statusCode.model";
import {UserModel} from "../models/user.model";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
import authenticateToken from "../authenticateToken.service";

const router = Router();

// Create new
router.post("/create", authenticateToken, asyncHandler(
    async (req: Request, res: any, next: NextFunction) => {
        try {
            const { userName, password } = req.body;
            if (!userName || !password) {
                return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await UserModel.create({ userName, password: hashedPassword });
            res.status(StatusCodes.Created.code).json({ id: newUser._id, userName: newUser.userName, password: newUser.password });
        } catch (error) {
            next(error);
        }
    }
));

router.get("/try", authenticateToken, asyncHandler((req, res) => {
    res.status(StatusCodes.OK.code).json({canActive: true});
}));

// Login
router.post("",  asyncHandler(
    async (req: Request, res: any, next: NextFunction) => {
        try {
            const { userName, password } = req.body;
            if (!userName || !password) {
                return res.status(StatusCodes.BadRequest.code).send(StatusCodes.BadRequest.description);
            }

            const user = await UserModel.findOne({ userName });
            if (user) {
                const hashedPassword = await bcrypt.hash(password, 10);

                if (await bcrypt.compare(password, user.password)) {
                    const token = generateTokenResponse(user);
                    res.status(StatusCodes.OK.code).json({ token });
                } else {
                    res.status(StatusCodes.Unauthorized.code).send(StatusCodes.Unauthorized.description);
                }
            } else {
                res.status(StatusCodes.Unauthorized.code).send(StatusCodes.Unauthorized.description);
            }
        } catch (error) {
            next(error);
        }
    }
));

const generateTokenResponse = (user: UserModel) => {
    return jwt.sign({
        userName: user.userName,
        password: user.password
    }, "SomeRandomText", {
        expiresIn: "30d"
    })
}

export default router;