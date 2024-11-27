import express from "express";
import cors from "cors";
import { estimateRouter } from "./routes/estimate";
import { confirmRouter } from "./routes/confirm";
import { ridesRouter } from "./routes/rides";

const app = express();

app.use(cors());
app.use(cors({ origin: "*" }));


app.use(express.json());


app.use("/ride", estimateRouter);
app.use("/ride", confirmRouter);
app.use("/ride", ridesRouter);

export { app };
