import { createPlaceholder, DomObserver } from './dom-observer';
import { Gate, MemoryStorage } from './gate';
import { TYPE_ATTRIBUTE } from './model';
import { Unblocker } from './unblocker';

describe('DomObserver', () => {

	let domObserver: DomObserver;

	beforeEach(() => {
		const storage = new MemoryStorage();
		const gate = new Gate(storage, []);
		const unblocker = new Unblocker(gate);
		domObserver = new DomObserver(gate, unblocker);
	});

	it('observe() and disconnect() do not throw error', () => {
		expect(() => {
			domObserver.observe();
			domObserver.disconnect();
		}).not.toThrowError();
	});

	it('handle() blocks external <script>', () => {
		const parent = document.createElement('div');
		const script = document.createElement('script');
		script.src = 'https://x.com/foo.js';
		script.type = 'application/javascript';
		parent.appendChild(script);

		domObserver.handle(script);

		expect(script.type).toEqual(TYPE_ATTRIBUTE);
		expect(parent.childElementCount).toEqual(0);
	});

	it('handle() does not block inline <script>', () => {
		const parent = document.createElement('div');
		const script = document.createElement('script');
		script.type = 'application/javascript';
		parent.appendChild(script);

		domObserver.handle(script);

		expect(script.type).toEqual('application/javascript');
	});

	it('handle() blocks <iframe>', () => {
		const parent = document.createElement('div');
		const iframe = document.createElement('iframe');
		iframe.src = 'iframe.html';
		parent.appendChild(iframe);

		domObserver.handle(iframe);

		expect(parent.querySelector('span')).not.toBeNull();
	});
});

describe('DomObserverUtils', () => {

	it('createPlaceholder() creates unique id', () => {
		const p1 = createPlaceholder();
		const p2 = createPlaceholder();
		const p3 = createPlaceholder();
		const p4 = createPlaceholder();
		const p = [p1, p2, p3, p4];

		for (let i = 0; i < p.length; i++) {
			for (let j = 0; j < p.length; j++) {
				if (i !== j) {
					expect(p[i]).not.toEqual(p[j]);
					expect(p[i].id).not.toEqual(p[j].id);
				}
			}
		}
	});
});
