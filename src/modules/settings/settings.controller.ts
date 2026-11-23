import { NextFunction, Request, Response } from "express";
import { successResponse } from "../../utils/response";
import { SettingsService } from "./settings.service";
import { updateSiteSettingSchema } from "./settings.validation";

export class SettingsController {
  private readonly settingsService: SettingsService;

  constructor(settingsService: SettingsService) {
    this.settingsService = settingsService;
  }

  getSiteSetting = async (
    _req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const setting = await this.settingsService.getSiteSetting();
      successResponse({
        res,
        message: "Berhasil mengambil pengaturan website",
        data: setting,
      });
    } catch (error) {
      next(error);
    }
  };

  updateSiteSetting = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const data = updateSiteSettingSchema.parse(req.body);
      const setting = await this.settingsService.updateSiteSetting(data);
      successResponse({
        res,
        message: "Pengaturan website berhasil disimpan",
        data: setting,
      });
    } catch (error) {
      next(error);
    }
  };
}
