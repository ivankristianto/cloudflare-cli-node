import Firewall from '../../classes/firewall';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {Object} argv        Command params
 * @param {string} argv.format Output format
 * @return {Promise<void>}
 */
async function runCommand(argv) {
	const { firewallId, spinner, zone } = argv;

	spinner.text = `Deleting Firewall with id ${firewallId}…`;

	await Firewall.delete(zone, firewallId);

	spinner.warn(
		'Delete a firewall rule will not delete the filter, you need to delete it manually. Run cf filters delete <zone> <filterId>',
	);
	spinner.start();
	spinner.text = `Firewall ${firewallId} successfully deleted`;
}

exports.command = 'delete <zone> <firewallId>';
exports.desc = 'Delete a firewall rule';
exports.builder = {};
exports.handler = withSpinner(runCommand);
