import DNS from '../../classes/dns';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

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
		default: 'A',
		describe: 'DNS record type, default A',
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
exports.handler = async function (argv) {
	try {
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
			zone,
		} = argv;
		let { format = 'list' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const requestArgs = { type, name, content, ttl, proxied, priority, record, zone };
		const response = await DNS.update(requestArgs);

		const results = formatter.mappingField(fields, response.result);

		formatter.output([results], { fields, format, separator });
		log.success(`\nDNS record ${name} successfully updated`);
	} catch (err) {
		log.error(err);
	}
};
