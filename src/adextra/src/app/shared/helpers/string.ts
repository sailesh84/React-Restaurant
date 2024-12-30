export function splitText(str: string, end: number = str.length, removeHtml: boolean = false): string {
  if (str) {
    if (removeHtml) {
      str = str.replace(/<[^>]*>?/gm, '');
    }
    if (!end) {
      end = str.length;
    }
    return str.trim().split(' ').filter((n) => n !== '').slice(0, end).join(' ');
  }
  return null;
}
