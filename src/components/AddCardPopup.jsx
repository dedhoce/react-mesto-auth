import React, { useEffect, useState } from "react";
import PopupWithForm from './PopupWithForm';

export default function AddCardPopup({onAddCard, isOpen, buttonText, onClose,}) {

  const [name, setName] = useState('');
  const [url, setUrl] = useState('');  

  function handleNameInput(e) {
    setName(e.target.value)
    setIsNameValid(e.target.validity.valid)
    setNameErrorMessage(e.target.validationMessage)
  }
  function handleUrlInput(e) {
    setUrl(e.target.value)
    setIsUrlValid(e.target.validity.valid)
    setUrlErrorMessage(e.target.validationMessage)
  }

  function handleSubmitAddCard(e) {
    // Запрещаем браузеру переходить по адресу формы
    e.preventDefault();
    // Передаём значения управляемых компонентов во внешний обработчик
    onAddCard({
      name,
      url
    });
  }
  
  useEffect(() => {
    if(!isOpen) {
      setName('')
      setUrl('')
    }
  }, [isOpen])

  const [isNameValid, setIsNameValid] = useState(false)
  const [isUrlValid, setIsUrlValid] = useState(false)
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [urlErrorMessage, setUrlErrorMessage] = useState('')

  const isFormValid = isNameValid && isUrlValid  

  return (
    <PopupWithForm 
      specClass='' 
      title="Новое место" 
      name="add_cards"
      buttonText={buttonText}
      buttonStatus={isFormValid} 
      onSubmit={handleSubmitAddCard} 
      onClose={onClose} 
      isOpen={isOpen} >      
      <label className="popup__form-field">
        <input            
          type="text"
          name="name"
          className="popup__text popup__text_type_title"
          id="popup-card-title"
          placeholder = "Название"
          onChange={handleNameInput}
          value={name}
          required minLength="2" maxLength="30"/>
        <button 
          onClick={() => {setName(''); setIsNameValid(false)}} 
          type='button' 
          name='button-clear-input-name' 
          className={`popup__button-clear-input ${name ? 'popup__button-clear-input_status_active' : ''}`} 
          tabIndex='-1'
          disabled={!name}>
        </button>
        <span className={`popup__text-error popup-card-title-error ${!isNameValid ? "popup__text-error_active" : ''}`}>
          {!(name === '') && (!isNameValid && name) ? nameErrorMessage : ''}
        </span>
      </label>
      <label className="popup__form-field">
        <input            
          type="url"
          name="url"
          className="popup__text popup__text_type_url"
          id="popup-card-url"
          placeholder = "Ссылка на картинку"
          onChange={handleUrlInput}
          value={url}
          required />
        <button 
          onClick={() => {setUrl(''); setIsUrlValid(false)}} 
          type='button' 
          name='button-clear-input-url' 
          className={`popup__button-clear-input ${url ? 'popup__button-clear-input_status_active' : ''}`} 
          tabIndex='-1'
          disabled={!url}>
        </button>
        <span className={`popup__text-error popup-card-title-error ${!isUrlValid ? "popup__text-error_active" : ''}`}>
          {!(url === '') && (!isUrlValid && url) ? urlErrorMessage : ''}
        </span>
      </label>       
    </PopupWithForm>
  )
}