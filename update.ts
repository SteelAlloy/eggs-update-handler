import { readJson, writeJson, path, semver } from "./deps.ts";

const oneDay = 1000 * 60 * 60 * 24;

export class UpdateNotifier {
  currentVersion = "";
  lastUpdateCheck = Date.now();
  updateCheckInterval = 5;

  constructor(public execName: string, public moduleName: string) {}

  async readConfig(): Promise<any> {
    return readJson(this.configPath());
  }

  async writeConfig(config: any) {
    await writeJson(this.configPath(), config, { spaces: 2 });
  }

  configPath() {
    const homedir = Deno.dir("home") || "/";
    return path.join(homedir, "/.eggs-global-module-versions.json");
  }

  needCheck() {
    return Date.now() - this.lastUpdateCheck > this.updateCheckInterval;
  }

  async init() {
    const config = await this.readConfig();
    const module = config[this.execName];

    if (module) {
      this.currentVersion = module.version;
    } else {
      throw new Error("Some fields are missing in the global config file.");
    }

    if (module.lastUpdateCheck) {
      this.lastUpdateCheck = module.lastUpdateCheck;
    }

    config[this.execName].lastUpdateCheck = this.lastUpdateCheck;

    if (module.lastUpdateCheck === undefined && this.needCheck()) {
      this.writeConfig(config);
    }
  }

  async getLatestVersionFromNestRegistry(): Promise<string> {
    const res = await fetch(
      "https://x.nest.land/api/package/" + this.moduleName,
    );
    const json = await res.json();
    return json.latestVersion.split("@")[1];
  }

  async checkForUpdate() {
    if(this.needCheck()) {
      const latestVersion = await this.getLatestVersionFromNestRegistry()
      const current = semver.coerce(this.currentVersion) || "0.0.1"
      const latest = semver.coerce(latestVersion) || "0.0.1"

      if(semver.lt(current, latest)) {
        const from = (typeof current === "string" ? current : current.version)
        const to = (typeof latest === "string" ? latest : latest.version)
        this.notify(from, to)
      }
    }
  }

  notify(from: string, to: string) {
    console.log(`Update available! from ${from} to ${to}`)
  }
}
