import { Banner, OnCloseBannerHandler } from './banner';
import { Gate } from './gate';
import { Consent } from './model';
import { Unblocker } from './unblocker';
import { compareConsents } from './utils/consents-comparer';

export class Manager {

	private readonly listeners: ManagerListener[] = [];

	public constructor(
		private readonly banner: Banner,
		private readonly gate: Gate,
		private readonly unblocker: Unblocker) {
	}

	public listen(listener: ManagerListener) {
		this.listeners.push(listener);
	}

	private notifyListeners(event: ManagerEvent) {
		for (let i = 0; i < this.listeners.length; i++) {
			this.listeners[i](event);
		}
	}

	public getConsents(): Consent[] {
		return this.gate.getConsents();
	}

	public editGrantedConsents() {
		const grantedConsents = this.gate.getConsents();

		this.showBanner(grantedConsents, (newConsents) => {
			const comparison = compareConsents(grantedConsents, newConsents);
			this.saveConsents(newConsents);
			if (comparison === 'added') {
				this.unblock();
			} else if (comparison === 'removed') {
				this.block();
			}
		});
	}

	public editNewConsents() {
		const definedCategories = this.gate.getKnownCategories();
		const notResolvedCategories = definedCategories
			.filter(c => !this.gate.hasConsent(c));

		if (notResolvedCategories.length > 0) {
			const consents = definedCategories.map(c => {
				return {
					category: c,
					isAllowed: this.gate.isAllowed(c)
				};
			});

			this.showBanner(consents, (newConsents) => {
				this.saveConsents(newConsents);
				this.unblock();
			});
		}
	}

	private showBanner(consents: Consent[], handler: OnCloseBannerHandler) {
		if (!this.banner.isOpened()) {
			this.notifyListeners('bannerOpened');
			this.banner.show(consents, (newConsents) => {
				this.notifyListeners('bannerClosed');
				handler(newConsents);
			});
		}
	}

	private saveConsents(consents: Consent[]) {
		consents.forEach(c => this.gate.setConsent(c));
		this.gate.save();
		this.notifyListeners('consentsChanged');
	}

	private unblock() {
		this.notifyListeners('beforeUnblocking');
		this.unblocker.unblock();
	}

	private block() {
		this.notifyListeners('beforeReloading');
		this.reloadPage();
	}

	private reloadPage() {
		window.location.reload();
	}
}

export type ManagerEvent = 'consentsChanged' | 'beforeUnblocking' | 'beforeReloading' | 'bannerOpened' | 'bannerClosed';
type ManagerListener = (event: ManagerEvent) => void;
