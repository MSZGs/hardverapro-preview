/* cSpell:ignore uadid fakebook */
import { GMfetch, parseHTML } from "./utils.js";

export type PreviewState = "NONE" | "LOADING" | "LOADED";
export type AdListElement = HTMLLIElement & { dataset: { uadid: string; previewState: PreviewState | undefined } };
export type AdId = string;

function getAds() {
  return document.querySelectorAll<AdListElement>("li[data-uadid]");
}

function getAdUrl(adId: AdId) {
  const title = document.querySelector<HTMLAnchorElement>(`[data-uadid="${adId}"] .uad-title a`);
  if (!title || !title.href) {
    throw new Error(`Couldn't get the url! (adId:${adId})`);
  }
  return title.href;
}

function createPreviewId(adId: AdId, asSelector = false) {
  return `${asSelector ? "#" : ""}preview-${adId}`;
}

async function loadPreview(id: AdId) {
  const url = getAdUrl(id);
  const response = await GMfetch({ url, method: "GET" });
  const responseDocument = parseHTML(response.responseText);

  //Select body
  const page = responseDocument.querySelector(".uad");
  if (!page) {
    throw new Error(`Couldn't get the preview body! (adId:${id})`);
  }

  // Remove header
  page.querySelector("div:first-of-type")?.remove();
  // Remove footer
  page.querySelector("div.uad-actions")?.remove();
  // Remove social buttons
  page.querySelector("button.fakebook")?.remove();

  page.id = createPreviewId(id);
  return page;
}

function togglePreview(adId: AdId) {
  const previewElement = document.querySelector<HTMLElement>(createPreviewId(adId, true));
  if (!previewElement) {
    throw new Error(`Preview element not found! (adId:${adId})`);
  }
  previewElement.hidden = !previewElement.hidden;
}

function clickHandler(this: AdListElement) {
  const setState = (state: PreviewState) => (this.dataset.previewState = state);
  const state = this.dataset.previewState ?? "NONE";
  const id = this.dataset.uadid;

  if (state == "NONE") {
    setState("LOADING");
    loadPreview(id)
      .then(page => {
        this.after(page);
        setState("LOADED");
      })
      .catch(error => {
        console.log(error);
        setState("NONE");
      });
  } else if (state == "LOADED") {
    togglePreview(id);
  }
}

function init() {
  getAds().forEach(ad => ad.addEventListener("click", clickHandler));
}

init();
