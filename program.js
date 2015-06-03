#! /usr/bin/env node

var exec = require('child_process').exec,
	prompt = require('prompt'),
	semver = require('semver'),
	userArgs = require('minimist')(process.argv.splice(2)),
	remote = userArgs.origin || 'origin',
	pattern = userArgs.pattern,
	versionRegExp = new RegExp(userArgs.versionRegExp || '(v[^\^{}^\n]+)'),
	tagsToDelete = [],
	tagsToIgnore = [],

	commands = {
		list: 'git ls-remote -t ' + remote,
		deleteRemote: 'git push ' + remote + ' :refs/tags/',
		deleteLocal: 'git tag -d '
	},

	prompts = {
		confirm: {
			name: 'okay',
			default: 'no',
			pattern: /^yes|no$/,
			required: true,
			description: 'Delete these tags?'.red
		},
		reallyConfirm: {
			name: 'okay',
			default: 'no',
			pattern: /^yes|no$/,
			required: true,
			description: ('Really delete all these tags?\n' + tagsToDelete.join(', ')).red
		}
	},

	tagIterator = function(tag) {
		tag = tag.match(versionRegExp);
		if (tag) {
			if (pattern && semver.satisfies(tag[1], pattern) && tagsToDelete.indexOf(tag[1]) === -1) {
				tagsToDelete.push(tag[1]);
			} else if (tagsToIgnore.indexOf(tag[1]) === -1) {
				tagsToIgnore.push(tag[1]);
			}
		}
	},

	tagSorter = function(a, b) {
		if (semver.lt(a, b)) {
			return -1;
		} else if (semver.gt(a, b)) {
			return 1;
		}
		return 0;
	};

	cb_delete = function(err, answer1) {
		if (answer1.okay === 'yes') {
			prompt.get([prompts.reallyConfirm], cb_reallyDelete);
		}
	},

	cb_reallyDelete = function(err, answer2) {
		var locals = [],
			remotes = [];
		if (answer2.okay === 'yes') {
			tagsToDelete.forEach(function(tag) {
				locals.push(commands.deleteLocal + tag);
				remotes.push(commands.deleteRemote + tag);
			});
		}
		exec(locals.join(' && '), cb_locals);
		exec(remotes.join(' && '), cb_remotes);
	},

	cb_locals = function(err, stdout, stderr) {
		if (err) {
			console.error('failed to delete locals', err);
		}
	},

	cb_remotes = function(err, stdout, stderr) {
		if (err) {
			console.error('failed to delete remotes', err);
		}
	};

prompt.start();

exec(commands.list, function(err, stdout, stderr) {

	stdout.split(/\n/).forEach(tagIterator);

	if (tagsToDelete.length) {
		console.log('Matching pattern:', pattern);
		console.log(tagsToDelete.sort(tagSorter).join('\n'));
		prompt.get([prompts.confirm], cb_delete);
	} else {
		console.log(tagsToIgnore.sort(tagSorter).join('\n'));
		console.log('No matches. Listing all the tags.'.blue);
	}

});
