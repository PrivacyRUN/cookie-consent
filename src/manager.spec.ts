import { Banner } from './banner';
import { DEFAULT_TRANSLATIONS } from './default-configuration';
import { Gate, MemoryStorage } from './gate';
import { Manager, ManagerEvent } from './manager';
import { Consent } from './model';
import { Unblocker } from './unblocker';

describe('Manager', () => {

	let storage: MemoryStorage;
	let banner: Banner;
	let gate: Gate;
	let manager: Manager;

	beforeEach(() => {
		storage = new MemoryStorage();
		banner = new Banner(DEFAULT_TRANSLATIONS.en, null, false);
		gate = new Gate(storage, []);
		const unblocker = new Unblocker(gate);
		manager = new Manager(banner, gate, unblocker);
	});

	it('getConsents() returns from Gate value', () => {
		const c1: Consent = { isAllowed: true, category: 'marketing' };
		const c2: Consent = { isAllowed: true, category: 'necessary' };

		gate.setConsent(c1);
		gate.setConsent(c2);

		const cc = manager.getConsents();
		expect(cc).toContain(c1);
		expect(cc).toContain(c2);
	});

	it('editNewConsents() does not open banner when it is not necessary', () => {
		gate.setConsent({ category: 'marketing', isAllowed: true });
		expect(banner.isOpened()).toBeFalse();

		manager.editNewConsents();

		expect(banner.isOpened()).toBeFalse();
	});

	it('editNewConsents() open banner when it is necessary', () => {
		gate.determineResource('script', 'q.js');

		expect(banner.isOpened()).toBeFalse();

		manager.editNewConsents();

		expect(banner.isOpened()).toBeTrue();

		banner.close();
	});

	it('editGrantedConsents() can unblock new resources', () => {
		const events: ManagerEvent[] = [];
		gate.setConsent({ category: 'marketing', isAllowed: false });
		manager.listen(event => events.push(event));

		expect(banner.isOpened()).toBeFalse();

		manager.editGrantedConsents();

		expect(banner.isOpened()).toBeTrue();
		expect(events[0]).toEqual('bannerOpened');

		banner.close(true);

		expect(events[1]).toEqual('bannerClosed');
		expect(events[2]).toEqual('consentsChanged');
		expect(events[3]).toEqual('beforeUnblocking');
		expect(storage.getItem('_cookieConsents')).not.toBeNull();
	});

	it('editGrantedConsents() is reolading page when user delete consents', () => {
		let called = false;

		spyOn<any>(manager, 'reloadPage').and.callFake(() => {
			called = true;
		});

		const events: ManagerEvent[] = [];

		gate.setConsent({ category: 'marketing', isAllowed: true });
		manager.listen(event => events.push(event));

		manager.editGrantedConsents();

		expect(banner.isOpened()).toBeTrue();
		expect(events[0]).toEqual('bannerOpened');

		banner.close(false);

		expect(events[1]).toEqual('bannerClosed');
		expect(events[2]).toEqual('consentsChanged');
		expect(events[3]).toEqual('beforeReloading');
		expect(called).toBeTrue();
	});
});
