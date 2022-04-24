const friendList = document.querySelector('#friend-list')
const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'
const SHOW_URL = INDEX_URL + '/:id'
const friendListArray = JSON.parse(localStorage.getItem('Best Friend')) || []

// 搜尋欄
const searchForm = document.querySelector('#search-form')
const formBack = document.querySelector('#form-back')

// modal上的加入摯友功能
const friendModal = document.querySelector('#friend-modal')



// 函式區
// 函式:顯示朋友名單
function displayFriendList(data) {
  let friendListData = ""
  data.forEach(item => {
    friendListData += `
    <div class="col-sm-2">
      <div class="card">
        <img src="${item.avatar}"
          class="card-img-top " alt="..." id="friend-list-image" data-bs-toggle="modal" data-bs-target="#friend-modal" data-id="${item.id}">
          <div class="card-body">
            <p5 class="card-title fs-5" id="friend-list-name">${item.surname}</br>${item.name}</p5>
          </div>
      </div>
    </div>
  `
  })
  friendList.innerHTML = friendListData
}
// 函式:renderModal資料
function renderModaldata(data) {
  const friendModalTitle = document.querySelector('#friend-modal-title')
  const friendModalImage = document.querySelector('#friend-modal-image')
  const friendModalId = document.querySelector('#friend-modal-id')
  const friendModalGender = document.querySelector('#friend-modal-gender')
  const friendModalAge = document.querySelector('#friend-modal-age')
  const friendModalEmail = document.querySelector('#friend-modal-email')
  const friendModalRegion = document.querySelector('#friend-modal-region')
  const friendModalBirthday = document.querySelector('#friend-modal-birthday')
  const friendModalAddButton = document.querySelector('#friend-modal-add-button')

  axios
    .get(INDEX_URL + data)
    .then(function (response) {
      const modalDatas = response.data

      friendModalTitle.innerText = modalDatas.surname + "  " + modalDatas.name
      friendModalBirthday.innerText = "birthday : " + modalDatas.birthday
      friendModalId.innerText = "id : " + modalDatas.id
      friendModalGender.innerText = "gender : " + modalDatas.gender
      friendModalAge.innerText = "age : " + modalDatas.age
      friendModalEmail.innerText = "email : " + modalDatas.email
      friendModalRegion.innerText = "region : " + modalDatas.region
      friendModalImage.src = modalDatas.avatar
      friendModalAddButton.innerHTML = `
        <div>
          <button type="button" class="btn btn-primary" data-id="${modalDatas.id}"">Add</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
        </div>
      `
    })
}

// 函式:加入到我的摯友 將點擊到的朋友資料送進 localStorage 儲存起來
function addBestFriendList(id) {
  const bestFriendList = JSON.parse(localStorage.getItem('Best Friend')) || []
  const bestFriend = friendListArray.find((friend) => friend.id === id)

  if (bestFriendList.some((friend) => friend.id === id)) {
    return alert('此朋友已經在名單中')
  }
  bestFriendList.push(bestFriend)
  localStorage.setItem('Best Friend', JSON.stringify(bestFriendList))
}


// 裝監聽器，監聽點擊圖片後，更改friendmodal的資料
friendList.addEventListener('click', function onImageClicked(event) {
  if (event.target.matches('.card-img-top')) {
    renderModaldata(Number(event.target.dataset.id))
  }
})

// 在搜尋表格上裝監聽器
searchForm.addEventListener('submit', function onSerchFormSubmitted(event) {
  event.preventDefault()
  const inputValue = document.querySelector('#input-value').value.trim().toLowerCase()
  let MatchSearchList = []
  // name 和 surname 都要判斷
  MatchSearchList = friendListArray.filter(
    item => item.name.toLowerCase().includes(inputValue) || item.surname.toLowerCase().includes(inputValue))

  if (MatchSearchList.length === 0) {
    return alert(`沒有符合關鍵字： ${inputValue} 的朋友`)
  }
  displayFriendList(MatchSearchList)
})

// 在搜尋表格的back鍵裝監聽器
// searchForm.addEventListener('click' , function onFormBackClicked(event){
//   if(event.target.matches('.btn-dark')){
//   axios
//   .get(INDEX_URL)
//   .then(function(response) {
//     const data = response.data.results
//     friendListArray.push(...data)
//     displayFriendList(friendListArray)
//   })   
// }  
// })
// 寫法二：在搜尋表格的back鍵裝監聽器 
formBack.addEventListener('click', function onFormBackClicked(event) {
  axios
    .get(INDEX_URL)
    .then(function (response) {
      const data = response.data.results
      friendListArray.push(...data)
      displayFriendList(friendListArray)
    })
})

// 在modal文件上的add按鈕裝監聽器
friendModal.addEventListener('click', function onModalAddButtom(event) {
  if (event.target.matches('.btn-primary')) {
    addBestFriendList(Number(event.target.dataset.id))
  }
})

// 呼叫朋友資料
displayFriendList(friendListArray)