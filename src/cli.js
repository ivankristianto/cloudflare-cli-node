/**
 * Internal dependencies
 */
import yargs from 'yargs';
import log from './utils/logger';

// eslint-disable-next-line consistent-return
function main() {
	try {
		return yargs.commandDir('commands').demandCommand().help().argv;
	} catch (e) {
		log.error(e.toString());
	}
}

main();
