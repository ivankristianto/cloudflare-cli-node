import formatter from '../../../utils/formatter';
import zoneSettingCommand from '../../../utils/zone-setting-command';

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
exports.handler = zoneSettingCommand({
	setting: 'minify',
	label: 'minify',
	parseValue: JSON.parse,
	pickResult: (result) => result.value,
});
