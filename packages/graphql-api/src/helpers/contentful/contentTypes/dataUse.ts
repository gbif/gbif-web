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
    primaryImage?: Asset;
    primaryLink?: Link;
    secondaryLinks: Link[];
    citation?: string;
    resourceUsed?: string;
    // Language codes
    countriesOfResearchers: string[];
    // Language codes
    countriesOfCoverage: string[];
    topics: Topic[];
    purposes: Purpose[];
    audiences: Audience[];
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}