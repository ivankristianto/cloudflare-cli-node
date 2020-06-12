import Zones from '../../classes/zones';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'get <zone>';
exports.desc = 'Get zone details';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,name,status,name_servers',
		describe: 'Fields to return',
		type: 'string',
	},
	format: {
		default: 'list',
		describe: 'Format the output, value: table, string, json, list',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, separator, zone } = argv;
		let { format = 'list' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		if (fields === 'name_servers') {
			format = 'json';
		}

		const response = await Zones.get(zone);

		const results = formatter.mappingField(fields, response.result);

		formatter.output({ fields, format, separator, results });
	} catch (err) {
		log.error(err);
	}
};
