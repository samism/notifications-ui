import React, { Component } from 'react';

class NotificationFeed extends Component {
  state = {
    value: null
  };

  async componentDidMount() {
    const apiTest = await fetch('/api/ping')
      .then(function(response) {
        return response.clone().json();
      })
      .catch(function(error) {
        console.error('Error!', error);
      });

    this.setState({
      value: apiTest.status
    });
  }

  render() {
    return <p>{this.state.value || 'not loaded'}</p>;
  }
}

export default NotificationFeed;
