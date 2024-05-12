import Zones from '../../../classes/zones';
import formatter from '../../../utils/formatter';
import withSpinner from '../../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {Object} argv        Command params
 * @param {string} argv.format Output format
 * @return {Promise<void>}
 */
async function runCommand(argv) {
	const { fields, format, separator, spinner, value, zone } = argv;
	let requestArgs = {};
	let response;

	if (value) {
		requestArgs = { value: value.toString() };
		spinner.text = `Updating Zone SSL setting…`;
		response = await Zones.setSettings(zone, 'ssl', requestArgs);
	} else {
		spinner.text = `Getting Zone ssl setting…`;
		response = await Zones.getSettings(zone, 'ssl');
	}

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], {
		fields,
		format,
		separator,
	});

	spinner.text = `Request to Zone ssl setting done!`;
}

exports.command = 'ssl <zone>';
exports.desc = 'Get zone ssl settings';
exports.builder = {
	...formatter.commandArgs(),
	value: {
		describe: 'Set the value, valid: off, flexible, full, strict',
		type: 'string',
	},
	fields: {
		default: 'value,modified_on',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
