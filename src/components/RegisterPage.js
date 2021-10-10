import React, { Component } from "react";
import { Link } from "react-router-dom";
import ContentBlock from "./ContentBlock";
import states from "../extra/states.json";
import PasswordStrengthBar from "react-password-strength-bar";
import SelectUSState from "react-select-us-states";
import { Redirect } from "react-router";
import SuccessPage from "./SuccessPage";
import axios from "axios";

const emailRegex = new RegExp(
  /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
);

const numberRegex = new RegExp(/^[0-9]*$/);

let mounted = false;

export class StartPage extends Component {
  constructor(props) {
    super(props);

    this.state = this.getInitialState();

    // Bind handleChange to the class,
    this.handleChange = this.handleChange.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.handleStateDropdownChange = this.handleStateDropdownChange.bind(this);
    this.onZipKeyDown = this.onZipKeyDown.bind(this);
    this.onChangeScore = this.onChangeScore.bind(this);
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
      email: {
        value: "",
        invalid: false,
      },
      pass: {
        value: "",
        invalid: false,
        goodScore: false,
      },
      firstName: {
        value: "",
        invalid: false,
      },
      lastName: {
        value: "",
        invalid: false,
      },
      address: {
        value: "",
        invalid: false,
      },
      city: {
        value: "",
        invalid: false,
      },
      zipCode: {
        value: "",
        invalid: false,
      },
      state: {
        value: "State",
        invalid: false,
      },
      invalidField: false,
      errorText: "Please fill out all fields.",
      redirect: false,
    };
  }

  onChangeScore(score, feedback) {
    console.log(score, feedback);
    if (score >= 3) {
      this.setState({
        pass: {
          value: this.state.pass.value,
          invalid: this.state.pass.invalid,
          goodScore: true,
        },
      });
    } else {
      this.setState({
        pass: {
          value: this.state.pass.value,
          invalid: this.state.pass.invalid,
          goodScore: false,
        },
      });
    }
  }

  onZipKeyDown(event) {
    var key = event.key; //  Retrieve the key that was pressed...
    if (
      (typeof this.state.zipCode.value != "undefined" &&
        this.state.zipCode.value.length + 1 > 5 &&
        key !== "Backspace" &&
        key !== "Tab") ||
      (!numberRegex.test(key) && key !== "Backspace" && key !== "Tab")
    ) {
      event.preventDefault();
    }
  }

  async handleLogin(event) {
    event.preventDefault();
    var isInvalidFieldPresent = false;
    Object.entries(this.state).forEach(([key, value]) => {
      if (
        value !== this.state.redirect &&
        value !== this.state.errorText &&
        value !== this.state.invalidField
      ) {
        if (
          value.value === "" ||
          (key === "state" && value.value === "State")
        ) {
          this.setState({
            [key]: { value: value.value, invalid: true },
          });
          isInvalidFieldPresent = true;
        } else {
          this.setState({
            [key]: { value: value.value, invalid: false },
          });
        }
      }
    });

    if (isInvalidFieldPresent) {
      this.setState({
        invalidField: true,
        errorText: "Please fill out all fields.",
      });
      return;
    }

    if (!emailRegex.test(this.state.email.value)) {
      this.setState({
        email: { invalid: true },
        invalidField: true,
        errorText: "Please enter a valid email.",
      });
      return;
    }

    if (this.state.zipCode.value.length !== 5) {
      this.setState({
        zipCode: { value: this.state.zipCode.value, invalid: true },
        invalidField: true,
        errorText: "Please enter a valid ZIP code.",
      });
      return;
    }

    if (!this.state.pass.goodScore) {
      console.log("Password does not meet strength requirements.");
      this.setState({
        pass: { value: "", invalid: true, goodScore: false },
        invalidField: true,
        errorText: "Password does not meet strength requirements.",
      });

      return;
    }

    // POST this account data to our REST API and hope we get a good response.

    var postBody = {
      firstName: this.state.firstName.value,
      lastName: this.state.lastName.value,
      address: this.state.address.value,
      city: this.state.city.value,
      state: this.state.state.value,
      zipCode: this.state.zipCode.value,
      email: this.state.email.value,
      pass: this.state.pass.value,
    };

    //this.setState({ redirect: true });
    this.postAccount(postBody);
    // Otherwise, display the error. =3
  }

  postAccount(info) {
    axios
      .post("http://localhost:3000/api/auth/register", info)
      .then((res) => {
        if (mounted) {
          if (res.status === 200) {
            this.setState({ redirect: true });
          } else {
            this.setState({
              invalidField: true,
              errorText:
                "Error POSTing form data. Please try submitting again.",
            });
          }
        }
      })
      .catch((err) => {
        const resp = err.response;
        if (mounted && resp && resp.status !== 200) {
          const data = resp.data;
          if (data.code && data.code === 11000) {
            this.setState({
              invalidField: true,
              errorText: "An account already exists with the provided email.",
            });
          }
        }
      });
  }

  handleChange(event) {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    this.setState({
      [name]: { value: value },
    });
  }

  handleStateDropdownChange(state) {
    this.setState({
      state: { value: state },
    });
  }

  render() {
    if (this.state.redirect === true) {
      return <SuccessPage />;
    } else
      return (
        <ContentBlock>
          <h3>Sign Up</h3>
          <p>
            uNet is a basic social network that allows anyone, anywhere to post
            a message to a board. Enter your information to create an account
            today!
          </p>
          <p
            className="invalidField"
            style={{ display: this.state.invalidField ? "" : "none" }}
          >
            {this.state.errorText}
          </p>
          <div className="flex-container">
            <input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="First Name"
              className="formField flex-item-left"
              style={{
                outline: this.state.firstName.invalid
                  ? "2px solid var(--issueBorder)"
                  : "",
              }}
              required="true"
              onChange={this.handleChange}
              value={this.state.firstName.value}
            />
            <input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Last Name"
              className="formField flex-item-right"
              style={{
                outline: this.state.lastName.invalid
                  ? "2px solid var(--issueBorder)"
                  : "",
              }}
              required="true"
              onChange={this.handleChange}
              value={this.state.lastName.value}
            />
          </div>
          <input
            id="address"
            name="address"
            type="text"
            placeholder="Address"
            className="formField"
            style={{
              outline: this.state.address.invalid
                ? "2px solid var(--issueBorder)"
                : "",
            }}
            required="true"
            onChange={this.handleChange}
            value={this.state.address.value}
          />
          <div className="flex-container">
            <input
              id="city"
              name="city"
              type="text"
              placeholder="City"
              className="formField flex-item-left"
              style={{
                outline: this.state.city.invalid
                  ? "2px solid var(--issueBorder)"
                  : "",
              }}
              required="true"
              onChange={this.handleChange}
              value={this.state.city.value}
            />
            <select
              name="state"
              id="state"
              className="formField formDropdown flex-item-right flex-item-left"
              style={{
                color: this.state.state.value === "State" ? "#767676" : "black",
                outline: this.state.state.invalid
                  ? "2px solid var(--issueBorder)"
                  : "",
              }}
              onChange={this.handleChange}
              value={this.state.state.value}
            >
              <option disabled="true" elected="true" value="State">
                State
              </option>
              {states.map((state) => (
                <option value={state.abbreviation}>{state.name}</option>
              ))}
            </select>
            <input
              id="zipCode"
              name="zipCode"
              type="text"
              placeholder="ZIP"
              className="formField flex-item-right"
              style={{
                outline: this.state.zipCode.invalid
                  ? "2px solid var(--issueBorder)"
                  : "",
              }}
              required="true"
              onKeyDown={this.onZipKeyDown}
              onChange={this.handleChange}
              value={this.state.zipCode.value}
            />
          </div>
          <input
            id="email"
            type="email"
            name="email"
            placeholder="Email"
            className="formField"
            style={{
              outline: this.state.email.invalid
                ? "2px solid var(--issueBorder)"
                : "",
            }}
            required="true"
            onChange={this.handleChange}
            value={this.state.email.value}
          />
          <p
            className="invalidField"
            style={{ display: this.state.invalidEmail ? "" : "none" }}
          >
            Invalid email address.
          </p>
          <input
            id="pass"
            name="pass"
            type="password"
            placeholder="Password"
            className="formField"
            style={{
              outline: this.state.pass.invalid
                ? "2px solid var(--issueBorder)"
                : "",
            }}
            required="true"
            onChange={this.handleChange}
            value={this.state.pass.value}
          />
          <PasswordStrengthBar
            password={this.state.pass.value}
            style={{
              display:
                typeof this.state.pass.value == "undefined" ||
                this.state.pass.value.length === 0
                  ? "none"
                  : "",
            }}
            minLength={8}
            onChangeScore={this.onChangeScore}
          />
          <p style={{ fontStyle: "italic" }}>
            Already have an account?{" "}
            <Link className="sgnUpLink" to="/login">
              Log in
            </Link>
            .
          </p>
          <input
            type="submit"
            name="submit"
            onClick={this.handleLogin}
            className="subBtn"
            value="Sign Up"
          />
        </ContentBlock>
      );
  }
}

export default StartPage;
