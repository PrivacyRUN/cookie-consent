import { compareConsents } from './consents-comparer';
import { Consent } from '../model';

describe('manager', () => {

	it('compareConsents() works correctly', () => {
		const a: Consent[] = [
			{ category: 'marketing', isAllowed: false },
			{ category: 'necessary', isAllowed: true }
		];
		const b: Consent[] = [
			{ category: 'marketing', isAllowed: true },
			{ category: 'necessary', isAllowed: true }
		];
		const c: Consent[] = [
			{ category: 'marketing', isAllowed: true },
			{ category: 'necessary', isAllowed: true },
			{ category: 'statistics', isAllowed: true }
		];
		const d: Consent[] = [
			{ category: 'marketing', isAllowed: true },
			{ category: 'necessary', isAllowed: true },
			{ category: 'statistics', isAllowed: false }
		];

		expect(compareConsents(a, b)).toEqual('added');
		expect(compareConsents(b, a)).toEqual('removed');
		expect(compareConsents(a, a)).toEqual('noChange');
		expect(compareConsents(b, b)).toEqual('noChange');
		expect(compareConsents(a, c)).toEqual('added');
		expect(compareConsents(b, d)).toEqual('removed');
	});
});
