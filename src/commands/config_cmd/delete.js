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
	const config = await Config.getAll();
	const { accounts } = config;

	const questions = [
		{
			name: 'name',
			type: 'input',
			message: 'Name of token you want to delete: ',
			validate: validateNotEmpty,
		},
	];

	const answers = await inquirer.prompt(questions);

	config.accounts = accounts.filter(function (account) {
		return account.name !== answers.name;
	});

	await Config.write(config);

	spinner.start();
	spinner.text = `Successfully delete api token from config!`;
}

exports.command = 'delete';
exports.desc = 'Delete existing Cloudflare API Token';
exports.builder = {};
exports.handler = withSpinner(runCommand);
