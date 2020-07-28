import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import log from '../utils/logger';

class Config {
	static getConfigFile() {
		return path.join(os.homedir(), '.cloudflare-config');
	}

	static defaultConfig() {
		return {
			apiToken: '',
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

	static async set(key, value) {
		const config = await Config.read();

		config[key] = value;

		await Config.write(config);
	}

	static async getAuthToken() {
		const token = await Config.get('apiToken');

		if (!token) {
			log.warning('Please run cf config setup');
			return false;
		}

		return token;
	}
}

export default Config;
