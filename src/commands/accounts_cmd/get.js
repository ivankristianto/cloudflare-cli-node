import Accounts from '../../classes/accounts';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'get <accountId>';
exports.desc = 'Get information about a specific account that you are a member of';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,name,type,created_on',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { accountId, fields, separator } = argv;
		let { format = 'list' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const response = await Accounts.get(accountId);

		const results = formatter.mappingField(fields, response.result);

		formatter.output([results], { fields, format, separator });
	} catch (err) {
		log.error(err);
	}
};
