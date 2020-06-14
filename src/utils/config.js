import os from 'os';
import path from 'path';
import fs from 'fs-extra';
import log from './logger';

export function getConfigFile() {
	return path.join(os.homedir(), '.cloudflare-config');
}

export function defaultConfig() {
	return {
		apiToken: '',
	};
}

export async function write(config) {
	await fs.writeJson(getConfigFile(), config);
}

export async function read() {
	let readConfig = {};

	if (await fs.exists(getConfigFile())) {
		readConfig = await fs.readJson(getConfigFile());
	}

	return { ...readConfig };
}

export async function get(key) {
	const defaults = defaultConfig();
	const config = await read();

	return typeof config[key] === 'undefined' ? defaults[key] : config[key];
}

export async function set(key, value) {
	const config = await read();

	config[key] = value;

	await write(config);
}

export async function getAuthToken() {
	const token = await get('apiToken');

	if (!token) {
		log.warning('Please run cf config setup');
		return false;
	}

	return token;
}
