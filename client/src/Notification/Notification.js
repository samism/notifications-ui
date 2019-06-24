import React from 'react';
import styled from 'styled-components';

import { convertIsoDateToNormal } from '../helpers';
import UnstyledLink from '../UnstyledLink';

const NotificationStyle = styled.section`
  background-color: orange;
  min-height: 100px;
  min-width: 275px;
  padding: 20px 20px;
  margin-bottom: 1em;
  border: 2px solid black;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-content: left;
  cursor: pointer;
`;

const TypeStyle = styled.p`
  &:first-letter {
    text-transform: capitalize;
  }
`;

const Notification = ({ data: notification, url = '/' }) => {
  return (
    <NotificationStyle title="Click to see full notification">
      <UnstyledLink to={url}>
        <TypeStyle>
          [{notification.type} Issue] {notification.title}
        </TypeStyle>
        <br />
        <p>{notification.body}</p>
        <br />
        <p>{convertIsoDateToNormal(notification.created_at)}</p>
      </UnstyledLink>
    </NotificationStyle>
  );
};

export default Notification;
