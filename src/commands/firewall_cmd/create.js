import Firewall from '../../classes/firewall';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {Object} argv        Command params
 * @param {string} argv.format Output format
 * @return {Promise<void>}
 */
async function runCommand(argv) {
	const {
		action,
		description = '',
		expression,
		fields,
		filterId,
		format = 'list',
		paused,
		priority,
		ref,
		separator,
		spinner,
		zone,
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

	spinner.text = `Creating Firewall rule…`;

	const response = await Firewall.create(zone, requestArgs);

	const results = formatter.mappingField(fields, response.result[0]);

	formatter.output([results], { fields, format, separator });

	spinner.text = `New Firewall rule created successfully!`;
}

exports.command = 'create <zone>';
exports.desc = 'Create a new firewall rule';
exports.builder = {
	...formatter.commandArgs(),
	filterId: {
		describe: 'Filter id to apply to this rule',
		type: 'string',
	},
	expression: {
		describe: 'Filter expression will created for this rule, and will ignore the filterId',
		type: 'string',
	},
	action: {
		describe: 'The firewall action to perform, values: log, bypass, allow. challenge, js_challenge, block',
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
};
exports.handler = withSpinner(runCommand);
