import React, { Component } from 'react';
import styled from 'styled-components';
import axios from 'axios';

import Notification from '../Notification';
import HeaderText from '../HeaderText';
import AddNotificationButton from '../AddNotificationButton';
import UnstyledLink from '../UnstyledLink';

const FeedStyle = styled.main`
  height: 100vh;
  background-color: red;
  padding: 10px 2em 10px 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class NotificationFeed extends Component {
  state = {
    notifications: [],
    error: null
  };

  async componentDidMount() {
    try {
      const { data: notifications } = await axios.get('/api/v1/notifications');

      this.setState({ notifications });
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    const { notifications } = this.state;
    return (
      <FeedStyle>
        <HeaderText>Your Notifications</HeaderText>
        {notifications &&
          notifications.map(notification => (
            <Notification
              key={notification.notification_id}
              data={notification}
              url={`/notification/${notification.notification_id}`}
            />
          ))}
        <UnstyledLink to="/create">
          <AddNotificationButton />
        </UnstyledLink>
      </FeedStyle>
    );
  }
}

export default NotificationFeed;
