import Zones from '../../classes/zones';
import formatter from '../../utils/formatter';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { fields, separator, spinner, zone } = argv;
	let { format = 'list' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	if (fields === 'name_servers') {
		format = 'json';
	}

	spinner.text = `Requesting Zone information…`;
	const response = await Zones.get(zone);

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = `Get Zone done!`;
}
exports.command = 'get <zone>';
exports.desc = 'Get zone details';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,name,status,account.id,account.name,name_servers',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
