import React, { useRef, useContext, useEffect, useState } from "react";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

export default function EditAvatarPopup({onUpdateAvatar, isOpen, onClose, buttonText}) {

  const currentUser = useContext(CurrentUserContext) 
  const inputAvatarLink = useRef()
  const [avatar, setAvatar] = useState('')    
  
  function handleSubmit(e) {
    e.preventDefault();
  
    onUpdateAvatar({
      avatar: inputAvatarLink.current.value/* Значение инпута, полученное с помощью рефа */,
    });
  }

  useEffect(() => {
    setAvatar(currentUser.avatar);        
  }, [currentUser]);
  
  useEffect(() => {
    if(!isOpen) {       
      setAvatar('')
      setIsUrlValid(false)
    } else {
      setAvatar(currentUser.avatar)
      setIsUrlValid(true)        
    }
  }, [currentUser.avatar, isOpen])
    
    
  function handleInputChange () {
    setAvatar(inputAvatarLink.current.value)
    setIsUrlValid(inputAvatarLink.current.validity.valid)
  };

  const [isUrlValid, setIsUrlValid] = useState(false)       

  return (
    <PopupWithForm 
      specClass='popup__form_size_oneInput' 
      title="Обновить аватар" 
      name="avatar_edit" 
      buttonText={buttonText}
      buttonStatus={isUrlValid} 
      onSubmit={handleSubmit} 
      onClose={onClose} 
      isOpen={isOpen} >     
      <label className="popup__form-field">
        <input
          ref={inputAvatarLink}
          type="url"
          name="avatar"
          className="popup__text popup__text_type_avatar"
          id="popup-avatar-url"
          placeholder="Ссылка на картинку аватар"
          onChange={handleInputChange}
          value={avatar}                
          required />
        <button 
          onClick={() => {setAvatar(''); setIsUrlValid(false)}} 
          type='button' 
          name='button-clear-input-avatar' 
          className={`popup__button-clear-input ${avatar ? 'popup__button-clear-input_status_active' : ''}`} 
          tabIndex='-1'
          disabled={!avatar}>
        </button>  
        <span className={`popup__text-error popup-avatar-url-error ${!isUrlValid ? "popup__text-error_active" : ''}`}>
          {!(avatar === '') && ((!isUrlValid && inputAvatarLink.current) ? inputAvatarLink.current.validationMessage : '')}</span>
      </label>     
    </PopupWithForm>
  )
}