import process from "node:process";
import { beforeEach, expect, test, vi } from "vitest";

import { exec } from "./exec.js";

vi.stubGlobal("console", {
  error: vi.fn(),
  log: vi.fn(),
  warn: vi.fn(),
});

beforeEach(() => {
  vi.resetAllMocks();
});

const nodePath = `"${process.execPath}"`;

test("Hello World!", async () => {
  expect(await exec(nodePath, [["-p", "'Hello World!'"]])).toBe("Hello World!");
});

test("Print command", async () => {
  await exec(nodePath, [["-p", "'Hello World!'"]], {
    printCommand: true,
  });

  const output = `↪ ${nodePath} \\\n  -p 'Hello World!'`;

  expect(console.log).toHaveBeenCalledWith(output);
});

test("Retry", async () => {
  const script = "process.exitCode = Math.random() > 0.5 ? 1 : 0";

  await exec(nodePath, [["-e", script]], { retries: 10 });
});

test("Timeout", async () => {
  const script = "setTimeout(() => {}, 100_000)";
  await expect(exec(nodePath, [["-e", script]], { timeout: 0 })).rejects.toThrowError();
});
