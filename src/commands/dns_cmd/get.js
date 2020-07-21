import DNS from '../../classes/dns';
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
	const { fields, record, separator, spinner, zone } = argv;
	let { format } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	spinner.text = `Getting DNS record information…`;

	const response = await DNS.get({ record, zone });

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = `Get DNS record information done!`;
}

exports.command = 'get <zone> <record>';
exports.desc = 'Get DNS record details';
exports.builder = {
	fields: {
		default: 'id,type,name,content,proxied,ttl',
		describe: 'Fields to return',
		type: 'string',
	},
	format: {
		default: 'list',
		describe: 'Format the output, value: table, string, json, list',
		type: 'string',
	},
	separator: {
		default: ' ',
		describe: 'Separator value when the output format is string',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
