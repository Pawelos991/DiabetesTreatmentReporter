export function dateToStringMonthYear(date?: Date | Date[]) {
  if (date == null) {
    return '';
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
  };

  const formattedDate = date.toLocaleString('en-US', options);
  return formattedDate.replace('/', '-');
}

export function dateToStringYearMonthDay(date?: Date | Date[]) {
  if (date == null) {
    return '';
  }
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  };

  const parts = date.toLocaleString('pl-pl', options).split('.');
  return parts[2] + '-' + parts[1] + '-' + parts[0];
}

export function monthYearStringToDate(dateString: string): Date {
  const [monthString, yearString] = dateString.split('-');

  const month = parseInt(monthString, 10);
  const year = parseInt(yearString, 10);

  return new Date(year, month - 1, 1);
}
