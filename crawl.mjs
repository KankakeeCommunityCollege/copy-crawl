#! /usr/bin/env node
import { readdir } from 'node:fs';
import { open } from 'node:fs/promises';
import { Counter } from './utils.mjs';


const path = './copy/';
const options = {
  recursive: true
}

const searchRegex = /https:\/\/www\.kcc\.edu\/student-resources\/?/g
const htmlFileRegExp = /.+\.(html)$/;

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
