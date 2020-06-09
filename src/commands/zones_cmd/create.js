import Zones from '../../classes/zones';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'create <zoneName>';
exports.desc = 'Create a new Zone';
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
		describe:
			'A full zone implies that DNS is hosted with Cloudflare. A partial zone is typically a partner-hosted zone or a CNAME setup. valid values: full, partial',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { accountId, jumpStart, type, zoneName } = argv;

		const requestArgs = {
			name: zoneName,
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
