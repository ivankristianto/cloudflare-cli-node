import DNS from '../../classes/dns';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

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
exports.handler = async function (argv) {
	try {
		const {
			fields,
			separator,
			perPage,
			page,
			order,
			content,
			direction,
			name,
			status,
			type,
			zone,
		} = argv;
		let { format } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const requestArgs = { zone, perPage, page, order, content, direction, name, status, type };

		const response = await DNS.list(requestArgs);

		const results = formatter.mappingFields(fields, response.result);

		formatter.output({ fields, format, separator, results });
	} catch (err) {
		log.error(err);
	}
};
