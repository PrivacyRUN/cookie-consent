import { Gate } from './gate';
import { Resource, ResourceType, TYPE_ATTRIBUTE } from './model';
import { Unblocker } from './unblocker';

export class DomObserver {

	private readonly observer = new MutationObserver((mutations: MutationRecord[]) => {
		for (let i = 0; i < mutations.length; i++) {
			const { addedNodes } = mutations[i];
			for (let j = 0; j < addedNodes.length; j++) {
				this.handle(<HTMLElement>addedNodes[j]);
			}
		}
	});

	public constructor(
		private readonly gate: Gate,
		private readonly unblocker: Unblocker) {
	}

	public handle(element: HTMLElement) {
		if (element.tagName === 'SCRIPT') {
			this.handleScript(<HTMLScriptElement>element);
		} else if (element.tagName === 'IFRAME') {
			this.handleIframe(<HTMLIFrameElement>element);
		}
	}

	private handleScript(script: HTMLScriptElement) {
		const resource = this.tryDetermineResource('script', script);
		if (resource && !this.gate.isAllowed(resource.category)) {
			this.unblocker.backupNode(script, resource);

			const originalType = script.type;
			if (originalType && originalType !== TYPE_ATTRIBUTE) {
				script.setAttribute('data-original-type', originalType);
			}
			script.type = TYPE_ATTRIBUTE;

			const beforeScriptExecuteListener = (event: Event) => {
				if (script.getAttribute('type') === TYPE_ATTRIBUTE) {
					event.preventDefault();
				}
				script.removeEventListener('beforescriptexecute', beforeScriptExecuteListener);
			};
			script.addEventListener('beforescriptexecute', beforeScriptExecuteListener);

			if (script.parentElement) {
				script.parentElement.removeChild(script);
			}
		}
	}

	private handleIframe(iframe: HTMLIFrameElement) {
		const resource = this.tryDetermineResource('iframe', iframe);
		if (resource && !this.gate.isAllowed(resource.category)) {
			this.unblocker.backupNode(iframe, resource);

			if (iframe.parentElement) {
				const placeholder = createPlaceholder();
				iframe.setAttribute('data-placeholder-id', placeholder.id);

				iframe.parentElement.insertBefore(placeholder, iframe);
				iframe.parentElement.removeChild(iframe);
			}
		}
	}

	private tryDetermineResource(type: ResourceType, element: HTMLElement): Resource {
		const url = (element as HTMLScriptElement | HTMLIFrameElement).src;
		return url ? this.gate.determineResource(type, url) : null;
	}

	public observe() {
		this.observer.observe(document.documentElement, {
			childList: true,
			subtree: true
		});
	}

	public disconnect() {
		this.observer.disconnect();
	}
}

let nextPlaceholderId = 0;

export function createPlaceholder(): HTMLElement {
	const placeholder = document.createElement('span');
	const nextId = '_bnnPlaceholder' + nextPlaceholderId++;
	placeholder.id = nextId;
	placeholder.style.display = 'none';
	return placeholder;
}
