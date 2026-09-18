import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { config } from '../../config/config.js';
import * as alehuBewereController from '../controllers/alehuBewere.controller.js';
import { requireScopeAccess } from "../middlewares/scopeAccess.middleware.js";
import { ScopeArea } from "../generated/prisma/enums.js";

const router = Router();

const authenticate = createAuthMiddleware(config.JWT_PUBLIC_KEY);

const submissionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many submissions from this IP. Please try again later.",
  },
});

router.get("/packages", alehuBewereController.listPackages);

router.post(
  "/subscriptions",
  submissionLimiter,
  alehuBewereController.createSubscription,
);

router.get("/subscriptions", authenticate, requireScopeAccess(ScopeArea.ALEHU_BEWERE), alehuBewereController.listSubscriptions);
router.get("/subscriptions/:id", authenticate, requireScopeAccess(ScopeArea.ALEHU_BEWERE), alehuBewereController.getSubscription);

export default router;
