import boxConsole from "./box.ts";
import * as color from "https://deno.land/std/fmt/colors.ts";

let msg = `New ${color.yellow("patch")} version of ${
  color.red("box-console")
} available! ${color.red("0.1.0")} -> ${"0.1.1"}`;
let tip = `Registry ${color.cyan("https://github.com/snayan/box-console")}`;
let install = `Run ${color.green("npm i " + "box-console")} to update`;

console.log(boxConsole([msg, tip, install]))
