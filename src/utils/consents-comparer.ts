import { Consent } from '../model';

export function compareConsents(prev: Consent[], current: Consent[]): ComparisonResult {
	let type: ComparisonResult = 'noChange';
	let isNew: boolean;
	for (const cc of current) {
		if (type === 'removed') {
			break;
		}
		isNew = true;
		for (const pp of prev) {
			if (cc.category === pp.category) {
				if (cc.isAllowed !== pp.isAllowed) {
					type = cc.isAllowed ? 'added' : 'removed';
				}
				isNew = false;
				break;
			}
		}
		if (isNew) {
			type = cc.isAllowed ? 'added' : 'removed';
		}
	}
	return type;
}

export type ComparisonResult = 'noChange' | 'added' | 'removed';
