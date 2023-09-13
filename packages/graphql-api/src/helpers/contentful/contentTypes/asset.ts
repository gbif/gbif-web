export type Asset = {
    contentType: 'asset';
    file: {
        url: string;
        details: {
            size: number;
            width?: number;
            height?: number;
        };
        fileName: string;
        contentType: string;
    };
    description?: string;
    title?: string;
}
