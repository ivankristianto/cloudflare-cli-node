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
	const {
		fields,
		type,
		name,
		content,
		ttl,
		proxied,
		priority,
		record,
		separator,
		spinner,
		zone,
	} = argv;
	let { format = 'list' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	const requestArgs = { type, name, content, ttl, proxied, priority, record, zone };

	spinner.text = `Updating DNS record…`;

	const response = await DNS.update(requestArgs);

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = `DNS record ${name} successfully updated`;
}

exports.command = 'update <zone> <record>';
exports.desc = 'Update a dns record for a zone';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,type,name,content,proxied,ttl',
		describe: 'Fields to return',
		type: 'string',
	},
	type: {
		describe: 'DNS record type',
		type: 'string',
	},
	content: {
		describe: 'DNS record content',
		type: 'string',
	},
	name: {
		describe: 'DNS record name',
		type: 'string',
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
		type: 'boolean',
	},
	priority: {
		default: 0,
		describe:
			'Used with some records like MX and SRV to determine priority. If you do not supply a priority for an MX record, a default value of 0 will be set',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
