import { Css } from './css';
import { DEFAULT_THEME } from './default-configuration';

describe('Css', () => {

	it('install() works correctly', () => {
		const css = new Css(DEFAULT_THEME);

		css.install();

		expect(css.style).not.toBeNull();
		expect(css.style.innerHTML).not.toBeNull();

		css.uninstall();

		expect(css.style).toBeNull();
	});

	it('install() throws error when is installed', () => {
		const css = new Css(DEFAULT_THEME);

		css.install();

		expect(() => css.install())
			.toThrowMatching((e: Error) => e.message.startsWith('CSS is already installed'));
	});
});
