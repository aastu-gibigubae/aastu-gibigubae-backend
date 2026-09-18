import prisma from "../models/prisma.js";
import { AppError } from "../utils/appError.js";
import type { AuthenticatedUser } from "../middlewares/auth.middleware.js";

const CUSTOM_PACKAGE_NAME = "Netsa Fikad";

// Hardened match: trims whitespace and ignores case, so a stray space or
// casing difference in the DB or a request doesn't silently break the
// custom-amount logic.
function isCustomPackage(name: string): boolean {
  return name.trim().toLowerCase() === CUSTOM_PACKAGE_NAME.toLowerCase();
}

/**
 * Pulls donor name + phone from the verified JWT claims. We don't know the
 * exact claim names SSO uses, so — same tolerant pattern as userId/sub in
 * auth.middleware.ts — we try a few reasonable candidates.
 */
export function extractDonorInfoFromUser(user: AuthenticatedUser): {
  donor_name: string;
  donor_contact: string;
} {
  const name =
    (user.name as string) ??
    (user.fullName as string) ??
    (user.firstName
      ? `${user.firstName as string} ${(user.fatherName as string) ?? ""}`.trim()
      : undefined);

  const phone =
    (user.phone as string) ??
    (user.phoneNumber as string) ??
    (user.contact as string) ??
    (user.mobile as string);

  if (!name) {
    throw new AppError(401, "Token is missing a name claim required to donate");
  }
  if (!phone) {
    throw new AppError(401, "Token is missing a phone claim required to donate");
  }

  return { donor_name: name, donor_contact: phone };
}

export interface CreateSubscriptionInput {
  package_name: string;
  amount?: number; // only used when package_name is Netsa Fikad
  donor_name: string;
  donor_contact: string;
}

export async function listPackages() {
  return prisma.donationPackage.findMany({
    where: { is_active: true },
    orderBy: { amount: "asc" },
  });
}

export async function createSubscription(input: CreateSubscriptionInput) {
  if (!input.package_name?.trim()) {
    throw new AppError(400, "package_name is required");
  }

  const donationPackage = await prisma.donationPackage.findUnique({
    where: { name: input.package_name.trim() },
  });

  if (!donationPackage || !donationPackage.is_active) {
    throw new AppError(400, "Unknown or inactive package");
  }

  let amount: number;

  if (isCustomPackage(donationPackage.name)) {
    if (!input.amount || input.amount <= 0) {
      throw new AppError(400, "A positive amount is required for Netsa Fikad");
    }
    amount = input.amount;
  } else {
    // Deliberate: always use the package's own stored price, never trust
    // whatever amount the client sends for a fixed package. Prevents
    // someone submitting "Adam" with a manipulated amount.
    amount = Number(donationPackage.amount);
  }

  return prisma.subscription.create({
    data: {
      package: donationPackage.name as any, // assuming DonationPackageType mapping
      amount,
      full_name: input.donor_name,
      phone_number: input.donor_contact,
    },
  });
}

export async function listSubscriptions() {
  return prisma.subscription.findMany({
    orderBy: { created_at: "desc" },
  });
}

export async function getSubscriptionById(id: string) {
  const subscription = await prisma.subscription.findUnique({ where: { id } });
  if (!subscription) {
    throw new AppError(404, "Subscription not found");
  }
  return subscription;
}