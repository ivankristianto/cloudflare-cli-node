import inquirer from 'inquirer';
import log from '../utils/logger';
import { defaultConfig, write } from '../utils/config';
import { validateNotEmpty } from '../utils/promp-validators';

exports.command = 'config setup';
exports.desc = 'Setup Cloudflare API Token';
exports.builder = {};
exports.handler = async function () {
	try {
		const defaults = defaultConfig();

		const questions = [
			{
				name: 'apiToken',
				type: 'input',
				message: 'Your Cloudflare API Token: ',
				default: '',
				validate: validateNotEmpty,
			},
		];

		const answers = await inquirer.prompt(questions);

		const config = Object.assign(defaults, answers);

		await write(config);

		log.success('Successfully saved api token file');
	} catch (err) {
		log.error(err);
	}
};
