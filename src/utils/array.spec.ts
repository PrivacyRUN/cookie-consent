import { arrayFind, arrayUnique } from './array';

describe('array', () => {

	it('arrayFind works correctly', () => {
		const r1 = arrayFind([{ x: 1 }, { x: 2 }, { x: 3 }], i => i.x === 3);

		expect(r1).not.toBeNull();
		expect(r1.x).toEqual(3);
	});

	it('arrayUnique works correctly', () => {
		const r1 = arrayUnique(['a', 'b', 'a']);

		expect(r1.length).toEqual(2);
		expect(r1[0]).toEqual('a');
		expect(r1[1]).toEqual('b');
	});
});
