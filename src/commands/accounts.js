import log from '../utils/logger';

exports.command = 'accounts';
exports.desc = 'Get information about a specific account that you are a member of.';
exports.builder = function (yargs) {
	return yargs.commandDir('accounts_cmd');
};
exports.handler = async function () {
	log.info('Use --help argument to get available subcommands');
};
