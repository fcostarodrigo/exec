import { parseCommand } from "./parse-command.js";

const prompt = "↪";

export function parseExecArgs(command, ...args) {
  const {
    env = {},
    inherit = false,
    printOutput = false,
    printCommand = inherit || printOutput,
    proxy = false,
    retries = 1,
    spawnOptions = {},
    spinner = false,
    stdin = "",
    timeout = null,
  } = getOptions(args);

  args = getArguments(args);
  const normalizedArgs = args.map((x) => [x].flat(Number.POSITIVE_INFINITY).join(" "));

  const tokens = parseCommand(command).concat(args.flat(Number.POSITIVE_INFINITY));

  return {
    command: [command, ...normalizedArgs].join(" "),
    options: {
      env: { ...env },
      inherit,
      printCommand,
      printOutput,
      proxy,
      retries,
      spawnOptions: { ...spawnOptions },
      spinner,
      stdin,
      timeout,
    },
    printCommand: [prompt, [command, ...normalizedArgs].join(" \\\n  ")].join(" "),
    program: tokens[0],
    programArguments: tokens.slice(1),
  };
}

function getArguments(args) {
  return args.flat().filter((arg) => !isOptions(arg));
}

function getOptions(args) {
  return args.flat().find((arg) => isOptions(arg)) ?? {};
}

function isOptions(arg) {
  return !Array.isArray(arg) && typeof arg === "object" && arg !== null;
}
