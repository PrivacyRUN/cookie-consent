import { extendObject } from './extend-objects';

describe('object', () => {

	it('extendObject() works correctly', () => {
		const A = { a: 10, b: 20, c: { d: 1000, e: 5000, z: /q/ }, q: { p: 5 } };
		const B: any = { c: { d: 9999, f: 6000 } };

		extendObject(B, A);

		expect(B.c.d).toEqual(1000);
		expect(B.c.e).toEqual(5000);
		expect(B.c.f).toEqual(6000);
		expect(B.c.z.test('q')).toBeTrue();
		expect(B.q.p).toEqual(5);
	});

	it('extendObject() throws error when argument is null', () => {
		const v = (e: Error) => e.message.startsWith('Invalid arguments');
		expect(() => extendObject(null, {})).toThrowMatching(v);
		expect(() => extendObject({}, null)).toThrowMatching(v);
	});
});
