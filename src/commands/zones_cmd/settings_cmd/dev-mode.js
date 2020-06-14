import Zones from '../../../classes/zones';
import log from '../../../utils/logger';
import formatter from '../../../utils/formatter';

exports.command = 'devmode <zone>';
exports.desc = 'Get zone development mode setting';
exports.builder = {
	...formatter.commandArgs(),
	value: {
		describe: 'Set the value, on or off',
		type: 'string',
	},
	fields: {
		default: 'id,value,time_remaining',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, format = 'list', separator, value, zone } = argv;
		let requestArgs = {};
		let response;

		if (value) {
			requestArgs = { value };
			response = await Zones.setSettings(zone, 'development_mode', requestArgs);
			log.success('\nDevelopment Mode settings update successfully. New settings:');
		} else {
			response = await Zones.getSettings(zone, 'development_mode');
		}

		const results = formatter.mappingField(fields, response.result);

		formatter.output([results], {
			fields,
			format,
			separator,
		});
	} catch (err) {
		log.error(err);
	}
};
