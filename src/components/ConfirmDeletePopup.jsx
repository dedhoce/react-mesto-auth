import React from "react";
import PopupWithForm from './PopupWithForm';

export default function ConfirmDeletePopup({idCard, isOpen, onCardDelete}) {

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
      onSubmit={handleSubmitDeleteCard}
      idCard={idCard}       
      isOpen={isOpen}
    />
  )
}