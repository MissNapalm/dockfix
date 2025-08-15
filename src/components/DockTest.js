import React from "react";

const DockTest = () => {
  return (
    <div style={{ background: "#000", padding: "20px", display: "flex" }}>
      <img
        src="/document.png"
        alt="Test Document"
        style={{
          width: "50px",
          height: "50px",
          borderRadius: "10px",
          border: "2px solid white",
        }}
      />
      <span style={{ color: "white", marginLeft: "10px" }}>About Me</span>
    </div>
  );
};

export default DockTest;