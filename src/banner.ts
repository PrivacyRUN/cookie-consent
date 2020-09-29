import { Consent, CookieCategory, Translation } from './model';
import { arrayFind } from './utils/array';

export class Banner {

	private consents: BannerConsent[];
	private onClose: OnCloseBannerHandler;

	private banner: HTMLElement;
	private acceptAllButton: HTMLElement;

	public constructor(
		private readonly translation: Translation,
		private readonly privacyPolicyUrl?: string,
		private readonly autoFocus?: boolean) {
	}

	public isOpened(): boolean {
		return !!this.banner;
	}

	public show(consents: Consent[], onClose: OnCloseBannerHandler) {
		if (this.banner) {
			throw new Error('Banner is opened now.');
		}

		this.consents = consents.map(c => {
			const isNecessary = c.category === 'necessary';
			return {
				category: c.category,
				isAllowed: isNecessary ? true : c.isAllowed,
				isReadonly: isNecessary,
				label: getConsentLabelText(this.translation, c.category)
			};
		});
		sortConsents(this.consents);
		this.onClose = onClose;
		this.install();
	}

	public close(setForceIsAllowed?: boolean) {
		if (!this.banner) {
			throw new Error('Banner is closed now.');
		}

		const consents = copyConsents(this.consents, setForceIsAllowed);
		this.onClose(consents);
		this.onClose = null;
		this.consents = null;
		this.uninstall();
	}

	private install() {
		this.banner = createElement('div', 'bnn-banner');

		const title = createElement('div', 'bnn-banner-title');
		title.innerText = this.translation.bannerTitle;
		this.banner.appendChild(title);

		const descr = createElement('div', 'bnn-banner-description');
		descr.innerText = this.translation.bannerDescription;
		this.banner.appendChild(descr);

		if (this.privacyPolicyUrl) {
			const privacyPolicy = createElement('div', 'bnn-privacy-policy');
			const link = createElement('a', 'bnn-privacy-policy-link');
			link.setAttribute('href', this.privacyPolicyUrl);
			link.innerText = this.translation.bannerOpenPrivacyPolicy;
			privacyPolicy.appendChild(link);
			this.banner.appendChild(privacyPolicy);
		}

		const consents = createElement('div', 'bnn-banner-consents');
		for (const consent of this.consents) {
			consents.appendChild(this.createConsent(consent));
		}
		this.banner.appendChild(consents);

		const buttons = createElement('div', 'bnn-banner-buttons');
		this.banner.appendChild(buttons);

		const saveButton = createElement('button', 'bnn-banner-button');
		saveButton.setAttribute('type', 'button');
		saveButton.setAttribute('name', 'bnn-save');
		saveButton.setAttribute('tabindex', '99999');
		saveButton.innerText = this.translation.save;
		saveButton.addEventListener('click', e => this.onSaveClicked(e));
		buttons.appendChild(saveButton);

		this.acceptAllButton = createElement('button', 'bnn-banner-button');
		saveButton.setAttribute('type', 'button');
		this.acceptAllButton.setAttribute('name', 'bnn-accept-all');
		this.acceptAllButton.setAttribute('tabindex', '99998');
		this.acceptAllButton.innerText = this.translation.acceptAll;
		this.acceptAllButton.addEventListener('click', e => this.onSaveClicked(e, true));
		buttons.appendChild(this.acceptAllButton);

		this.embed();
	}

	private embed() {
		if (document.body) {
			document.body.appendChild(this.banner);
			if (this.autoFocus) {
				this.acceptAllButton.focus();
			}
		} else {
			setTimeout(() => this.embed(), 25);
		}
	}

	private uninstall() {
		this.banner.parentElement.removeChild(this.banner);
		this.banner = null;
	}

	private createConsent(consent: BannerConsent): HTMLElement {
		const div = createElement('div', 'bnn-banner-consent');
		const switch_ = createElement('span', 'bnn-banner-consent-switch');
		switch_.setAttribute('data-category', consent.category);
		switch_.setAttribute('data-checked', consent.isAllowed ? '1' : '0');
		switch_.setAttribute('data-enabled', consent.isReadonly ? '0' : '1');
		div.appendChild(switch_);
		const label = createElement('span', 'bnn-banner-consent-label');
		label.innerText = consent.label;
		div.appendChild(label);
		if (!consent.isReadonly) {
			switch_.addEventListener('click', e => this.onSwitchClicked(e, switch_, consent.category));
			label.addEventListener('click', e => this.onSwitchClicked(e, switch_, consent.category));
		}
		return div;
	}

	private onSwitchClicked(e: Event, switch_: HTMLElement, category: CookieCategory) {
		e.preventDefault();
		e.stopPropagation();

		const consent = arrayFind(this.consents, c => c.category === category);
		consent.isAllowed = !consent.isAllowed;
		switch_.setAttribute('data-checked', consent.isAllowed ? '1' : '0');
	}

	private onSaveClicked(e: Event, setForceIsAllowed?: boolean) {
		e.preventDefault();
		e.stopPropagation();
		this.close(setForceIsAllowed);
	}
}

export function createElement(tagName: string, className: string): HTMLElement {
	const element = document.createElement(tagName);
	element.className = className;
	return element;
}

export function getConsentLabelText(trans: Translation, category: CookieCategory): string {
	switch (category) {
		case 'necessary':
			return trans.necessary;
		case 'preferences':
			return trans.preferences;
		case 'statistics':
			return trans.statistics;
		case 'marketing':
			return trans.marketing;
		case 'unclassified':
			return trans.unclassified;
		default:
			throw new Error(`Not supported category: ${category}.`);
	}
}

export function copyConsents(consents: Consent[], setForceIsAllowed?: boolean): Consent[] {
	return consents.map<Consent>(c => {
		return {
			category: c.category,
			isAllowed: (setForceIsAllowed !== undefined) ? setForceIsAllowed : c.isAllowed
		};
	});
}

export function sortConsents(consents: BannerConsent[]) {
	consents.sort((a, b) => a.label.localeCompare(b.label));
	const consent = arrayFind(consents, c => c.isReadonly);
	if (consent && consents.length > 1) {
		const index = consents.indexOf(consent);
		const first = consents[0];
		consents[0] = consents[index];
		consents[index] = first;
	}
}

export type OnCloseBannerHandler = (consents: Consent[]) => void;

export interface BannerConsent {
	category: CookieCategory;
	isAllowed: boolean;
	isReadonly: boolean;
	label: string;
}
