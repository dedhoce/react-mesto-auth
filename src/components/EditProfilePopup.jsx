import React, { useContext, useEffect } from "react";
import PopupWithForm from './PopupWithForm';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { useFormAndValidation } from "../hooks/useFormAndValidation";
import { LabelForForm } from "./LabelForForm";

function EditProfilePopup({ isOpen, onUpdateUser }) {

  const {values, handleChange, errors, isValid, resetForm} = useFormAndValidation()

  //подписываемся на контекст стэйта с данными пользователя
  const currentUser = useContext(CurrentUserContext)
  
  //обновляем значение input.value на сохраненное в глобальном стэйте
  //каждый раз при изменении глобального стейта и изменении состояния попапа
  useEffect((isOpen) => {
    if(!isOpen) {      
      resetForm({name: currentUser.name, description: currentUser.about}, {}, false)
    }
  }, [currentUser, isOpen]);  

  //передаем данные стэйтов в запрос к серверу при сабмите
  function handleSubmit(e) {  
    e.preventDefault();      
    onUpdateUser({
      name: values.name,
      about: values.description
    });
  } 
  return ( 
    <PopupWithForm 
      specClass='' 
      title="Редактировать профиль" 
      name="edit_profile" 
      buttonStatus={isValid}       
      onSubmit={handleSubmit}        
      isOpen={isOpen} >        
      <LabelForForm 
        typeInput="text"
        name="name"
        value={values.name}
        onChange={handleChange}
        placeholder="Новое имя пользователя"
        onClick={() => resetForm({...values, name: ''}, {}, false)}
        isValid={isValid}
        errors={errors.name}
        minLength='2'
        maxLength='40'
      />
      <LabelForForm 
        typeInput="text"
        name="description"
        value={values.description}
        onChange={handleChange}
        placeholder="Информация о пользователе"
        onClick={() => resetForm({...values, description: ''}, {}, false)}
        isValid={isValid}
        errors={errors.description}
        minLength='2'
        maxLength='200'
      />                 
    </PopupWithForm>
  )
}

export default EditProfilePopup