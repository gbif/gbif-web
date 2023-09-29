export type Notification = {
    contentType: 'notification';
    id: string;
    title: string;
    summary?: string;
    body?: string;
    start: Date;
    end?: Date;
    url?: string;
    // TODO: Should probably be an enum
    notificationType: string;
    // TODO: Should probably be an enum
    severity: string;
}