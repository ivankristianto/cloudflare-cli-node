import Zones from '../../classes/zones';
import log from '../../utils/logger';

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
exports.handler = async function (argv) {
	try {
		const { all, files, hosts, tags, zone } = argv;

		const requestArgs = { all, files, hosts, tags };

		const response = await Zones.purge(zone, requestArgs);

		if (response.success) {
			log.success('Zone Cache(s) Purges Successfully');
		} else {
			log.error(`Error: ${response.errors[0]}`);
		}
	} catch (err) {
		log.error(err);
	}
};
