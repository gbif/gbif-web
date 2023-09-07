export type Image = {
    file: {
        url: string;
        details: {
            size: number;
            width: number;
            height: number;
        };
        fileName: string;
        contentType: string;
    };
    description?: string;
    title?: string;
}

export type CountryWithTitle = {
    id: string;
    country: string;
    title: string;
}

export type Document = {
    file: {
        url: string;
        details: {
            size: number;
        };
        fileName: string;
        contentType: string;
    };
    description?: string;
    title?: string;
}

export type Link = {
    label: string;
    url: string;
}

export type PossiblyNotLoaded<T> = T | { id: string };