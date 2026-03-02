import { Router } from "express";
import { registerUser, login } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { userRegisterValidator } from "../validators/index.js";

const router = Router();
//validate is the pure middleware
// run the userReg validator then if there are errors then throw ot using validator else next()
router.route("/register").post(userRegisterValidator(),validate,registerUser)

router.route("/login").post(login);

export default router;
