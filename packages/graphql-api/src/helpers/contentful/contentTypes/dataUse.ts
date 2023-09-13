import { PossiblyNotLoaded } from "./_shared";
import { Asset } from "./asset";
import { Audience } from "./audience";
import { Link } from "./link";
import { Purpose } from "./purpose";
import { Topic } from "./topic";

export type DataUse = {
    contentType: 'dataUse';
    id: string;
    title: string;
    summary?: string;
    body?: string;
    primaryImage?: PossiblyNotLoaded<Asset>;
    primaryLink?: PossiblyNotLoaded<Link>;
    secondaryLinks: PossiblyNotLoaded<Link>[];
    citation?: string;
    resourceUsed?: string;
    // Language codes
    countriesOfResearchers: string[];
    // Language codes
    countriesOfCoverage: string[];
    topics: PossiblyNotLoaded<Topic>[];
    purposes: PossiblyNotLoaded<Purpose>[];
    audiences: PossiblyNotLoaded<Audience>[];
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}