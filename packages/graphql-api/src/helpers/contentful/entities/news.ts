import { Link, PossiblyNotLoaded, Image } from "./_shared";

export type News = {
    contentType: 'news';
    id: string;
    title: string;
    summary?: string;
    body?: string;
    primaryImage?: PossiblyNotLoaded<Image>;
    primaryLink?: PossiblyNotLoaded<Link>;
    secondaryLinks: PossiblyNotLoaded<Link>[];
    citation?: string;
    // Language codes
    countriesOfCoverage: string[];
    // TODO: Should probably be an enum
    topics: PossiblyNotLoaded<string>[];
    // TODO: Should probably be an enum
    purposes: PossiblyNotLoaded<string>[];
    // TODO: Should probably be an enum
    audiences: PossiblyNotLoaded<string>[];
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}