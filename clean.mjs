#! /usr/bin/env node
import { rm } from 'node:fs';

const path = './copy';
const options = {
  recursive: true,
  force: true
}

rm(path, options, (err) => {
  if (err) {
    console.error("Could not clean the directory.", err);
    process.exit(1);
  }
});
