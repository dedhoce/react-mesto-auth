import React, { useEffect, useContext, useState } from "react";
import PopupWithForm from "./PopupWithForm";
import { useFormAndValidation } from "../hooks/useFormAndValidation";
import { LabelForForm } from "./LabelForForm";
import { ButtonTextContext } from "../contexts/ButtonTextContext";

export default function AddCardPopup({ onAddCard, isOpen }) {
  const isLoading = useContext(ButtonTextContext);

  const [buttonText, setButtonText] = useState('')

  useEffect(() => {
    !isLoading 
      ? setButtonText("Создать") 
      : setButtonText("Создание...")
  }, [isLoading]);  

  const { values, handleChange, errors, isValid, resetForm } =
    useFormAndValidation();

  function handleSubmitAddCard(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    onAddCard({
      name: values.cardName,
      url: values.cardUrl,
    });
  }

  useEffect(() => {
    if (!isOpen) {
      resetForm({}, {}, false);
    }
  }, [isOpen]);

  return (
    <PopupWithForm
      specClass=""
      title="Новое место"
      name="add_cards"
      buttonStatus={isValid}
      onSubmit={handleSubmitAddCard}
      isOpen={isOpen}
      buttonText={buttonText}
    >
      <LabelForForm
        typeInput="text"
        name="cardName"
        value={values.cardName}
        onChange={handleChange}
        placeholder="Название"
        onClick={() => resetForm({ ...values, cardName: "" }, {}, false)}
        isValid={isValid}
        errors={errors.cardName}
        minLength="2"
        maxLength="30"
      />
      <LabelForForm
        typeInput="url"
        name="cardUrl"
        value={values.cardUrl}
        onChange={handleChange}
        placeholder="Ссылка на картинку"
        onClick={() => resetForm({ ...values, cardUrl: "" }, {}, false)}
        isValid={isValid}
        errors={errors.cardUrl}
        minLength=""
        maxLength=""
      />
    </PopupWithForm>
  );
}
