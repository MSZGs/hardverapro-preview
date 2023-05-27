export type PreviewState = "NONE" | "LOADING" | "LOADED";
export type AdId = string;
export type AdListElement = HTMLLIElement & { dataset: { uadid: AdId; previewState: PreviewState | undefined } };
export type AdPreviewElement = HTMLElement & { dataset: { previewFor: string } };
