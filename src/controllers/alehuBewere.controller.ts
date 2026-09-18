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
  let donor_name = req.body.full_name;
  let donor_contact = req.body.phone_number;
  let user_id = undefined;

  if (req.user) {
    user_id = req.user.userId;
    try {
      const info = alehuBewereService.extractDonorInfoFromUser(req.user);
      donor_name = donor_name || info.donor_name;
      donor_contact = donor_contact || info.donor_contact;
    } catch (err) {
      // Ignore claim extraction errors if body has the required fields
    }
  }

  if (!donor_name || !donor_contact) {
    throw new AppError(400, "full_name and phone_number are required");
  }

  const { package_name, amount, email } = req.body;

  const subscription = await alehuBewereService.createSubscription({
    package_name,
    amount,
    donor_name,
    donor_contact,
    user_id,
    email,
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

export async function updateSubscription(req: Request, res: Response) {
  const { status, admin_note } = req.body;
  const subscription = await alehuBewereService.updateSubscriptionStatus(
    getIdParam(req),
    status,
    admin_note
  );
  res.json(subscription);
}