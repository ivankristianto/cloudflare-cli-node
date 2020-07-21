import fs from 'fs';
import DNS from '../../classes/dns';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { output, spinner, zone } = argv;

	spinner.text = `Exporting DNS records to ${output}…`;

	const response = await DNS.export({ zone });

	const fd = fs.openSync(output, 'w+');
	fs.writeSync(fd, response);
	fs.closeSync(fd);

	spinner.text = `DNS records exported to file ${output}`;
}

exports.command = 'export <zone>';
exports.desc = 'Export dns records for a zone';
exports.builder = {
	output: {
		describe: 'Output file path',
		type: 'string',
		demandOption: true,
	},
};
exports.handler = withSpinner(runCommand);
