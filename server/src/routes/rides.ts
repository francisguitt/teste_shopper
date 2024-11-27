import express from "express";
import { ridesController } from "../controllers/ridesController";

const ridesRouter = express.Router();

ridesRouter.get("/:customer_id", ridesController);

export { ridesRouter };
