import formatter from '../../../utils/formatter';
import zoneSettingCommand from '../../../utils/zone-setting-command';

exports.command = 'ssl <zone>';
exports.desc = 'Get zone ssl settings';
exports.builder = {
	...formatter.commandArgs(),
	value: {
		describe: 'Set the value, valid: off, flexible, full, strict',
		type: 'string',
	},
	fields: {
		default: 'value,modified_on',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = zoneSettingCommand({ setting: 'ssl', label: 'ssl' });
