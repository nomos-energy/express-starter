import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import customerRoutes from "./routes/customer";
import partnerRoutes from "./routes/partner";
import adminRoutes from "./routes/admin";

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.use("/customer", customerRoutes);
app.use("/partner", partnerRoutes);
app.use("/admin", adminRoutes);

// Error handling
app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

export default app;
