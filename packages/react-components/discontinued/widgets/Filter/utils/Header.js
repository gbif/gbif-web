
import { css, jsx } from '@emotion/react';
import React, { useContext } from "react";
import { Row, Col, Button, Menu } from '../../../components';
import { MdMoreVert } from "react-icons/md";
import ThemeContext from '../../../style/themes/ThemeContext';

const Header = ({ children, menuItems, labelledById, ...props }) => {
  const theme = useContext(ThemeContext);
  return <Row as="section" {...props} css={header({theme})} alignItems="center">
    <Col aria-labelledby={labelledById}>
      {children}
    </Col>
    {menuItems && <Col grow={false}>
      <Menu
        aria-label="Custom menu"
        trigger={<Button appearance="text"><MdMoreVert style={{ fontSize: 24, color: theme.color800 }} /></Button>}
        items={menuItems}
      />
    </Col>}
  </Row >
}

const header = ({theme}) => css`
  border-bottom: 1px solid ${theme.paperBorderColor};
  padding: 1.2em 1.5em;
  flex: 0 0 auto;
`;

export default Header;