const fs = require("fs");
const { execSync } = require("child_process");

const rootPath = execSync("git rev-parse --show-toplevel").toString('utf-8').trim();
const contentPath = `${rootPath}/content`;

function doDirectory(path) {
  const list = fs.readdirSync(path, { withFileTypes: true });
  const dirs = list.filter((e) => e.isDirectory());
  const files = list.filter((e) => e.isFile() && e.name.endsWith(".txt"));

  const ret = {};

  files.forEach((f) => {
    ret[f.name.replace(".txt", "")] = fs.readFileSync(`${f.path}/${f.name}`, { encoding: "utf-8" });
  });

  dirs.forEach((d) => {
    ret[d.name] = doDirectory(`${d.path}/${d.name}`);
  })

  return ret;
}

const output = doDirectory(contentPath);
fs.writeFileSync(`${rootPath}/output.json`, JSON.stringify(output));