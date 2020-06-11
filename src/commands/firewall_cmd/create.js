import Firewall from '../../classes/firewall';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'create <zone>';
exports.desc = 'Create a new firewall rule';
exports.builder = {
	filterId: {
		describe: 'Filter id to apply to this rule',
		type: 'string',
	},
	expression: {
		describe: 'Filter expression will created for this rule, and will ignore the filterId',
		type: 'string',
	},
	action: {
		describe:
			'The firewall action to perform, values: log, bypass, allow. challenge, js_challenge, block',
		type: 'string',
		demandOption: true,
	},
	description: {
		describe: 'To briefly describe the rule',
		type: 'string',
	},
	paused: {
		default: false,
		describe: 'Indicates if the rule is active',
		type: 'boolean',
	},
	priority: {
		describe: "The rule's priority, gets lowest priority if omitted",
		type: 'number',
	},
	ref: {
		describe: 'Unique, user-supplied identifier or reference',
		type: 'string',
	},
	fields: {
		default: 'id,description,action',
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
		const {
			filterId,
			expression,
			action,
			description = '',
			paused,
			priority,
			ref,
			zone,
			fields,
			format,
			separator,
		} = argv;

		if (!filterId && !expression) {
			log.warning('You need to provide filterId or expression');
			return;
		}

		let filters = {};

		if (filterId) {
			filters = {
				filter: {
					id: filterId,
				},
			};
		}

		if (expression) {
			filters = {
				filter: {
					expression,
				},
			};
		}

		const requestArgs = { ...filters, action, description, paused, priority, ref };

		const response = await Firewall.create(zone, requestArgs);

		const results = formatter.mappingField(fields, response.result[0]);

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
