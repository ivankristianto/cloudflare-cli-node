import Rules from '../../classes/rules';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { records, spinner, zone } = argv;
	const requestArgs = { zone, records };

	spinner.text = `Deleting zone page rule with id ${records}…`;

	await Rules.delete(requestArgs);

	spinner.text = `Zone page rule ${records} successfully deleted`;
}

exports.command = 'delete <zone> [records...]';
exports.desc = 'Delete page rules in a zone';
exports.builder = {};
exports.handler = withSpinner(runCommand);
