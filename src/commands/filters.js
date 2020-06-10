exports.command = 'filters';
exports.desc = 'Manage set of filters';
exports.builder = function (yargs) {
	return yargs.commandDir('filters_cmd');
};
exports.handler = {};
