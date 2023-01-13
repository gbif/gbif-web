import { jsx, css } from '@emotion/react';
import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from 'react-use';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Card, CardHeader2, GrSciCollMetadata as Metadata, SideBarLoader, MapThumbnail } from '../../shared';
import { Properties, Switch as Toggle, Property, ResourceLink, Image, HyperText, ListItem, Prose, Tag } from "../../../components";
import useBelow from '../../../utils/useBelow';
import sortBy from 'lodash/sortBy';
import { MdMailOutline as MailIcon, MdPhone as PhoneIcon, MdHelp } from 'react-icons/md';
import { TopTaxa, TopCountries, TotalAndDistinct } from '../../shared/stats';
import { HashLink } from 'react-router-hash-link';
import { Groups } from './Groups';
import { Material } from '../Material';
import { Assertions } from '../Assertions';
import { DataTable } from '../DataTable';
import { Identifications } from '../Identifications';
import { Media } from './Media';
import { Sequences } from './Sequences';
import { Location } from './Location';

const { Term: T, Value: V, EmptyValue } = Properties;
const Name2Avatar = ListItem.Name2Avatar;

export function Core({
  data = {},
  loading,
  error,
  specimen,
  occurrenceSearch,
  className,
  ...props
}) {
  const hideSideBar = useBelow(100);
  const [toc, setToc] = useState({});

  const lat = 55.50571;
  const lon = 9.48711;

  useEffect(() => {
    setToc({});
  }, []);// make sure it updates in data change

  const addSection = useCallback((section) => {
    // console.log(toc);
    // if (!toc[section]) {
    //   const newToc = {...toc, [section]: true};
    //   debugger;
    //   setToc(newToc)
    // }
  }, []);



  return <div>

    <div css={css`padding-bottom: 100px; display: flex; margin: 0 -12px;`}>
      {!hideSideBar && <aside css={css`flex: 0 0 280px; margin: 0 12px;`}>
        <Card style={{ padding: 0, marginBottom: 12 }}>
          <div css={mapThumb}>
            <img src={`https://api.mapbox.com/styles/v1/mapbox/light-v9/static/pin-s-circle+285A98(${lon},${lat})/${lon},${lat},5,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`} />
            <img className="gb-on-hover"
              src={`https://api.mapbox.com/styles/v1/mapbox/outdoors-v11/static/pin-s-circle+285A98(${lon},${lat})/${lon},${lat},11,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
            />
            <div className="gb-capped"></div>
            <img
              src={`https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/pin-s-circle+285A98(${lon},${lat})/${lon},${lat},13,0/250x180@2x?access_token=pk.eyJ1IjoiaG9mZnQiLCJhIjoiY2llaGNtaGRiMDAxeHNxbThnNDV6MG95OSJ9.p6Dj5S7iN-Mmxic6Z03BEA`}
            />
            <HashLink to="#location" replace></HashLink>
          </div>
          <nav css={sideNav()}>
            <ul>
              {/* <Li to="#summary">Summary</Li>
              <Separator /> */}
              <Li toc={toc} to="#images">Images</Li>
              <Li toc={toc} to="#specimen">Preserved specimen</Li>
              <Li toc={toc} to="#identification">Identification</Li>
              <Li toc={toc} to="#assertions">Assertions</Li>
              <Li toc={toc} to="#sequences">Sequences</Li>
              <Li toc={toc} to="#location">Location</Li>
              <Li toc={toc} to="#organism">Organism</Li>
              <Li toc={toc} to="#relationsships">Relationsships</Li>
              <Li toc={toc} to="#other">Other</Li>
              <Separator />
              {/* <Li style={{ color: '#888', fontSize: '85%' }}>Extensions</Li> */}
              <Li toc={toc} to="#identification">Identifiers</Li>
              <Li toc={toc} to="#gel-image">Literature</Li>
              <Li toc={toc} to="#loan">References <Tag type="light">3</Tag></Li>
              <li style={{ borderBottom: '1px solid #eee' }}></li>
              <Li to="#citation">How to cite</Li>
            </ul>
            {/* <div onClick={() => setShowAll(!showAll)}>Toggle debug view</div> */}
          </nav>
        </Card>
      </aside>}

      <div css={css`flex: 1 1 auto; margin: 0 12px;`}>
        <div css={css`display: flex; align-items: center; margin-bottom: 8px;`}>
          <label css={css`margin-inline-end: 8px;`}>
            <Toggle /> <FormattedMessage id="specimen.extendedView" defaultMessage="Extended view" />
          </label>
          <MdHelp />
        </div>
        <Media updateToc={addSection} specimen={specimen} />
        <Sequences updateToc={addSection} specimen={specimen} />
        <Location updateToc={addSection} specimen={specimen} />
        <Material css={css`margin-bottom: 24px; margin-top: 24px;`} />
        <Assertions css={css`margin-bottom: 24px;`} />
        <Identifications css={css`margin-bottom: 24px;`} />
      </div>
    </div>
  </div>
};

function Li({ to, toc, children, ...props }) {
  if (to) {
    // if (toc && !toc[to.substr(1)]) {
    //   return null;
    // }
    return <li css={sideNavItem()} {...props}>
      <HashLink to={to} replace>{children}</HashLink>
    </li>
  }
  return <li css={sideNavItem()} {...props} children={children} />
}

function Separator(props) {
  return <li style={{ borderBottom: '1px solid #eee' }}></li>
}

const mapThumb = css`
  position: relative;
  .gb-on-hover {
    position: absolute;
    opacity: .001;
    transition: opacity 300ms ease;
  }
  &:hover {
    .gb-on-hover {
      opacity: 1;
    }
  }

  .gb-capped {
    width: 20%;
    height: 26%;
    top: 30%;
    left: 40%;
    position: absolute;
    opacity: .001;
    transition: opacity 300ms ease;
    background: tomato;
    z-index: 100;
    &:hover {
      + img {
        opacity: 1;
      }
    }
     + img {
      position: absolute;
      opacity: 0;
      transition: opacity 300ms ease;
    }
  }
  
  div, img, a {
    top: 0;
    width: 100%;
    margin-bottom: 12px;
    display: block;
  }
  a {
    position: absolute;
    height: 100%;
  }
`;

const sideNav = ({ ...props }) => css`
  background: white;
  margin-bottom: 12px;
  border-radius: 4px;
  overflow: hidden;
  padding: 4px;
  ul {
    list-style: none;
    padding: 0;
    margin: 0;
  }
`;

const sideNavItem = ({ ...props }) => css`
  padding: 8px 12px;
  line-height: 1em;
  display: block;
  color: inherit;
  width: 100%;
  text-align: left;
  text-decoration: none;
  a {
    color: inherit;
    text-decoration: none;
  }
  &.isActive {
    background: #e0e7ee;
    font-weight: 500;
  }
`;