import inquirer from 'inquirer';
import withSpinner from '../../utils/withSpinner';
import Config from '../../classes/config';
import { validateNotEmpty } from '../../utils/promp-validators';

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
	const defaults = Config.defaultConfig();

	const questions = [
		{
			name: 'apiToken',
			type: 'input',
			message: 'Your default Cloudflare API Token: ',
			default: '',
			validate: validateNotEmpty,
		},
	];

	const answers = await inquirer.prompt(questions);

	const config = Object.assign(defaults, answers);

	await Config.write(config);

	spinner.start();
	spinner.text = `Successfully saved api token file!`;
}

exports.command = 'setup';
exports.desc = 'Setup default Cloudflare API Token';
exports.builder = {};
exports.handler = withSpinner(runCommand);
