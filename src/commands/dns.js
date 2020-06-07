exports.command = 'dns <command>';
exports.desc = 'Manage DNS recors of a zone';
exports.builder = function (yargs) {
	return yargs.commandDir('dns_cmd');
};
exports.handler = {};
