import { Router } from "express";
import { login, register, logout, dummy } from "../controllers/user.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/login").post(login);
router.route("/register").post(register);


// secure routes
router.route("/logout").post(authenticate, logout)
router.route("/dummy").get(authenticate, dummy);

export default router;