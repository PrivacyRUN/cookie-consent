
export function extendObject(target: any, source: any) {
	if (!target || !source) {
		throw new Error('Invalid arguments.');
	}
	for (const key of Object.keys(source)) {
		const value = source[key];
		if (typeof value === 'object' && !(value instanceof RegExp)) {
			if (!target[key]) {
				target[key] = {};
			}
			extendObject(target[key], source[key]);
		} else {
			target[key] = source[key];
		}
	}
}
