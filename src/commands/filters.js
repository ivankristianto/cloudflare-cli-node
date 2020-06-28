import log from '../utils/logger';

exports.command = 'filters';
exports.desc = 'Manage set of filters';
exports.builder = function (yargs) {
	return yargs.commandDir('filters_cmd');
};
exports.handler = async function () {
	log.info('Use --help argument to get available subcommands');
};
