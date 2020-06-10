exports.command = 'settings';
exports.desc = 'Manage set of a zone settings';
exports.builder = function (yargs) {
	return yargs.commandDir('settings_cmd');
};
exports.handler = {};
