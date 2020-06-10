import Zones from '../../classes/zones';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'delete <zone>';
exports.desc = 'Delete a zone';
exports.builder = {};
exports.handler = async function (argv) {
	try {
		const { zone } = argv;

		await Zones.delete(zone);

		formatter.toJson(`Zone ${zone} succesfully deleted`);
	} catch (err) {
		log.error(err);
	}
};
