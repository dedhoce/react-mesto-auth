import React, {useContext} from "react";
import Popup from "./Popup";
import { ButtonTextContext } from "../contexts/ButtonTextContext";

function PopupWithForm({name, isOpen, specClass, title, onSubmit, children, buttonStatus}) {
  const isLoading = useContext(ButtonTextContext)
  return (
    <Popup 
      isOpen={isOpen} 
      specClass={specClass}
      title={title}      
      name={name}
    >
      <form onSubmit={onSubmit} name={name} className="popup__form-input" noValidate>
        {children}
        <button
          type="submit"
          name="popup__button-save"
          className={`popup__button-save ${!buttonStatus ? 'popup__button-save_inactive' : ''}`}
          disabled={!buttonStatus}>            
          {name === 'edit_profile' || name === 'avatar_edit' ? (!isLoading ? 'Сохранить' : 'Сохранение...') : ''}          
          {name === 'add_cards' ? (!isLoading ? 'Создать' : 'Создание...') : ''}
          {name === 'confirmation' ? (!isLoading ? 'Да' : 'Удаление...') : ''}
        </button>
      </form>
    </Popup>
  )
}

export default PopupWithForm