export async function installUpdateHandler(
  moduleName: string,
  execName: string,
  moduleURL: string,
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
      moduleURL,
    ],
  });

  const status = await installation.status();
  installation.close();
}
