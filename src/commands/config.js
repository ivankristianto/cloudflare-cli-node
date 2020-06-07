exports.command = 'config <command>';
exports.desc = 'Set CloudFlare Token';
exports.builder = function (yargs) {
	return yargs.commandDir('config_cmd');
};
exports.handler = {};
