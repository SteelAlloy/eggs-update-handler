import { UpdateNotifier } from "./update.ts";

const onWindows = Deno.build.os === "windows";
const [execName, updateCheckInterval, ...args] = Deno.args;

if (!execName) {
  console.log("Error, no module");
  Deno.exit(1);
}

const process = Deno.run({
  cmd: [
    execName + (onWindows ? ".cmd" : ""),
    ...args,
  ],
});

const status = await process.status();
process.close();

const notifier = new UpdateNotifier(execName, Number.parseInt(updateCheckInterval));

await notifier.init();
await notifier.checkForUpdate();

Deno.exit(status.code);

/**
 * 1. eggs install --allow-write --allow-read --unstable -n remove https://x.nest.land/remove-forever@1.0.0/cli.ts
 * 
 * 2. deno install --allow-write --allow-read --unstable -n __remove https://x.nest.land/remove-forever@1.0.0/cli.ts
 *    deno install --allow-all -n remove https://x.nest.land/nest-update-notifier@1.0.0/cli.ts __remove
 * 
 * 3. remove.cmd rm -s forever
 */
