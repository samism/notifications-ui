import React from 'react';
import styled from 'styled-components';

const HeaderTextStyle = styled.h1`
  text-align: center;
  padding: 1em 0 1em 0;
`;

const HeaderText = ({ children }) => (
  <HeaderTextStyle>{children}</HeaderTextStyle>
);

export default HeaderText;
