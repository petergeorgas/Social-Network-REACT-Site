import React from "react";
import "../css/ContentBlock.css";

const ContentBlock = ({ children }) => {
  return (
    <div>
      <div className="contentBlock">
        <div className="listText">{children}</div>
      </div>
    </div>
  );
};

export default ContentBlock;
