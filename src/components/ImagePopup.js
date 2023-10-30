import React from "react";

function ImagePopup({card, onClose}) {   
  return (
    <div className={`popup popup_overlay_dark popup_zoom_image  ${card ? 'popup_status_active' : ''}`}>
      <div className="popup__group">
        <button
          type="button"
          name="popup__button"
          className="popup__button-close"
          onClick={onClose}>
        </button>
        <img src={card?.link} alt={card?.name} className="popup__zoom-image" />
        <p className="popup__caption">{card?.name}</p>
      </div>
    </div>
  )
}

export default ImagePopup