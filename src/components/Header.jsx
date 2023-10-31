import React from 'react' // импорт библиотеки
import { Link, useLocation } from 'react-router-dom'

function Header({email, onExit}) {    
  const location = useLocation(); 

  return (
    <header className="header">
      <div className="logo logo_place_header"></div>
      {location.pathname ===  "/" ? 
      <div className='header__email-botton-case'>
        <h2 className="header__user-email">{email}</h2>
        <button onClick={onExit} className="header__log-out">Выход</button> 
      </div>
      : 
      (location.pathname ===  "/sign-in" ? <Link to="/sign-up" className="header__link">Регистрация</Link> : 
      (location.pathname ===  "/sign-up" ? <Link to="/sign-in" className="header__link">Вход</Link> : '') )}
    </header>
  )
}

export default Header