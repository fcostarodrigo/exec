# Exec

Wrapper around node spawn process to make it easier to use.

## Features

### Promises

Command is converted to a promise.

```js
const result = await exec("echo Hello World!");
console.log(result); // Hello World!
```

### Command parser

Spaces are trimmed.

```js
const result = await exec("echo Hello     World!");
console.log(result); // Hello World!
```

Quotes and double quotes can be used to don't trim spaces.

```js
const result = await exec("echo 'Hello     World!'");
console.log(result); // Hello     World!
```

Other arguments are take literally.

```js
const result = await exec("echo", "Hello     World!");
console.log(result); // Hello     World!
```

You can use array of strings to make it easier to read.

```js
await exec("program", { env: {} }, [
  ["--option", "value"],
  ["--option", "value"],
  ["--option", "value"],
]);
```

### Other options

- `printCommand`: Print command before running it.
- `inherit`: Send output directly to the terminal. Some programs will work on "CI" mode if terminal's stdio is not inherited.
- `spinner`: Display a spinner while the command is running.
- `spawnOptions`: Override options sent to spawn.
- `proxy`: Set proxy environment variables to this value.
- `retries`: Retry running command on error.
- `timeout`: Fail command on timeout.
- `ignoreError`: Never rejects returning promise.
- `stdin`: Send text like the character `y` to the program.
- `printOutput`: When not inheriting stdio, send output from the program to the terminal.

## Changelog

[Changelog](CHANGELOG.MD)

## License

[MIT License](http://www.opensource.org/licenses/mit-license.php)
