import React, { useContext } from 'react' // импорт библиотеки
import Card from './Card';
import { CurrentUserContext } from '../contexts/CurrentUserContext';

function Main({onEditAvatar, onEditProfile, onAddPlace, cards, onCardLike, onCardClick, onCardDelete}) { 

  const currentUser = useContext(CurrentUserContext)  
     
  return (
    <main>
      <section className="profile">
        <div className="profile__block">
          <div className="profile__edit-avatar">
            <img
              src={currentUser.avatar}
              alt="Аватар профиля"              
              className="profile__avatar" />
            <button onClick={onEditAvatar} type="button" className="profile__avatar-edit-button"></button>
            </div>
          <div className="profile__info">
            <div className="profile__position-name-button">
              <h1 className="profile__name">{currentUser.name}</h1>
              <button onClick={onEditProfile} type="button" className="profile__edit-button"></button>
            </div>
            <p className="profile__subname">{currentUser.about}</p>
          </div>
        </div>
        <button onClick={onAddPlace} type="button" className="profile__add-button"></button>
      </section>
      <section aria-label="elements">
        <ul className="elements">
          {cards.map((item) => {
              return ( 
                <li className="element" key={item._id}>
                  <Card 
                  key={item._id}
                  card={item}
                  onCardLike={onCardLike} 
                  onCardClick={onCardClick} 
                  onCardDelete={onCardDelete}/>
                </li>
              )
            })
          }
        </ul>
      </section>
    </main>
  )
}

export default Main