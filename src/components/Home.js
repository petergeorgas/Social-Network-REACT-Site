import React, { Component } from "react";
import ContentBlock from "./ContentBlock";
import authService from "../util/auth-service";
import { Redirect } from "react-router";
import NewPost from "./Posts/NewPost";
import Post from "./Posts/Post";

export class Home extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    this.signOut = this.signOut.bind(this);
  }

  signOut() {
    authService.logout();

    this.setState({
      redirect: true,
    });
  }

  getInitialState() {
    return {
      redirect: false,
    };
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to="/login" />;
    }
    return (
      <div>
        <NewPost />
        <Post />
        <input
          type="submit"
          name="submit"
          onClick={this.signOut}
          className="subBtn"
          value="Sign Out"
        />
      </div>
    );
  }
}

export default Home;
