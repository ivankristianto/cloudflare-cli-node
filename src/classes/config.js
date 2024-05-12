import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import yargs from 'yargs';
import log from '../utils/logger';

class Config {
	static getConfigFile() {
		return path.join(os.homedir(), '.cloudflare-config');
	}

	static defaultConfig() {
		return {
			apiToken: '',
			accounts: [],
		};
	}

	static async write(config) {
		await fs.writeJson(Config.getConfigFile(), config);
	}

	static async read() {
		let readConfig = {};

		if (await fs.exists(Config.getConfigFile())) {
			readConfig = await fs.readJson(Config.getConfigFile());
		}

		return { ...readConfig };
	}

	static async get(key) {
		const defaults = Config.defaultConfig();
		const config = await Config.read();

		return typeof config[key] === 'undefined' ? defaults[key] : config[key];
	}

	static async getAll() {
		const defaults = Config.defaultConfig();
		const config = await Config.read();

		return Object.assign(defaults, config);
	}

	static async set(key, value) {
		const config = await Config.read();

		config[key] = value;

		await Config.write(config);
	}

	/**
	 * Get auth token.
	 *
	 * @return {Promise<boolean|*>} Return token or false if token is not found.
	 */
	static async getAuthToken() {
		let token = await Config.get('apiToken');
		const { useToken } = yargs.argv;

		if (useToken) {
			const config = await Config.getAll();
			const accounts = config.accounts.filter(function (account) {
				return account.name === useToken;
			});

			if (accounts.length === 0) {
				log.warning('Token not found');
				return false;
			}

			token = accounts[0].apiToken;
		}

		if (!token) {
			log.warning('Please run cf config setup');
			return false;
		}

		return token;
	}
}

export default Config;
