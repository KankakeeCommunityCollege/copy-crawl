#! /usr/bin/env node
import { readdir } from 'node:fs';
import { open } from 'node:fs/promises';
import { Counter } from './utils.mjs';


const path = './copy/';
const options = {
  recursive: true
}

const htmlFileRegExp = /.+\.(html)$/;

if (process.argv.length === 2) {
  console.error('Expected at least one argument!');
  process.exit(1);
}

const args = process.argv.slice(2);
const rawReg = args.filter(arg => arg.search(/^--regex=.+$/) !== -1);
const rawFlag = args.filter(arg => arg.search(/^--flags=.+$/) !== -1);

if (rawReg.length === 0) {
  console.error('Expected a "--regex=..." argument!');
  process.exit(1);
}

const flags = (rawFlag.length === 0) ? 'g' : rawFlag[0].replace(/^--flags=/, '');

const searchRegex = new RegExp(
  rawReg[0].replace(/^--regex=/, ''),
  `${flags}`
);

console.log(`[USING REGEX]: ${searchRegex}`);


async function fileReader(file) {
  const fileHandle = await open(`${path}/${file}`);
  const counter = new Counter(0);

  for await (const line of fileHandle.readLines()) {
    counter.increment();
    if (line.search(searchRegex) !== -1) {
      const matches = line.match(searchRegex);

      matches.forEach(
        match => console.log(`[FILE]:  ${file} (line: ${counter.report()})
[FOUND]: ${match}
[LINE]:  ${line}\n=====`)
      );
    }
  }
}

console.log(`\n==== [SEARCHING in: ${path}] ====`);

readdir(path, options, (err, files) => {
  if (err) {
    console.error("Could not list the directory.", err);
    process.exit(1);
  }

  // Filter out directories so that fileReader doesn't error on them
  const htmlFiles = files.filter(file => !file.search(htmlFileRegExp));

  htmlFiles.forEach(fileReader);
});

console.log(`\n====   [RESULTS]    ====`);
