# semver-tag-delete

## Command line utility for deleting ranges of tags

Leverages the node-semver and semver pattern matching.

## Usage:

`$ npm install semver-tag-delete -g`

#### Example:
`$ semver-tag-delete --pattern='0.0.1 - 0.0.3'` will match and delete tags: v0.0.1, v0.0.2 and v0.0.3

#### Flags:
`--pattern` - The semver pattern to match the tags you wish to delete. _Required_

`--versionRegExp` - The regex to use to parse your versioning pattern. _Default:_ `v[^\^{}^\n]+`

`--remote` - The name of the remote to use to get your remote tags. _Default:_ `origin`

You can specify any valid semver range.  You will be prompted to approve the matched set before proceeding with deletion.
Both local and remote tags will be deleted.

## References:

* https://github.com/npm/node-semver
