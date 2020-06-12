import Zones from '../../../classes/zones';
import log from '../../../utils/logger';
import formatter from '../../../utils/formatter';

exports.command = 'minify <zone>';
exports.desc = 'Get zone minify settings';
exports.builder = {
	value: {
		describe: 'Set the value, in json format',
		type: 'string',
	},
	fields: {
		default: 'css,html,js',
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
			requestArgs = { value: JSON.parse(value) };
			response = await Zones.setSettings(zone, 'minify', requestArgs);
			log.success('\nMinify settings update successfully. New settings:');
		} else {
			response = await Zones.getSettings(zone, 'minify');
		}

		const results = [];

		fields.split(',').forEach((field) => {
			results.push(response.result.value[field]);
		});

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
