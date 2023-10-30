import React, { useState , useEffect} from "react";
//import { useNavigate } from 'react-router-dom'

function Register({isAuth, onRegisterUser, buttonText }) {    
  //const navigate = useNavigate()
    //стэйты значений input.value
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') 
  
  //стэйты состояния валидности инпутов
  const [isEmailValid, setIsEmailValid] = useState(false)
  const [isPasswordValid, setIsPasswordValid] = useState(false)
  /** Стэйты для хранения сообщения валидации, чтоб показывать актуальное в форме */
  const [emailErrorMessage, setEmailErrorMessage] = useState('')
  const [passwordErrorMessage, setPasswordErrorMessage] = useState('')  
  /* если хоть один стэйт валидности false то общее значение - false(передаем в PopupWithForm, что влиять на кнопку сабмита) */
  const isFormValid = isEmailValid && isPasswordValid 

  //обновляем значение input.value на сохраненное в глобальном стэйте
  //каждый раз при изменении глобального стейта и изменении состояния попапа
  useEffect((isAuth) => {
    if(!isAuth) {
      setEmail('');
      setPassword('');
      setEmailErrorMessage('')
      setPasswordErrorMessage('')
      setIsEmailValid(false)
      setIsPasswordValid(false)
    }
  }, [isAuth]);

  //записываем текущее значенени и валидность input.value в стэйты
  function handleInputEmail (e) {
    setEmail(e.target.value)
    setIsEmailValid(e.target.validity.valid)
    setEmailErrorMessage(e.target.validationMessage)    
  };
  function handleInputPassword (e) {  
    setPassword(e.target.value)
    setIsPasswordValid(e.target.validity.valid)
    setPasswordErrorMessage(e.target.validationMessage)   
  };

  //передаем данные стэйтов в запрос к серверу при сабмите
  function handleSubmit(e) {  
    e.preventDefault();  
    onRegisterUser({
        email, password
    });
  } 
  return (
    <div className='regist'>     
    <div className='regist__block-form'>
      <h2 className="regist__title">Регистрация</h2>        
        <form onSubmit={handleSubmit} name={email} className="regist__form" noValidate>
          <label className="regist__form-field">            
            <input                  
              type="email"
              name="email"
              className="regist__input"
              id="regist-email"
              value={email}
              onChange={handleInputEmail}
              placeholder = "Email"
              required/>
            <button 
              onClick={() => setEmail('')} 
              type='button' 
              name='button-clear-input-email' 
              className={`regist__button-clear-input ${email ? 'regist__button-clear-input_status_active' : ''}`} 
              tabIndex='-1'
              disabled={!email}></button>
            <span className={`regist__text-error regist-name-error ${!isEmailValid ? "regist__text-error_active" : ''}`}>
            {!(email === '') && (!isEmailValid && email) ? emailErrorMessage : ''}
            </span>
          </label>
          <label className="regist__form-field">
            <input                 
              type="password"
              name="password"
              className="regist__input"
              id="regist-password"
              value={password}
              onChange={handleInputPassword}
              placeholder = "Пароль"
              required minLength="6"/>
            <button 
              onClick={() => setPassword('')} 
              type='button' 
              name='button-clear-input-password' 
              className={`regist__button-clear-input ${password ? 'regist__button-clear-input_status_active' : ''}`}
              tabIndex='-1'
              disabled={!password}></button>
            <span className={`regist__text-error regist-password-error ${!isPasswordValid ? "regist__text-error_active" : ''}`}>
            {!(password === '') && (!isPasswordValid && password) ? passwordErrorMessage : ''}
            </span>
          </label>
          <button
            type="submit"
            name="regist__button-save"
            className={`regist__button-save ${!isFormValid ? 'regist__button-save_inactive' : ''}`}
            disabled={!isFormValid}>
            {buttonText}
          </button>          
        </form>
        <h3 className='regist__text'>Уже зарегестрированны? <a className='regist__text-link' href='/login'>Войти </a></h3>
    </div>
    </div>    
  )
}

export default Register