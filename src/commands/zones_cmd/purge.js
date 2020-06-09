import Zones from '../../classes/zones';
import log from '../../utils/logger';

exports.command = 'purge <zoneId|zoneName>';
exports.desc = 'Purge All Caches';
exports.builder = {
	zoneId: {
		describe: 'Zone ID',
		type: 'string',
	},
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
		const { all, files, hosts, tags, zoneId } = argv;

		const requestArgs = { all, files, hosts, tags };

		console.log('DEBUG: hosts', hosts); // eslint-disable-line no-console

		const response = await Zones.purge(zoneId, requestArgs);

		if (response.success) {
			log.success('Zone Cache Purges Successfully');
		} else {
			log.error(`Error: ${response.errors[0]}`);
		}
	} catch (err) {
		log.error(err);
	}
};
