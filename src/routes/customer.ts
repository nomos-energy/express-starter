import { Router } from "express";

const customerRoutes = Router();

customerRoutes.get("/", (req, res) => {
  res.send("Hello from the Customer Route");
});

export default customerRoutes;
