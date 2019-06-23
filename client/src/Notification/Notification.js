import React from 'react';
import styled from 'styled-components';

import { convertIsoDateToNormal } from '../helpers';

const NotificationStyle = styled.section`
  background-color: orange;
  min-height: 100px;
  padding: 20px 20px;
  margin-bottom: 1em;
  border: 2px solid black;
  border-radius: 3px;
  display: flex;
  flex-direction: column;
  align-content: left;
  cursor: pointer;
`;

const TypeStyle = styled.span`
  &:first-letter {
    text-transform: capitalize;
  }
`;

const Notification = ({ data: notification }) => {
  return (
    <NotificationStyle title="Click to see full notification">
      <TypeStyle>
        [{notification.type} Issue] {notification.title}
      </TypeStyle>
      <br />
      <p>{notification.body}</p>
      <br />
      <p>{convertIsoDateToNormal(notification.created_at)}</p>
    </NotificationStyle>
  );
};

export default Notification;
