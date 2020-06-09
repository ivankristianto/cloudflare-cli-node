import User from '../../classes/user';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'organizations';
exports.desc = 'List organizations of current user';
exports.builder = {
	fields: {
		default: 'id,name,status',
		describe: 'Fields to return',
		type: 'string',
	},
	format: {
		default: 'table',
		describe: 'Format the output, value: table, string, json',
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
		const { fields, separator } = argv;
		let { format } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const response = await User.get();

		const results = formatter.mappingFields(fields, response.result.organizations);

		switch (format) {
			case 'json':
				formatter.toJson(results);
				break;
			case 'string':
				formatter.toString(results, separator);
				break;
			case 'table':
			default:
				formatter.toTable(fields, results);
				break;
		}
	} catch (err) {
		log.error(err);
	}
};
