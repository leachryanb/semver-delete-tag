# semver-tag-delete

## Command line utility for deleting ranges of tags

Leverages the node-semver and semver pattern matching.

## Usage:

`$ npm install semver-tag-delete -g`

Example: `$ semver-tag-delete --pattern='0.0.1 - 0.0.5'`

You can specify any valid semver range.  You will be prompted to approve the matched set before proceeding with deletion.
Both local and remote tags will be deleted.

## References:

* https://github.com/npm/node-semver
