export function getURL(base: string, url: string): string {
  let finalBase = '';
  if (!base?.startsWith('http://') && !base?.startsWith('https://')) {
    finalBase = `http://${base}`;
  }
  try {
    return new URL(url, finalBase).href;
  } catch (e) {
    console.debug(e);
    return '';
  }
}
