import { getHtml } from "./utils";

export function truncateText(sourceText: string, maxLength: number): string {
    if (sourceText.length <= maxLength) return sourceText;
    const truncatedText = sourceText.slice(0, maxLength);
    const lastSpaceIndex = truncatedText.lastIndexOf(' ');
    return truncatedText.slice(0, lastSpaceIndex) + '...';
}

export function previewText(source: { summary?: string; body?: string }, maxLength: number = 200): string | undefined {
    if (source.summary != null) return getHtml(source.summary);
    if (source.body == null) return;

    // Parse the body and remove all tags
    const bodyHtml = getHtml(source.body, { inline: false, allowedTags: [] });
    return truncateText(bodyHtml, maxLength);
}