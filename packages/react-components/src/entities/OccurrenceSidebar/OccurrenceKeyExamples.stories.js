import React from 'react';
// import { text, boolean, select } from '@storybook/addon-knobs';
import { Accordion, Properties } from '../../components';
const { Term: T, Value: V } = Properties;

export default {
  title: 'Entities/Occurrence examples',
};

export const OccurrenceGroupsMock = () => <div>
  <Accordion summary="Record" defaultOpen={true}>
    <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
      <T>Basis of record</T><V>Human observation</V>
    </Properties>
  </Accordion>
  <Accordion summary="Taxon" defaultOpen={true}>
    <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
      
      <T>Scientific name</T><V>
        <Properties>
        <T>Interpreted</T>
        <V>Xanthoria parietina (L.) Th.Fr. <span style={{background: '#ffee90', borderRadius: 20, fontSize: '10px', display: 'inline-block', padding: '0 8px'}}>Fuzzy taxon match</span></V>
        <T>Verbatim</T>
        <V>Xanthoria pareitina (L) Th.Fr.</V>
        </Properties>
        </V>
      <T>Classification</T><V>Fungi > Ascomycota > Lecanoromycetes > Teloschistales > Teloschistaceae > Xanthoria</V>
      <T>Rank</T><V>Species</V>
      <T>Taxonomic status	</T><V>Synonym for Xanthoria parietina (L.) Beltr.</V>
    </Properties>
  </Accordion>
  <Accordion summary="Location" defaultOpen={true}>
    <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
      <T>Coordinates</T>
      <V>
        <div style={{maxWidth: '100%', position: 'relative'}}>
        <img style={{display: 'block', maxWidth: '100%'}} src="https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(-73.7638,42.6564)/-73.7638,42.6564,13,0/600x300@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA"/>
        <img style={{border: '1px solid #aaa', width: '30%', position: 'absolute', bottom: 0, right: 0}} src="https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+949494(-73.7638,42.6564)/-73.7638,42.6564,4,0/200x100@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA"/>
        </div>
        <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
          <T>Lat/Lon</T><V>12.1N 15.24E ±5000m https://staticmapmaker.com/mapbox/</V>
        </Properties>
      </V>
      <T>Country or area</T><V>Estonia</V>
      <T>County</T><V>Lääne-Viru maakond</V>
      <T>Municipality</T><V>Vihula vald</V>
    </Properties>
  </Accordion>
  <Accordion summary="Occurrence" defaultOpen={true}>
    <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
      <T>Individual count</T><V>1</V>
      <T>Organism quantity</T>
      <V><Properties horizontal><T>individuals</T><V>1</V></Properties></V>
      <T>Recorded by</T><V>Ede Oja</V>
    </Properties>
  </Accordion>
  <Accordion summary="Event" defaultOpen={true}>
    <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
      <T>Event date</T><V>2009 May 18</V>
      <T>Event ID</T><V>https://plutof.ut.ee/#/event/view/286 (18 occurrences =>)</V>
    </Properties>
  </Accordion>
  <Accordion summary="Identification" defaultOpen={true}>
    <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
      <T>Date identified</T><V>2009 May 18</V>
      <T>Identification ID</T><V>989698</V>
    </Properties>
  </Accordion>
</div>

export const Example = () => <div style={{background: '#fff', width: 700, fontSize: '13px', padding: 32}}>
  Based on https://www.gbif.org/occurrence/1147311717.
  <br />
  <br />
  <strong>Group fields into one property</strong><br />
  I was wondering if we should try to collapse more fields into 1. 
  Taxonomy being a good example. Also e.g. lat/lng/uncertainty/Geodetic datum.
  <br />
  Exactly which fields would make sense to collapse we would need to consider - this is just an idea.
  <br />
  <br />
  <strong>Hide fields</strong><br />
  Also we could consider hiding some fields per default. E.g.<br />
  * day/month/year since we show full date<br />
  * eventID if only one event and no sampling protocol (then it is probably just filled in for the sake of it)<br />
  * institution code if it isn't a specimen (data is often filled despite being meaningless)<br />
  <br />
  <strong>Option to show all</strong><br />
  We could then have a toggle to show the remaining fields and possibly ungroup them - that is show day/month/year etc (and store the choice for the future)<br />
  <br />
  <strong>Show verbatim when there are related issues</strong><br />
  For fields that we do show and there is an issue related to the field, then we could show both the interpreted and the verbatim name along with the issue.
  <br />
  <br />
  <strong>Show verbatim toggle</strong><br />
  Option to show all data incl verbatim. This would be similar to gbif.org
  <br />
  <br />
  <OccurrenceGroupsMock />
</div>;

Example.story = {
  name: 'Occurrence std view',
};
