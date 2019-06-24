import styled from 'styled-components';
import { Link } from 'react-router-dom';

const UnstyledLink = styled(Link)`
  color: black;
  text-decoration: none;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    color: black;
    text-decoration: none;
  }
`;

export default UnstyledLink;
