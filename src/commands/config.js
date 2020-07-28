import log from '../utils/logger';

exports.command = 'config setup';
exports.desc = 'Setup Cloudflare API Token';
exports.builder = function (yargs) {
	return yargs.commandDir('config_cmd');
};
exports.handler = async function () {
	log.info('Use --help argument to get available subcommands');
};
