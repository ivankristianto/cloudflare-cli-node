exports.command = 'accounts';
exports.desc = 'Get information about a specific account that you are a member of.';
exports.builder = function (yargs) {
	return yargs.commandDir('accounts_cmd');
};
exports.handler = {};
