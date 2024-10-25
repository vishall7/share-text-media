import { login } from "../controllers/user.controller.js";
import { Router } from "express";

const router = Router();

router.route("/login").get(login);

export default router;