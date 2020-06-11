import Firewall from '../../classes/firewall';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'delete <zone> <firewallId>';
exports.desc = 'Delete a firewall rule';
exports.builder = {};
exports.handler = async function (argv) {
	try {
		const { zone, firewallId } = argv;

		await Firewall.delete(zone, firewallId);

		formatter.toString([`Firewall ${firewallId} successfully deleted`]);
		log.warning(
			'Deleting a firewall rule will not delete the filter, you need to delete it manually. \nRun cf filters delete <zone> <filterId>',
		);
	} catch (err) {
		log.error(err);
	}
};
