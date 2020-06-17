const oneDay = 1000 * 60 * 60 * 24;

export async function installUpdateHandler(
  moduleName: string,
  execName: string,
  updateCheckInterval: number = oneDay
) {
  const installation = Deno.run({
    cmd: [
      "deno",
      "install",
      "--unstable",
      "-f",
      "-A",
      "-n",
      moduleName,
      "https://x.nest.land/eggs-update-handler@0.1.5/cli.ts",
      execName,
      updateCheckInterval.toString()
    ],
  });

  const status = await installation.status();
  installation.close();
}
