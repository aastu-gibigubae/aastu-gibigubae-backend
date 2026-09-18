import { Request, Response } from "express";
import * as alehuBewereService from "../services/alehuBewere.service.js";
import { AppError } from "../utils/appError.js";

function getIdParam(req: Request): string {
  const { id } = req.params;
  if (typeof id !== "string") {
    throw new AppError(400, "Invalid id parameter");
  }
  return id;
}

export async function listPackages(_req: Request, res: Response) {
  const packages = await alehuBewereService.listPackages();
  res.json(packages);
}

export async function createSubscription(req: Request, res: Response) {
  if (!req.user) {
    // Shouldn't happen if authenticate middleware ran correctly, but a
    // clear error here beats a confusing crash further down.
    throw new AppError(401, "Not authenticated");
  }

  const { donor_name, donor_contact } = alehuBewereService.extractDonorInfoFromUser(req.user);
  const { package_name, amount } = req.body;

  const subscription = await alehuBewereService.createSubscription({
    package_name,
    amount,
    donor_name,
    donor_contact,
  });

  res.status(201).json(subscription);
}

export async function listSubscriptions(_req: Request, res: Response) {
  const subscriptions = await alehuBewereService.listSubscriptions();
  res.json(subscriptions);
}

export async function getSubscription(req: Request, res: Response) {
  const subscription = await alehuBewereService.getSubscriptionById(
    getIdParam(req),
  );
  res.json(subscription);
}