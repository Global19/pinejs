import * as _express from 'express';

import './sbvr-loader';

import * as Bluebird from 'bluebird';
import * as dbModule from '../database-layer/db';
export { dbModule };
import * as configLoader from '../config-loader/config-loader';
import * as migrator from '../migrator/migrator';

import { PinejsSessionStore } from '../pinejs-session-store/pinejs-session-store';
import * as sbvrUtils from '../sbvr-api/sbvr-utils';
export { sbvrUtils, PinejsSessionStore };

let databaseOptions: {
	engine: string;
	params: string;
};
if (dbModule.engines.websql != null) {
	databaseOptions = {
		engine: 'websql',
		params: 'rulemotion',
	};
} else {
	let databaseURL: string;
	if (process.env.DATABASE_URL) {
		databaseURL = process.env.DATABASE_URL;
	} else if (dbModule.engines.postgres != null) {
		databaseURL = 'postgres://postgres:.@localhost:5432/postgres';
	} else if (dbModule.engines.mysql == null) {
		databaseURL = 'mysql://mysql:.@localhost:3306';
	} else {
		throw new Error('No supported database options available');
	}
	databaseOptions = {
		engine: databaseURL.slice(0, databaseURL.indexOf(':')),
		params: databaseURL,
	};
}

const db = dbModule.connect(databaseOptions);

export const init = (
	app: _express.Application,
	config?: string | configLoader.Config,
): Bluebird<ReturnType<typeof configLoader.setup>> =>
	sbvrUtils
		.setup(app, db)
		.then(() => configLoader.setup(app))
		.tap((cfgLoader) => cfgLoader.loadConfig(migrator.config))
		.tap(async (cfgLoader) => {
			const promises: Array<Bluebird<void>> = [];
			if (process.env.SBVR_SERVER_ENABLED) {
				const sbvrServer = await import('../data-server/sbvr-server');
				const transactions = require('../http-transactions/transactions');
				promises.push(cfgLoader.loadConfig(sbvrServer.config));
				promises.push(
					cfgLoader
						.loadConfig(transactions.config)
						.then(() => transactions.addModelHooks('data')),
				);
			}
			if (!process.env.CONFIG_LOADER_DISABLED) {
				promises.push(cfgLoader.loadApplicationConfig(config));
			}
			return Bluebird.all(promises);
		})
		.catch((err) => {
			console.error('Error initialising server', err, err.stack);
			process.exit(1);
		});
