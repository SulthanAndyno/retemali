import { Request, Response, NextFunction } from "express";
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
