import formatter from '../../../utils/formatter';
import zoneSettingCommand from '../../../utils/zone-setting-command';

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
exports.handler = zoneSettingCommand({
	setting: 'development_mode',
	label: 'development mode',
	defaultFormat: 'list',
});
