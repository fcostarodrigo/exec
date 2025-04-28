import { Buffer } from "node:buffer";
import { spawn } from "node:child_process";
import process from "node:process";
import ora from "ora";

import { parseExecArgs } from "../src/parse-exec-args.js";

export async function exec(rawCommand, ...args) {
  const parsedArgs = parseExecArgs(rawCommand, args);
  const { command, options, printCommand, program, programArguments } = parsedArgs;

  if (options.printCommand) {
    console.log(printCommand);
  }

  if (options.inherit) {
    options.spawnOptions.stdio = "inherit";
  }

  options.spinner = options.spinner ? ora(command).start() : null;

  options.spawnOptions.env ??= { ...process.env, ...options.env };

  if (options.proxy) {
    for (const name of ["http_proxy", "https_proxy", "HTTP_PROXY", "HTTPS_PROXY"]) {
      options.spawnOptions.env[name] = options.proxy;
    }
  }

  const error = new Error("error");
  let attemptsLeft = options.retries;

  return new Promise((resolve, reject) => {
    let timeoutId = null;

    const handleError = (error) => {
      if (attemptsLeft < 1) {
        options.spinner?.stop();
        reject(error);
      } else {
        spawnNewProcess();
      }
    };

    const spawnNewProcess = () => {
      attemptsLeft -= 1;

      const childProcess = spawn(program, programArguments, options.spawnOptions);

      if (options.stdin !== "") {
        childProcess.stdin.write(options.stdin);
        childProcess.stdin.end();
      }

      const outputBuffer = [];

      if (!options.inherit) {
        childProcess.stdout.on("data", (data) => {
          if (options.printOutput) {
            process.stdout.write(data);
          }

          outputBuffer.push(data);
        });

        childProcess.stderr.on("data", (data) => {
          if (options.printOutput) {
            process.stderr.write(data);
          }

          outputBuffer.push(data);
        });
      }

      if (options.timeout !== null) {
        const onTimeout = () => {
          childProcess.kill();

          const output = Buffer.concat(outputBuffer).toString().trim();
          error.message = `Timeout: ${command}\n${output}`;
          handleError(error);
        };

        timeoutId = setTimeout(onTimeout, options.timeout);
      }

      childProcess.on("error", handleError);

      childProcess.on("close", (code) => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        const output = Buffer.concat(outputBuffer).toString().trim();

        if (code === 0) {
          options.spinner?.stop();
          resolve(output);
        } else {
          error.message = `Error running: ${command}\n${output}`;
          handleError(error);
        }
      });
    };

    spawnNewProcess();
  });
}
