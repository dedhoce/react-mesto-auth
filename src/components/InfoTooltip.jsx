import React, {useContext} from "react";
import { OnCloseContext } from "../contexts/OnCloseContext";

function InfoTooltip({isOpen, title, icon}) {
  const closeAllPopups = useContext(OnCloseContext)
  
  return (
    <div className={`popup ${isOpen ? 'popup_status_active' : ''}`}>
      <div className='popup__form tooltip'>
        {icon ? <img src={require (`../images/${icon}`)} alt="#" className="tooltip__image" /> : ''}
        <h2 className="popup__title tooltip__title">{title}</h2>        
        <button
          type="button"
          name="popup__button"
          className="popup__button-close"
          onClick={closeAllPopups}>
        </button>        
      </div>
    </div>
  )
}

export default InfoTooltip