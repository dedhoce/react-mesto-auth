class Api {
  constructor(options) {
    this._baseUrl = options.baseUrl
    this._headers = options.headers    
  }
  
  _getResponseData(res) {
    if (!res.ok) {
        return Promise.reject(`Ошибка: ${res.status}`); 
    }
    return res.json();  
  }

  getUserInfo() {    
    return fetch(`${this._baseUrl}/users/me`, {
      headers: this._headers      
    })
    .then(res => this._getResponseData(res))            
  }  

  pushUserInfo({name, about}) {    
    return fetch(`${this._baseUrl}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name,
        about
      })
    })
    .then(res => this._getResponseData(res))
  }

  pushAvatar({avatar}) {
    console.log(avatar)        
    return fetch(`${this._baseUrl}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: avatar        
      })
    })
    .then(res => this._getResponseData(res)) 
  }

  getInitialCards() {    
    return fetch(`${this._baseUrl}/cards`, {
      headers: this._headers      
    })
    .then(res => this._getResponseData(res))            
  }

  deleteCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}`, {
      method: 'DELETE',
      headers: this._headers      
    })
    .then(res => this._getResponseData(res))
  }

  pushInfoCreateCard({name, url}) {    
    return fetch(`${this._baseUrl}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: name,
        link: url         
      })
    })
    .then(res => this._getResponseData(res))
  }

  regisrationNewUser({email, password}) {
    return fetch('https://auth.nomoreparties.co/signup', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        email
      })
    })
  }

  checkUserToken(localJWT) {
    return fetch('https://auth.nomoreparties.co/users/me', {
      method: 'GET',
      headers: {
        "Content-Type": "application/json",
        "Authorization" : `Bearer ${localJWT}`
      }      
    })
    .then(res => this._getResponseData(res))
  }

  getUserToken({email, password}) {
    return fetch('https://auth.nomoreparties.co/signin', {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        password,
        email
      })
    })
    .then(res => this._getResponseData(res))
  }

  _likeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'PUT',
      headers: this._headers      
    })
    .then(res => this._getResponseData(res))  
  }

  _deleteLikeCard(cardId) {
    return fetch(`${this._baseUrl}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this._headers      
    })
    .then(res => this._getResponseData(res))
  }

  changeLikeCardStatus(cardId, likeStatus) {
    if(likeStatus) {
      return this._likeCard(cardId)
    }
    return this._deleteLikeCard(cardId)
  } 
}

const api = new Api({
  baseUrl: "https://mesto.nomoreparties.co/v1/cohort-75",
  headers: {
    authorization: "6a605e63-1774-4c5f-989e-07adc5e69a71",
    "Content-Type": "application/json",
  },
});

export default api




