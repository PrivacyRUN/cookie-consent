
export const TYPE_ATTRIBUTE = 'javascript/blocked';

export type CookieCategory = 'necessary' | 'preferences' | 'statistics' | 'marketing' | 'unclassified';

export interface Configuration {
	autoFocus?: boolean;
	theme?: Theme;
	resources: Resource[];
	language?: string;
	translations?: Translations;
	privacyPolicyUrl?: string;
}

export interface Translations {
	[language: string]: Translation;
}

export interface Translation {
	bannerTitle: string;
	bannerDescription: string;
	bannerOpenPrivacyPolicy: string;
	save: string;
	acceptAll: string;
	necessary: string;
	preferences: string;
	marketing: string;
	statistics: string;
	unclassified: string;
}

export interface Resource {
	url: string | RegExp;
	type: ResourceType;
	category: CookieCategory;
}

export type ResourceType = 'script' | 'iframe';

export interface Consent {
	category: CookieCategory;
	isAllowed: boolean;
}

export interface Theme {
	radius: number;
	spacing: number;
	borderSize: number;
	bannerWidth: number;

	fontSize: number;
	lineHeight: number;
	headerFontSize: number;
	headerLineHeight: number;

	// backgroundColor, secondaryColor, secondaryHoverColor, secondaryTextColor,
	// textColor, primaryColor, primaryTextColor, primaryHoverColor, primaryDisabledColor
	colors: string[];
}
