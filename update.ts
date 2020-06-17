import { readJson, writeJson, path, semver, colors, Table } from "./deps.ts";
import { getLatestVersion } from "./registries.ts";

export class UpdateNotifier {
  moduleName = "";
  owner = "";
  currentVersion = "";
  registry = "";
  installationArgs: string[] = [];
  lastUpdateCheck = Date.now();

  constructor(
    public execName: string,
    public updateCheckInterval: number,
  ) {}

  async readConfig(): Promise<any> {
    return readJson(this.configPath());
  }

  async writeConfig(config: any) {
    await writeJson(this.configPath(), config, { spaces: 2 });
  }

  configPath() {
    const homedir = Deno.dir("home") || "/";
    return path.join(homedir, "/.eggs-global-modules.json");
  }

  needCheck() {
    return Date.now() - this.lastUpdateCheck > this.updateCheckInterval;
  }

  async init() {
    const config = await this.readConfig();
    const module = config[this.execName];

    if (module) {
      this.moduleName = module.moduleName;
      this.owner = module.owner;
      this.currentVersion = module.version;
      this.registry = module.registry;
      this.installationArgs = module.args;
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

  async checkForUpdate() {
    if (this.needCheck()) {
      const latestVersion = await getLatestVersion(
        this.registry,
        this.moduleName,
        this.owner,
      );
      const current = semver.coerce(this.currentVersion) || "0.0.1";
      const latest = semver.coerce(latestVersion) || "0.0.1";

      if (semver.lt(current, latest)) {
        const from = (typeof current === "string" ? current : current.version);
        const to = (typeof latest === "string" ? latest : latest.version);
        this.notify(from, to);
      }
    }
  }

  notify(from: string, to: string) {
    const notification = `New version of ${
      colors.red(this.moduleName)
    } available! ${colors.yellow(from)} → ${colors.green(to)}
Registry ${colors.cyan(this.registry)}
Run ${colors.magenta("eggs update -g " + this.moduleName)} to update`;

    console.log("")
    Table.from([[notification]])
      .padding(1)
      .indent(2)
      .border( true )
      .render();
  }
}
