import { Gate } from './gate';
import { Resource } from './model';

export class Unblocker {

	private readonly backupedNodes: BackupedNode[] = [];

	public constructor(
		private readonly gate: Gate) {
	}

	public backupNode(node: HTMLElement, resource: Resource) {
		this.backupedNodes.push({
			node: node,
			resource: resource
		});
	}

	public unblock() {
		const unblockNodes = this.backupedNodes.filter(bn => this.gate.isAllowed(bn.resource.category));

		for (const bn of unblockNodes) {
			this.backupedNodes.splice(this.backupedNodes.indexOf(bn), 1);

			switch (bn.resource.type) {
				case 'script':
					this.unblockScript(bn.node as HTMLScriptElement);
					break;
				case 'iframe':
					this.unblockIframe(bn.node as HTMLIFrameElement);
					break;
			}
		}
	}

	private unblockScript(bn: HTMLScriptElement) {
		const script = document.createElement('script');

		const originalType = bn.getAttribute('data-original-type');
		script.src = bn.src;
		script.type = originalType || 'application/javascript';

		const attributes = bn.attributes;
		for (let i = 0; i < attributes.length; i++) {
			const attribute = attributes[i];
			const name = attribute.name;
			if (name.indexOf('on') === 0 || name === 'id' || (name.indexOf('data-') === 0 && name !== 'data-original-type')) {
				script.setAttribute(name, attribute.value);
			}
		}

		document.head.appendChild(script);
	}

	private unblockIframe(bn: HTMLIFrameElement) {
		const placeholderId = bn.getAttribute('data-placeholder-id');
		const placeholder = document.getElementById(placeholderId);

		placeholder.parentElement.insertBefore(bn, placeholder);
		placeholder.parentElement.removeChild(placeholder);
	}
}

interface BackupedNode {
	node: HTMLElement;
	resource: Resource;
}
