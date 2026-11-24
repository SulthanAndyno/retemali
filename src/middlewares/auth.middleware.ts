import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import { AppError } from "./error.middleware";
import { prisma } from "@/lib/prisma";

export interface AuthRequest extends Request {
  userId?: string;
  userRole?: string;
}

/**
 * Verifies the bearer token, then resolves the caller's role from the database.
 *
 * The role is deliberately NOT taken from the JWT claim: a token minted before
 * an admin demoted a volunteer would otherwise keep granting volunteer access
 * until it expired. Reading the row makes every role change take effect on the
 * very next request, and it also lets a SUSPENDED account be cut off instantly.
 */
export const authenticate = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      status: "error",
      message: "Token autentikasi tidak ditemukan",
    });
    return;
  }

  const token = authHeader.split(" ")[1];

  let userId: string;
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      userId: string;
      role?: string;
    };
    userId = decoded.userId;
  } catch {
    res.status(401).json({
      status: "error",
      message: "Token tidak valid atau sudah kadaluarsa",
    });
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true, status: true },
    });

    if (!user) {
      res.status(401).json({
        status: "error",
        message: "Akun tidak ditemukan. Silakan masuk kembali",
      });
      return;
    }

    if (user.status === "SUSPENDED") {
      res.status(403).json({
        status: "error",
        message: "Akun Anda sedang ditangguhkan",
      });
      return;
    }

    req.userId = user.id;
    req.userRole = user.role;
    next();
  } catch {
    res.status(503).json({
      status: "error",
      message: "Gagal memverifikasi peran akun. Silakan coba lagi",
    });
  }
};

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction): void => {
    if (!req.userRole || !allowedRoles.includes(req.userRole)) {
      next(
        new AppError(
          "Anda tidak memiliki akses untuk melakukan aksi ini",
          403,
        ),
      );
      return;
    }
    next();
  };
};

function constantTimeEquals(a: string, b: string): boolean {
  const bufA = Buffer.from(a, "utf8");
  const bufB = Buffer.from(b, "utf8");
  if (bufA.length !== bufB.length) {
    return false;
  }
  return crypto.timingSafeEqual(bufA, bufB);
}

/**
 * Verifies a server-to-server shared secret (used by cron jobs and webhooks).
 * Accepts any configured header name directly or `Authorization: Bearer <secret>`.
 * Fails closed with 503 if the backing env variable is not configured.
 */
export const requireSharedSecret = (
  envVarName: string,
  headerNames: readonly string[],
  label: string,
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const expectedSecret = process.env[envVarName]?.trim();
    if (!expectedSecret) {
      res.status(503).json({
        status: "error",
        message: `${label} belum dikonfigurasi pada server (${envVarName})`,
      });
      return;
    }

    const candidates: string[] = [];
    for (const headerName of headerNames) {
      const value = req.headers[headerName.toLowerCase()];
      if (typeof value === "string" && value.trim()) {
        candidates.push(value.trim());
      }
    }

    const authHeader = req.headers.authorization;
    if (typeof authHeader === "string" && authHeader.startsWith("Bearer ")) {
      const bearer = authHeader.slice("Bearer ".length).trim();
      if (bearer) {
        candidates.push(bearer);
      }
    }

    const matched = candidates.some((candidate) =>
      constantTimeEquals(candidate, expectedSecret),
    );
    if (!matched) {
      res.status(401).json({
        status: "error",
        message: `Secret ${label} tidak valid atau tidak ditemukan`,
      });
      return;
    }

    next();
  };
};
