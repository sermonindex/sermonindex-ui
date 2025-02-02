// todo: this needs to be manually sync'd with any new languages we
//   add to the API.
export const languageMap: { [key: string]: string } = {
  eng: 'English',
  fra: 'French',
  spa: 'Spanish',
  deu: 'German',
  // ... add more languages
};

export function getLanguageName(code: string): string {
  if (code in languageMap) {
    return languageMap[code];
  } else {
    // return code so that the API can flex without breaking the frontend
    return code;
  }
}

export function isValidLanguage(code: string): boolean {
  return code in languageMap;
}
