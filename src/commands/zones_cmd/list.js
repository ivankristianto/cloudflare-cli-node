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
		direction,
		exportCsv,
		fields,
		order,
		perPage,
		page,
		separator,
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

	if (!exportCsv) {
		formatter.output(results, { fields, format, separator });
		spinner.text = `Get Zone list done!`;
	} else {
		await formatter.toCsv(exportCsv, results, { fields, format, separator });
		spinner.text = `Zone list wrote to ${exportCsv} file!`;
	}
}

exports.command = 'list';
exports.desc = 'List, search, sort, and filter your zones';
exports.builder = {
	...formatter.commandArgs(),
	account: {
		describe: 'Filter by account id',
		type: 'string',
	},
	direction: {
		default: 'asc',
		describe: 'Direction to order zones',
		type: 'string',
	},
	exportCsv: {
		describe: 'File path tp export as CSV File',
		type: 'string',
	},
	fields: {
		default: 'id,name,status,name_servers',
		describe: 'Fields to return',
		type: 'string',
	},
	order: {
		default: 'name',
		describe: 'Field to order zones by',
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
	status: {
		describe: 'Status of the zone',
		type: 'string',
	},
	zoneName: {
		describe: 'Array of domain names',
		type: 'array',
	},
};
exports.handler = withSpinner(runCommand);
