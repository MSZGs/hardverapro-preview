import type { AdId, AdListElement, PreviewState } from "./types.js";
import { createPreview, getPreview } from "./preview.js";
import { initCollapse, toggleCollapse } from "./utils.js";
import { fixCarousel } from "./carousel.js";

function getAds() {
  return document.querySelectorAll<AdListElement>("li[data-uadid]");
}

async function loadPreview(id: AdId, element: Element) {
  const adPreview = await createPreview(id);

  initCollapse(adPreview);

  element.after(adPreview);

  fixCarousel(adPreview);

  return adPreview;
}

function togglePreview(adId: AdId, force?: boolean) {
  toggleCollapse(getPreview(adId), force);
}

function clickHandler(this: AdListElement) {
  const setState = (state: PreviewState) => (this.dataset.previewState = state);
  const state = this.dataset.previewState ?? "NONE";
  const adId = this.dataset.uadid;

  if (state === "NONE") {
    setState("LOADING");
    loadPreview(adId, this)
      .then(() => {
        setState("LOADED");
        togglePreview(adId, true);
      })
      .catch(error => {
        console.log(error);
        setState("NONE");
      });
  } else if (state === "LOADED") {
    togglePreview(adId);
  }
}

getAds().forEach(ad => ad.addEventListener("click", clickHandler));
