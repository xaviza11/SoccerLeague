import 'dotenv/config';

export class ConfigService {
  public readonly CRUD_API: string;
  public readonly BFF_API: string;
  public readonly SIMULATOR_API: string;
  public readonly CLIENT_URL: string;
  public readonly BFF_PORT: string;

  constructor() {
    this.CRUD_API = this.getEnvVar('CRUD_API');
    this.BFF_API = this.getEnvVar('BFF_API');
    this.SIMULATOR_API = this.getEnvVar('SIMULATOR_API');
    this.CLIENT_URL = this.getEnvVar('CLIENT_URL');
    this.BFF_PORT = this.getEnvVar('BFF_PORT')
  }

  private getEnvVar(key: string): string {
    const value = process.env[key];
    if (!value) {
      throw new Error(`Missing environment variable: ${key} is ${value}`);
    }
    return value;
  }
}

export const configService = new ConfigService();
