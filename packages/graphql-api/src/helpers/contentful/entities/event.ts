import { Link, PossiblyNotLoaded, Image, Document, CountryWithTitle } from "./_shared";

export type Event = {
    contentType: 'event';
    id: string;
    title: string;
    summary?: string;
    body?: string;
    primaryImage?: PossiblyNotLoaded<Image>;
    primaryLink?: PossiblyNotLoaded<Link>;
    secondaryLinks: PossiblyNotLoaded<Link>[];
    start: Date;
    end: Date;
    allDayEvent?: boolean;
    organisingParticipants: PossiblyNotLoaded<CountryWithTitle>[];
    venue?: string;
    location?: string;
    country?: string;
    coordinates?: unknown;
    eventLanguage?: string;
    // Ids of contentful Asset entries
    documents?: PossiblyNotLoaded<Document>[];
    attendees?: string;
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}