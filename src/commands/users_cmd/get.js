import User from '../../classes/user';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'get';
exports.desc = 'Get details of current user';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,email,username',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, separator } = argv;
		let { format = 'table' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const response = await User.get();

		const results = formatter.mappingField(fields, response.result);

		formatter.output([results], { fields, format, separator });
	} catch (err) {
		log.error(err);
	}
};
