import Filters from '../../classes/filters';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'create <zone>';
exports.desc = 'Create filters rules';
exports.builder = {
	...formatter.commandArgs(),
	expressions: {
		describe: 'Filter Expression Rule',
		type: 'array',
		demandOption: true,
	},
	fields: {
		default: 'id,description,expression,paused',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, separator, zone } = argv;
		let { expressions, format = 'list' } = argv;

		if (fields === 'id') {
			format = 'string';
		}

		expressions = expressions.map((expression) => JSON.parse(expression));

		const requestArgs = { expressions };
		const response = await Filters.create(zone, requestArgs);

		const results = formatter.mappingFields(fields, response.result);

		formatter.output([results], { fields, format, separator });
	} catch (err) {
		log.error(err);
	}
};
