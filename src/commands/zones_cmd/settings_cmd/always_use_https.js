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
		spinner.text = `Updating Zone always use https setting…`;
		response = await Zones.setSettings(zone, 'always_use_https', requestArgs);
	} else {
		spinner.text = `Getting Zone always use https setting…`;
		response = await Zones.getSettings(zone, 'always_use_https');
	}

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], {
		fields,
		format,
		separator,
	});

	spinner.text = `Request to Zone always use https setting done!`;
}

exports.command = 'always_use_https <zone>';
exports.desc = 'Get zone always use https settings';
exports.builder = {
	...formatter.commandArgs(),
	value: {
		describe: 'Set the value, valid: on, off',
		type: 'string',
	},
	fields: {
		default: 'value,modified_on',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
