import React from 'react' // импорт библиотеки
import { Link } from 'react-router-dom'

function Header({emailUser, loggedIn, onExit, registration}) {    
  return (
    <header className="header">
      <div className="logo logo_place_header"></div>
      {loggedIn ? 
      <>
        <h2 className="header__user-email">{emailUser}</h2>
        <button onClick={onExit} className="header__link">Выход</button> 
      </>
      : 
      (registration ? <Link to="/sign-in" className="header__link">Вход</Link> : <Link to="/sign-up" className="header__link">Регистрация</Link>)}
    </header>
  )
}

export default Header