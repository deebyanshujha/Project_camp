import { Router } from "express";
import { registerUser, login, userLogOut,getCurrentUSer, verifyEmail } from "../controllers/auth.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import {
  userRegisterValidator,
  userLoginValidator,
} from "../validators/index.js";

import { verifyJWT } from "../middlewares/auth.middlewares.js";

const router = Router();
//validate is the pure middleware
// run the userReg validator then if there are errors then throw ot using validator else next()
router.route("/register").post(userRegisterValidator(), validate, registerUser);

router.route("/login").post(userLoginValidator(), validate, login);

//secure routes
router.route("/logout").post(verifyJWT, userLogOut);
router.route("/current-user").post(verifyJWT, getCurrentUSer);
router.route("/verify-email").post(verifyEmail);



export default router;
