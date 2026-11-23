import { SettingsRepository } from "./settings.repository";
import { UpdateSiteSettingInput } from "./settings.validation";

export class SettingsService {
  private readonly settingsRepository: SettingsRepository;

  constructor(settingsRepository: SettingsRepository) {
    this.settingsRepository = settingsRepository;
  }

  async getSiteSetting() {
    return this.settingsRepository.getSiteSetting();
  }

  async updateSiteSetting(input: UpdateSiteSettingInput) {
    return this.settingsRepository.updateSiteSetting(input);
  }
}
