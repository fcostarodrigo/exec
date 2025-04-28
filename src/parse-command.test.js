import { expect, test } from "vitest";

import { parseCommand } from "./parse-command.js";

test("Parse single command", () => {
  expect(parseCommand("echo")).toEqual(["echo"]);
});

test("Parse space separated arguments", () => {
  expect(parseCommand("echo hello")).toEqual(["echo", "hello"]);
});

test("Ignore white spaces", () => {
  const command = "  echo  \t   Hello World!   ";
  expect(parseCommand(command)).toEqual(["echo", "Hello", "World!"]);
});

test("Parse argument in double quotes", () => {
  expect(parseCommand('echo "Hello World!"')).toEqual(["echo", "Hello World!"]);
});

test("Parse argument in single quotes", () => {
  expect(parseCommand("echo 'Hello World!'")).toEqual(["echo", "Hello World!"]);
});
