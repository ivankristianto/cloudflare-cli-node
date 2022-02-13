import Rules from '../../classes/rules';
import formatter from '../../utils/formatter';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { fields, priority, record, status, separator, spinner, zone } = argv;
	let { format = 'list', target, action } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	try {
		target = JSON.parse(target);
		action = JSON.parse(action);
	} catch (e) {
		spinner.text = e.message;
		return;
	}

	const requestArgs = { target, action, priority, record, status, zone };

	spinner.text = `Updating Zone page rule…`;

	const response = await Rules.update(requestArgs);

	const results = formatter.mappingField(fields, response.result);

	formatter.output([results], { fields, format, separator });

	spinner.text = 'Zone page rule successfully updated!';
}

exports.command = 'update <zone> <record>';
exports.desc = 'Update a page rule for a zone';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,targets,actions,priority,status',
		describe: 'Fields to return',
		type: 'string',
	},
	target: {
		describe: 'Targets to evaluate on a request',
		type: 'string',
		demandOption: true,
	},
	action: {
		describe: 'The set of actions to perform if the targets of this rule match the request. ',
		type: 'string',
		demandOption: true,
	},
	priority: {
		default: 1,
		describe: 'A number that indicates the preference for a page rule over another.',
		type: 'number',
	},
	status: {
		default: 'active',
		describe: 'Status of the page rule.',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
