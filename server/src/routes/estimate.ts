import express from "express";
import { estimateController } from "../controllers/estimateController";

const estimateRouter = express.Router();

estimateRouter.post("/estimate", estimateController);

export { estimateRouter };
