import React from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { withRouter } from 'react-router-dom';

import StyledButton from '../StyledButton';

const StyledModalPage = styled.main`
  height: 100vh;
  background-color: red;
  padding: 10px 2em 10px 2em;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const StyledModal = styled.aside`
  width: 50%;
  border: 2px solid white;
  border-radius: 3px;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 2em 4em;

  form {
    display: flex;
    flex-direction: column;
    align-items: left;

    label {
      color: white;
      border-radius: 3px;
      font-size: 20px;
    }

    input,
    select {
      border-radius: 3px;
      font-size: 20px;
      padding: 5px 10px;
    }
  }
`;

const NotificationModal = ({ history }) => {
  const createNotification = async event => {
    event.preventDefault();

    const { title, body, type } = event.target;

    try {
      const { data: response } = await axios.post('/api/v1/notification', {
        notification: {
          title: title.value,
          body: body.value,
          issue_type_id: type.value
        }
      });

      return response;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <StyledModalPage>
      <h1>Create a Notification</h1>
      <br />
      <StyledModal>
        <form
          onSubmit={event => {
            if (createNotification(event)) {
              history.push('/');
            }
          }}
        >
          <label>
            Title:&nbsp;
            <input type="text" name="title" autoFocus required />
          </label>
          <br />
          <label>
            Body:&nbsp;
            <input type="text" name="body" required />
          </label>
          <br />
          <label>
            Type:&nbsp;
            <select name="type">
              <option value="1">Data</option>
              <option value="2">Config</option>
            </select>
          </label>
          <br />
          <br />
          <StyledButton type="submit">Submit</StyledButton>
        </form>
      </StyledModal>
    </StyledModalPage>
  );
};

export default withRouter(NotificationModal);
