import { NextFunction, Request, Response } from "express";
import { paginatedResponse, successResponse } from "../../utils/response";
import { AuthService } from "./auth.service";
import {
  adminResetCredentialsSchema,
  changePasswordSchema,
  loginSchema,
  registerSchema,
  updateProfileSchema,
  updateUserStatusSchema,
  userQuerySchema,
} from "./auth.validation";
import { AuthRequest } from "@/middlewares/auth.middleware";

export class AuthController {
  private readonly authService: AuthService;

  constructor(authService: AuthService) {
    this.authService = authService;
  }

  /**
   * Registrasi anggota perpustakaan baru.
   */
  register = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = registerSchema.parse(req.body);
      const result = await this.authService.register(data);

      successResponse({
        res,
        statusCode: 201,
        message: "Registrasi anggota berhasil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Login pengguna (Member / Volunter / Admin).
   */
  login = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = loginSchema.parse(req.body);
      const result = await this.authService.login(data);

      successResponse({
        res,
        message: "Login berhasil",
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengambil profil pengguna yang sedang login.
   */
  getProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const user = await this.authService.getProfile(req.userId as string);

      successResponse({
        res,
        message: "Berhasil mengambil profil",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengupdate profil pengguna.
   */
  updateProfile = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = updateProfileSchema.parse(req.body);
      const user = await this.authService.updateProfile(
        req.userId as string,
        data,
        req.file,
      );

      successResponse({
        res,
        message: "Profil berhasil diupdate",
        data: user,
      });
    } catch (error) {
      next(error);
    }
  };

  /**
   * Mengganti password pengguna.
   */
  changePassword = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = changePasswordSchema.parse(req.body);
      await this.authService.changePassword(req.userId as string, data);

      successResponse({
        res,
        message: "Password berhasil diubah",
      });
    } catch (error) {
      next(error);
    }
  };

  getAllUsers = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const query = userQuerySchema.parse(req.query);
      const { data, meta } = await this.authService.getAllUsers(query);
      paginatedResponse({
        res,
        message: "Berhasil mengambil daftar anggota",
        data,
        meta,
      });
    } catch (error) {
      next(error);
    }
  };

  updateUserStatus = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      const input = updateUserStatusSchema.parse(req.body);
      const updated = await this.authService.updateUserStatus(
        id,
        input,
        req.userId,
      );
      successResponse({
        res,
        message: "Status anggota berhasil diperbarui",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };

  adminResetCredentials = async (
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const id = req.params["id"] as string;
      const input = adminResetCredentialsSchema.parse(req.body);
      const updated = await this.authService.adminResetCredentials(
        id,
        input,
        req.userId,
      );
      successResponse({
        res,
        message: "Kredensial akun anggota berhasil diperbarui",
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  };
}
