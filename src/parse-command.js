/**
 * @argument {string} command
 * @returns string[]
 */
export function parseCommand(command) {
  return command
    .match(/("[^"]+")|('[^']+')|(\S+)/g)
    .map((x) => x.replace(/^"|'/, "").replace(/"|'$/, ""))
    .filter(Boolean);
}
