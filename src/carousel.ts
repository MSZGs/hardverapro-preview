import { AdPreviewElement } from "./types.js";

export function fixCarousel(page: AdPreviewElement) {
  const adId = page.dataset.previewFor;
  const carouselId = `preview-carousel-${adId}`;
  const carouselSelector = `[data-carousel-id="${carouselId}"`;

  page.querySelectorAll<HTMLElement>("#uad-images-carousel").forEach(x => (x.dataset.carouselId = carouselId));

  page.querySelectorAll<HTMLAnchorElement>('a[href="#uad-images-carousel"]').forEach(x => (x.href = carouselSelector));

  page
    .querySelectorAll<HTMLElement>('*[data-target="#uad-images-carousel"]')
    .forEach(x => (x.dataset.target = carouselSelector));

  page.querySelectorAll("a.carousel-control-expand,.carousel-item > a").forEach(x =>
    x.addEventListener("click", ev => {
      ev.preventDefault();
      page.querySelector("#uad-images-carousel")?.classList.toggle("fullscreen");
    })
  );
}
