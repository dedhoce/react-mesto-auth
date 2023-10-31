import React, { useState , useEffect} from 'react'; // импорт библиотеки
import { Routes, Route, useNavigate} from 'react-router-dom'

import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import ImageAvatar from '../images/image.jpg';
import api from '../utils/Api';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddCardPopup from './AddCardPopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import Register from './Register';
import Login from './Login';
import ProtectedRouteElement from './ProtectedRoute';


function App() {
  /** Стэйты состояния открытия попапов. */
  const [isOpenProfilePopup, setIsOpenProfilePopup] = useState(false);
  const [isOpenAvatarPopup, setIsOpenAvatarPopup] = useState(false);
  const [isOpenAddCardPopup, setIsOpenAddCardPopup] = useState(false);
  const [isOpenConfirmPopup, setIsOpenConfirmPopup] = useState(false);
  /* стэйт с id карточки на удаление. */
  const [idDeleteCard, setIdDeleteCard] = useState(''); 
  /* в стэйт записывается наименование и картинка карточки для попапа с картинкой. */
  const [selectedCard, setSelectedCard] = useState(null);
  /* Глобальный стэйт с данными профиля пользователя. */
  const [currentUser, setCurrentUser] = useState({
    name: 'Жак-ив-Кусто',
    about: 'Исследователь, мореплаватель',
    avatar: ImageAvatar
  })
  /** Глобальный стэйт с объектом карточек. */
  const [cards, setCards] = useState([])

  /** стэйты текстовых значений кнопок сабмита в формах попапов. */
  const [buttonSaveProfile, setButtonSaveProfile] = useState('Сохранить')
  const [buttonSaveAvatar, setButtonSaveAvatar] = useState('Сохранить')
  const [buttonCreateCard, setButtonCreateCard] = useState('Создать')
  const [buttonConfirm, setButtonConfirm] = useState('Да')
  const [buttonRegistration, setButtonRegistration] = useState('Зарегестрироваться')
  const [buttonEnter, setButtonEnter] = useState('Вход')

  /** Стэйт авторизации пользователя. */
  const [loggedIn, setLoggedIn] = useState(false)
  const [userAuthInfo, setUserAuthInfo] = useState({})
  
  const handleLogin = () => {
    setLoggedIn(true);
  }

  /** Получаем данные с сервера по объединенному запросу и записываем ответы в глобальные стэйты. */
  useEffect(() => {   
    Promise.all([
      api.getInitialCards(),
      api.getUserInfo()    
    ])
      .then(([initialCards, userInformation]) => {        
        setCurrentUser(userInformation)                                                               
        setCards(initialCards)           
      })             
      .catch((err) => {
        console.log(err); 
      })    
  }, [])
  
  /** Проверяем наличие нашего лайка, по нему определяем в Api какой запрос отправить лайк или дизлайк. */
  function handleCardLike(card) {   
    const isLiked = card.likes.some(i => i._id === currentUser._id);   
    api.changeLikeCardStatus(card._id, !isLiked)
      .then((newCard) => {        
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
      })
      .catch((err) => {
        console.log(err); 
      });
  }
  /** Отправляем данные о пользователе на сервер, меняем подпись кнопки сабмита при загрузке,
    *  ответ с новыми данными записываем в глобальный стэйт. */
  function handleUpdateUser({ name, about}) {
    setButtonSaveProfile('Сохранение...')
    api.pushUserInfo({name, about})
      .then(userInformation => {
        setCurrentUser(userInformation)
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setButtonSaveProfile('Сохранить'));    
  }
  /** Отправляем данные для регимстрации пользователя, меняем подпись кнопки сабмита при загрузке,
    *  при положительном ответе переходим в окно входа. */
  const navigate = useNavigate();
  function handleRegisterUser({ email, password}) {
    setButtonRegistration('Регистрация...')
    api.regisrationNewUser({email, password})
      .then(res => {
        navigate('/sign-in', {replace: true})        
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setButtonRegistration('Зарегестрироваться'));    
  }
  function handleEnterUser({ email, password}) {
    setButtonEnter('Проверка...')
    api.getUserToken({email, password})
      .then(res => {
        console.log(res)
        if(res.token) {
          handleLogin()
          navigate('/', {replace: true})
        }       
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setButtonEnter('Вход'));    
  }

  useEffect(() => {
    handleTokenCheck();
  }, [])

  const handleTokenCheck = () => {
    if (localStorage.getItem('jwt')){
      const localJWT = localStorage.getItem('jwt');
      api.checkUserToken(localJWT).then((res) => {        
        if (res){
          setUserAuthInfo(res)
          setLoggedIn(true);          
          navigate("/", {replace: true})
        }
        navigate("/sign-in", {replace: true})
      });
    }
  }  
  const handleSignOut = () => {
    setLoggedIn(false);  
    localStorage.removeItem('jwt');
    navigate("/sign-in", {replace: true})  
  }
  /** Отправляем ссылку нового аватара пользователя на сервер, меняем подпись кнопки сабмита при загрузке,
    * полученный ответ записываем в глобальный стэйт. */
  function handleUpdateAvatar(avatarUrl) {
    setButtonSaveAvatar('Сохранение...')
    api.pushAvatar(avatarUrl)
      .then(newAvatar => {
        setCurrentUser(newAvatar)
        closeAllPopups()      
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setButtonSaveAvatar('Сохранить'));    
  }
  /** Отправялеем данные карточки на сервер, меняем подпись кнопки сабмита при загрузке,
    * полученную карточку подгружаем в глобальный стэйт. */
  function handleAddCard({name, url}) {
    setButtonCreateCard("Создание...")
    api.pushInfoCreateCard({name, url})
      .then(newCard => {
        console.log(newCard)
        setCards([newCard, ...cards])
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err); // выведем ошибку в консоль
      })
      .finally(() => setButtonCreateCard('Создать'));      
  }
  /** По id карточки отправляем запрос на удаление, после ответа фильтруем карточки 
    * в глобальном стэйте по id и возврящаем все кроме той что удалили. */
  function handleCardDelete(cardId) {
    setButtonConfirm('Удаление...')
    api.deleteCard(cardId)
      .then(() => {
        setCards((cards) => cards.filter(item => {          
          return item._id !== cardId
        }));
        setIdDeleteCard('');  
        closeAllPopups()
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => setButtonConfirm('Да'));    
  }
  /** Проверяем состояние стэйтов открытия попапов, если хоть один открыт - true. */
  const isSomePopupOpen = isOpenProfilePopup || isOpenAvatarPopup || isOpenAddCardPopup || isOpenConfirmPopup || selectedCard
  /** Если хоть один попап открыт то вешаем слушатели на документ. */
  useEffect(() => {
    function closePopupByEsc (key) {    
      if (key.key === 'Escape') {
        closeAllPopups()
      }
    }
    function closePopupByClickOverlay (e) {
      if (e.target.classList.contains('popup')) {
        closeAllPopups()
      }
    }
    if(isSomePopupOpen) {
      document.addEventListener("keydown", closePopupByEsc);
      document.addEventListener('click', closePopupByClickOverlay);
      return () => {
        document.removeEventListener("keydown", closePopupByEsc);
        document.removeEventListener('click', closePopupByClickOverlay);
      }
    }   
  }, [isSomePopupOpen])

  function handleCardClick({name, link}) {    
    setSelectedCard({name, link})
  };   

   function isEditProfilePopupOpen() { 
    setIsOpenProfilePopup(true);    
  };

  function isEditAvatarPopupOpen() {  
    setIsOpenAvatarPopup(true);    
  };

  function isAddPlacePopupOpen() {  
    setIsOpenAddCardPopup(true);    
  };

  function handleDeleteClick(idCard) {  
    setIsOpenConfirmPopup(true);
    setIdDeleteCard(idCard)    
  };

  function closeAllPopups () {
    setIsOpenProfilePopup(false)
    setIsOpenAvatarPopup(false)
    setIsOpenAddCardPopup(false)
    setIsOpenConfirmPopup(false)
    setSelectedCard(false)
  };

  return (
    <CurrentUserContext.Provider value={currentUser}>        
      <div className="content">      
        <Routes>
          
          <Route path='/sign-up' element={  
            <> 
              <Header emailUser = {userAuthInfo} loggedIn={loggedIn} onExit={handleSignOut} registration = {true}/>          
              <Register onRegisterUser={handleRegisterUser} buttonText={buttonRegistration}/>
            </>
          } />
          <Route path='/sign-in' element={  
            <>
              <Header emailUser = {userAuthInfo} loggedIn={loggedIn} onExit={handleSignOut} registartion = {false}/>           
              <Login onEnterUser={handleEnterUser} buttonText={buttonEnter}/>
            </>
          } />
          <Route path='/' element={ <ProtectedRouteElement component={
            Main} 
            cards = {cards}
            onCardLike={handleCardLike}
            onCardClick={handleCardClick}
            onCardDelete={handleDeleteClick}
            onEditProfile={isEditProfilePopupOpen}         
            onEditAvatar={isEditAvatarPopupOpen} 
            onAddPlace={isAddPlacePopupOpen}
            
           loggedIn={loggedIn}/>            
          } />
        </Routes>          
        {loggedIn && <Footer />}        
        <EditProfilePopup 
          buttonText={buttonSaveProfile} 
          onUpdateUser={handleUpdateUser} 
          isOpen={isOpenProfilePopup} 
          onClose={closeAllPopups} />
        <EditAvatarPopup 
          buttonText={buttonSaveAvatar} 
          onUpdateAvatar={handleUpdateAvatar} 
          isOpen={isOpenAvatarPopup}
          onClose={closeAllPopups} />  
        <AddCardPopup 
          buttonText={buttonCreateCard} 
          onAddCard={handleAddCard} 
          isOpen={isOpenAddCardPopup}
          onClose={closeAllPopups} />
        <ConfirmDeletePopup 
          buttonText={buttonConfirm} 
          onCardDelete={handleCardDelete} 
          idCard={idDeleteCard} 
          isOpen={isOpenConfirmPopup}
          onClose={closeAllPopups} />                
        <ImagePopup card={selectedCard} onClose={closeAllPopups}/>            
      </div>    
    </CurrentUserContext.Provider>
  );
}

export default App;
