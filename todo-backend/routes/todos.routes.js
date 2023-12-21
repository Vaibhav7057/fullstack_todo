import { Router } from "express";
import {
  addtodo,
  removetodo,
  findtodo,
  findsingletodo,
  updatetodo,
  updatetodostatus,
} from "../controllers/todo.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.route("/createtodo").post(verifyJWT, addtodo);
router.route("/getsingletodo/:id").get(verifyJWT, findsingletodo);
router.route("/getalltodos").get(verifyJWT, findtodo);
router.route("/deletetodo/:id").delete(verifyJWT, removetodo);
router.route("/editstatus/:id").put(verifyJWT, updatetodostatus);
router.route("/edittodo/:id").put(verifyJWT, updatetodo);
export default router;
