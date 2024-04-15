import express, { Router } from 'express';
import { User } from '../controllers/user.controller.js';

const userController = new User()
const userRouter = express.Router()

userRouter.get('/', userController.getUser)

export default userRouter