import Zones from '../../classes/zones';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'activation_check [zones...]';
exports.desc = 'Initiate another zone activation check';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'name,status,message',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, separator, zones } = argv;
		let { format = 'table' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const requestArgs = { zones };

		const response = await Zones.activationCheck(requestArgs);

		const results = formatter.mappingFields(fields, response);

		formatter.output(results, { fields, format, separator });
	} catch (err) {
		log.error(err);
	}
};
