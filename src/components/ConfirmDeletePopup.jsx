import React from "react";
import PopupWithForm from './PopupWithForm';

export default function ConfirmDeletePopup({idCard, buttonText, onClose, isOpen, onCardDelete}) {

  function handleSubmitDeleteCard(e) {
    /* Запрещаем браузеру переходить по адресу формы */
    e.preventDefault();

    /* Передаём значения управляемых компонентов во внешний обработчик */
    onCardDelete(idCard);
  }

  return (
    <PopupWithForm 
      specClass='popup__form_size_zeroInput' 
      title="Вы уверены?" 
      name="confirmation"
      buttonStatus={true} 
      buttonText={buttonText} 
      onSubmit={handleSubmitDeleteCard}
      idCard={idCard} 
      onClose={onClose} 
      isOpen={isOpen}/>
  )
}