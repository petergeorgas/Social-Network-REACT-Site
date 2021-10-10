import React, { Component } from "react";
import { Redirect } from "react-router";
import ContentBlock from "./ContentBlock";

export class SuccessPage extends Component {
  constructor(props) {
    super(props);
    this.state = this.getInitialState();

    this.handleClickLogin = this.handleClickLogin.bind(this);
  }

  getInitialState() {
    return {
      redirect: false,
    };
  }

  handleClickLogin() {
    this.setState({
      redirect: true,
    });
  }

  render() {
    if (this.state.redirect) {
      return <Redirect to="/" />;
    }
    return (
      <ContentBlock>
        <h1>Success</h1>
        <p>
          Account has been successfully created. Please log in with your email
          and password.
        </p>
        <input
          type="submit"
          name="submit"
          onClick={this.handleClickLogin}
          className="subBtn"
          value="Log in"
        />
      </ContentBlock>
    );
  }
}

export default SuccessPage;
