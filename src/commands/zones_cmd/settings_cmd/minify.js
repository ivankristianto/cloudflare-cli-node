import Zones from '../../../classes/zones';
import log from '../../../utils/logger';
import formatter from '../../../utils/formatter';

exports.command = 'minify <zone>';
exports.desc = 'Get zone minify settings';
exports.builder = {
	...formatter.commandArgs(),
	value: {
		describe: 'Set the value, in json format',
		type: 'string',
	},
	fields: {
		default: 'css,html,js',
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
			requestArgs = { value: JSON.parse(value) };
			response = await Zones.setSettings(zone, 'minify', requestArgs);
			log.success('\nMinify settings update successfully. New settings:');
		} else {
			response = await Zones.getSettings(zone, 'minify');
		}

		const results = formatter.mappingField(fields, response.result.value);

		formatter.output([results], {
			fields,
			format,
			separator,
		});
	} catch (err) {
		log.error(err);
	}
};
