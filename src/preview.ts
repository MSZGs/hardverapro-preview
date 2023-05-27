import { AdId, AdPreviewElement } from "./types.js";

const DomParser = new DOMParser();

function getAdUrl(adId: AdId) {
  const title = document.querySelector<HTMLAnchorElement>(`[data-uadid="${adId}"] .uad-title a`);
  if (!title || !title.href) {
    throw new Error(`Couldn't get the url! (adId:${adId})`);
  }
  return title.href;
}

function preparePage(element: Document, id: AdId) {
  //Select body
  const body = element.querySelector<HTMLElement>(".uad");
  if (!body) {
    throw new Error(`Couldn't get the preview body!`);
  }

  // Remove header
  body.querySelector("div:first-of-type")?.remove();

  // Remove footer
  body.querySelector("div.uad-actions")?.remove();

  // Remove social buttons
  body.querySelector("button.fakebook")?.remove();

  // Remove unnecessary margin after the previews
  body.style.marginBottom = "0px";

  //Set meta
  body.dataset.previewFor = id;

  return <AdPreviewElement>body;
}

export function getPreview(adId: AdId) {
  const preview = document.querySelector<AdPreviewElement>(`[data-preview-for="${adId}"]`);
  if (!preview) {
    throw new Error(`Preview element not found! (adId:${adId})`);
  }
  return preview;
}

export async function createPreview(adId: AdId) {
  const url = getAdUrl(adId);
  const response = await fetch(url);
  const responseDocument = DomParser.parseFromString(await response.text(), "text/html");
  const adPreview = preparePage(responseDocument, adId);
  return adPreview;
}
