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
      "-A",
      "-n",
      moduleName,
      "https://x.nest.land/eggs-update-handler@1.0.0/cli.ts",
      execName,
      updateCheckInterval.toString()
    ],
  });

  const status = await installation.status();
  installation.close();
}
