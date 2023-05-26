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

function fixCarousel(page: Element, id: AdId) {
  const newID = `preview-carousel-${id}`;
  const carouselSelector = `[data-carousel-id="${newID}"`;

  page.querySelectorAll<HTMLElement>("#uad-images-carousel").forEach(x => (x.dataset.carouselId = newID));

  page.querySelectorAll<HTMLAnchorElement>('a[href="#uad-images-carousel"]').forEach(x => (x.href = carouselSelector));

  page
    .querySelectorAll<HTMLElement>('*[data-target="#uad-images-carousel"]')
    .forEach(x => (x.dataset.target = carouselSelector));

  page.querySelectorAll("a.carousel-control-expand,.carousel-item > a").forEach(x =>
    x.addEventListener("click", ev => {
      ev.preventDefault();
      page.querySelector("#uad-images-carousel").classList.toggle("fullscreen");
    })
  );
}

async function loadPreview(id: AdId, element: Element) {
  const url = getAdUrl(id);
  const response = await GMfetch({ url, method: "GET" });
  const responseDocument = parseHTML(response.responseText);

  //Select body
  const page = responseDocument.querySelector(".uad");
  if (!page) {
    throw new Error(`Couldn't get the preview body! (adId:${id})`);
  }

  page.id = createPreviewId(id);
  page.classList.add("collapse", "show");

  // Remove header
  page.querySelector("div:first-of-type")?.remove();
  // Remove footer
  page.querySelector("div.uad-actions")?.remove();
  // Remove social buttons
  page.querySelector("button.fakebook")?.remove();

  element.after(page);

  fixCarousel(page, id);

  return page;
}

function togglePreview(adId: AdId) {
  const previewElement = document.querySelector<HTMLElement>(createPreviewId(adId, true));
  if (!previewElement) {
    throw new Error(`Preview element not found! (adId:${adId})`);
  }
  $(previewElement).collapse("toggle");
}

function clickHandler(this: AdListElement) {
  const setState = (state: PreviewState) => (this.dataset.previewState = state);
  const state = this.dataset.previewState ?? "NONE";
  const id = this.dataset.uadid;

  if (state == "NONE") {
    setState("LOADING");
    loadPreview(id, this)
      .then(() => {
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
