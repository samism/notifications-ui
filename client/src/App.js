import React from 'react';
import { createGlobalStyle } from 'styled-components';
import { Switch, Route } from 'react-router';

import NotificationFeed from './NotificationFeed';
import Notification from './Notification';
import NotificationModal from './NotificationModal';

const Reset = createGlobalStyle`
  html {
    box-sizing: border-box;
    font-size: 16px;
  }

  *, *:before, *:after {
    box-sizing: inherit;
    font-family: 'Helvetica';
  }

  body, h1, h2, h3, h4, h5, h6, p, ol, ul {
    margin: 0;
    padding: 0;
    font-weight: normal;
  }

  ol, ul {
    list-style: none;
  }

  img {
    max-width: 100%;
    height: auto;
  }
`;

function App() {
  return (
    <React.Fragment>
      <Reset />
      <Switch>
        <Route exact path="/" component={NotificationFeed} />
        <Route exact path="/notification/:id" component={Notification} />
        <Route exact path="/create" component={NotificationModal} />
      </Switch>
    </React.Fragment>
  );
}

export default App;
