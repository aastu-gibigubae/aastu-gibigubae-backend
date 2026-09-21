import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { randomUUID } from "crypto";
import { config } from "../../config/config.js";
import { AppError } from "../utils/appError.js";

const VALID_ROLES = ["ADMIN", "SUB_ADMIN", "STUDENT"] as const;
type Role = (typeof VALID_ROLES)[number];

export async function createMockToken(req: Request, res: Response) {
  if (process.env.NODE_ENV === "production") {
    return res.status(404).end();
  }

  if (!config.JWT_PRIVATE_KEY) {
    throw new AppError(
      503,
      "Mock token generation is not configured (JWT_PRIVATE_KEY missing)"
    );
  }

  const { role = "STUDENT", name, phone, userId } = req.body ?? {};

  if (!VALID_ROLES.includes(role)) {
    throw new AppError(400, `role must be one of: ${VALID_ROLES.join(", ")}`);
  }

  const payload = {
    userId: userId ?? randomUUID(),
    role: role as Role,
    name: name ?? "Test User",
    phone: phone ?? "+251900000000",
  };

  const token = jwt.sign(payload, config.JWT_PRIVATE_KEY, {
    algorithm: "RS256",
    expiresIn: "2h",
  });

  res.json({ token });
}