import process from "node:process";
import { test, expect, vi, beforeEach } from "vitest";
import { exec } from "./exec.js";

vi.stubGlobal("console", {
  log: vi.fn(),
  warn: vi.fn(),
  error: vi.fn(),
});

beforeEach(() => {
  vi.resetAllMocks();
});

const nodePath = `"${process.execPath}"`;

test("Hello world!", async () => {
  expect(await exec(nodePath, [["-p", "'Hello world!'"]])).toBe("Hello world!");
});

test("Print output", async () => {
  await exec(nodePath, [["-p", "'Hello world!'"]], {
    printOutput: true,
  });

  const output = `↪ ${nodePath} \\\n  -p 'Hello world!'`;

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
