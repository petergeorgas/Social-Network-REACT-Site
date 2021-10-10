import React, { Component } from "react";
import ContentBlock from "../ContentBlock";

export class Post extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ContentBlock>
        <h4>firstName lastName</h4>
        <p>A post! on the page!!</p>
      </ContentBlock>
    );
  }
}

export default Post;
