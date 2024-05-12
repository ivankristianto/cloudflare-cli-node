import DNS from '../../classes/dns';
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
	const { fields, separator, perPage, page, order, content, direction, name, spinner, status, type, zone } = argv;
	let { format = 'table' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	const requestArgs = { zone, perPage, page, order, content, direction, name, status, type };

	spinner.text = `Requesting DNS record list…`;

	const response = await DNS.list(requestArgs);

	const results = formatter.mappingFields(fields, response.result);

	formatter.output(results, { fields, format, separator });

	spinner.text = `Get DNS record list done!`;
}

exports.command = 'list <zone>';
exports.desc = 'List of dns records of a zone';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,type,name,content,proxied',
		describe: 'Fields to return',
		type: 'string',
	},
	content: {
		describe: 'DNS record content, ex: 1.1.1.1',
		type: 'string',
	},
	name: {
		describe: 'DNS record name, ex: sub1.example.com',
		type: 'string',
	},
	perPage: {
		default: 20,
		describe: 'Number of zones per page',
		type: 'integer',
	},
	page: {
		default: 1,
		describe: 'Page number of paginated results',
		type: 'integer',
	},
	order: {
		default: 'name',
		describe: 'Field to order zones by',
		type: 'string',
	},
	direction: {
		default: 'asc',
		describe: 'Direction to order zones',
		type: 'string',
	},
	status: {
		default: 'active',
		describe: 'Status of the zone',
		type: 'string',
	},
	type: {
		describe:
			'DNS record type, valid values: A, AAAA, CNAME, TXT, SRV, LOC, MX, NS, SPF, CERT, DNSKEY, DS, NAPTR, SMIMEA, SSHFP, TLSA, URI',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
