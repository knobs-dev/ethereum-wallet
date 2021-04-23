const { exec } = require("child_process");
const { readFile, writeFileSync } = require("fs");
const argv = require("minimist")(process.argv.slice(2));
const { join } = require("path");
const pkg = require(join(process.cwd(), "package.json"));

const VERSIONING_FILE = argv.constantPath || "constant.js";
const VERSION = pkg.version;
const VERSION_PATTERN_REGEX = /\[?(\d+\.\d+\.\d+)/m;

/**
 * Update version in constant file
 *
 * @param  {string} input             Input to be changed
 * @return {string} Updated input
 */
function updateVersionFile(input) {
    if (!VERSION_PATTERN_REGEX.test(input)) {
        process.exit(1);
    }
    const previousVersion = input.match(VERSION_PATTERN_REGEX)[1];
    return input.replace(previousVersion, VERSION);
}

function run() {
    readFile(
        VERSIONING_FILE,
        { encoding: "utf-8" },
        (error, constantContent) => {
            if (error) {
                console.log("[FS ERROR]", error);
            }

            writeFileSync(VERSIONING_FILE, updateVersionFile(constantContent));

            exec(`git add ${VERSIONING_FILE}`, (error, stdout) => {
                if (error) {
                    console.log("[GIT ERROR]", error);
                    process.exit(1);
                } else {
                    exec(
                        `git commit --amend -m "Updated to version ${VERSION}"`,
                        (error, stdout) => {
                            if (error) {
                                console.log("[GIT ERROR]", error);
                            }

                            process.exit(0);
                        }
                    );
                }
            });
        }
    );
}

run();
