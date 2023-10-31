import React from "react";
import ComponentWithForm from "./ComponentWithFormForLoginPage";

function Login({onEnterUser, buttonText}) {  
  return (
    <div className='regist'>     
      <div className='regist__block-form'>
        <h2 className="regist__title">Вход</h2>        
        <ComponentWithForm setUserInfo={onEnterUser} buttonText={buttonText}/>         
      </div>
    </div>    
  )
}

export default Login