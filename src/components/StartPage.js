import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Redirect } from "react-router";
import ContentBlock from "./ContentBlock";
import PasswordStrengthBar from "react-password-strength-bar";
import axios from "axios";

const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);
let mounted = false;

export class StartPage extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    // Bind handleChange to the class,
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    mounted = true;
    console.log("Component mounted!");
  }

  componentWillUnmount() {
    mounted = false;
    console.log("Component will unmount!");
  }

  getInitialState() {
    return {
      email: "",
      pass: "",
      checked: false,
      invalid: false,
      errorText:
        "Incorrect credentials. Please check your password and try again.",
      redirect: false,
    };
  }

  // Case 1: No email provided.
  // Case 2: No password provided.
  // Case 3: Email and password provided
  // Case 3a: No account exists for email
  // Case 3b: Wrong password
  // Case 3c: Correct login
  handleLogin() {
    if (this.state.email.length === 0) {
      // No email provided
      console.log("No Email");
      this.setState({
        invalid: true,
        errorText: "Please provide an email address.",
      });
      return;
    } else if (!emailRegex.test(this.state.email)) {
      // Email field populated, invalid email
      this.setState({
        invalid: true,
        errorText: "Please provide a valid email address.",
      });
      return;
    }

    // No password provided
    if (this.state.pass.length === 0) {
      this.setState({
        invalid: true,
        errorText: "Please provide a password.",
      });
      return;
    }

    // Both valid email and password provided

    // POST login to API endpoint
    let user = { email: this.state.email, pass: this.state.pass };
    this.attemptLogin(user);
  }

  attemptLogin(user) {
    axios
      .post("http://localhost:3000/api/auth/login", user)
      .then((res) => {
        if (mounted) {
          if (res.status === 200) {
            localStorage.setItem("user", JSON.stringify(res.data));
            this.props.update();
            this.setState({ redirect: true });
          } else {
            this.setState({ invalid: true });
          }
        }
      })
      .catch((err) => {
        const res = err.response;
        // If the status code is not 200, we're NOT OK...
        if (mounted && res.status) {
          this.setState({ invalid: true });
        }
      });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.type === "checkbox" ? target.checked : target.value;
    const name = target.name;

    console.log(value);
    this.setState({
      [name]: value,
    });
  }

  render() {
    if (this.state.redirect) {
      console.log("redirect to home!");
      return <Redirect to="/home" />;
    }

    return (
      <ContentBlock>
        <h3>uNet</h3>
        <p>
          uNet is a basic social network that allows anyone, anywhere to post a
          message to a board. This is a demo project for a MERN stack
          application. All actions on this site communicate with a REST API
          written with Express and running on a Node.js server.
        </p>
        <p
          className="invalidField"
          style={{ display: this.state.invalid ? "" : "none" }}
        >
          {this.state.errorText}
        </p>
        <input
          id="email"
          type="email"
          name="email"
          placeholder="Email"
          className="formField"
          required="true"
          onChange={this.handleChange}
          value={this.state.email}
        />

        <input
          id="pass"
          name="pass"
          type="password"
          placeholder="Password"
          className="formField"
          required="true"
          onChange={this.handleChange}
          value={this.state.pass}
        />
        <div className="rememberLine">
          <input
            id="rememberMe"
            type="checkbox"
            name="checked"
            checked={this.state.checked}
            onChange={this.handleChange}
            className="rememberChk"
            value="remember"
          />
          <label id="rememberMeLbl" for="rememberMe">
            Remember me{" "}
          </label>
          <p id="signUp">
            Don't have an account?{" "}
            <Link className="sgnUpLink" to="/register">
              Sign up
            </Link>
            .
          </p>
        </div>
        <input
          type="submit"
          name="submit"
          onClick={this.handleLogin}
          className="subBtn"
          value="Log in"
        />
      </ContentBlock>
    );
  }
}

export default StartPage;
