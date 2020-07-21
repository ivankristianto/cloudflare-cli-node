import Zones from '../../classes/zones';
import formatter from '../../utils/formatter';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const {
		account,
		fields,
		separator,
		perPage,
		page,
		order,
		direction,
		status,
		spinner,
		verbose,
		zoneName,
	} = argv;
	let { format = 'table' } = argv;

	if (fields === 'id') {
		format = 'string';
	}

	const requestArgs = { account, direction, perPage, page, spinner, order, verbose };

	if (zoneName) {
		requestArgs.zoneName = zoneName;
	}

	if (status) {
		requestArgs.status = status;
	}

	spinner.text = `Requesting Zone list…`;

	const response = await Zones.list(requestArgs);

	const results = formatter.mappingFields(fields, response.result);

	formatter.output(results, { fields, format, separator });

	spinner.text = `Get Zone list done!`;
}

exports.command = 'list';
exports.desc = 'List, search, sort, and filter your zones';
exports.builder = {
	...formatter.commandArgs(),
	fields: {
		default: 'id,name,status,name_servers',
		describe: 'Fields to return',
		type: 'string',
	},
	perPage: {
		default: 20,
		describe: 'Number of zones per page',
		type: 'integer',
	},
	page: {
		default: 1,
		describe: 'Page number of paginated results',
		type: 'integer',
	},
	order: {
		default: 'name',
		describe: 'Field to order zones by',
		type: 'string',
	},
	direction: {
		default: 'asc',
		describe: 'Direction to order zones',
		type: 'string',
	},
	status: {
		describe: 'Status of the zone',
		type: 'string',
	},
	zoneName: {
		describe: 'Array of domain names',
		type: 'array',
	},
	account: {
		describe: 'Filter by account id',
		type: 'string',
	},
};
exports.handler = withSpinner(runCommand);
