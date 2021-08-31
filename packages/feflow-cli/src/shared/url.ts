export function getURL(base: string, url: string): string {
  let newBase: any = '';
  if (!base?.startsWith('http://') && !base?.startsWith('https://')) {
    newBase = `http://${base}`;
  }
  try {
    return new URL(url, newBase).href;
  } catch (e) {
    console.debug(e);
    return '';
  }
}
