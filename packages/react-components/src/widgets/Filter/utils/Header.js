/** @jsx jsx */
import { css, jsx } from '@emotion/core';
import React from "react";
import { Row, Col, Button, Menu } from '../../../components';
import { MdMoreVert } from "react-icons/md";

const Header = ({ children, menuItems, ...props }) => {
  return <Row as="section" {...props} css={header} alignItems="center">
    <Col>
      {children}
    </Col>
    {menuItems && <Col grow={false}>
      <Menu
        aria-label="Custom menu"
        trigger={<Button appearance="text"><MdMoreVert style={{ fontSize: 24 }} /></Button>}
        items={menuItems}
      />
    </Col>}
  </Row >
}

const header = css`
  border-bottom: 1px solid #eee;
  padding: 1.2em 1.5em;
  flex: 0 0 auto;
`;

export default Header;