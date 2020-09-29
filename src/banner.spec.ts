import { Banner, BannerConsent, copyConsents, createElement, getConsentLabelText, sortConsents } from './banner';
import { DEFAULT_TRANSLATIONS } from './default-configuration';
import { Consent } from './model';

describe('banner', () => {

	it('isOpened() returns false in the beggining', () => {
		const banner = new Banner(DEFAULT_TRANSLATIONS.en, null, false);
		expect(banner.isOpened()).toBeFalse();
	});

	it('close() throws error when banner is not opened', () => {
		const banner = new Banner(DEFAULT_TRANSLATIONS.en, null, false);
		expect(() => banner.close())
			.toThrowMatching((e: Error) => e.message.startsWith('Banner is closed now'));
	});

	it('second call show() throws error', () => {
		const banner = new Banner(DEFAULT_TRANSLATIONS.en, null, false);

		let throwed = true;

		banner.show([], () => {});
		try {
			banner.show([], () => {});
		} catch (e) {
			throwed = true;
		}

		banner.close();
		expect(throwed).toBeTrue();
	});

	it('can show() banner and manually close()', () => {
		const banner = new Banner(DEFAULT_TRANSLATIONS.en, 'http://', true);

		let consents: Consent[] = null;

		banner.show(
			[
				{ category: 'marketing', isAllowed: false },
				{ category: 'necessary', isAllowed: false }
			], c => consents = c);

		expect(banner.isOpened()).toBeTrue();
		expect(document.getElementsByClassName('bnn-banner').length).toEqual(1);

		banner.close();

		expect(document.getElementsByClassName('bnn-banner').length).toEqual(0);
		expect(banner.isOpened()).toBeFalse();
		expect(consents).not.toBeNull();
		const m = consents.find(c => c.category === 'marketing');
		expect(m.isAllowed).toBeFalse();
		const n = consents.find(c => c.category === 'necessary');
		expect(n.isAllowed).toBeTrue();
	});

	it('clicking on switch works as expected', () => {
		const banner = new Banner(DEFAULT_TRANSLATIONS.en);

		let consents: Consent[] = null;

		banner.show([
			{ category: 'marketing', isAllowed: false }
		], c => consents = c);

		const _switch = document.querySelector('.bnn-banner-consent-switch[data-category="marketing"]');
		_switch.dispatchEvent(new Event('click'));

		banner.close();

		expect(consents[0].isAllowed).toBeTrue();
	});

	it('createElement() returns proper value', () => {
		const el = createElement('a', 'test1');

		expect(el.tagName.toLowerCase()).toEqual('a');
		expect(el.className).toEqual('test1');
	});

	it('getConsentLabelText() returns proper value', () => {
		const trans = DEFAULT_TRANSLATIONS.en;

		expect(getConsentLabelText(trans, 'marketing')).toEqual(trans.marketing);
		expect(getConsentLabelText(trans, 'necessary')).toEqual(trans.necessary);
		expect(getConsentLabelText(trans, 'preferences')).toEqual(trans.preferences);
		expect(getConsentLabelText(trans, 'statistics')).toEqual(trans.statistics);
		expect(getConsentLabelText(trans, 'unclassified')).toEqual(trans.unclassified);
		expect(() => getConsentLabelText(trans, <any>'X'))
			.toThrowMatching((e: Error) => e.message.startsWith('Not supported category'));
	});

	it('copyConsents() returns proper value', () => {
		const consents: Consent[] = [
			{ category: 'marketing', isAllowed: false },
			{ category: 'necessary', isAllowed: true }
		];

		const c1 = copyConsents(consents);

		expect(c1[0].category).toEqual('marketing');
		expect(c1[0].isAllowed).toBeFalse();
		expect(c1[1].category).toEqual('necessary');
		expect(c1[1].isAllowed).toBeTrue();

		const c2 = copyConsents(consents, true);
		expect(c2[0].isAllowed).toBeTrue();
		expect(c2[1].isAllowed).toBeTrue();

		const c3 = copyConsents(consents, false);
		expect(c3[0].isAllowed).toBeFalse();
		expect(c3[1].isAllowed).toBeFalse();
	});

	it('sortConsents() returns proper value', () => {
		const consents: BannerConsent[] = [
			{ label: 'D', isReadonly: false, category: null, isAllowed: false },
			{ label: 'C', isReadonly: false, category: null, isAllowed: false },
			{ label: 'A', isReadonly: false, category: null, isAllowed: false },
			{ label: 'B', isReadonly: true, category: null, isAllowed: false },
			{ label: 'F', isReadonly: false, category: null, isAllowed: false }
		];

		sortConsents(consents);

		expect(consents[0].label).toEqual('B');
		expect(consents[1].label).toEqual('A');
		expect(consents[2].label).toEqual('C');
		expect(consents[3].label).toEqual('D');
		expect(consents[4].label).toEqual('F');
	});
});
