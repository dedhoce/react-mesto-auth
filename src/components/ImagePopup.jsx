import React from "react";
import Popup from "./Popup";

function ImagePopup({card, onClose}) {   
  return (
    <Popup
      isOpen={card}
      onClose={onClose}
      name={'overlay_dark'}      
      specClass={'popup__group'}
      flag={true}>      
      <>
        <img src={card?.link} alt={card?.name} className="popup__zoom-image" />
        <p className="popup__caption">{card?.name}</p>
      </>
    </Popup>   
  )
}

export default ImagePopup