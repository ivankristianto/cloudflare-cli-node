import DNS from '../../classes/dns';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

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
exports.handler = async function (argv) {
	try {
		const { fields, separator, record, zone } = argv;
		let { format } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const response = await DNS.get({ record, zone });

		const results = formatter.mappingField(fields, response.result);

		switch (format) {
			case 'json':
				formatter.toJson(results);
				break;
			case 'string':
				formatter.toString(results, separator);
				break;
			case 'list':
				formatter.toList(fields, results);
				break;
			case 'table':
			default:
				formatter.toTable(fields, [results]);
				break;
		}
	} catch (err) {
		log.error(err);
	}
};
