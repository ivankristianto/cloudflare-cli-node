import Filters from '../../classes/filters';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'update <zone> <filterId>';
exports.desc = 'Update a single filter';
exports.builder = {
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
		const { description, expression, paused, fields, format, filterId, separator, zone } = argv;
		const requestArgs = { description, expression, paused };
		const response = await Filters.update(zone, filterId, requestArgs);

		const results = formatter.mappingField(fields, response.result);

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
