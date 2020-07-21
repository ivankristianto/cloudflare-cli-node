import Zones from '../../classes/zones';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { all, files, hosts, tags, spinner, zone } = argv;

	const requestArgs = { all, files, hosts, tags };

	spinner.text = `Sending Zone purge cache request…`;

	const response = await Zones.purge(zone, requestArgs);

	if (response.success) {
		spinner.text = `Zone ${zone} cache(s) purged successfully!`;
	} else {
		throw new Error(response.errors[0]);
	}
}

exports.command = 'purge <zone>';
exports.desc = 'Purge caches';
exports.builder = {
	all: {
		default: false,
		describe: 'Purge Everything',
		type: 'boolean',
	},
	files: {
		default: [],
		describe: 'Purge selected files',
		type: 'array',
	},
	tags: {
		default: [],
		describe: 'Purge selected tags',
		type: 'array',
	},
	hosts: {
		default: [],
		describe: 'Purge selected hosts',
		type: 'array',
	},
};
exports.handler = withSpinner(runCommand);
