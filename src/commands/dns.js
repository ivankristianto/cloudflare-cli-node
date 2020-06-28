import log from '../utils/logger';

exports.command = 'dns';
exports.desc = 'DNS Records for a Zone';
exports.builder = function (yargs) {
	return yargs.commandDir('dns_cmd');
};
exports.handler = async function () {
	log.info('Use --help argument to get available subcommands');
};
