import { Router } from "express";
import {
  getNotes,
  createNote,
  updateNote,
  getNoteById,
  deleteNote,
} from "../controllers/note.controllers.js";
import { validate } from "../middlewares/validator.middleware.js";
import { createNoteValidator } from "../validators/index.js";

import {
  verifyJWT,
  validateProjectPermission,
} from "../middlewares/auth.middlewares.js";
import { AvailableUserRoles, UserRolesEnum } from "../utils/constants.js";

const router = Router();
router.use(verifyJWT); // all routes will use verifyJWT

router
  .route("/:projectId")
  .get(validateProjectPermission(AvailableUserRoles), getNotes)
  .post(
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createNoteValidator(),
    validate,
    createNote,
  );

router
  .route("/:projectId/n/:noteId")
  .get(validateProjectPermission(AvailableUserRoles), getNoteById)
  .put(
    // update data(put)
    validateProjectPermission([UserRolesEnum.ADMIN]),
    createNoteValidator(),
    validate,
    updateNote,
  )
  .delete(validateProjectPermission([UserRolesEnum.ADMIN]), deleteNote);

export default router;
