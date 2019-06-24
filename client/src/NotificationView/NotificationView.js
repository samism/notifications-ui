import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router';
import styled from 'styled-components';

import Notification from '../Notification';

const NotificationViewStyle = styled.main`
  height: 100%;
  background-color: red;
  padding: 10px 2em 10px 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

class NotificationView extends Component {
  state = {
    notification: null,
    error: null,
    redirect: false
  };

  async componentDidMount() {
    const { id } = this.props.match.params;

    if (!(Number.isInteger(+id) && +id > 0)) {
      this.setState({ redirect: true });
      return;
    }

    try {
      const { data: notification } = await axios.get(
        `/api/v1/notification/${id}`
      );

      this.setState({ notification });
    } catch (error) {
      this.setState({ error });
    }
  }

  render() {
    const { redirect, notification } = this.state;

    if (redirect) {
      return <Redirect to="/" />;
    }

    return (
      notification && (
        <NotificationViewStyle>
          <Notification data={notification} />
        </NotificationViewStyle>
      )
    );
  }
}

export default NotificationView;
