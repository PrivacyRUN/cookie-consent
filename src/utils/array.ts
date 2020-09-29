
export function arrayFind<T>(array: T[], predicate: (current: T, index: number, list: T[]) => boolean): T {
	const length = array.length;

	for (let i = 0; i < length; i++) {
		const value = array[i];
		if (predicate.call(array, value, i, array)) {
			return value;
		}
	}

	return undefined;
}

export function arrayUnique<T>(array: T[]): T[] {
	return array.filter((c, ix, r) => r.indexOf(c) === ix);
}
