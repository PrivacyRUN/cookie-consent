import { Configuration, Theme, Translations } from './model';

export const DEFAULT_TRANSLATIONS: Translations = {
	'en': {
		bannerTitle: 'This website uses cookies',
		// tslint:disable-next-line
		bannerDescription: 'We uses cookies to improve user experience. Choose what cookies you allow us to use. You can read more about our Cookie Policy in our Privacy Policy.',
		bannerOpenPrivacyPolicy: 'Go to Privacy Policy',
		save: 'Save',
		acceptAll: 'Accept all',
		marketing: 'Marketing',
		necessary: 'Necessary',
		preferences: 'Preferences',
		statistics: 'Statistics',
		unclassified: 'Unclassified'
	}
};

export const DEFAULT_THEME: Theme = {
	radius: 5,
	spacing: 10,
	borderSize: 1,
	bannerWidth: 280,

	fontSize: 14,
	lineHeight: 20,
	headerFontSize: 22,
	headerLineHeight: 28,

	colors: [
		'#FFF', // backgroundColor
		'#000', // textColor
		'#143D4D', // primaryColor
		'#FFF', // primaryTextColor
		'#215264', // primaryHoverColor
		'#6F7C7E', // primaryDisabledColor
		'#E0E0E0', // secondaryColor
		'#CECECE', // secondaryHoverColor
		'#FFF' // secondaryTextColor
	]
};

export const DEFAULT_CONFIGURATION: Configuration = {
	autoFocus: false,
	resources: [],
	theme: DEFAULT_THEME,
	translations: DEFAULT_TRANSLATIONS,
	privacyPolicyUrl: null
};
