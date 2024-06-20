
# Copy Crawl

> Copy then crawl the HTML of a website to find occurrences of a string

-----

## Prerequisites

* Nodejs version specified in `.nvmrc` file.
* A working `wget` command.

-----

## Installation

```bash
git clone git@github.com:KankakeeCommunityCollege/copy-crawl.git
cd copy-crawl

# If you use nvm and it's not setup to automatically switch:
nvm use
```

-----

## Usage

### Clean & Copy

Clean the `./copy` folder and copy the HTML pages that makeup www.example.com:

```bash
URL=www.example.com npm start
```

You can also run the `clean` and `copy` commands independently:

```bash
npm run clean # Delete everything in the `./copy` folder
URL=www.example.com npm run copy # Use wget to copy HTML pages to `./copy`
```

The `copy` npm script uses `wget` to make a copy of www.example.com in the local `./copy/` folder. It does not copy images, JS, CSS or other dependencies, only the HTML files that makeup the website.

The `wget` command will not traverse any higher than the URL you give it. For example `URL=www.example.com/foo/bar/ npm start` (or `URL=www.example.com/foo/bar/ npm run copy`) will copy everything under `/foo/bar/` but not go up to `/foo/` or the domain root.

### Crawl

Crawl through the HTML pages copied into `./copy/`:

```bash
npm run crawl
```

The above npm script will iterate through every HTML file in the `./copy/` folder. It looks for matches against the regular expression stored in the  `searchRegex` constant defined in the module scope of `crawl.mjs`.

Adjust the `searchRegex` constant to search for whatever string you want in the HTML.

Matches will be logged to the command line in the following format:

```bash
$ npm run crawl

> copy-crawl@1.0.0 crawl
> node crawl.mjs


==== [SEARCHING in: ./copy/] ====

====   [RESULTS]    ====
[FILE]:  faq.html (line: 201)
[FOUND]: https://www.kcc.edu/student-resources/
[LINE]:            <p class="present-before-paste">Additional referral resources are on the <a href="https://www.kcc.edu/student-resources/counseling-and-referral-services/">Counseling and Referral Services page</a>.</p>
=====
[FILE]:  kcc-resources.html (line: 186)
[FOUND]: https://www.kcc.edu/student-resources/
[LINE]:                  <li>Additional referral resources are on the <a href="https://www.kcc.edu/student-resources/counseling-and-referral-services/">Counseling and Referral Services page</a>.</li>
=====
```

### Crawler

The `crawler` npm script does the same thing as `crawl` but uses command line arguments to set the regular expression used.

Arguments must include an equals-sign. Wrap argument values in quotes if you don't want to escape backslashes.

The ***required*** `--regex=...` argument is used set the regular expression:

```bash
npm run crawler -- --regex='https:\/\/www\.kcc\.edu\/student-resources\/?'

# You must escape backslashes if not using quotes:
npm run crawler -- --regex=https:\\/\\/www\\.kcc\\.edu\\/student-resources\\/?
```

The ***optional*** `--flags=...` argument is used to set the regular expression flags. If the argument is omitted, the global (`g`) flag will be used as a default.

```bash
npm run crawler -- --flags=gi --regex='https:\/\/www\.kcc\.edu\/student-resources\/?'
```

The order of the arguments does not matter. An invalid regular expression will cause the script to error-out.

Remember that npm requires double hyphens before any script arguments:
```bash
npm run <command> [-- <args>]
```
