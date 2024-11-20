import { Router } from "express";

const adminRoutes = Router();

adminRoutes.get("/", (req, res) => {
  res.send("Hello from the Admin Route");
});

export default adminRoutes;
