import log from '../utils/logger';

exports.command = 'user';
exports.desc = 'Get current user and organization';
exports.builder = function (yargs) {
	return yargs.commandDir('users_cmd');
};
exports.handler = async function () {
	log.info('Use --help argument to get available subcommands');
};
