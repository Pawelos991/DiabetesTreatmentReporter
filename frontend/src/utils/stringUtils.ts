function isEmpty(s: string | null | undefined) {
  return !s?.length;
}

function isBlank(s: string | null | undefined): s is null {
  return isEmpty(s?.trim());
}

export { isEmpty, isBlank };
