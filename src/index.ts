import {runCommandFromArgs} from "./commands_execution";

async function main() {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.log("No command specified");
    return 1;
  }
  return await runCommandFromArgs(args[0], args.slice(1));
}

const errorCode = await main();
process.exit(errorCode);
