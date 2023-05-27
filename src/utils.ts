export function initCollapse(element: HTMLElement) {
  element.classList.add("collapse");
}

export function toggleCollapse(element: HTMLElement, force?: boolean) {
  $(element).collapse(force === undefined ? "toggle" : force ? "show" : "hide");
}
