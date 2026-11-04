import formatter from '../../../utils/formatter';
import zoneSettingCommand from '../../../utils/zone-setting-command';

exports.command = 'always_use_https <zone>';
exports.desc = 'Get zone always use https settings';
exports.builder = {
	...formatter.commandArgs(),
	value: {
		describe: 'Set the value, valid: on, off',
		type: 'string',
	},
	fields: {
		default: 'value,modified_on',
		describe: 'Fields to return',
		type: 'string',
	},
};
exports.handler = zoneSettingCommand({ setting: 'always_use_https', label: 'always use https' });
