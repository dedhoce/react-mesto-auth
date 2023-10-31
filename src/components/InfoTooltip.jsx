import React from "react";

function InfoTooltip({isOpen, title, icon, onClose}) {
  return (
    <div className={`popup ${isOpen ? 'popup_status_active' : ''}`}>
      <div className='popup__form'>
        <img src={`../images/${icon}`} alt="" className="class" />
        <h2 className="popup__title">{title}</h2>        
        <button
          type="button"
          name="popup__button"
          className="popup__button-close"
          onClick={onClose}>
        </button>        
      </div>
    </div>
  )
}

export default InfoTooltip