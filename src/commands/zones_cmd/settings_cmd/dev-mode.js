import Zones from '../../../classes/zones';
import log from '../../../utils/logger';
import formatter from '../../../utils/formatter';

exports.command = 'devmode <zone>';
exports.desc = 'Get zone development mode setting';
exports.builder = {
	value: {
		describe: 'Set the value, on or off',
		type: 'string',
	},
	fields: {
		default: 'id,value,time_remaining',
		describe: 'Fields to return',
		type: 'string',
	},
	format: {
		default: 'table',
		describe: 'Format the output, value: table, string, json',
		type: 'string',
	},
	separator: {
		default: ' ',
		describe: 'Separator value when the output format is string',
		type: 'string',
	},
};
exports.handler = async function (argv) {
	try {
		const { fields, format, separator, value, zone } = argv;
		let requestArgs = {};
		let response = {};

		if (value) {
			requestArgs = { value };
			response = await Zones.setSettings(zone, 'development_mode', requestArgs);
			log.success('\nDevelopment Mode settings update successfully. New settings:');
		} else {
			response = await Zones.getSettings(zone, 'development_mode');
		}

		const results = formatter.mappingField(fields, response.result);

		switch (format) {
			case 'json':
				formatter.toJson(results);
				break;
			case 'string':
				formatter.toString(results, separator);
				break;
			case 'table':
			default:
				formatter.toTable(fields, [results]);
				break;
		}
	} catch (err) {
		log.error(err);
	}
};
