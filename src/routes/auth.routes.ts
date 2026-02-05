import { Router } from "express";
import { signin, initiateAdminUser } from "../controllers/auth.controller";

const router = Router();

router.post("/signin", signin);
router.post("/initiate-admin", initiateAdminUser);

export default router;
