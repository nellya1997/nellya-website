import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-app.js';
import { getAnalytics } from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-analytics.js';
import {
  getDatabase,
  ref as databaseRef,
  get,
  set,
} from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-database.js';
import {
  getStorage,
  uploadBytes,
  getDownloadURL,
  ref as storagesRef,
} from 'https://www.gstatic.com/firebasejs/10.3.0/firebase-storage.js';

const firebaseConfig = {
  apiKey: 'AIzaSyAXPOZS9BqL_3K7_1WkTIit4KO5rwxb7uE',
  authDomain: 'wedding-edec2.firebaseapp.com',
  databaseURL: 'https://wedding-edec2-default-rtdb.firebaseio.com',
  projectId: 'wedding-edec2',
  storageBucket: 'wedding-edec2.appspot.com',
  messagingSenderId: '101659396471',
  appId: '1:101659396471:web:11e65008c36b656e60b972',
  measurementId: 'G-CY7KVVYYS0',
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getDatabase();
const storage = getStorage();
const stageIndicators = document.querySelectorAll('.stage-indicator');
const backButton = document.createElement('button');
backButton.textContent = 'Назад';
backButton.className = 'back-button';
const tableGrid = document.getElementById('table-grid');
const stageHeader = document.getElementById('stage-header');
const tableInfo = document.createElement('p');

let currentStage = 1;
let selectedTable = null;
let selectedSeat = null;

function updateStageDisplay() {
  stageIndicators.forEach((indicator) => {
    const stage = parseInt(indicator.getAttribute('data-stage'));
    if (stage <= currentStage) {
      indicator.classList.add('active');
    } else {
      indicator.classList.remove('active');
    }
  });
}

function updateSeatStatus(tableIndex, seatIndex, isOccupied, guestName) {
  const seatRef = ref(db, `tables/${tableIndex}/seats/${seatIndex}`);
  const newSeatData = {
    isOccupied: isOccupied,
    guestName: guestName,
  };

  set(seatRef, newSeatData)
    .then(() => {
      if (currentStage === 1) {
        showSeats();
      } else if (currentStage === 2) {
        showUserInfoForm();
      }
    })
    .catch((error) => {
      console.error('Error updating seat status:', error);
    });
}

function showTables() {
  currentStage = 1;
  tableGrid.innerHTML = '';
  stageHeader.innerHTML = '<h1>Выберите стол</h1>';
  const wedding_img = document.getElementById('wedding_img');
  wedding_img.style.display = 'flex';
  const totalTables = 4;
  const tablesContainer = document.createElement('div');
  tablesContainer.className = 'tables-container';

  for (let i = 0; i < 2; i++) {
    const tables = document.createElement('div');
    tables.className = 'tables';
    for (let tableIndex = 0; tableIndex < 2; tableIndex++) {
      const tableElement = document.createElement('div');
      tableElement.className = 'table';
      tableElement.textContent = `Стол ${i * 2 + tableIndex + 1}`;

      const tableRef = databaseRef(db, `tables/${i * 2 + tableIndex}`);
      get(tableRef).then((snapshot) => {
        const tableData = snapshot.val();
        if (tableData && tableData.seats) {
          const totalSeats = tableData.seats.length;
          let occupiedSeats = 0;
          for (let seat of tableData.seats) {
            if (seat.isOccupied) {
              occupiedSeats++;
            }
          }
          const availableSeats = totalSeats - occupiedSeats;
          const availabilityInfo = document.createElement('p');
          availabilityInfo.textContent = `Свободно ${availableSeats}/${totalSeats} мест`;
          tableElement.appendChild(availabilityInfo);
        }
      });

      tableElement.addEventListener('click', () => {
        selectedTable = i * 2 + tableIndex;
        showSeats();
      });

      tables.appendChild(tableElement);
    }
    tablesContainer.appendChild(tables);
  }

  tableGrid.appendChild(tablesContainer);
  updateStageDisplay();
}

function showSeats() {
  currentStage = 2;
  tableGrid.innerHTML = '';
  const wedding_img = document.getElementById('wedding_img');
  wedding_img.style.display = 'none';
  backButton.style.display = 'inline';
  stageHeader.innerHTML = '<h1>Выберите место</h1>';
  const seatsContent = document.createElement('div');
  seatsContent.className = 'seats-content';
  const seatsContainer1 = document.createElement('div');
  seatsContainer1.className = 'seats';
  const seatsContainer2 = document.createElement('div');
  seatsContainer2.className = 'seats';
  const seatsPerTable = 10;
  const tableRef = databaseRef(db, `tables/${selectedTable}`);
  get(tableRef).then((snapshot) => {
    const tableData = snapshot.val();
    if (tableData && tableData.seats) {
      for (let seatIndex = 0; seatIndex < seatsPerTable; seatIndex++) {
        const seatElement = createSeatElement(
          seatIndex,
          tableData.seats[seatIndex],
        );

        if (seatIndex < 5) {
          seatsContainer1.appendChild(seatElement);
        } else {
          seatsContainer2.appendChild(seatElement);
        }
      }
      seatsContent.appendChild(seatsContainer1);
      seatsContent.appendChild(seatsContainer2);
      tableInfo.textContent = `Стол ${selectedTable + 1}`;
      tableGrid.appendChild(tableInfo);
      tableGrid.appendChild(seatsContent);
      backButton.removeEventListener('click', showSeats);
      backButton.removeEventListener('click', showUserInfoForm);
      backButton.addEventListener('click', showTables);
      tableGrid.appendChild(backButton);
      updateStageDisplay();
    }
  });
}

function showModal(guestName, tableNumber, seatNumber, photoURL) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-modal" id="close-modal">&times;</span>
      <div class="modal-body">
        ${
          photoURL
            ? `<img src="${photoURL}" alt="${guestName}" class="seat-photo">`
            : ''
        }
        <p>Имя: ${guestName}</p>
        <p>Стол: ${tableNumber}, Место: ${seatNumber}</p>
      </div>
    </div>
  `;

  modal.style.display = 'block';

  const closeModalButton = modal.querySelector('#close-modal');
  closeModalButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  document.body.appendChild(modal);
}

function createSeatElement(seatIndex, seatData) {
  const seatElement = document.createElement('div');
  seatElement.className = 'seat';

  if (seatData.isOccupied) {
    if (seatData.photoURL) {
      const seatImage = document.createElement('img');
      seatImage.src = seatData.photoURL;
      seatImage.alt = seatData.guestName;
      seatElement.innerHTML = ''; // Очистка сиденья
      seatElement.appendChild(seatImage);
    } else {
      seatElement.classList.add('occupied');
      seatElement.textContent = seatData.guestName;
    }
    seatElement.addEventListener('click', () => {
      showModal(
        seatData.guestName,
        selectedTable + 1,
        seatIndex + 1,
        seatData.photoURL,
      );
    });
  } else {
    seatElement.addEventListener('click', () => {
      selectedSeat = seatIndex;
      showUserInfoForm();
    });
  }

  return seatElement;
}

showTables();

function showUserInfoForm() {
  currentStage = 3;
  tableGrid.innerHTML = '';
  stageHeader.innerHTML = '<h1>Введите данные</h1>';
  const wedding_img = document.getElementById('wedding_img');
  wedding_img.style.display = 'none';
  backButton.style.display = 'inline';
  const formContainer = document.createElement('div');
  formContainer.className = 'form-container';

  const nameContainer = document.createElement('div');
  nameContainer.className = 'nameContainer';
  const nameLabel = document.createElement('label');
  nameLabel.textContent = 'Как вас зовут?';
  const nameInput = document.createElement('input');
  nameInput.type = 'text';
  nameContainer.appendChild(nameLabel);
  nameContainer.appendChild(nameInput);

  const genderContainer = document.createElement('div');
  genderContainer.className = 'genderContainer';
  const genderTitle = document.createElement('p');
  genderTitle.textContent = 'Ваш пол';
  genderContainer.appendChild(genderTitle);

  const genderDiv = document.createElement('div');
  genderDiv.className = 'genderDiv';

  const maleContainer = document.createElement('div');
  const maleLabel = document.createElement('label');
  maleLabel.textContent = 'М';
  const maleRadio = document.createElement('input');
  maleRadio.type = 'radio';
  maleRadio.name = 'gender';
  maleRadio.value = 'male';
  maleRadio.id = 'maleRadio';
  maleContainer.appendChild(maleRadio);
  maleContainer.appendChild(maleLabel);

  const femaleContainer = document.createElement('div');
  const femaleLabel = document.createElement('label');
  femaleLabel.textContent = 'Ж';
  const femaleRadio = document.createElement('input');
  femaleRadio.type = 'radio';
  femaleRadio.name = 'gender';
  femaleRadio.value = 'female';
  femaleRadio.id = 'femaleRadio';
  femaleContainer.appendChild(femaleRadio);
  femaleContainer.appendChild(femaleLabel);

  genderDiv.appendChild(maleContainer);
  genderDiv.appendChild(femaleContainer);

  genderContainer.appendChild(genderDiv);

  const ageContainer = document.createElement('div');
  ageContainer.className = 'ageContainer';
  const ageLabel = document.createElement('label');
  ageLabel.textContent = 'Возраст:';
  const ageCounter = document.createElement('div');
  ageCounter.className = 'age-counter';
  const ageDisplay = document.createElement('input');
  ageDisplay.type = 'text';
  ageDisplay.pattern = '[0-9]{1,2}';
  ageDisplay.maxLength = 2;
  ageDisplay.className = 'age-input'; // Добавьте класс для стилизации, если необходимо

  //ageDisplay.value = '0';
  ageDisplay.placeholder = '0';

  const incrementButton = document.createElement('button');
  incrementButton.textContent = '+';
  incrementButton.addEventListener('click', () => {
    const currentAge = parseInt(ageDisplay.value);
    if (!isNaN(currentAge)) {
      ageDisplay.value = (currentAge + 1).toString();
    }
  });

  const decrementButton = document.createElement('button');
  decrementButton.textContent = '-';
  decrementButton.addEventListener('click', () => {
    const currentAge = parseInt(ageDisplay.value);
    if (!isNaN(currentAge) && currentAge > 0) {
      ageDisplay.value = (currentAge - 1).toString();
    }
  });

  ageDisplay.addEventListener('input', () => {
    const value = ageDisplay.value;
    if (value.length === 2 && value.startsWith('0')) {
      ageDisplay.value = value.charAt(1);
    }
  });

  ageCounter.appendChild(decrementButton);
  ageCounter.appendChild(ageDisplay);
  ageCounter.appendChild(incrementButton);

  ageContainer.appendChild(ageLabel);
  ageContainer.appendChild(ageCounter);

  const photoContainer = document.createElement('div');
  photoContainer.className = 'photoContainer';
  const photoLabel = document.createElement('label');
  photoLabel.textContent = 'Загрузить фото:';
  const photoInput = document.createElement('input');
  photoInput.type = 'file';
  photoInput.accept = 'image/*';
  photoInput.className = 'file-input';
  const photoPreview = document.createElement('img');
  photoPreview.id = 'photo-preview';
  photoPreview.style.display = 'block';
  photoPreview.style.maxWidth = '100%';
  photoInput.addEventListener('change', () => {
    const photoFile = photoInput.files[0];
    if (photoFile) {
      const reader = new FileReader();
      reader.onload = function (e) {
        photoPreview.src = e.target.result;
        photoPreview.style.display = 'block';
      };
      reader.readAsDataURL(photoFile);
    } else {
      photoPreview.src = '';
      photoPreview.style.display = 'none';
    }
  });
  photoContainer.appendChild(photoLabel);
  photoContainer.appendChild(photoInput);
  photoContainer.appendChild(photoPreview);

  const sideContainer = document.createElement('div');
  sideContainer.className = 'sideContainer';

  const sideText = document.createElement('div');
  sideText.textContent = 'Я со стороны:';
  sideText.className = 'sideText';

  const sideOptions = document.createElement('div');
  sideOptions.className = 'sideOptions';

  const manDiv = document.createElement('div');
  manDiv.className = 'sideOption';
  const manImage = document.createElement('img');
  manImage.src = './img/man.png';
  const manCheck = document.createElement('img');
  manCheck.src = './img/check.png';
  manCheck.className = 'check';
  manCheck.style.display = 'none';

  const manText = document.createElement('div');
  manText.textContent = 'Жениха';
  manText.className = 'sideOptionText';

  manDiv.appendChild(manImage);
  manDiv.appendChild(manCheck);
  manDiv.appendChild(manText);

  const womanDiv = document.createElement('div');
  womanDiv.className = 'sideOption';
  const womanImage = document.createElement('img');
  womanImage.src = './img/woman.png';
  const womanCheck = document.createElement('img');
  womanCheck.src = './img/check.png';
  womanCheck.className = 'check';
  womanCheck.style.display = 'none';

  const womanText = document.createElement('div');
  womanText.textContent = 'Невесты';
  womanText.className = 'sideOptionText';

  womanDiv.appendChild(womanImage);
  womanDiv.appendChild(womanCheck);
  womanDiv.appendChild(womanText);

  manDiv.addEventListener('click', () => {
    manCheck.style.display = 'block';
    womanCheck.style.display = 'none';
  });

  womanDiv.addEventListener('click', () => {
    womanCheck.style.display = 'block';
    manCheck.style.display = 'none';
  });
  sideOptions.appendChild(manDiv);
  sideOptions.appendChild(womanDiv);
  sideContainer.appendChild(sideText);
  sideContainer.appendChild(sideOptions);

  const guestContainer = document.createElement('div');
  guestContainer.className = 'guestContainer';

  const guestText = document.createElement('div');
  guestText.textContent = 'Со мной придут:';
  guestText.className = 'guestText';

  const guestOptions = document.createElement('div');
  guestOptions.className = 'guestOptions';

  const addGuestButton = document.createElement('button');
  addGuestButton.textContent = 'Добавить гостя';

  addGuestButton.addEventListener('click', addGuestInputAboveButton);

  guestOptions.appendChild(addGuestButton);

  guestContainer.appendChild(guestText);
  guestContainer.appendChild(guestOptions);

  function addGuestInputAboveButton() {
    if (guestOptions.children.length < 4) {
      const guestInput = document.createElement('input');
      guestInput.type = 'text';
      guestInput.placeholder = 'Имя гостя';

      guestOptions.insertBefore(guestInput, addGuestButton);

      guestInput.addEventListener('input', () => {
        let guests = [];
        const guestName = guestInput.value;
        if (guestName) {
          guests.push(guestName);
        }
      });
    }
  }

  addGuestInputAboveButton();

  formContainer.appendChild(photoContainer);
  formContainer.appendChild(nameContainer);
  formContainer.appendChild(genderContainer);
  formContainer.appendChild(ageContainer);
  formContainer.appendChild(sideContainer);
  formContainer.appendChild(guestContainer);

  const submitButton = document.createElement('button');
  submitButton.textContent = 'Подтвердить';
  submitButton.addEventListener('click', () => {
    const name = nameInput.value;
    const gender = maleRadio.checked
      ? 'М'
      : femaleRadio.checked
      ? 'Ж'
      : 'Не выбран';
    const age = ageDisplay.value;
    let sideText = '';
    let guests = [];

    if (maleRadio.checked) {
      sideText = 'со стороны Жениха';
    } else if (femaleRadio.checked) {
      sideText = 'со стороны Невесты';
    }

    const guestInputs = guestOptions.querySelectorAll('input[type="text"]');
    guestInputs.forEach((input) => {
      if (input.value) {
        guests.push(input.value);
      }
    });

    if (name && gender !== 'Не выбран' && age >= 0) {
      const photoFile = photoInput.files[0];
      if (photoFile) {
        const storageRef = storagesRef(
          storage,
          `photo/${selectedTable}/${selectedSeat}/${name}.png`,
        );
        uploadBytes(storageRef, photoFile)
          .then((snapshot) => {
            console.log('Uploaded a blob or file!');
            getDownloadURL(snapshot.ref).then((downloadURL) => {
              console.log('File available at', downloadURL);
              submitUserInfo(name, gender, age, downloadURL, sideText, guests); // Передаем гостей в функцию
              formContainer.style.display = 'none';
              backButton.style.display = 'none';
            });
          })
          .catch((error) => {
            console.error('Error uploading file:', error);
          });
      } else {
        submitUserInfo(name, gender, age, null, sideText, guests); // Передаем гостей в функцию
        formContainer.style.display = 'none';
        backButton.style.display = 'none';
      }
    }
  });

  formContainer.appendChild(submitButton);

  tableGrid.appendChild(formContainer);

  backButton.addEventListener('click', showSeats);
  tableGrid.appendChild(backButton);
  updateStageDisplay();
}

let confirmationDisplayed = false; // Add this variable

function showConfirmationWindow(name, gender, age, side, guests) {
  if (!confirmationDisplayed) {
    confirmationDisplayed = true;
    const confirmationWindow = document.createElement('div');
    confirmationWindow.className = 'custom-alert';
    const img_done = document.createElement('img');
    img_done.src = './img/img_done.png';
    img_done.className = 'img_done';
    confirmationWindow.appendChild(img_done);
    const confirmationText = document.createElement('p');
    confirmationText.textContent = `Вы выбрали стол ${
      selectedTable + 1
    }, сиденье ${
      selectedSeat + 1
    }. Имя: ${name}, Пол: ${gender}, Возраст: ${age}, Сторона: ${side}, Гости: ${guests.join(
      ', ',
    )}`;
    confirmationWindow.appendChild(confirmationText);

    const returnButton = document.createElement('button');
    returnButton.textContent = 'На главную';
    returnButton.addEventListener('click', () => {
      confirmationWindow.style.display = 'none';
      showTables();
    });
    confirmationWindow.appendChild(returnButton);

    const rootDiv = document.getElementById('root');
    const stageContainer = document.querySelector('.stage-container');
    rootDiv.insertBefore(confirmationWindow, stageContainer.nextSibling);
    confirmationWindow.style.display = 'flex';

    setTimeout(() => {
      confirmationWindow.style.display = 'none';
      showTables();
    }, 8000);
  }
}

function submitUserInfo(name, gender, age, photoURL, side, guests) {
  if (typeof side === 'undefined') {
    side = 'Не указана';
  }
  if (typeof guests === 'undefined') {
    guests = [];
  }
  const tableRef = databaseRef(db, `tables/${selectedTable}`);
  get(tableRef).then((snapshot) => {
    const tableData = snapshot.val();
    if (tableData && tableData.seats && tableData.seats[selectedSeat]) {
      tableData.seats[selectedSeat].isOccupied = true;
      tableData.seats[selectedSeat].guestName = name;
      tableData.seats[selectedSeat].gender = gender;
      tableData.seats[selectedSeat].age = age;
      tableData.seats[selectedSeat].photoURL = photoURL;
      tableData.seats[selectedSeat].side = side;
      tableData.seats[selectedSeat].guests = guests;

      set(tableRef, tableData)
        .then(() => {
          showConfirmationWindow(name, gender, age, side, guests); // Обновление возраста в функции подтверждения
          formContainer.style.display = 'none';
          showUserInfoForm();
        })
        .catch((error) => {
          console.error('Error updating table data:', error);
        });
    }
  });
}

showTables();
