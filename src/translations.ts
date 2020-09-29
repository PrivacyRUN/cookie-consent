import { Translations, Translation } from './model';

export function getTranslation(language: string, dictionaries: Translations): Translation {
	language = determineLanguage(language, Object.keys(dictionaries));
	return dictionaries[language];
}

export function determineLanguage(langauge: string, supportLanguages: string[]): string {
	if (supportLanguages.indexOf(langauge) >= 0) {
		return langauge;
	}
	return supportLanguages[0];
}
