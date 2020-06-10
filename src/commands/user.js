exports.command = 'user';
exports.desc = 'Get current user and organization';
exports.builder = function (yargs) {
	return yargs.commandDir('users_cmd');
};
exports.handler = {};
