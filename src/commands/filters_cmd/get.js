import Filters from '../../classes/filters';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'get <zone> <filterId>';
exports.desc = 'Get detail of a zone firewall filters';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,expression,paused',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, filterId, separator, zone } = argv;
		let { format = 'list' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		const response = await Filters.get(zone, filterId);

		const results = formatter.mappingField(fields, response.result);

		formatter.output([results], { fields, format, separator });
	} catch (err) {
		log.error(err);
	}
};
