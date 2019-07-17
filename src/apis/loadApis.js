const fs = require("fs");
const path = require("path");

const whitelist = ["loadApis.js", "index.ts", ".DS_Store"];

const isDirectory = path => {
  return fs.lstatSync(path).isDirectory();
};

const isFile = path => {
  return fs.lstatSync(path).isFile();
};

const createFileExportRow = filepath => {
  return `export * from "${filepath}";`;
};

const createDirectoryExportRow = dirpath => {
  fs.writeFileSync(
    `${dirpath}/index.ts`,
    fs
      .readdirSync(dirpath)
      .filter(file => !whitelist.includes(file))
      .map(name => {
        if (isDirectory(`${dirpath}/${name}`)) {
          createDirectoryExportRow(`${dirpath}/${name}`);
        }
        return createFileExportRow(`${dirpath}/${name.split(".ts")[0]}`);
      })
      .join("\n")
  );
};

createDirectoryExportRow("src/apis");
