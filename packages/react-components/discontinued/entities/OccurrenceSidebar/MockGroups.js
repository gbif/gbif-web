import React from 'react';
import { Accordion, Properties } from '../../components';
const { Term: T, Value: V } = Properties;

export const MockGroups = () => <>
  <Accordion summary="Record (everything below is nonsense data)" defaultOpen={true}>
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
        <img style={{border: '1px solid #aaa', width: '30%', position: 'absolute', bottom: 0, right: 0}} src="https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+dedede(-73.7638,42.6564)/-73.7638,42.6564,4,0/200x100@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA"/>
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
      <T>Event ID</T><V>https://plutof.ut.ee/#/event/view/286 (18 occurrences =&gt;)</V>
    </Properties>
  </Accordion>
  <Accordion summary="Identification" defaultOpen={true}>
    <Properties style={{ fontSize: 13, marginBottom: 12 }} horizontal={true}>
      <T>Date identified</T><V>2009 May 18</V>
      <T>Identification ID</T><V>989698</V>
    </Properties>
  </Accordion>
</>