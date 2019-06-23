import React from 'react';

import NotificationFeed from './NotificationFeed';
import HeaderText from './HeaderText';

function App() {
  return (
    <React.Fragment>
      <HeaderText>Your Notifications</HeaderText>
      <NotificationFeed />
    </React.Fragment>
  );
}

export default App;
