import { Banner } from './banner';
import { CreateElementObserver } from './create-element-observer';
import { Css } from './css';
import { DEFAULT_CONFIGURATION } from './default-configuration';
import { DomObserver } from './dom-observer';
import { Gate } from './gate';
import { Manager } from './manager';
import { Configuration } from './model';
import { getTranslation } from './translations';
import { Unblocker } from './unblocker';
import { extendObject } from './utils/extend-objects';

declare global {
	interface Window {
		_cookieConsent: Configuration;
		cookieManager: Manager;
	}
}

function run() {
	const configuration: Configuration = DEFAULT_CONFIGURATION;
	if (window._cookieConsent) {
		extendObject(configuration, window._cookieConsent);
	}

	const gate = new Gate(localStorage, configuration.resources);
	gate.load();
	const unblocker = new Unblocker(gate);

	const css = new Css(configuration.theme);
	css.install();

	const domObserver = new DomObserver(gate, unblocker);
	domObserver.observe();
	const createElementObserver = new CreateElementObserver(gate);
	createElementObserver.observe();

	const translation = getTranslation(configuration.language, configuration.translations);

	const banner = new Banner(translation, configuration.privacyPolicyUrl, configuration.autoFocus);

	const manager = new Manager(banner, gate, unblocker);
	window.cookieManager = manager;

	window.addEventListener('DOMContentLoaded', () => {
		setTimeout(() => {
			manager.editNewConsents();
		});
	}, { once: true });

	window.addEventListener('beforeunload', () => {
		domObserver.disconnect();
		createElementObserver.disconnect();
	}, { once: true });
}

run();
