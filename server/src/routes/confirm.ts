import express from "express";
import { confirmController } from "../controllers/confirmController";

const confirmRouter = express.Router();

confirmRouter.patch("/confirm", confirmController);

export { confirmRouter };
