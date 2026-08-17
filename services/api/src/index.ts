import express from "express";
import cors from "cors";
import { env } from "./env";
import { authRouter } from "./routes/auth.routes";
import { ridesRouter } from "./routes/rides.routes";
import { foodRouter } from "./routes/food.routes";
import { medsRouter } from "./routes/meds.routes";
import { homeRouter } from "./routes/home.routes";
import { careRouter } from "./routes/care.routes";
import { myraRouter } from "./routes/myra.routes";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

app.use(cors({ origin: env.corsOrigin }));
app.use(express.json());

app.get("/health", (_req, res) => res.json({ status: "ok", service: "nexserv-api" }));

app.use("/auth", authRouter);
app.use("/rides", ridesRouter);
app.use("/food", foodRouter);
app.use("/meds", medsRouter);
app.use("/home", homeRouter);
app.use("/care", careRouter);
app.use("/myra", myraRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(env.port, () => {
  console.log(`NexServ API listening on :${env.port}`);
});
