import { Asset } from "./asset";
import { Link } from "./link";
import { Participant } from "./participant";

export type Event = {
    contentType: 'event';
    id: string;
    title: string;
    summary?: string;
    body?: string;
    primaryImage?: Asset;
    primaryLink?: Link;
    secondaryLinks: Link[];
    start: Date;
    end: Date;
    allDayEvent?: boolean;
    organisingParticipants: Participant[];
    venue?: string;
    location?: string;
    country?: string;
    coordinates?: unknown;
    eventLanguage?: string;
    // Ids of contentful Asset entries
    documents: Asset[];
    attendees?: string;
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}