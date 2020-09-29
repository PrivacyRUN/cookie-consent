import { CreateElementObserver } from './create-element-observer';
import { Gate, MemoryStorage } from './gate';
import { TYPE_ATTRIBUTE } from './model';

describe('createElementObserver', () => {

	let gate: Gate;
	let observer: CreateElementObserver;

	beforeEach(() => {
		const storage = new MemoryStorage();
		gate = new Gate(storage, []);
		observer = new CreateElementObserver(gate);
	});

	it('observe() replaces original createElement() function', () => {
		// tslint:disable-next-line
		const originalCreateElement = document.createElement;

		observer.observe();

		// tslint:disable-next-line
		expect(document.createElement).not.toEqual(originalCreateElement);

		observer.disconnect();

		// tslint:disable-next-line
		expect(document.createElement).toEqual(originalCreateElement);
	});

	it('createElement() blocks dynamics script', () => {
		observer.observe();

		const script = document.createElement('script');
		script.src = 'https://code.jquery.com/jquery-3.5.1.min.js';
		script.id = 'testScript';
		script.setAttribute('type', 'application/javascript');
		script.setAttribute('data-foo', 'bar');
		document.body.appendChild(script);

		const script0 = document.getElementById('testScript');
		expect(script0).not.toBeNull();
		expect(script0.getAttribute('type')).toEqual(TYPE_ATTRIBUTE);

		observer.disconnect();
	});
});
