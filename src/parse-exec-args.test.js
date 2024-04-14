import { test, expect } from "vitest";
import { parseExecArgs } from "./parse-exec-args.js";

test("Exec parse arguments", () => {
  const result = parseExecArgs("npx script 'hello World'", { proxy: true }, [
    ["--switch1", "switchArgument1"],
    ["--switch2", "switchArgument2"],
  ]);

  expect(result).toEqual({
    command: "npx script 'hello World' --switch1 switchArgument1 --switch2 switchArgument2",
    options: {
      retries: 1,
      inherit: false,
      printCommand: false,
      printOutput: false,
      proxy: true,
      env: {},
      spinner: false,
      spawnOptions: {},
      stdin: "",
      timeout: null,
    },
    printCommand:
      "↪ npx script 'hello World' \\\n  --switch1 switchArgument1 \\\n  --switch2 switchArgument2",
    program: "npx",
    programArguments: [
      "script",
      "hello World",
      "--switch1",
      "switchArgument1",
      "--switch2",
      "switchArgument2",
    ],
  });
});
