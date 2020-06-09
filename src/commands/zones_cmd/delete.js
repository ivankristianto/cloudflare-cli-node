import Zones from '../../classes/zones';
import log from '../../utils/logger';
import formatter from '../../utils/formatter';

exports.command = 'delete <zoneId|zoneName>';
exports.desc = 'Delete a zone';
exports.builder = {
	zoneId: {
		describe: 'Zone ID',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { zoneId } = argv;

		await Zones.delete(zoneId);

		formatter.toJson(`Zone ${zoneId} succesfully deleted`);
	} catch (err) {
		log.error(err);
	}
};
