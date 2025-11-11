import { jsx } from '@emotion/react';
import { css } from '@emotion/react';

import { number } from "@storybook/addon-knobs";
import { withA11y } from "@storybook/addon-a11y";
import React from "react";
import { MemoryRouter as Router, Route } from "react-router-dom";
import AddressBar from "../../StorybookAddressBar"
import { Toc } from "./Toc";

export default {
  title: "Components/Toc",
  component: Toc,
  decorators: [withA11y],
};

const options = {
  primary: "primary",
  primaryOutline: "primaryOutline",
  outline: "outline",
  danger: "danger",
};

const paragraphs = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

export const Default = () => {

const offsetTop = number('Offset top', 50);

  let tocRefs = {};
  return (
      <Router initialEntries={[`/`]}>
            <AddressBar style={{position: 'sticky', top: 0}}/>

    <div >
    <div css={withSideBar}>
      <div css={sideBar}>
        <Toc refs={tocRefs} ></Toc>
      </div>
      <div>
      <h2 style={{scrollMarginTop: `${offsetTop}px`}} ref={node => { tocRefs["lorem-ipsum"] = node; }}>Lorem ipsum</h2>
        {paragraphs.map(i => <p key={i}>Lorem ipsum dolor sit amet, ei pri feugiat consectetuer. Vix natum timeam ea, nec ne dicat quaeque definitionem. Insolens partiendo corrumpit no his. Assentior vituperatoribus vel ad, cu reformidans neglegentur eos, duo et nostrud diceret similique. Lorem ipsum dolor sit amet, ei pri feugiat consectetuer. Vix natum timeam ea, nec ne dicat quaeque definitionem. Insolens partiendo corrumpit no his. Assentior vituperatoribus vel ad, cu reformidans neglegentur eos, duo et nostrud diceret similique.</p>
)}
        <h2 style={{scrollMarginTop: `${offsetTop}px`}} ref={node => { tocRefs["vim-quis"] = node; }}>Vim quis</h2>
        {paragraphs.map(i => <p key={i}>Vim quis everti no, nec ut comprehensam necessitatibus, aliquid voluptatum nam an. Est tation euismod scaevola cu. Pro ut sensibus eleifend deseruisse, id dolore mentitum cum. Has velit singulis moderatius cu, sea magna senserit reprehendunt te.</p>)}
        <h2 style={{scrollMarginTop: `${offsetTop}px`}} ref={node => { tocRefs["no-soleat"] = node; }}>No soleat</h2>
        {paragraphs.map(i => <p key={i}> No soleat nostrud reprehendunt vel, mei vitae decore suscipit id. Eius iracundia sadipscing no vix. Ei delenit debitis sententiae mei, eam an prima democritum. Nisl vitae in mei, eros quaeque pro at.</p>)}
        <h2 style={{scrollMarginTop: `${offsetTop}px`}} ref={node => { tocRefs["ad-eius"] = node; }}>Ad eius</h2>
        {paragraphs.map(i => <p key={i}>Ad eius invenire has. Dolorum ponderum pertinacia ut vix. Hendrerit aliquando te vix, oblique luptatum an quo. Duo et prompta denique. Ex probo legere incorrupte eos, pro id case omnes inermis, duo ad decore blandit appetere.</p>)}
        <h2 style={{scrollMarginTop: `${offsetTop}px`}} ref={node => { tocRefs["errem-labore"] = node; }}>Errem labore</h2>
        {paragraphs.map(i => <p key={i}>Errem labore everti ne ius. Noster suavitate contentiones ut ius, sumo debitis quo ei. Eum id idque periculis, eu sed explicari dissentiet. Aliquip omittantur vix id, vero inciderint per id.</p>)}
      </div>
    </div>
    </div>
    </Router>
  );
};



Default.story = {
  name: "Toc",
};

const sideBar = ({ ...props }) => css`
  flex: 0 0 250px;
  padding-top: 12px;
  margin: 0;
  font-size: 14px;
  position: sticky;
  top: 0;
  align-self: flex-start;
  height: 100%;
`;

const withSideBar = ({ ...props }) => css`
  display: flex;
  /* margin: 0 12px; */
`;

const sideBarNav = ({ ...props }) => css`
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