import Zones from '../../classes/zones';
import formatter from '../../utils/formatter';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {Object} argv        Command params
 * @param {string} argv.format Output format
 * @return {Promise<void>}
 */
async function runCommand(argv) {
	const { accountId, jumpStart, type, zone, fields, format = 'list', separator, spinner } = argv;

	const requestArgs = {
		name: zone,
		accountId,
		jumpStart,
		type,
	};

	spinner.text = `Creating new Zone…`;

	const response = await Zones.create(requestArgs);

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = `Zone create done!`;
}

exports.command = 'create <zone>';
exports.desc = 'Create new zone, permission needed: #zone:edit';
exports.builder = {
	...formatter.commandArgs(),
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
	fields: {
		default: 'id,name,status,name_servers,original_name_servers',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
