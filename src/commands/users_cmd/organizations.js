import User from '../../classes/user';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'organizations';
exports.desc = 'List organizations of current user';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,name,status',
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

		const results = formatter.mappingFields(fields, response.result.organizations);

		formatter.output(results, { fields, format, separator });
	} catch (err) {
		log.error(err);
	}
};
