import Filters from '../../classes/filters';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'update <zone> <filterId>';
exports.desc = 'Update a single filter';
exports.builder = {
	...formatter.commandArgs(),
	expression: {
		describe: 'Filter Expression Rule',
		type: 'string',
		demandOption: true,
	},
	paused: {
		default: false,
		describe: 'Pause filter',
		type: 'boolean',
	},
	fields: {
		default: 'id,expression,paused',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { description, expression, paused, fields, filterId, separator, zone } = argv;
		let { format = 'list' } = argv;

		if (fields === 'id') {
			format = 'string';
		}
		const requestArgs = { description, expression, paused };
		const response = await Filters.update(zone, filterId, requestArgs);

		const results = formatter.mappingField(fields, response.result);

		formatter.output([results], { fields, format, separator });
	} catch (err) {
		log.error(err);
	}
};
