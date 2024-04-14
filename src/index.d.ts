import type { spawn } from "node:child_process";

type Option = {
  inherit?: boolean;
  printOutput?: boolean;
  printCommand?: boolean;
  proxy?: string;
  stdin?: string;
  spawnOptions?: Parameters<typeof spawn>[2];
  env?: Record<string, string>;
  spinner?: boolean;
  retries?: number;
  timeout?: number;
};

export function exec(
  command: string,
  ...options: Array<string | string[] | string[][] | string[][][] | Option>
): Promise<string>;
