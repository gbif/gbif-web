export type Notification = {
    title: string;
    summary?: string;
    body?: string;
    start: Date;
    end: Date;
    url?: string;
    notificationType: string;
    severity: string;
}

// {
//     "sys": {
//       "space": {
//         "sys": {
//           "type": "Link",
//           "linkType": "Space",
//           "id": "uo17ejk9rkwj"
//         }
//       },
//       "id": "notification",
//       "type": "ContentType",
//       "createdAt": "2017-08-16T10:13:34.901Z",
//       "updatedAt": "2017-11-24T09:34:58.130Z",
//       "environment": {
//         "sys": {
//           "id": "master",
//           "type": "Link",
//           "linkType": "Environment"
//         }
//       },
//       "revision": 11
//     },
//     "displayField": "title",
//     "name": "Notification",
//     "description": "for displaying temporary system health notifications to users (outages etc)",
//     "fields": [
//       {
//         "id": "title",
//         "name": "Title",
//         "type": "Symbol",
//         "localized": true,
//         "required": true,
//         "disabled": false,
//         "omitted": false
//       },
//       {
//         "id": "summary",
//         "name": "Summary",
//         "type": "Text",
//         "localized": false,
//         "required": true,
//         "disabled": false,
//         "omitted": false
//       },
//       {
//         "id": "body",
//         "name": "Body",
//         "type": "Text",
//         "localized": true,
//         "required": true,
//         "disabled": false,
//         "omitted": false
//       },
//       {
//         "id": "start",
//         "name": "Start",
//         "type": "Date",
//         "localized": false,
//         "required": true,
//         "disabled": false,
//         "omitted": false
//       },
//       {
//         "id": "end",
//         "name": "End",
//         "type": "Date",
//         "localized": false,
//         "required": true,
//         "disabled": false,
//         "omitted": false
//       },
//       {
//         "id": "url",
//         "name": "Url",
//         "type": "Symbol",
//         "localized": false,
//         "required": false,
//         "disabled": false,
//         "omitted": false
//       },
//       {
//         "id": "notificationType",
//         "name": "Notification Type",
//         "type": "Symbol",
//         "localized": false,
//         "required": true,
//         "disabled": false,
//         "omitted": false
//       },
//       {
//         "id": "severity",
//         "name": "Severity",
//         "type": "Symbol",
//         "localized": false,
//         "required": true,
//         "disabled": false,
//         "omitted": false
//       }
//     ]
//   },