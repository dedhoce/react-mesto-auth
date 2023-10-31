import React, { useContext } from "react";
import { CurrentUserContext } from '../contexts/CurrentUserContext';


function Card ({card, onCardClick, onCardLike, onCardDelete}) {
  const currentUser = useContext(CurrentUserContext);
  
  
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some(i => i._id === currentUser._id);

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleCardDelete() {
    onCardDelete(card._id)
  }
  return (
    <>
      <img
        src={card.link}
        alt={card.name}
        className="element__mask-group" 
        onClick={handleClick}
        />
      <div className="element__block-title">
        <h2 className="element__title">{card.name}</h2>
        <div onClick={handleLikeClick} className="element__like">
          <button type="button" className={`element__group ${isLiked ? 'element__group_status_active' : ''}`}></button>
          <h3 className="element__like-quantity">{card.likes.length}</h3>
        </div>
      </div>
      {isOwn && <button type="button" onClick={handleCardDelete} className="element__trash"></button>}
    </>
  )

}

export default Card