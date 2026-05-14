import { body } from "express-validator";
import { AvailableUserRoles, AvailableTaskStatus } from "../utils/constants.js";

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

    body("password")
      .trim()
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
    body("fullName").optional().trim(),
  ];
};

const userLoginValidator = () => {
  return [
    body("email").optional().isEmail().withMessage("Email is invalid"),
    body("password").notEmpty().withMessage("Password is required"),
  ];
};

const userChangeCurrentPasswordValidator = () => {
  return [
    body("oldPassword").notEmpty().withMessage("Old password is required"),
    body("newPassword").notEmpty().withMessage("new password is required"),
  ];
};

const userForgotPasswordValidator = () => {
  return [
    body("email")
      .notEmpty()
      .withMessage("email is required")
      .isEmail()
      .withMessage("email is invalid"),
  ];
};

const userResetForgotPasswordValidator = () => {
  return [
    body().custom((_, { req }) => {
      if (!req.body.newPassword && !req.body.password) {
        throw new Error("password is required");
      }
      return true;
    }),
    body("newPassword")
      .optional()
      .notEmpty()
      .withMessage("new password is required"),
    body("password").optional().notEmpty().withMessage("password is required"),
  ];
};

const createProjectValidator = () => {
  return [
    body("name").notEmpty().withMessage("Name is required"),
    body("description").optional(),
    body("githubRepo").optional().isURL().withMessage("Must be a valid URL"),
  ];
};

const addMembersToProjectValidator = () => {
  return [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Email is required")
      .isEmail()
      .withMessage("Email is required"),

    body("role")
      .notEmpty()
      .withMessage("Role is required")
      .isIn(AvailableUserRoles)
      .withMessage("Role is invalid"),
  ];
};

const createTaskValidator = () => {
  return [
    body("title").trim().notEmpty().withMessage("title required"),
    body("description")
      .optional()
      .isString()
      .withMessage("description must be string")
      .trim(),
    body("status")
      .optional()
      .isIn(AvailableTaskStatus)
      .withMessage("Invalid status"),
    body("assignedTo")
      .optional({ checkFalsy: true })
      .isMongoId()
      .withMessage("Invalid User ID"),
  ];
};

const createSubTaskValidator = () => {
  return [
    body("title").optional().trim().notEmpty().withMessage("Title is required"),

    body("isCompleted")
      .optional()
      .isBoolean()
      .withMessage("Must be a boolean")
      .toBoolean(),
  ];
};

const createNoteValidator = () => {
  return [
    body("title")
      .optional()
      .trim()
      .isString()
      .withMessage("title must be a string"),
    body("content")
      .trim()
      .notEmpty()
      .withMessage("content not present")
      .isString()
      .withMessage("content must be a string"),
  ];
};
export {
  userRegisterValidator,
  userLoginValidator,
  userChangeCurrentPasswordValidator,
  userForgotPasswordValidator,
  userResetForgotPasswordValidator,
  createProjectValidator,
  addMembersToProjectValidator,
  createTaskValidator,
  createSubTaskValidator,
  createNoteValidator,
};
