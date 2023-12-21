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

router.route("/createtodo").post(addtodo);
router.route("/getsingletodo/:id").get(findsingletodo);
router.route("/getalltodos").get(findtodo);
router.route("/deletetodo/:id").delete(removetodo);
router.route("/editstatus/:id").put(updatetodostatus);
router.route("/edittodo/:id").put(updatetodo);
export default router;
