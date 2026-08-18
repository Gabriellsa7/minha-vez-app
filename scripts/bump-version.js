#!/usr/bin/env node
/**
 * Bumps the app's semantic version (app.json "expo.version" + package.json
 * "version") and commits the change, so every real build ships with a
 * unique, incrementing version number (e.g. 1.0.6 -> 1.0.7).
 *
 * Usage: node scripts/bump-version.js [patch|minor|major]
 * Defaults to "patch", matching the "npm version" convention.
 */
const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const ROOT = path.resolve(__dirname, "..");
const APP_JSON_PATH = path.join(ROOT, "app.json");
const PACKAGE_JSON_PATH = path.join(ROOT, "package.json");

const bumpType = process.argv[2] || "patch";
if (!["major", "minor", "patch"].includes(bumpType)) {
  console.error(`Unknown bump type "${bumpType}". Use patch, minor or major.`);
  process.exit(1);
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

function bumpSemver(version, type) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(version);
  if (!match) {
    throw new Error(`Version "${version}" is not a valid semver (X.Y.Z).`);
  }
  let [, major, minor, patch] = match.map(Number);
  if (type === "major") {
    major += 1;
    minor = 0;
    patch = 0;
  } else if (type === "minor") {
    minor += 1;
    patch = 0;
  } else {
    patch += 1;
  }
  return `${major}.${minor}.${patch}`;
}

const appJson = readJson(APP_JSON_PATH);
const packageJson = readJson(PACKAGE_JSON_PATH);

const currentVersion = appJson.expo.version;
const nextVersion = bumpSemver(currentVersion, bumpType);

appJson.expo.version = nextVersion;
packageJson.version = nextVersion;

writeJson(APP_JSON_PATH, appJson);
writeJson(PACKAGE_JSON_PATH, packageJson);

execSync(`git add "${APP_JSON_PATH}" "${PACKAGE_JSON_PATH}"`, { cwd: ROOT });
execSync(`git commit -m "chore(version): bump to v${nextVersion}"`, {
  cwd: ROOT,
  stdio: "inherit",
});

console.log(`Version bumped: ${currentVersion} -> ${nextVersion}`);
