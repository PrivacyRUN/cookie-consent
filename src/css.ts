import { Theme } from './model';

export class Css {

	public style: HTMLStyleElement;

	public constructor(
		private readonly theme: Theme) {
	}

	public install() {
		if (this.style) {
			throw new Error('CSS is already installed.');
		}

		this.style = document.createElement('style');
		this.style.setAttribute('type', 'text/css');

		const firstScript = document.getElementsByTagName('script')[0];
		firstScript.parentElement.insertBefore(this.style, firstScript);

		const sheet = this.style.sheet;
		const t = this.theme;
		const [backgroundColor, textColor, primaryColor, primaryTextColor, primaryHoverColor, primaryDisabledColor,
			secondaryColor, secondaryHoverColor, secondaryTextColor] = t.colors;

		sheet.addRule(
			'.bnn-banner, .bnn-banner-description, .bnn-banner-button',
			`font-size: ${t.fontSize}px; line-height: ${t.lineHeight}px;`);
		sheet.addRule(
			'.bnn-banner',
			// tslint:disable-next-line
			`z-index: 999999; width: ${t.bannerWidth}px; position: fixed; left: ${t.spacing}px; bottom: ${t.spacing}px; padding: ${t.spacing * 2}px; background: ${backgroundColor}; border: ${t.borderSize}px solid ${secondaryColor}; box-sizing: border-box; box-shadow: 0 0 4px rgba(0, 0, 0, 0.25); border-radius: ${t.radius}px;`, 0);
		sheet.insertRule(
			`@media screen and (max-width: ${t.bannerWidth * 2}px) { .bnn-banner {left: 0; bottom: 0; width: 100%;} }`, 1);
		sheet.addRule(
			'.bnn-banner-title',
			`font-weight: bold; color: ${textColor}; font-size: ${t.headerFontSize}px; line-height: ${t.headerLineHeight}px;`);
		sheet.addRule(
			'.bnn-banner-description',
			`margin: ${t.spacing}px 0; color: ${textColor};`);
		sheet.addRule(
			'.bnn-privacy-policy',
			`margin-bottom: ${t.spacing}px;`);
		sheet.addRule(
			'.bnn-privacy-policy-link',
			`color: ${primaryColor} !important; text-decoration: underline !important;`);
		sheet.addRule(
			'.bnn-privacy-policy-link:hover',
			`color: ${primaryColor} !important; text-decoration: none !important;`);
		sheet.addRule(
			'.bnn-banner-consent',
			`padding: ${t.spacing}px 0; border-top: ${t.borderSize}px solid ${secondaryColor};`);
		sheet.addRule(
			'.bnn-banner-consent-switch',
			// tslint:disable-next-line
			`position: relative; display: inline-block; background: ${secondaryColor}; width: 56px; height: 30px; border-radius: ${t.radius}px; vertical-align: middle; transition: background 0.2s ease;`);
		sheet.addRule(
			'.bnn-banner-consent-switch[data-enabled="1"]',
			`background: ${secondaryColor}; cursor: pointer;`);
		sheet.addRule(
			'.bnn-banner-consent-switch[data-enabled="1"]:hover',
			`background: ${secondaryHoverColor};`);
		sheet.addRule(
			'.bnn-banner-consent-switch::after',
			// tslint:disable-next-line
			`content: ' '; position: absolute; top: 0; left: 0; display: block; width: 22px; height: 22px; margin: 4px; background: ${primaryDisabledColor}; border-radius: ${t.radius}px; transition: left 0.2s ease;`);
		sheet.addRule(
			'.bnn-banner-consent-switch[data-checked="1"]::after',
			`left: 26px;`);
		sheet.addRule(
			'.bnn-banner-consent-switch[data-enabled="1"]::after',
			`background: ${primaryColor};`);
		sheet.addRule(
			'.bnn-banner-consent-switch[data-checked="1"][data-enabled="1"]::after',
			`background: ${secondaryTextColor};`);
		sheet.addRule(
			'.bnn-banner-consent-switch[data-enabled="1"][data-checked="1"]',
			`background: ${primaryColor};`);
		sheet.addRule(
			'.bnn-banner-consent-switch[data-enabled="1"][data-checked="1"]:hover',
			`background: ${primaryHoverColor};`);
		sheet.addRule(
			'.bnn-banner-consent-label',
			`font-weight: 600; margin-left: ${t.spacing}px; color: ${textColor}; cursor: pointer;`);
		sheet.addRule(
			'.bnn-banner-buttons',
			`border-top: ${t.borderSize}px solid ${secondaryColor}; text-align: center;`);
		sheet.addRule(
			'.bnn-banner-button',
			// tslint:disable-next-line
			`display: block; border: 0; outline: 0; color: ${primaryTextColor}; background: ${primaryColor}; border-radius: ${t.radius}px; transition: background 0.2s ease; font-weight: 600; margin: ${t.spacing}px 0 0; padding: ${t.spacing}px; width: 100%; box-sizing: border-box; cursor: pointer;`);
		sheet.addRule(
			'.bnn-banner-button:hover, .bnn-banner-button:active, .bnn-banner-button:focus',
			`color: ${primaryTextColor}; background: ${primaryHoverColor};`);
		sheet.addRule(
			'.bnn-banner-button:focus',
			`box-shadow: 0 0 3px ${primaryHoverColor};`);
	}

	public uninstall() {
		this.style.parentElement.removeChild(this.style);
		this.style = null;
	}
}
