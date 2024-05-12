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

	const questions = [
		{
			name: 'name',
			type: 'input',
			message: 'Name for this token: ',
			validate: validateNotEmpty,
		},
		{
			name: 'apiToken',
			type: 'input',
			message: 'Your Cloudflare API Token: ',
			validate: validateNotEmpty,
		},
	];

	const answers = await inquirer.prompt(questions);

	// check if token name exist.
	const accountExist =
		config.accounts.filter(function (account) {
			return account.name === answers.name;
		}).length > 0;

	if (accountExist) {
		const { yesDelete } = await inquirer.prompt([
			{
				type: 'confirm',
				name: 'yesDelete',
				message: 'Account exist, do you want to overwrite?',
				default: false,
			},
		]);

		if (!yesDelete) {
			spinner.succeed(`Cancelled.`);
			return;
		}

		// Delete it from the array.
		config.accounts = config.accounts.filter(function (account) {
			return account.name !== answers.name;
		});
	}

	config.accounts.push(answers);

	await Config.write(config);

	spinner.start();
	spinner.text = `Successfully saved api token file!`;
}

exports.command = 'add';
exports.desc = 'Add new Cloudflare API Token';
exports.builder = {};
exports.handler = withSpinner(runCommand);
