exports.command = 'accounts <command>';
exports.desc = 'Get User and Organization Details';
exports.builder = function (yargs) {
	return yargs.commandDir('accounts_cmd');
};
exports.handler = {};
