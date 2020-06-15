import { readJson, writeJson } from "./deps.ts";

const decoder = new TextDecoder("utf-8");
const encoder = new TextEncoder();

const oneDay = 1000 * 60 * 60 * 24;
const defaultOptions = { updateCheckInterval: oneDay };

export class UpdateNotifier {
  private name = "";
  private version = "";
  private lastUpdateCheck = Date.now();
  private updateCheckInterval = 0

  async readConfig(): Promise<any> {
    return readJson("eggs.json");
  }

  async writeConfig(config: any) {
    await writeJson("eggs.json", config, { spaces: 2 });
  }

  async init(options: Options) {
    this.updateCheckInterval = options.updateCheckInterval
    const module = await this.readConfig();

    if (module.name && module.version) {
      this.name = module.name;
      this.version = module.version;
    } else {
      throw new Error("Some fields are missing in the eggs.json file.");
    }

    if (module.lastUpdateCheck) {
      this.lastUpdateCheck = module.lastUpdateCheck
    }
  
    this.writeConfig({
      lastUpdateCheck: this.lastUpdateCheck,
      ...module
    })
  }

  async getLatestVersionFromNestRegistry (dependencyName: string): Promise<string> {
    const res = await fetch("https://x.nest.land/api/package/" + dependencyName);
    const json = await res.json();
    return json.latestVersion.split("@")[1]
  }

  needUpdate() {
    return Date.now() - this.lastUpdateCheck < this.updateCheckInterval
  }
}

interface Options {
  updateCheckInterval: number;
}
