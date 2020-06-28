import log from '../utils/logger';

exports.command = 'firewall';
exports.desc = 'Manage set of firewall rules';
exports.builder = function (yargs) {
	return yargs.commandDir('firewall_cmd');
};
exports.handler = async function () {
	log.info('Use --help argument to get available subcommands');
};
