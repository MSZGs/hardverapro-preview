export type GMfetchMethod = "GET" | "HEAD" | "POST";
export type GMfetchOptions = { url: string; method?: GMfetchMethod };

export function GMfetch({ url, method }: GMfetchOptions): Promise<Tampermonkey.ResponseBase> {
  return new Promise((resolve, reject) => {
    GM.xmlHttpRequest({
      url,
      method,
      onload: response => resolve(response),
      onabort: () => reject(),
      onerror: error => reject(error),
      ontimeout: () => reject(),
    });
  });
}

const _parser = new DOMParser();
export function parseHTML(htmlText: string) {
  return _parser.parseFromString(htmlText, "text/html");
}
