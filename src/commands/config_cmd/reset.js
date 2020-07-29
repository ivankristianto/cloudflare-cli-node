import inquirer from 'inquirer';
import withSpinner from '../../utils/withSpinner';
import Config from '../../classes/config';

/**
 * Run Command
 *
 * @param {object} argv Command params
 * @param {string} argv.format Output format
 * @returns {Promise<void>}
 */
async function runCommand(argv) {
	const { spinner } = argv;

	spinner.stop();
	const { yesDelete } = await inquirer.prompt([
		{
			type: 'confirm',
			name: 'yesDelete',
			message: 'Are you sure want to delete all existing tokens?',
			default: false,
		},
	]);

	if (!yesDelete) {
		spinner.text = `Cancelled`;
		return;
	}

	const config = await Config.defaultConfig();
	await Config.write(config);

	spinner.start();
	spinner.text = `Successfully reset config!`;
}

exports.command = 'reset';
exports.desc = 'Reset Cloudflare API Token configuration';
exports.builder = {};
exports.handler = withSpinner(runCommand);
