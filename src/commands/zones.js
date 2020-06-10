exports.command = 'zones';
exports.desc = 'Manage set of zones';
exports.builder = function (yargs) {
	return yargs.commandDir('zones_cmd');
};
exports.handler = {};
