import DNS from '../../classes/dns';
import formatter from '../../utils/formatter';
import withSpinner from '../../utils/withSpinner';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { inputFile, spinner, zone } = argv;

	spinner.text = `Importing DNS records from ${inputFile}…`;

	const response = await DNS.import({ inputFile, zone });

	const fields = 'recs_added,total_records_parsed';
	const results = formatter.mappingField(fields, response.result);

	formatter.toList(fields, results);

	spinner.text = `DNS records imported successfully!`;
}

exports.command = 'import <zone>';
exports.desc = 'Bulk import dns records for a zone';
exports.builder = {
	inputFile: {
		describe: 'Input file path',
		type: 'string',
		demandOption: true,
	},
};
exports.handler = withSpinner(runCommand);
