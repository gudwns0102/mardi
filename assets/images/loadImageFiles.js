const fs = require("fs");

const allFiles = fs.readdirSync("./assets/images");

const allPngFiles = allFiles.filter(file => /.(png|gif|jpg)$/.test(file));

const allSinglePngFiles = allPngFiles
  .map(file => file.replace(/@[2|3]x/, ""))
  .reduce((acc, curr) => {
    if (!acc.find(val => val === curr)) {
      return [...acc, curr];
    }

    return [...acc];
  }, []);

const result = `export const images = {
  ${allSinglePngFiles
    .map(file => `${file.split(/.(png|gif|jpg)/)[0]}: require("./${file}")`)
    .join(",\n")}
}
`;

fs.writeFileSync("./assets/images/index.ts", result);
