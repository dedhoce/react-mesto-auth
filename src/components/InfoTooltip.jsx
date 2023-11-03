import React from "react";
import Popup from "./Popup";

function InfoTooltip({ isOpen, title, icon }) {
  return (
    <Popup 
      isOpen={isOpen}
      name='tooltip'
      title={title}
      icon={icon}
      specClass='tooltip'
    />    
  );
}

export default InfoTooltip;
