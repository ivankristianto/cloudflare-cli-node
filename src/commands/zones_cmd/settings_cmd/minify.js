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
		requestArgs = { value: JSON.parse(value) };
		spinner.text = `Updating Zone minify setting…`;
		response = await Zones.setSettings(zone, 'minify', requestArgs);
	} else {
		spinner.text = `Getting Zone minify setting…`;
		response = await Zones.getSettings(zone, 'minify');
	}

	const results = formatter.mappingField(fields, response.result.value);

	formatter.output([results], {
		fields,
		format,
		separator,
	});

	spinner.text = `Request to Zone minify setting done!`;
}

exports.command = 'minify <zone>';
exports.desc = 'Get zone minify settings';
exports.builder = {
	...formatter.commandArgs(),
	value: {
		describe: 'Set the value, in json format',
		type: 'string',
	},
	fields: {
		default: 'css,html,js',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
