import React from "react";

function Logo({ width = "100px" }) {
  return (
    <div style={{ width }}>
      <img
        src="/LOGO.png"       // Path from public folder
        alt="Logo"
        style={{ width: "100%", height: "auto" }}
      />
    </div>
  );
}

export default Logo;
