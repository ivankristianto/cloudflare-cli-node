exports.command = 'user <command>';
exports.desc = 'Get User and Organization Details';
exports.builder = function (yargs) {
	return yargs.commandDir('users_cmd');
};
exports.handler = {};
