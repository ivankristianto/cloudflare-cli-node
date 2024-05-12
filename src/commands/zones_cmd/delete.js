import Zones from '../../classes/zones';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {Object} argv        Command params
 * @param {string} argv.format Output format
 * @return {Promise<void>}
 */
async function runCommand(argv) {
	const { spinner, zone } = argv;

	spinner.text = `Deleting zone ${zone}`;

	await Zones.delete(zone);

	spinner.text = `Zone ${zone} successfully deleted!`;
}

exports.command = 'delete <zone>';
exports.desc = 'Delete a zone';
exports.builder = {};
exports.handler = withSpinner(runCommand);
