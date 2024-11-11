import React from "react";
import { Pannellum } from "pannellum-react";

const Cabin360View = ({ imageUrl, onClose }) => (
  <div style={{ position: "relative", width: "100%", height: "500px" }}>
    <Pannellum
      width="100%"
      height="100%"
      image={imageUrl}
      pitch={10}
      yaw={180}
      hfov={110}
      autoLoad
      showZoomCtrl
    />
    <button
      style={{
        position: "absolute",
        top: 10,
        right: 10,
        background: "rgba(0,0,0,0.5)",
        color: "#fff",
        padding: "5px 10px",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={onClose}
    >
      Close
    </button>
  </div>
);

export default Cabin360View;
