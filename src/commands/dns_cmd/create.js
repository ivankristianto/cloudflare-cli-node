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
	const { fields, type, name, content, ttl, proxied, priority, separator, spinner, zone } = argv;
	let { format = 'list' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	const requestArgs = { type, name, content, ttl, proxied, priority, zone };

	spinner.text = `Creating DNS record…`;

	const response = await DNS.create(requestArgs);

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = `DNS record ${name} successfully created!`;
}

exports.command = 'create <zone>';
exports.desc = 'Create a dns record for a zone';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,type,name,content,proxied,ttl',
		describe: 'Fields to return',
		type: 'string',
	},
	type: {
		default: 'A',
		describe: 'DNS record type, default A',
		type: 'string',
		demandOption: true,
	},
	name: {
		describe: 'DNS record name',
		type: 'string',
		demandOption: true,
	},
	content: {
		describe: 'DNS record content',
		type: 'string',
		demandOption: true,
	},
	ttl: {
		default: '1',
		describe: "Time to live for DNS record. Value of 1 is 'automatic'",
		type: 'string',
	},
	proxied: {
		default: true,
		describe:
			'Whether the record is receiving the performance and security benefits of Cloudflare, default: true',
		type: 'string',
	},
	priority: {
		default: 0,
		describe:
			'Used with some records like MX and SRV to determine priority. If you do not supply a priority for an MX record, a default value of 0 will be set',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
