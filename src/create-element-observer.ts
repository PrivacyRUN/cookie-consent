import { Gate } from './gate';
import { TYPE_ATTRIBUTE } from './model';

export class CreateElementObserver {

	private createElement: any;
	private srcDescriptor: PropertyDescriptor;
	private typeDescriptor: PropertyDescriptor;

	public constructor(
		private readonly gate: Gate) {
	}

	public observe() {
		// tslint:disable-next-line
		this.createElement = document.createElement;
		this.srcDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'src');
		this.typeDescriptor = Object.getOwnPropertyDescriptor(HTMLScriptElement.prototype, 'type');
		const t = this;

		// tslint:disable-next-line
		document.createElement = (...args: any[]) => {
			const element = <HTMLElement>this.createElement.bind(document)(...args);
			if (element.tagName.toLowerCase() !== 'script') {
				return element;
			}
			const script = element as HTMLScriptElement;

			try {
				Object.defineProperties(script, {
					src: {
						get: function () {
							return t.srcDescriptor.get.call(this);
						},
						set: function (value: string) {
							const resource = t.gate.determineResource('script', value);
							if (!t.gate.isAllowed(resource.category)) {
								t.typeDescriptor.set.call(this, TYPE_ATTRIBUTE);
							}
							t.srcDescriptor.set.call(this, value);
						}
					},
					type: {
						set: function (value: string) {
							if (script.src) {
								const resource = t.gate.determineResource('script', script.src);
								if (!t.gate.isAllowed(resource.category)) {
									value = TYPE_ATTRIBUTE;
								}
							}
							t.typeDescriptor.set.call(this, value);
						}
					}
				});

				script.setAttribute = function (name: string, value: string) {
					if (name === 'type' || name === 'src') {
						script[name] = value;
					} else {
						HTMLScriptElement.prototype.setAttribute.call(script, name, value);
					}
				};
			} catch (e) {
				console.warn('[CookieBanner] Unable to prevent script execution for script src.');
			}
			return script;
		};
	}

	public disconnect() {
		// tslint:disable-next-line
		document.createElement = this.createElement;
	}
}
