import withSpinner from '../../utils/withSpinner';
import Config from '../../classes/config';
import formatter from '../../utils/formatter';

/**
 * Run Command
 *
 * @param {Object} argv        Command params
 * @param {string} argv.format Output format
 * @return {Promise<void>}
 */
async function runCommand(argv) {
	const { spinner } = argv;

	spinner.stop();
	const config = await Config.getAll();
	const fields = 'name,apiToken';

	const results = [['default', config.apiToken]].concat(formatter.mappingFields(fields, config.accounts));

	formatter.toTable(fields, results);

	spinner.start();
	spinner.text = `Get config list done!`;
}

exports.command = 'list';
exports.desc = 'List all Cloudflare API Tokens';
exports.builder = {};
exports.handler = withSpinner(runCommand);
