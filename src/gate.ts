import { Consent, CookieCategory, Resource, ResourceType } from './model';
import { arrayFind, arrayUnique } from './utils/array';

export const CONSENTS_STORAGE_KEY = '_cookieConsents';

export class Gate {

	private readonly consents: Consent[] = [];
	private readonly knownResources: Resource[] = [];
	private readonly unknownResources: Resource[] = [];

	public constructor(
		private readonly storage: GateStorage,
		private readonly definedResources: Resource[]) {
	}

	public load() {
		const data = this.storage.getItem(CONSENTS_STORAGE_KEY);
		if (data) {
			const consents = <Consent[]>JSON.parse(data);
			consents.forEach(c => this.consents.push(c));
		}
	}

	public save() {
		const data = JSON.stringify(this.consents);
		this.storage.setItem(CONSENTS_STORAGE_KEY, data);
	}

	public setConsent(consent: Consent) {
		const current = arrayFind(this.consents, c => c.category === consent.category);
		if (current) {
			current.isAllowed = consent.isAllowed;
		} else {
			this.consents.push(consent);
		}
	}

	public determineResource(type: ResourceType, url: string): Resource {
		const definedResource = arrayFind(this.definedResources, r => {
			return r.type === type && (typeof r.url === 'string' ? r.url === url : r.url.test(url));
		});
		if (!definedResource) {
			console.warn(`[CookieBanner] Resource ${url} (${type}) cannot be classified.`);
			return this.getOrCreateResource(this.unknownResources, type, url, 'unclassified');
		}
		return this.getOrCreateResource(this.knownResources, type, url, definedResource.category);
	}

	private getOrCreateResource(resources: Resource[], type: ResourceType, url: string, category: CookieCategory): Resource {
		let resource = arrayFind(resources, r => r.type === type && r.url === url && r.category === category);
		if (!resource) {
			resource = { type: type, url: url, category: category };
			resources.push(resource);
		}
		return resource;
	}

	public isAllowed(category: CookieCategory): boolean {
		if (category !== 'necessary') {
			const consent = arrayFind(this.consents, c => c.category === category);
			return consent ? consent.isAllowed : false;
		}
		return true;
	}

	public hasConsent(category: CookieCategory): boolean {
		return !!arrayFind(this.consents, c => c.category === category);
	}

	public getConsents(): Consent[] {
		return this.consents;
	}

	public getKnownCategories(): CookieCategory[] {
		const categories = this.definedResources.concat(this.unknownResources)
			.map(c => c.category);
		return arrayUnique(categories);
	}
}

export interface GateStorage {
	getItem(key: string): string;
	setItem(key: string, value: string): void;
}

export class MemoryStorage implements GateStorage {
	private readonly _values: { [name: string]: string } = {};

	public getItem(key: string): string {
		return this._values[key];
	}

	public setItem(key: string, value: string) {
		this._values[key] = value;
	}

	public count() {
		return Object.keys(this._values).length;
	}
}
