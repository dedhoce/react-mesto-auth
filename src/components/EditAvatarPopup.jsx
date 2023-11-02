import React, { useContext, useEffect } from "react";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useFormAndValidation } from "../hooks/useFormAndValidation";
import { LabelForForm } from "./LabelForForm";

export default function EditAvatarPopup({onUpdateAvatar, isOpen}) {

  const {values, handleChange, errors, isValid, resetForm} = useFormAndValidation()

  const currentUser = useContext(CurrentUserContext)      
  
  function handleSubmit(e) {
    e.preventDefault();  
    onUpdateAvatar({
      avatar: values.avatar
    });
  } 
  
  useEffect(() => {
    if(!isOpen) {       
      resetForm({avatar: currentUser.avatar}, {}, false)        
    }
  }, [currentUser.avatar, isOpen])        

  return (
    <PopupWithForm 
      specClass='popup__form_size_oneInput' 
      title="Обновить аватар" 
      name="avatar_edit"      
      buttonStatus={isValid} 
      onSubmit={handleSubmit}        
      isOpen={isOpen} 
    > 
      <LabelForForm 
        typeInput="url"
        name="avatar"
        value={values.avatar}
        onChange={handleChange}
        placeholder="Ссылка на картинку аватар"
        onClick={() => resetForm({...values, avatar: ''}, {}, false)}
        isValid={isValid}
        errors={errors.avatar}
        minLength=''
        maxLength=''
      />          
    </PopupWithForm>
  )
}