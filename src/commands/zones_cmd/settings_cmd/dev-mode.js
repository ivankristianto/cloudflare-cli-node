import Zones from '../../../classes/zones';
import formatter from '../../../utils/formatter';
import withSpinner from '../../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { fields, format = 'list', separator, spinner, value, zone } = argv;
	let requestArgs = {};
	let response;

	if (value) {
		requestArgs = { value };
		spinner.text = `Updating Zone development mode setting…`;
		response = await Zones.setSettings(zone, 'development_mode', requestArgs);
	} else {
		spinner.text = `Getting Zone development mode setting…`;
		response = await Zones.getSettings(zone, 'development_mode');
	}

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], {
		fields,
		format,
		separator,
	});

	spinner.text = `Request to Zone development mode setting done!`;
}

exports.command = 'devmode <zone>';
exports.desc = 'Get zone development mode setting';
exports.builder = {
	...formatter.commandArgs(),
	value: {
		describe: 'Set the value, on or off',
		type: 'string',
	},
	fields: {
		default: 'id,value,time_remaining',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
