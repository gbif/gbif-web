// https://github.com/react-icons/react-icons/issues/238
// SVJ => JSON using https://react-icons-json-generator.surge.sh/
import { GenIcon } from 'react-icons';

const clusterJson = { "tag": "svg", "attr": { "version": "1.1", "id": "Capa_1", "x": "0px", "y": "0px", "viewBox": "-202.4 314.1 200.8 201.2", "style": "enable-background:new -202.4 314.1 200.8 201.2;" }, "child": [{ "tag": "path", "attr": { "d": "M-35.7,469.5c8.6-10.4,14.7-22.9,17.7-36l14.6,3.3c-3.4,15.4-10.6,30-20.8,42.3L-35.7,469.5z M-40.5,334.9\n\tc-12.6-9.7-27.5-16.3-43-19.1l-2.7,14.8c13.2,2.4,25.9,8.1,36.6,16.3L-40.5,334.9z M-198.2,385.6l14.4,4.4\n\tc3.9-12.9,10.9-24.8,20.3-34.5l-10.8-10.4C-185.3,356.4-193.6,370.5-198.2,385.6z M-168.8,490c11.8,10.6,26.2,18.3,41.5,22.3\n\tl3.8-14.5c-13-3.4-25.2-10-35.3-19L-168.8,490z M-189.7,464l13.1-7.3c-6.6-11.7-10.3-25.1-10.8-38.6l-15,0.6\n\tC-201.9,434.5-197.4,450.2-189.7,464z M-140.7,338.5c12.1-6.2,25.2-9.4,39-9.4v-15c-15.9,0-31.7,3.8-45.8,11L-140.7,338.5z\n\t M-1.7,403.5c-1.8-15.7-7.3-31-16.1-44.3l-12.5,8.3c7.5,11.2,12.2,24.3,13.7,37.6L-1.7,403.5z M-94.2,515.3\n\tc15.8-1.2,31.3-6.2,44.8-14.4l-7.8-12.8c-11.5,7-24.7,11.3-38.1,12.3L-94.2,515.3z" }, "child": [] }, { "tag": "g", "attr": {}, "child": [{ "tag": "circle", "attr": { "cx": "-119.9", "cy": "451.9", "r": "27" }, "child": [] }, { "tag": "circle", "attr": { "cx": "-84.2", "cy": "377.5", "r": "27" }, "child": [] }] }] };
const cluster = GenIcon(clusterJson)
export const ClusterIcon = props => cluster(props);

const gbifLogoJson = { "tag": "svg", "attr": { "viewBox": "90 239.1 539.7 523.9" }, "child": [{ "tag": "path", "attr": { "d": "M325.5,495.4c0-89.7,43.8-167.4,174.2-167.4C499.6,417.9,440.5,495.4,325.5,495.4" }, "child": [] }, { "tag": "path", "attr": { "d": "M534.3,731c24.4,0,43.2-3.5,62.4-10.5c0-71-42.4-121.8-117.2-158.4c-57.2-28.7-127.7-43.6-192.1-43.6\n\tc28.2-84.6,7.6-189.7-19.7-247.4c-30.3,60.4-49.2,164-20.1,248.3c-57.1,4.2-102.4,29.1-121.6,61.9c-1.4,2.5-4.4,7.8-2.6,8.8\n\tc1.4,0.7,3.6-1.5,4.9-2.7c20.6-19.1,47.9-28.4,74.2-28.4c60.7,0,103.4,50.3,133.7,80.5C401.3,704.3,464.8,731.2,534.3,731" }, "child": [] }] };
const gbifLogo = GenIcon(gbifLogoJson)
export const GbifLogoIcon = props => gbifLogo(props);

const sampleEventJson = { "tag": "svg", "attr": { "version": "1.1", "id": "Layer_1", "x": "0px", "y": "0px", "viewBox": "0 0 35.7 35.7", "style": "enable-background:new 0 0 35.7 35.7;" }, "child": [{ "tag": "circle", "attr": { "cx": "17.6", "cy": "17.7", "r": "4.2" }, "child": [] }, { "tag": "path", "attr": { "d": "M3.4,3.6v28.3h28.3V3.6H3.4z M27.6,27.8H7.5V7.7h20.1V27.8z" }, "child": [] }] };
const sampleEvent = GenIcon(sampleEventJson)
export const SampleEventIcon = props => sampleEvent(props);

