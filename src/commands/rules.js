import log from '../utils/logger';

exports.command = 'rules';
exports.desc = 'Page Rules for a Zone';
exports.builder = function (yargs) {
	return yargs.commandDir('rules_cmd');
};
exports.handler = async function () {
	log.info('Use --help argument to get available subcommands');
};
