import Filters from '../../classes/filters';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { filterId, spinner, zone } = argv;

	spinner.text = `Deleting filter with id ${filterId}…`;

	await Filters.delete(zone, filterId);

	spinner.text = `Filter ${filterId} successfully deleted`;
}

exports.command = 'delete <zone> <filterId>';
exports.desc = 'Delete a filter';
exports.builder = {};
exports.handler = withSpinner(runCommand);
