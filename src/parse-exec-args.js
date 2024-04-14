import { parseCommand } from "./parse-command.js";

const prompt = "↪";

function isOptions(arg) {
  return !Array.isArray(arg) && typeof arg === "object" && arg !== null;
}

function getOptions(args) {
  return args.flat().find((arg) => isOptions(arg)) ?? {};
}

function getArguments(args) {
  return args.flat().filter((arg) => !isOptions(arg));
}

export function parseExecArgs(command, ...args) {
  const {
    inherit = false,
    printOutput = false,
    printCommand = inherit || printOutput,
    proxy = false,
    stdin = "",
    spawnOptions = {},
    env = {},
    spinner = false,
    retries = 1,
    timeout = null,
  } = getOptions(args);

  args = getArguments(args);
  const normalizedArgs = args.map((x) => [x].flat(Number.POSITIVE_INFINITY).join(" "));

  const tokens = parseCommand(command).concat(args.flat(Number.POSITIVE_INFINITY));

  return {
    options: {
      inherit,
      printOutput,
      printCommand,
      proxy,
      stdin,
      spawnOptions: { ...spawnOptions },
      env: { ...env },
      spinner,
      retries,
      timeout,
    },
    printCommand: [prompt, [command, ...normalizedArgs].join(" \\\n  ")].join(" "),
    command: [command, ...normalizedArgs].join(" "),
    program: tokens[0],
    programArguments: tokens.slice(1),
  };
}
