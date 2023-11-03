import React, { useContext, useState, useEffect } from "react";
import PopupWithForm from "./PopupWithForm";
import { ButtonTextContext } from "../contexts/ButtonTextContext";

export default function ConfirmDeletePopup({ idCard, isOpen, onCardDelete }) {
  const isLoading = useContext(ButtonTextContext);

  const [buttonText, setButtonText] = useState('')

  useEffect(() => {
    !isLoading 
      ? setButtonText("Да") 
      : setButtonText("Удаление...")
  }, [isLoading]);

  function handleSubmitDeleteCard(e) {
    /* Запрещаем браузеру переходить по адресу формы */
    e.preventDefault();

    /* Передаём значения управляемых компонентов во внешний обработчик */
    onCardDelete(idCard);
  }

  return (
    <PopupWithForm
      specClass="popup__form_size_zeroInput"
      title="Вы уверены?"
      name="confirmation"
      buttonStatus={true}
      onSubmit={handleSubmitDeleteCard}
      idCard={idCard}
      isOpen={isOpen}
      buttonText={buttonText}
    />
  );
}
