import { Translations } from './model';
import { determineLanguage, getTranslation } from './translations';

describe('translations', () => {

	it('getTranslation() return proper value', () => {
		const trans: Translations = {
			'en': <any>{ save: 'EN' },
			'de': <any>{ save: 'DE' },
			'es': <any>{ save: 'ES' }
		};

		const t1 = getTranslation('en', trans);
		expect(t1.save).toEqual('EN');

		const t2 = getTranslation('de', trans);
		expect(t2.save).toEqual('DE');

		const t3 = getTranslation('ru', trans);
		expect(t3.save).toEqual('EN');
	});

	it('determineLanguage() return proper value', () => {
		const langs = ['en', 'pl'];

		expect(determineLanguage('en', langs)).toEqual('en');
		expect(determineLanguage('pl', langs)).toEqual('pl');
		expect(determineLanguage('de', langs)).toEqual('en');
		expect(determineLanguage('es', langs)).toEqual('en');
	});
});
