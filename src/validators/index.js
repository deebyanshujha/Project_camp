import { body } from "express-validator";

const userRegisterValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is invalid"),

    body("username")
      .trim()
      .notEmpty()
      .withMessage("username is required")
      .isLowercase()
      .withMessage("username must be in lowercase")
      .isLength({ min: 3 })
      .withMessage("username must be atleast 3 characters long"),

    body("password").trim().isEmpty().withMessage("Password is required"),
    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email")
        .optional()
        .isEmail()
        .withMessage("Email is invalid"),
    body("password")
        .notEmpty()
        .withMessage("Password is required")

    ];
};

export { userRegisterValidator, userLoginValidator };
