import React from "react";

const EthicalHacks = () => {
  const hacks = [
    "Bypass login with SQL injection",
    "Privilege escalation via misconfigured permissions",
    "Session hijacking with XSS",
    "Directory traversal to access restricted files",
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      {hacks.map((hack, i) => (
        <div key={i}>
          {i + 1}. {hack}
        </div>
      ))}
    </div>
  );
};

export default EthicalHacks;