import React, { useState , useEffect} from 'react'; // импорт библиотеки
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'

import Main from './Main';
import ImagePopup from './ImagePopup';
import { CurrentUserContext } from '../contexts/CurrentUserContext';
import { OnCloseContext } from '../contexts/OnCloseContext';
import { ButtonTextContext } from '../contexts/ButtonTextContext';
import ImageAvatar from '../images/image.jpg';
import api from '../utils/Api';
import auth from '../utils/auth';
import EditProfilePopup from './EditProfilePopup';
import EditAvatarPopup from './EditAvatarPopup';
import AddCardPopup from './AddCardPopup';
import ConfirmDeletePopup from './ConfirmDeletePopup';
import Register from './Register';
import Login from './Login';
import ProtectedRouteElement from './ProtectedRoute';
import { Layout } from './Layout';
import InfoTooltip from './InfoTooltip';

function App() {
  /** Стэйты состояния открытия попапов. */
  const [isOpenProfilePopup, setIsOpenProfilePopup] = useState(false);
  const [isOpenAvatarPopup, setIsOpenAvatarPopup] = useState(false);
  const [isOpenAddCardPopup, setIsOpenAddCardPopup] = useState(false);
  const [isOpenConfirmPopup, setIsOpenConfirmPopup] = useState(false);
  const [isOpenInfoTooltip, setIsOpenInfoTooltip] = useState(false);

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

  /** стэйты для изменения текста в кнопках сабмита в формах. */  
  const [isLoading, setIsLoading] = useState(false)

  /** Стэйт авторизации пользователя. */
  const [loggedIn, setLoggedIn] = useState(false)
  const [userAuthInfo, setUserAuthInfo] = useState({})
  
  const handleLogin = () => {
    setLoggedIn(true);
  }

  const [infoTooltip, setInfoTooltip] = useState({})

  /** Получаем данные с сервера по объединенному запросу и записываем ответы в глобальные стэйты. */
  useEffect(() => {   
    loggedIn && Promise.all([
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
  }, [loggedIn])
  
  /** Проверяем наличие нашего лайка, по нему определяем в Api какой запрос отправить лайк или дизлайк. */
  function handleCardLike(card) {   
    const isLiked = card.likes.some(i => i._id === currentUser._id);  
    callingBaseToServer({
      apiMetod: api.changeLikeCardStatus(card._id, !isLiked),
      thenCallback: (newCard) => {        
        setCards((state) => state.map((c) => c._id === card._id ? newCard : c));       
      },
      tilteTooltip: {title: 'Что-то пошло не так! Попробуйте еще раз.', img: 'Union-red.png'}
    })     
  }
  /** Отправляем данные о пользователе на сервер, меняем подпись кнопки сабмита при загрузке,
    *  ответ с новыми данными записываем в глобальный стэйт. */
  function handleUpdateUser({ name, about }) {
    callingBaseToServer({
      apiMetod: api.pushUserInfo({name, about}),
      thenCallback: (userInformation) => {        
        setCurrentUser(userInformation)
        closeAllPopups()       
      },
      tilteTooltip: {title: 'Что-то пошло не так! Попробуйте еще раз.', img: 'Union-red.png'}
    })         
  }
  /** Отправляем данные для регимстрации пользователя, меняем подпись кнопки сабмита при загрузке,
    *  при положительном ответе переходим в окно входа. */
  const navigate = useNavigate();
  function handleRegisterUser({ email, password }) {
    callingBaseToServer({
      apiMetod: auth.regisrationNewUser({email, password}),
      thenCallback: (res) => {        
        if(!res.ok) {
          return Promise.reject(`Ошибка: ${res.status}`)            
        }
        setInfoTooltip({title: 'Вы успешно зарегестрировались!', img: 'Union.png'})        
        navigate('/sign-in', {replace: true})       
      },
      tilteTooltip: {title: 'Что-то пошло не так! Попробуйте еще раз.', img: 'Union-red.png'}
    })         
  }
  
  function handleEnterUser({ email, password }) {
    callingBaseToServer({
      apiMetod: auth.getUserToken({email, password }),
      thenCallback: (res) => {        
        if(res.token) {
          setUserAuthInfo({email})          
          localStorage.setItem('jwt', res.token)
          handleLogin()
          navigate('/', {replace: true})
        }       
      },
      tilteTooltip: {title: 'Неверный логин или пароль!', img: 'Union-red.png'}
    })         
  }

  useEffect(() => {
    handleTokenCheck();
  }, [])

  const handleTokenCheck = () => {
    if (localStorage.getItem('jwt')){      
      const localJWT = localStorage.getItem('jwt');
      callingBaseToServer({
        apiMetod: auth.checkUserToken(localJWT),
        thenCallback: (res) => {        
          if (res){          
            setUserAuthInfo(res.data)
            handleLogin();          
            navigate("/", {replace: true})
          }       
        }
      })      
    } else {
      navigate("/sign-in", {replace: true})
    } 
  }       

  const handleSignOut = () => {
    setLoggedIn(false);  
    localStorage.removeItem('jwt');
    setUserAuthInfo({})
    navigate("/sign-in", {replace: true})  
  }  

  
  /** Базовая функция для обращения к серверу и обработки ответа,
    * принимает апи метод и колбэк then так как обрабтка промиса индивидуальная. */
  function callingBaseToServer ({apiMetod, thenCallback, tilteTooltip}) {
    setIsLoading(true)
    apiMetod
      .then(thenCallback)
      .catch((err) => {
        setInfoTooltip(tilteTooltip)
        setIsOpenInfoTooltip(true)
        console.log(err);
      })
      .finally(() => {        
        setIsLoading(false)
      })
  }
  /** Отправляем ссылку нового аватара пользователя на сервер, меняем подпись кнопки сабмита при загрузке,
    * полученный ответ записываем в глобальный стэйт. */
  function handleUpdateAvatar(avatarUrl) {
    callingBaseToServer({
      apiMetod: api.pushAvatar(avatarUrl),
      thenCallback: (newAvatar) => {        
        setCurrentUser(newAvatar);
        closeAllPopups()
      },
      tilteTooltip: {title: 'Что-то пошло не так! Попробуйте еще раз.', img: 'Union-red.png'}
    })        
  }
  /** Отправялеем данные карточки на сервер, меняем подпись кнопки сабмита при загрузке,
    * полученную карточку подгружаем в глобальный стэйт. */
  function handleAddCard({name, url}) {
    callingBaseToServer({
      apiMetod: api.pushInfoCreateCard({name, url}),
      thenCallback: (newCard) => {        
        setCards([newCard, ...cards])
        closeAllPopups()
      },
      tilteTooltip: {title: 'Что-то пошло не так! Попробуйте еще раз.', img: 'Union-red.png'}
    })          
  }
  /** По id карточки отправляем запрос на удаление, после ответа фильтруем карточки 
    * в глобальном стэйте по id и возврящаем все кроме той что удалили. */
  function handleCardDelete(cardId) {
    callingBaseToServer({
      apiMetod: api.deleteCard(cardId),
      thenCallback: () => {        
        setCards((cards) => cards.filter(item => {          
          return item._id !== cardId
        }));
        setIdDeleteCard('');  
        closeAllPopups()
      },
      tilteTooltip: {title: 'Что-то пошло не так! Попробуйте еще раз.', img: 'Union-red.png'}
    })        
  }  
  
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
    setIsOpenInfoTooltip(false)
    setInfoTooltip({})
  };

  return (
    <OnCloseContext.Provider value={closeAllPopups}>
    <ButtonTextContext.Provider value={isLoading}>
    <CurrentUserContext.Provider value={currentUser}>        
      <div className="content">     
        <Routes>
          <Route to='/' element={<Layout email={userAuthInfo.email} onExit={handleSignOut}/>}>
            <Route path='*' element={<Navigate to='/' replace/>} />
            <Route path='sign-up' element={                        
              <Register nameForm='registration' onRegisterUser={handleRegisterUser} />           
            } />
            <Route path='sign-in' element={                       
              <Login nameForm='login' onEnterUser={handleEnterUser} />           
            } />
            <Route index element={<ProtectedRouteElement component={ Main } 
              cards = {cards}
              onCardLike={handleCardLike}
              onCardClick={handleCardClick}
              onCardDelete={handleDeleteClick}
              onEditProfile={isEditProfilePopupOpen}         
              onEditAvatar={isEditAvatarPopupOpen} 
              onAddPlace={isAddPlacePopupOpen}              
              loggedIn={loggedIn}/>            
            } />
          </Route>
        </Routes>               
        <EditProfilePopup            
          onUpdateUser={handleUpdateUser} 
          isOpen={isOpenProfilePopup} />
        <EditAvatarPopup           
          onUpdateAvatar={handleUpdateAvatar} 
          isOpen={isOpenAvatarPopup} />  
        <AddCardPopup           
          onAddCard={handleAddCard} 
          isOpen={isOpenAddCardPopup} />
        <ConfirmDeletePopup           
          onCardDelete={handleCardDelete} 
          idCard={idDeleteCard} 
          isOpen={isOpenConfirmPopup} />                
        <ImagePopup 
          card={selectedCard} />
        <InfoTooltip 
          isOpen={isOpenInfoTooltip}
          title={infoTooltip.title}
          icon={infoTooltip.img} />            
      </div>    
    </CurrentUserContext.Provider>
    </ButtonTextContext.Provider>
    </OnCloseContext.Provider>    
  );
}

export default App;
