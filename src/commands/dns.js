exports.command = 'dns';
exports.desc = 'DNS Records for a Zone';
exports.builder = function (yargs) {
	return yargs.commandDir('dns_cmd');
};
exports.handler = {};
