import { PossiblyNotLoaded } from "./_shared";
import { Asset } from "./asset";
import { Link } from "./link";
import { Participant } from "./participant";

export type Event = {
    contentType: 'event';
    id: string;
    title: string;
    summary?: string;
    body?: string;
    primaryImage?: PossiblyNotLoaded<Asset>;
    primaryLink?: PossiblyNotLoaded<Link>;
    secondaryLinks: PossiblyNotLoaded<Link>[];
    start: Date;
    end: Date;
    allDayEvent?: boolean;
    organisingParticipants: PossiblyNotLoaded<Participant>[];
    venue?: string;
    location?: string;
    country?: string;
    coordinates?: unknown;
    eventLanguage?: string;
    // Ids of contentful Asset entries
    documents: PossiblyNotLoaded<Asset>[];
    attendees?: string;
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}