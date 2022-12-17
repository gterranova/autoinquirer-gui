import * as fs from 'fs';
import * as rimraf from 'rimraf';
import { PACKAGES, exec } from './util';

const mainPkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
const distDir = 'dist/@autoinquirer';

// cleanup
//exec(`rm -rf ${distDir}`);
rimraf.sync(distDir);

PACKAGES.map((name) => {
  // build package
  exec(name === 'schematics' ? `ts-node --dir build schematics.ts` : `ng build @autoinquirer/${name} --configuration production`);

  const pkgDir = `${distDir}/${name}`;
  //exec(`cp README.md ${pkgDir}`);

  // update `FORMLY-VERSION` in package.json for all sub-packages
  const pkgPath = `${pkgDir}/package.json`;
  const pkgJson = {
    ...JSON.parse(fs.readFileSync(pkgPath, 'utf8')),
    version: mainPkg.version,
    homepage: mainPkg.homepage,
    description: mainPkg.description,
    repository: mainPkg.repository,
    bugs: mainPkg.bugs,
  };

  if (pkgJson.peerDependencies && pkgJson.peerDependencies['@autoinquirer/core']) {
    pkgJson.peerDependencies['@autoinquirer/core'] = mainPkg.version;
  }

  fs.writeFileSync(pkgPath, JSON.stringify(pkgJson, null, 2));
});