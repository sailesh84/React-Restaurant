export function formatNumber(
  value: number, minIntegerDigits: number = 0, minimumFractionDigits?: number, maximumFractionDigits?: number
): string {
  const options = {minimumIntegerDigits: minIntegerDigits > 0 ? minIntegerDigits : 1};
  if (minimumFractionDigits) {
    options[`minimumFractionDigits`] = minimumFractionDigits > 0 ? minimumFractionDigits : 1;
  }
  if (maximumFractionDigits) {
    options[`maximumFractionDigits`] = maximumFractionDigits > 0 ? maximumFractionDigits : 1;
  }
  return new Intl.NumberFormat(
    'en-GB',
    options
    ).format(value).replace(/,/gi, '');
}



