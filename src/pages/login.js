import React from 'react';
import { Form, Icon, Input, Button } from 'antd';
import logo from '../assets/qingyoulogo.svg';
import Alert from '../components/alert';
import { userLogin, userLogout } from '../api/user';

const FormItem = Form.Item;
const styleComponent = {
  LoginContainer: {
    display: 'flex',
    width: '100vw',
    height: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  LogoContainer: {
    marginTop: '20vh',
    marginBottom: '64px'
  },
  LoginForm: {
    width: '300px'
  },
  LoginFormButton: {
    width: '100%'
  }
};
class NormalLoginForm extends React.Component {
  constructor() {
    super();
    this.state = {
      username: '',
      password: '',
      passwordWrong: false,
      errMsg: '',
      isLogin: false
    };
  }

  componentDidMount() {
    const TOKEN = localStorage.getItem('token');
    this.setState({ isLogin: !!TOKEN });
  }

  handleUsername = ({ target: { value: username } }) => {
    this.setState({ username });
  };

  handlePassword = ({ target: { value: password } }) => {
    this.setState({ password });
  };

  handleSubmit = e => {
    const { username, password } = this.state;
    userLogin(username, password)
      .then(({ data: { success, data, errMsg } }) => {
        if (success) {
          localStorage.setItem('token', data);
          this.setState({ isLogin: true });
        } else {
          this.setState({ passwordWrong: true, errMsg });
        }
      })
      .catch(errMsg => this.setState({ errMsg }));
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  };

  /**
   * 退出登录
   */
  logOutPress = () => {
    this.setState({ isLogin: false });
    localStorage.clear();
    userLogout(localStorage.getItem(`token`)).then(res => {
      console.log(res);
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const { passwordWrong, errMsg, isLogin } = this.state;
    return (
      <div style={styleComponent.LoginContainer}>
        {passwordWrong ? <Alert errMsg={errMsg} /> : null}
        <div style={styleComponent.LogoContainer}>
          <img src={logo} alt="" />
        </div>
        {isLogin ? (
          <div style={styleComponent}>
            <Button type="primary" size="large" onClick={this.logOutPress}>
              退出登录
            </Button>
          </div>
        ) : (
          <Form onSubmit={this.handleSubmit} style={styleComponent.LoginForm}>
            <FormItem>
              {getFieldDecorator('userName', {
                rules: [
                  { required: true, message: 'Please input your username!' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  onChange={this.handleUsername}
                  placeholder="Username"
                />
              )}
            </FormItem>
            <FormItem>
              {getFieldDecorator('password', {
                rules: [
                  { required: true, message: 'Please input your Password!' },
                  { passwordWrong: false, message: '密码错误' }
                ]
              })(
                <Input
                  prefix={
                    <Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />
                  }
                  onChange={this.handlePassword}
                  type="password"
                  placeholder="Password"
                />
              )}
            </FormItem>
            <FormItem>
              <Button
                type="primary"
                htmlType="submit"
                style={styleComponent.LoginFormButton}
              >
                Log in
              </Button>
            </FormItem>
          </Form>
        )}
      </div>
    );
  }
}

const QyLogin = Form.create()(NormalLoginForm);
export default QyLogin;