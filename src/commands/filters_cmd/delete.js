import Filters from '../../classes/filters';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'delete <zone> <filterId>';
exports.desc = 'Delete a filter';
exports.builder = {};
exports.handler = async function (argv) {
	try {
		const { zone, filterId } = argv;

		await Filters.delete(zone, filterId);

		formatter.toString([`Filter ${filterId} successfully deleted`]);
	} catch (err) {
		log.error(err);
	}
};
