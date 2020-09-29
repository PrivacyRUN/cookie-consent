import { Gate, MemoryStorage } from './gate';
import { Unblocker } from './unblocker';

describe('unblocker', () => {

	function createScriptTestEl(): HTMLScriptElement {
		const script = document.createElement('script');
		script.setAttribute('id', 'bl0ckedScript');
		script.setAttribute('src', 'http://z.com/alfa.js');
		script.setAttribute('data-foo', 'example');
		return script;
	}

	function createIframeTestElement(): HTMLIFrameElement {
		const iframe = document.createElement('iframe');
		iframe.setAttribute('id', 'bl0ckedIframe');
		iframe.setAttribute('data-placeholder-id', 'placehold3r-id');
		iframe.setAttribute('src', 'http://z.com/alfa.html');
		return iframe;
	}

	function createIframePlaceholderElement(): HTMLElement {
		const placeholder = document.createElement('span');
		placeholder.setAttribute('id', 'placehold3r-id');
		return placeholder;
	}

	it('unblock() appends blocked element to document', () => {
		const storage = new MemoryStorage();
		const gate = new Gate(storage, []);
		const unblocker = new Unblocker(gate);
		gate.setConsent({ category: 'marketing', isAllowed: true });

		const script = createScriptTestEl();
		const iframe = createIframeTestElement();
		const iframePlaceholder = createIframePlaceholderElement();
		document.body.appendChild(iframePlaceholder);

		unblocker.backupNode(script, { url: 'http://z.com/alfa.js', type: 'script', category: 'marketing' });
		unblocker.backupNode(iframe, { url: 'http://z.com/alfa.html', type: 'iframe', category: 'marketing' });

		unblocker.unblock();

		const script0 = document.getElementById('bl0ckedScript');
		expect(script0).not.toBeNull();
		expect(script0.parentElement).not.toBeNull();
		expect(script0.getAttribute('data-foo')).toEqual('example');
		expect(script0.getAttribute('src')).toEqual('http://z.com/alfa.js');
		script0.parentElement.removeChild(script0);

		const iframe0 = document.getElementById('bl0ckedIframe');
		expect(iframe0).not.toBeNull();
		expect(iframe0.getAttribute('src')).toEqual('http://z.com/alfa.html');
		iframe0.parentElement.removeChild(iframe0);
	});
});
