import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { createAuthMiddleware } from '../middlewares/auth.middleware.js';
import { config } from '../../config/config.js';
import * as alehuBewereController from '../controllers/alehuBewere.controller.js';;

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
  authenticate,
  submissionLimiter,
  alehuBewereController.createSubscription,
);

router.get("/subscriptions", alehuBewereController.listSubscriptions);
router.get("/subscriptions/:id", alehuBewereController.getSubscription);

export default router;
