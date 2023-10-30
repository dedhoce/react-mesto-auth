import React from "react";

function PopupWithForm({name, isOpen, specClass, title, onClose, onSubmit, children, buttonStatus, buttonText}) {
  return (
    <div className={`popup popup_${name} ${isOpen ? 'popup_status_active' : ''}`}>
      <div className={`popup__form ${specClass}`}>
        <h2 className="popup__title">{title}</h2>
        <button
          type="button"
          name="popup__button"
          className="popup__button-close"
          onClick={onClose}>
        </button>
        <form onSubmit={onSubmit} name={name} className="popup__form-input popup__form-edit-profile" noValidate>
          {children}
          <button
            type="submit"
            name="popup__button-save"
            className={`popup__button-save ${!buttonStatus ? 'popup__button-save_inactive' : ''}`}
            disabled={!buttonStatus}>
            {buttonText}
          </button>
        </form>
      </div>
    </div>
  )
}

export default PopupWithForm