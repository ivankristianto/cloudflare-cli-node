import Accounts from '../../classes/accounts';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'get <accountId>';
exports.desc = 'Get detail of an account';
exports.builder = {
	fields: {
		default: 'id,name,type',
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
		const { accountId, fields, separator } = argv;
		let { format } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const response = await Accounts.get(accountId);

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
