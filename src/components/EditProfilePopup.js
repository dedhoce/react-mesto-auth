import React, { useContext, useEffect, useState } from "react";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function EditProfilePopup({isOpen, onUpdateUser, buttonText, onClose}) {
  //подписываемся на контекст стэйта с данными пользователя
  const currentUser = useContext(CurrentUserContext)
  //стэйты значений input.value
  const [name, setName] = useState('')
  const [description, setDescription] = useState('') 
  
  //стэйты состояния валидности инпутов
  const [isNameValid, setIsNameValid] = useState(false)
  const [isDescriptionValid, setIsDescriptionValid] = useState(false)
  /** Стэйты для хранения сообщения валидации, чтоб показывать актуальное в форме */
  const [nameErrorMessage, setNameErrorMessage] = useState('')
  const [descriptionErrorMessage, setDescriptionErrorMessage] = useState('')
  /* если хоть один стэйт валидности false то общее значение - false(передаем в PopupWithForm, что влиять на кнопку сабмита) */
  const isFormValid = isNameValid || isDescriptionValid 

  //обновляем значение input.value на сохраненное в глобальном стэйте
  //каждый раз при изменении глобального стейта и изменении состояния попапа
  useEffect((isOpen) => {
    if(!isOpen) {
      setName(currentUser.name);
      setDescription(currentUser.about);
      setNameErrorMessage('')
      setDescriptionErrorMessage('')
      setIsNameValid(false)
      setIsDescriptionValid(false)
    }
  }, [currentUser, isOpen]);

  //записываем текущее значенени и валидность input.value в стэйты
  function handleInputName (e) {
    setName(e.target.value)
    setIsNameValid(e.target.validity.valid)
    setNameErrorMessage(e.target.validationMessage)    
  };
  function handleInputDescription (e) {  
    setDescription(e.target.value)
    setIsDescriptionValid(e.target.validity.valid)
    setDescriptionErrorMessage(e.target.validationMessage)   
  };

  //передаем данные стэйтов в запрос к серверу при сабмите
  function handleSubmit(e) {  
    e.preventDefault();  
    onUpdateUser({
      name: name,
      about: description,
    });
  } 
  return ( 
    <PopupWithForm 
      specClass='' 
      title="Редактировать профиль" 
      name="edit_profile" 
      buttonStatus={isFormValid}
      buttonText={buttonText} 
      onSubmit={handleSubmit} 
      onClose={onClose} 
      isOpen={isOpen} >        
      <label className="popup__form-field">            
        <input                  
          type="text"
          name="name"
          className="popup__text popup__text_type_name"
          id="popup-name"
          value={name ? name : ''}
          onChange={handleInputName}
          placeholder = "Новое имя пользователя"
          required minLength="2" maxLength="40"/>
        <button 
          onClick={() => setName('')} 
          type='button' 
          name='button-clear-input-name' 
          className={`popup__button-clear-input ${name ? 'popup__button-clear-input_status_active' : ''}`} 
          tabIndex='-1'
          disabled={!name}></button>
        <span className={`popup__text-error popup-name-error ${!isNameValid ? "popup__text-error_active" : ''}`}>
          {!(name === '') && (!isNameValid && name) ? nameErrorMessage : ''}
        </span>
      </label>
      <label className="popup__form-field">
        <input                 
          type="text"
          name="subname"
          className="popup__text popup__text_type_subname"
          id="popup-subname"
          value={description ? description : ''}
          onChange={handleInputDescription}
          placeholder = "Информация о пользователе"
          required minLength="2" maxLength="200"/>
        <button 
          onClick={() => setDescription('')} 
          type='button' 
          name='button-clear-input-description' 
          className={`popup__button-clear-input ${description ? 'popup__button-clear-input_status_active' : ''}`}
          tabIndex='-1'
          disabled={!description}></button>
        <span className={`popup__text-error popup-subname-error ${!isDescriptionValid ? "popup__text-error_active" : ''}`}>
          {!(description === '') && (!isDescriptionValid && description) ? descriptionErrorMessage : ''}
        </span>
      </label>           
    </PopupWithForm>
  )
}

export default EditProfilePopup