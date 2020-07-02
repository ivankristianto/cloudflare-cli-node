import Zones from '../../../classes/zones';
import log from '../../../utils/logger';
import formatter from '../../../utils/formatter';

exports.command = 'always_use_https <zone>';
exports.desc = 'Get zone always use https settings';
exports.builder = {
	...formatter.commandArgs(),
	value: {
		describe: 'Set the value, in json format',
		type: 'string',
	},
	fields: {
		default: 'value,modified_on',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, format, separator, value, zone } = argv;
		let requestArgs = {};
		let response = {};

		if (value) {
			requestArgs = { value: value.toString() };
			response = await Zones.setSettings(zone, 'always_use_https', requestArgs);
			log.success('\nAlways Use HTTPS settings update successfully. New settings:');
		} else {
			response = await Zones.getSettings(zone, 'always_use_https');
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
