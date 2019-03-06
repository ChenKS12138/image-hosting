import React, { Component } from 'react';
import { notification, Icon } from 'antd';

export default class QyAlert extends Component {
  componentDidUpdate(prevProps) {
    if (prevProps.error !== this.props.error) {
      this.notification(this.props.error);
    }
  }

  notification = error => {
    notification.open({
      message: '通知消息🍋',
      description: error,
      duration: 6,
      icon: <Icon type="bulb" style={{ color: '#108ee9' }} />
    });
  };

  render() {
    const { error } = this.props;
    if (error) {
      this.notification(error);
    }
    return <div />;
  }
}
