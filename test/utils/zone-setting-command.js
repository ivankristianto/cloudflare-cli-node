/**
 * External dependencies
 */
import { assert } from 'chai';
import sinon from 'sinon';

/**
 * Internal dependencies
 */
import Zones from '../../lib/classes/zones';
import formatter from '../../lib/utils/formatter';
import zoneSettingCommand from '../../lib/utils/zone-setting-command';

describe('utils: zone-setting-command', () => {
	let sandbox;
	let output;

	const run = (opts, argv) =>
		zoneSettingCommand(opts)({
			disableSpinner: true,
			fields: 'value',
			zone: 'example.com',
			...argv,
		});

	beforeEach(() => {
		sandbox = sinon.createSandbox();
		sandbox.stub(Zones, 'getSettings').resolves({ result: { value: 'off' } });
		sandbox.stub(Zones, 'setSettings').resolves({ result: { value: 'on' } });
		output = sandbox.stub(formatter, 'output');
	});

	afterEach(() => {
		sandbox.restore();
	});

	it('should get the setting when no value is given', async () => {
		await run({ setting: 'ssl', label: 'ssl' }, {});

		assert.isTrue(Zones.getSettings.calledOnceWith('example.com', 'ssl'));
		assert.isFalse(Zones.setSettings.called);
		assert.deepEqual(output.firstCall.args[0], [['off']]);
	});

	it('should set the setting with the value as a string', async () => {
		await run({ setting: 'ssl', label: 'ssl' }, { value: 'full' });

		assert.isTrue(Zones.setSettings.calledOnceWith('example.com', 'ssl', { value: 'full' }));
		assert.deepEqual(output.firstCall.args[0], [['on']]);
	});

	it('should parse the value and pick the result when told to', async () => {
		Zones.setSettings.resolves({ result: { value: { css: 'on' } } });

		await run(
			{
				setting: 'minify',
				label: 'minify',
				parseValue: JSON.parse,
				pickResult: (result) => result.value,
			},
			{ value: '{"css":"on"}', fields: 'css' },
		);

		assert.deepEqual(Zones.setSettings.firstCall.args[2], { value: { css: 'on' } });
		assert.deepEqual(output.firstCall.args[0], [['on']]);
	});

	it('should fall back to the default format only when none is passed', async () => {
		const opts = {
			setting: 'development_mode',
			label: 'development mode',
			defaultFormat: 'list',
		};

		await run(opts, {});
		await run(opts, { format: 'json' });

		assert.equal(output.firstCall.args[1].format, 'list');
		assert.equal(output.secondCall.args[1].format, 'json');
	});
});
