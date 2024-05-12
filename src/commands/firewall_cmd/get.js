import Firewall from '../../classes/firewall';
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
	const { fields, firewallId, separator, spinner, zone } = argv;
	let { format = 'list' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	spinner.text = `Requesting Firewall information…`;

	const response = await Firewall.get(zone, firewallId);

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = `Get Firewall information done!`;
}

exports.command = 'get <zone> <firewallId>';
exports.desc = 'Get details of a zone firewall';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,description,paused,modified_on,filter.id,filter.expression,action',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
