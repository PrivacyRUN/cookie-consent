import { CONSENTS_STORAGE_KEY, Gate, MemoryStorage } from './gate';

describe('Gate', () => {

	let storage: MemoryStorage;

	beforeEach(() => {
		storage = new MemoryStorage();
	});

	it('determineResource() returns proper value', () => {
		const gate = new Gate(storage, [
			{ category: 'marketing', type: 'script', url: /^https:\/\/foo.com\/foo/ },
			{ category: 'statistics', type: 'iframe', url: 'http://bar.com/bar.js' }
		]);

		const r1 = gate.determineResource('script', 'https://foo.com/foo/script.js');
		const r2 = gate.determineResource('iframe', 'http://bar.com/bar.js');
		const r3 = gate.determineResource('iframe', 'http://unknow.org/c.js');

		expect(r1).not.toBeNull();
		expect(r1.category).toEqual('marketing');
		expect(r2.category).toEqual('statistics');
		expect(r3.category).toEqual('unclassified');
	});

	it('determineResource() returns always same instance', () => {
		const gate = new Gate(storage, [
			{ category: 'statistics', type: 'iframe', url: 'http://s.com/p.js' }
		]);

		const r1 = gate.determineResource('iframe', 'http://s.com/p.js');
		const r2 = gate.determineResource('iframe', 'http://s.com/p.js');

		expect(r1).toEqual(r2);
	});

	it('isAllowed() returns proper value', () => {
		const gate = new Gate(storage, [
			{ type: 'script', 'url': /aaa.js/, category: 'statistics' },
			{ type: 'script', 'url': /necessary.js/, category: 'necessary' }
		]);

		gate.setConsent({ category: 'statistics', isAllowed: true });

		const res1 = gate.determineResource('script', 'http://aaa.com/aaa.js');
		const res2 = gate.determineResource('script', 'http://bbb.com/bbb.js');
		const res3 = gate.determineResource('script', 'http://bbb.com/necessary.js');

		const h1 = gate.isAllowed(res1.category);
		const h2 = gate.isAllowed(res2.category);
		const h3 = gate.isAllowed(res3.category);

		expect(h1).toBeTrue();
		expect(h2).toBeFalse();
		expect(h3).toBeTrue();
	});

	it('hasConsent() works as expected', () => {
		const gate = new Gate(storage, []);

		gate.setConsent({ category: 'necessary', isAllowed: true });
		gate.setConsent({ category: 'statistics', isAllowed: false });

		expect(gate.hasConsent('necessary')).toBeTrue();
		expect(gate.hasConsent('statistics')).toBeTrue();
		expect(gate.hasConsent('marketing')).toBeFalse();
		expect(gate.hasConsent('unclassified')).toBeFalse();
	});

	it('setConsent() changes exist consent', () => {
		const gate = new Gate(storage, []);

		gate.setConsent({ category: 'marketing', isAllowed: false });
		gate.setConsent({ category: 'marketing', isAllowed: true });

		expect(gate.isAllowed('marketing')).toBeTrue();
	});

	it('save() works as expected', () => {
		const gate = new Gate(storage, []);

		expect(storage.count()).toEqual(0);

		gate.setConsent({ category: 'marketing', isAllowed: true });
		gate.save();

		expect(storage.count()).toEqual(1);
		const jsonRaw = storage.getItem(CONSENTS_STORAGE_KEY);
		const json = JSON.parse(jsonRaw);
		expect(json).not.toBeNull();
		expect(Array.isArray(json)).toBeTrue();
	});

	it('load() works as expected', () => {
		const gate = new Gate(storage, []);

		expect(gate.hasConsent('marketing')).toBeFalse();

		storage.setItem(CONSENTS_STORAGE_KEY, '[{"category":"marketing","isAllowed":true}]');

		gate.load();

		expect(gate.hasConsent('marketing')).toBeTrue();
	});

	it('getKnownCategories() returns proper value', () => {
		const gate = new Gate(storage, [
			{ url: 'm1.js', category: 'marketing', type: 'script' },
			{ url: 'm2.js', category: 'marketing', type: 'script' },
			{ url: 'n.js', category: 'necessary', type: 'script' },
			{ url: 's.js', category: 'statistics', type: 'iframe' }
		]);

		const categories1 = gate.getKnownCategories();

		expect(categories1.length).toEqual(3);
		expect(categories1).toContain('marketing');
		expect(categories1).toContain('necessary');
		expect(categories1).toContain('statistics');

		const r = gate.determineResource('iframe', 'unknown.js');
		expect(r.category).toEqual('unclassified');

		const categories2 = gate.getKnownCategories();
		expect(categories2.length).toEqual(4);
		expect(categories2).toContain('unclassified');
	});

	it('getConsents() returns always array', () => {
		const gate = new Gate(storage, []);

		expect(Array.isArray(gate.getConsents())).toBeTrue();
	});
});
