export function isCorrectVersion(version: string) {
  return !version.startsWith('%__') && !version.endsWith('__%');
}
