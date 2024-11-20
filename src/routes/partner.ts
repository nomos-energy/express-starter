import { Router } from "express";

const partnerRoutes = Router();

partnerRoutes.get("/", (req, res) => {
  res.send("Hello from the Partner Route");
});

export default partnerRoutes;
