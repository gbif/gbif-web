import { Asset } from "./asset";
import { Audience } from "./audience";
import { Link } from "./link";
import { Purpose } from "./purpose";
import { Topic } from "./topic";

export type News = {
    contentType: 'news';
    id: string;
    title: string;
    summary?: string;
    body?: string;
    primaryImage?: Asset;
    primaryLink?: Link;
    secondaryLinks: Link[];
    citation?: string;
    // Language codes
    countriesOfCoverage: string[];
    topics: Topic[];
    purposes: Purpose[];
    audiences: Audience[];
    keywords: string[];
    searchable: boolean;
    homepage: boolean;
}