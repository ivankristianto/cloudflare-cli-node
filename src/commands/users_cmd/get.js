import User from '../../classes/user';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'get';
exports.desc = 'Get detail of current user';
exports.builder = {
	fields: {
		default: 'id,email,username',
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

		const results = [];

		fields.split(',').forEach((field) => {
			results.push(response.result[field]);
		});

		switch (format) {
			case 'json':
				formatter.toJson(results);
				break;
			case 'string':
				formatter.toString(results, separator);
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
