import Zones from '../../classes/zones';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'create <zone>';
exports.desc = 'Create new zone, permission needed: #zone:edit';
exports.builder = {
	accountId: {
		describe: 'Account ID where Zone added to',
		type: 'string',
		demandOption: true,
	},
	jumpStart: {
		default: true,
		describe: 'Automatically attempt to fetch existing DNS records',
		type: 'boolean',
	},
	type: {
		default: 'full',
		describe: 'A full or partial zone hosted with Cloudflare. default: full',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { accountId, jumpStart, type, zone } = argv;

		const requestArgs = {
			name: zone,
			accountId,
			jumpStart,
			type,
		};

		const response = await Zones.create(requestArgs);

		formatter.toJson(response.result);
	} catch (err) {
		log.error(err);
	}
};
