import log from '../utils/logger';

exports.command = 'zones';
exports.desc = 'Manage set of zones';
exports.builder = function (yargs) {
	return yargs.commandDir('zones_cmd');
};
exports.handler = async function () {
	log.info('Use --help argument to get available subcommands');
};
