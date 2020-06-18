import { UpdateNotifier } from "./lib/update.ts";

const onWindows = Deno.build.os === "windows";
const [execName, updateCheckInterval, ...args] = Deno.args;

if (!execName || !updateCheckInterval) {
  console.error("Error, no module");
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
