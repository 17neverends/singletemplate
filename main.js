const departureInput = document.getElementById('departure_city');
const targetInput = document.getElementById('destination_city');
const departureCityList = document.getElementById('departure_city-list');
const destinationCityList = document.getElementById('destination_city-list');
let backButton = document.getElementById("back_to_2");
let backButtonTo3 = document.getElementById("back_to_3");
let star;

async function init() {
  setupEventListeners();
}

class Result {
  constructor(
  field1 = false,
  field2 = false,
  field3 = false,
  field4 = false,
  field5 = false,
  field6 = false,
  field7 = [],
  ) {
  this.field1 = field1;
  this.field2 = field2;
  this.field3 = field3;
  this.field4 = field4;
  this.field5 = field5;
  this.field6 = field6;
  this.field7 = field7;
  }

  logInfo() {
      console.log('Field 1:', this.field1);
      console.log('Field 2:', this.field2);
      console.log('Field 3:', this.field3);
      console.log('Field 4:', this.field4); 
      console.log('Field 5:', this.field5);
      console.log('Field 6:', this.field6);
      console.log('Field 7:', this.field7);
  }
}

const status_text = document.getElementById('status1');
let page1 = document.querySelector('.step1');
let page2 = document.querySelector('.step2');
let page3 = document.querySelector('.step3');
let page4 = document.querySelector('.step4');
let page5 = document.querySelector('.step5');

let data;

let sliderpoint2 = document.getElementById('slider2');
let sliderpoint3 = document.getElementById('slider3');
let sliderpoint4 = document.getElementById('slider4');
let sliderpoint5 = document.getElementById('slider5');

const customDropdown = document.getElementById('custom_dropdown');
let placeCounter = 2;
let toTarif = false;
let departure_from_list = false;
let destination_from_list = false;
let placesData = [];
let details;
let filterTimeout;
let lastInputValue = '';
let selectedDepartureCityNumber;
let selectedDestinationCityNumber;
const result = new Result();

const cost_2 = document.getElementById('service_2_p');
const cost_3 = document.getElementById('service_3_p');
const cost_5 = document.getElementById('service_5_p');
const cost_6 = document.getElementById('service_6_p');
const cost_7 = document.getElementById('service_7_p');
const floorType = document.querySelector('input[name="floorType"]:checked');
const additionalCostElement = document.getElementById('additional_cost');

additionalCostElement.textContent = 'Доп. услуги не выбраны';
let initialTotalCost;
let totalcost;
let weight;
const checkboxService1 = document.getElementById('service1');
const checkboxService2 = document.getElementById('service2');
const checkboxService3 = document.getElementById('service3');
const checkboxService4 = document.getElementById('service4');
const checkboxService7 = document.getElementById('service7');
const boxesContainer = document.querySelector('.boxes');
const checkboxService5 = document.getElementById('service5');
const checkboxService6 = document.getElementById('service6');
const floorLift = document.getElementById('floorLift');
const manualRadio = document.getElementById('manual');
const liftRadio = document.getElementById('lift');
const bubbleWrapMeters = document.getElementById('bubbleWrapMeters');

let globalResult = {
  field7: {}
};

let contracts;
let boxData;

let needCheckPvz = false;



window.onload = function() {
  init();
  contracts = {
      "contracts": [
          "111",
          "222",
          "333"
      ]
  };

  contracts.contracts.forEach(template => {
      let listItem = document.createElement('li');
      listItem.textContent = template;
      custom_dropdown.appendChild(listItem);
  });

  if (contracts.contracts.length > 1) {
      document.getElementById('contract').addEventListener('click', function () {
          var dropdown = document.getElementById('custom_dropdown');
          var dropdownStyle = window.getComputedStyle(dropdown);
          if (dropdownStyle.getPropertyValue('display') === 'none') {
              dropdown.style.display = 'block';
          } else {
              dropdown.style.display = 'none';
          }
      });

      document.querySelectorAll('#custom_dropdown li').forEach(item => {
          item.addEventListener('click', event => {
              document.getElementById('contract').value = event.target.textContent;
              document.getElementById('custom_dropdown').style.display = 'none';
          });
      });
  } else {
      document.getElementById("contract").value = contracts.contracts[0];
  }
};

document.addEventListener("click", function(event) {
  var dropdown = document.getElementById("roleList");
  var input = document.getElementById("combobox_value");
  if (event.target !== dropdown && event.target !== input) {
      hideDropdown();
  }
});

function showDropdown() {
  var dropdown = document.getElementById("roleList");
  if (dropdown) {
    dropdown.style.display = "block";
  }
}

function hideDropdown() {
  var dropdown = document.getElementById("roleList");
  if (dropdown) {
    dropdown.style.display = "none";
  }
}


function selectRole(value, label) {
  var input = document.getElementById("combobox_value");
  input.value = label;
  hideDropdown();

  var checkboxContainer = document.getElementById("checkboxContainer");
  var paymentCheckbox = document.getElementById("paymentCheckbox");

  if (value === "sender" || value === "outsider") {
    checkboxContainer.style.display = "block";
  } else {
    checkboxContainer.style.display = "none";
    paymentCheckbox.checked = false;
  }
}





function addPlace() {
  if (placeCounter > 254){
    status_text.innerText = "Максимум 255 мест";
    return;
  }
  const newPlace = document.createElement('div');
  newPlace.classList.add('place');
  newPlace.id = 'place' + placeCounter;

  newPlace.innerHTML = `
      <p class="place_title">Место ${placeCounter}</p>
      <label>Вес посылки (кг)</label>
      <input type="text" id="box_weight${placeCounter}" name="box_weight${placeCounter}" placeholder="Введите вес посылки">
      <label id="box_size">Размер посылки (см)</label>
      <div class="size">
          <input type="text" id="box_length${placeCounter}" name="box_length${placeCounter}" placeholder="Длина">
          <p class="delimetr" style="color: #808080;">x</p>
          <input type="text" id="box_width${placeCounter}" name="box_width${placeCounter}" placeholder="Ширина">
          <p class="delimetr" style="color: #808080;">x</p>
          <input type="text" id="box_height${placeCounter}" name="box_height${placeCounter}" placeholder="Высота">
      </div>
      <label>Описание товара</label>
      <input type="text" id="desc${placeCounter}" name="desc${placeCounter}" value="ТНП" placeholder="Введите описание товара">
      <button class="created" id="for_delete" type="button" onclick="removePlace('${newPlace.id}')">Удалить</button>
  `;

  document.getElementById('places-container').appendChild(newPlace);

  placeCounter++;
}

function removePlace(placeId) {
  const placeToRemove = document.getElementById(placeId);

  placeToRemove.remove();

  const places = document.getElementsByClassName('place');
  for (let i = 0; i < places.length; i++) {
      const currentPlace = places[i];
      const newPlaceCounter = i + 1;

      currentPlace.id = 'place' + newPlaceCounter;
      currentPlace.querySelector('.place_title').innerText = 'Место ' + newPlaceCounter;

      currentPlace.querySelectorAll('[id^="box_weight"], [id^="box_length"], [id^="box_width"], [id^="box_height"], [id^="desc"]').forEach(element => {
          const currentElementId = element.id;
          element.id = currentElementId.replace(/\d+$/, newPlaceCounter);
      });

      const deleteButton = currentPlace.querySelector('button');
      if (deleteButton) {
          deleteButton.setAttribute('onclick', `removePlace('place${newPlaceCounter}')`);
      }
  }

  placeCounter--;
}

document.addEventListener('click', function(event) {
  if (event.target && event.target.matches('button[id^="delete"]')) {
      const buttonId = event.target.id;
      const placeId = buttonId.replace('delete', 'place');
      removePlace(placeId);
  }
});





function check_inputs_step1() {

  const places = document.getElementsByClassName('place');
  let isValid = true;
  const placesData = [];

  for (let i = 0; i < places.length; i++) {
    const currentPlace = places[i];
    const boxWeight = currentPlace.querySelector(`#box_weight${i + 1}`);
    const boxLength = currentPlace.querySelector(`#box_length${i + 1}`);
    const boxWidth = currentPlace.querySelector(`#box_width${i + 1}`);
    const boxHeight = currentPlace.querySelector(`#box_height${i + 1}`);

    removeErrorStyle(boxWeight);
    removeErrorStyle(boxLength);
    removeErrorStyle(boxWidth);
    removeErrorStyle(boxHeight);

    if (
      boxWeight.value.trim() !== '' &&
      boxLength.value.trim() !== '' &&
      boxWidth.value.trim() !== '' &&
      boxHeight.value.trim() !== ''
    ) {
      if (
        isValidNumber(boxWeight.value) &&
        isValidSize(boxLength.value) &&
        isValidSize(boxWidth.value) &&
        isValidSize(boxHeight.value)
      ) {
        const placeData = {
          weight: parseFloat(boxWeight.value),
          length: parseFloat(boxLength.value),
          width: parseFloat(boxWidth.value),
          height: parseFloat(boxHeight.value)
        };

        placesData.push(placeData);
      } else {
        if (!isValidNumber(boxWeight.value)) {
          applyErrorStyle(boxWeight);
        }
        if (!isValidSize(boxLength.value)) {
          applyErrorStyle(boxLength);
          status_text.innerText = 'Обратитесь к менеджеру для индивидуального расчета';
          return;

        }
        if (!isValidSize(boxWidth.value)) {
          applyErrorStyle(boxWidth);
          status_text.innerText = 'Обратитесь к менеджеру для индивидуального расчета';
          return;

        }
        if (!isValidSize(boxHeight.value)) {
          applyErrorStyle(boxHeight);
          status_text.innerText = 'Обратитесь к менеджеру для индивидуального расчета';
          return;
        }

        isValid = false;
      }
    } 
  }
  
  console.log(placesData);
  if (isValid) {
    // if (departure_from_list == true && destination_from_list == true && placesData.length > 0){
    //   toTarif = true;
    if (placesData.length > 0){
      toTarif = true;
    
  } if (toTarif){
    let urlParams = new URLSearchParams(window.location.search);
    let userId = urlParams.get('user_id');  
    let formData = new FormData();
    formData.append('userId', userId);
    
    let data = {
      "lang": "rus",
      "from_location": {
          "code": parseInt(selectedDepartureCityNumber, 10),
      },
      "to_location": {
          "code": parseInt(selectedDestinationCityNumber, 10)
      },
      "packages": []
    };
    
    
    placesData.forEach(packageData => {
      data.packages.push({
        "height": packageData.height,
        "length": packageData.length,
        "weight": packageData.weight,
        "width": packageData.width,
      });
    });
    console.log(data);
    formData.append('data', JSON.stringify(data));
    fetch('/get_data', {
      method: 'POST',
      body: formData
  }).then(() => {
    let responseData = {
      "details": [
          { "type": "дверь - дверь", "cost": "100₽", "datetime": "1-3 раб.д" },
          { "type": "Дверь - склад", "cost": "2000₽", "datetime": "2-3 раб.д" },
          { "type": "Склад - дверь", "cost": "3000₽", "datetime": "3-4 раб.д" },
          { "type": "Склад - склад", "cost": "400₽", "datetime": "1-2 раб.д" }
      ]
  };

  details = responseData.details;

  showDetailsOnPage();
  document.getElementById('status1').innerText = '';

  sliderShowPoint(2);
  sliderpoint2.style.display = 'block';

  })
  } else{ 
    console.log(weight);
    selectedType = 'Не выбран';
    boxData = {
      "Коробка XS": {
      "ширина": 17,
      "длина": 12,
      "высота": 9,
      "вес": 1,
      "стоимость": 20
      },
      "Коробка S": {
      "ширина": 23,
      "длина": 19,
      "высота": 10,
      "вес": 2,
      "стоимость": 40
      },
      "Коробка M": {
      "ширина": 33,
      "длина": 25,
      "высота": 15,
      "вес": 5,
      "стоимость": 60
      }
    }

    document.getElementById('totalcost').style.display = 'none';
    data = calculatePackagesSum(gatherFormData());
    star = false;
    initialTotalCost = calculateInitialCost();
    totalcost = initialTotalCost;
    updateCost();
    var manualRadio = document.getElementById("manual");
    manualRadio.checked = true;
    document.getElementById('status2').innerText = '';
    
    sliderShowPoint(3);
    cost_6.style.display = 'block';


  }
      } else {
        status_text.innerText = 'Заполните все поля корректно';
      }
}


function isValidNumber(value) {
  return !isNaN(parseFloat(value)) && isFinite(value) && value >= 1;
}

function isValidSize(value) {
  return !isNaN(parseFloat(value)) && isFinite(value) && value >= 1 && value < 160;
}


function applyErrorStyle(element) {
  element.style.borderColor = "red";
}

function removeErrorStyle(element) {
  element.style.borderColor = "";
}








function gatherFormData() {
  let formData = {
    template_name: document.getElementById('template_name').value,
    role: document.getElementById('combobox_value').value,
    paymentCheckbox: document.getElementById('paymentCheckbox').checked,
    departure_city: document.getElementById('departure_city').value,
    destination_city: document.getElementById('destination_city').value,
    places: []
  };

  let i = 1;

while (true) {
    let placeId = `place${i}`;
    let placeElement = document.getElementById(placeId);

    if (!placeElement) {
        break;
    }

    let placeData = {
        [`box_weight${i}`]: document.getElementById(`box_weight${i}`).value,
        [`box_length${i}`]: document.getElementById(`box_length${i}`).value,
        [`box_width${i}`]: document.getElementById(`box_width${i}`).value,
        [`box_height${i}`]: document.getElementById(`box_height${i}`).value,
        [`desc${i}`]: document.getElementById(`desc${i}`).value
    };

    formData.places.push(placeData);
    i++;
}

  return formData;
}





function handleInput(inputElement, list, input_value, otherList) {
  clearTimeout(filterTimeout);

  const trimmedInputValue = input_value.trim();

  if (trimmedInputValue.length < 2) {
      list.style.display = 'none';
      return;
  }

  filterTimeout = setTimeout(async () => {
      const response = await fetch(`/search_cities?query=${encodeURIComponent(trimmedInputValue)}`);
      const result = await response.json();
      if (inputElement.value !== lastInputValue) {
          return;
      }
      const filtered_cities = result.data;
      dropdownList(list, filtered_cities, [], trimmedInputValue, inputElement, otherList);
      if (trimmedInputValue !== '') {
          inputElement === departureInput ? departure_from_list = false : destination_from_list = false;
      }
  }, 300);

  lastInputValue = inputElement.value;
}

function displayAllItems(list, display_items, input_value, inputElement) {
  list.innerHTML = '';
  const inputLower = input_value.toLowerCase();
  display_items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'dropdown-item';
      const index = item.lastIndexOf(",");
      const cityText = index !== -1 ? item.substring(0, index) : item;
      const cityNumber = index !== -1 ? item.substring(index + 1) : '';
      const matchIndex = cityText.toLowerCase().indexOf(inputLower);
      if (matchIndex !== -1) {
          const before = document.createTextNode(cityText.substring(0, matchIndex));
          const match = document.createElement('span');
          match.style.fontWeight = 'bold';
          match.textContent = cityText.substring(matchIndex, matchIndex + inputLower.length);
          const after = document.createTextNode(cityText.substring(matchIndex + inputLower.length));

          li.appendChild(before);
          li.appendChild(match);
          li.appendChild(after);
      } else {
          li.textContent = cityText;
      }
      li.addEventListener('click', function () {
        inputElement.value = cityText.trim();
        list.style.display = 'none';
        if (list === departureCityList) {
            departure_from_list = true;
            selectedDepartureCityNumber = cityNumber.trim();
        } else if (list === destinationCityList) {
            destination_from_list = true;
            selectedDestinationCityNumber = cityNumber.trim();
        }
    });
      list.appendChild(li);
      li.classList.add('fade-in');
      li.addEventListener('animationend', () => {
          list.style.display = 'block';
      });
  });
}


function dropdownList(list, filtered_cities, filtered_regions, input_value, inputElement, otherList) {

    let itemsToDisplay = [];
    if (input_value !== '') {
        if (filtered_cities.length > 0) {
            itemsToDisplay = filtered_cities;
        } else if (filtered_regions.length > 0) {
            itemsToDisplay = filtered_regions;
        }
    }
    list.style.display = itemsToDisplay.length > 0 ? 'block' : 'none';
    if (itemsToDisplay.length > 0) {
        displayAllItems(list, itemsToDisplay, input_value, inputElement);
    }
    if (otherList) {
        otherList.style.display = 'none';
    }
}



function handleInputChange(inputElement, list, otherList) {
  const trimmedInputValue = inputElement.value.trim();
  handleInput(inputElement, list, trimmedInputValue, otherList);
}

function setupEventListeners() {
    departureInput.addEventListener('input', () => handleInputChange(departureInput, departureCityList, destinationCityList));
    targetInput.addEventListener('input', () => handleInputChange(targetInput, destinationCityList, departureCityList));

    document.addEventListener('click', event => {
        if (event.target !== departureInput && event.target !== targetInput) {
            departureCityList.style.display = 'none';
            destinationCityList.style.display = 'none';
        }
    });

    departureInput.addEventListener('blur', () => clearTimeout(filterTimeout));
    targetInput.addEventListener('blur', () => clearTimeout(filterTimeout));
}





function scrollToTop() {
  window.scrollTo({
      top: 0,
      behavior: 'smooth'
  });
}


// window.TelegramWebviewProxy.postEvent('web_app_setup_closing_behavior', JSON.stringify({ need_confirmation: true }));
///////////////////////////

const detailsContainer = document.getElementById("detailsContainer");
const statusParagraph = document.getElementById("status2");
let selectedType;
let selectedCost;
let selectedDetail = null;

function createDetailItem(detail) {
    const itemDiv = document.createElement("div");
    itemDiv.classList.add("item");

    const createAndAppend = (tag, text) => {
        const element = document.createElement(tag);
        element.textContent = text;
        itemDiv.appendChild(element);
    };

    createAndAppend("p", detail.type);
    createAndAppend("p", detail.cost);
    createAndAppend("p", detail.datetime);

    itemDiv.addEventListener("click", function () {
        if (selectedType === detail.type && selectedCost === detail.cost) {
            itemDiv.classList.remove("selected");
            selectedType = null;
            selectedCost = null;
            selectedDetail = null;
        } else {
            if (selectedDetail) {
                selectedDetail.classList.remove("selected");
            }
            itemDiv.classList.add("selected");
            selectedType = detail.type;
            selectedCost = detail.cost;
            selectedDetail = itemDiv;
        }
    });

    return itemDiv;
}


function sortByCost() {
  detailsContainer.innerHTML = "";
  details
      .slice()
      .sort((a, b) => parseInt(a.cost) - parseInt(b.cost))
      .forEach(function (detail) {
          const itemDiv = createDetailItem(detail);
          detailsContainer.appendChild(itemDiv);
          if (selectedType === detail.type) {
              itemDiv.classList.add("selected");
              selectedDetail = itemDiv;
          }
      });
}

function sortByTime() {
  detailsContainer.innerHTML = "";
  details
      .slice()
      .sort((a, b) => {
          const aTime = a.datetime.split(" ")[0].split("-").map(num => parseInt(num));
          const bTime = b.datetime.split(" ")[0].split("-").map(num => parseInt(num));

          if (aTime[0] !== bTime[0]) {
              return aTime[0] - bTime[0];
          } else {
              return aTime[1] - bTime[1];
          }
      })
      .forEach(function (detail) {
          const itemDiv = createDetailItem(detail);
          detailsContainer.appendChild(itemDiv);
          if (selectedType === detail.type) {
              itemDiv.classList.add("selected");
              selectedDetail = itemDiv;
          }
      });
}

function resetFilters() {
  detailsContainer.innerHTML = "";
  details.forEach(function (detail) {
      const itemDiv = createDetailItem(detail);
      detailsContainer.appendChild(itemDiv);
      if (selectedType === detail.type) {
          itemDiv.classList.add("selected");
          selectedDetail = itemDiv;
      }
  });
}


function showDetailsOnPage() {
  detailsContainer.innerHTML = '';

  details.forEach(detail => {
    const itemDiv = createDetailItem(detail);
    if (detail.type === selectedType && detail.cost === selectedCost) {
      itemDiv.classList.add("selected");
      selectedDetail = itemDiv;
    }
    detailsContainer.appendChild(itemDiv);
  });
}




  
document.getElementById("sortSelect").addEventListener("change", function (event) {
    const selectedOption = event.target.value;
    if (selectedOption === "default") {
        resetFilters();
    } else if (selectedOption === "cost") {
        sortByCost();
    } else if (selectedOption === "time") {
        sortByTime();
    }
});




function sliderShowPoint(point){
  var buttons = document.querySelectorAll('.slider_button');
  buttons.forEach(function(btn){
    btn.classList.remove('active');
  });
  document.getElementById('slider' + point).classList.add('active');
  
  if (point === 1)
  {
    page1.style.display = 'block';
    page2.style.display = 'none';
    page3.style.display = 'none';
    page4.style.display = 'none';

    sliderpoint2.style.display = 'none';
    sliderpoint3.style.display = 'none';
    sliderpoint4.style.display = 'none';

    toTarif = false;

  } 
    else if(point === 2)
  {
    page1.style.display = 'none';
    page2.style.display = 'block';
    page3.style.display = 'none';
    page4.style.display = 'none';

    sliderpoint3.style.display = 'none';
    sliderpoint4.style.display = 'none';


  }
    else if (point === 3)
  {
    page1.style.display = 'none';
    page2.style.display = 'none';
    page3.style.display = 'block';
    page4.style.display = 'none';

    sliderpoint3.style.display = 'block';
    sliderpoint4.style.display = 'none';

    if (!toTarif){
      sliderpoint3.innerText = '2';
      backButton.onclick = function() {
        sliderShowPoint(1);
    };
    } else {
      sliderpoint3.innerText = '3';
      backButton.onclick = function() {
        sliderShowPoint(2);
    };

    }


  }

  else if (point === 4)
  {
    page1.style.display = 'none';
    page2.style.display = 'none';
    page3.style.display = 'none';
    page4.style.display = 'block';
    sliderpoint4.style.display = 'block';

    if (!toTarif){
      sliderpoint4.innerText = '3';
    } else {
      sliderpoint4.innerText = '4';

    }
  }

  else if (point === 5)
  {
    page1.style.display = 'none';
    page2.style.display = 'none';
    page3.style.display = 'none';
    page4.style.display = 'none';
    page5.style.display = 'block';
    sliderpoint5.style.display = 'block';

    if (!toTarif){
      sliderpoint5.innerText = '4';
    } else {
      sliderpoint5.innerText = '5';

    }
  }
}


document.getElementById("confirm2").addEventListener("click", function () {
  if (!selectedType) {
    selectedType = 'Не выбран';
  } 
      console.log(selectedType);
      document.getElementById('totalcost').style.display = 'block';
      boxData = {
        "Коробка XS": {
        "ширина": 17,
        "длина": 12,
        "высота": 9,
        "вес": 1,
        "стоимость": 20
        },
        "Коробка S": {
        "ширина": 23,
        "длина": 19,
        "высота": 10,
        "вес": 2,
        "стоимость": 40
        },
        "Коробка M": {
        "ширина": 33,
        "длина": 25,
        "высота": 15,
        "вес": 5,
        "стоимость": 60
        }
      }
      document.getElementById('totalcost').style.display = 'none';

      data = calculatePackagesSum(gatherFormData());
      star = false;
      initialTotalCost = calculateInitialCost();
      totalcost = initialTotalCost;
      updateCost();
      var manualRadio = document.getElementById("manual");
      manualRadio.checked = true;
      cost_6.style.display = 'block';

      document.getElementById('status2').innerText = '';
      sliderShowPoint(3);
      sliderpoint3.innerText = '3';


  
});



function calculatePackagesSum(shipmentData) {
    const { places } = shipmentData;

    let data = {
        "packages": []
    };

    const sum = {
        height: 0,
        length: 0,
        weight: 0,
        width: 0
    };

    places.forEach((box, index) => {
        sum.height += parseFloat(box[`box_height${index + 1}`]);
        sum.length += parseFloat(box[`box_length${index + 1}`]);
        sum.weight += parseFloat(box[`box_weight${index + 1}`]);
        sum.width += parseFloat(box[`box_width${index + 1}`]);
    });

    data.packages.push({
        "height": sum.height,
        "length": sum.length,
        "weight": sum.weight,
        "width": sum.width,
        "type": selectedType,
    });

    return data;
}




checkboxService1.addEventListener('change', updateCost);

checkboxService2.addEventListener('change', updateCost);
checkboxService3.addEventListener('change', updateCost);
checkboxService4.addEventListener('change', updateCost);

checkboxService5.addEventListener('change', updateCost);
checkboxService6.addEventListener('change', updateCost);
floorLift.addEventListener('input', updateCost);
manualRadio.addEventListener('change', updateCost);
liftRadio.addEventListener('change', updateCost);
bubbleWrapMeters.addEventListener('input', updateCost);

function updateCost() {
  
  
  let additionalCost = 0;
  let box_cost = 0;
  if (checkboxService1.checked){
      result.field1 = true;
  } else {
      result.field1 = false;
  }

  if (checkboxService2.checked) {
      additionalCost += 10;
      cost_2.innerHTML = '10₽';
      result.field2 = '10₽';

  } else {
      cost_2.innerHTML = '';
      result.field2 = false;

  }

  if (checkboxService3.checked) {
      additionalCost += 50;
      cost_3.innerHTML = '50₽';
      result.field3 = '50₽';
  } else {
      cost_3.innerHTML = '';
      result.field3 = false;

  }


  if (checkboxService4.checked){
      result.field4 = true;
  } else {
      result.field4 = false;
  }

  if (checkboxService5.checked) {
      document.getElementById('bubbleWrapSection').style.display = 'block';   

  } else {
      document.getElementById('bubbleWrapSection').style.display = 'none';
      bubbleWrapMeters.value = '';
      cost_5.innerText = '';
      result.field5 = false;

  }

  if (checkboxService5.checked && bubbleWrapMeters.value.trim() !== "") {
      let metersValue = bubbleWrapMeters.value.trim();
      if (/^\d+$/.test(metersValue)) {
          const meters = parseInt(metersValue, 10);
  
          if (!isNaN(meters) && meters >= 0) {
              additionalCost += meters * 70;
              cost_5.innerText = `${meters * 70}₽`;
              result.field5 = [`${meters * 70}₽`, meters + 'м'];

          } else {
              cost_5.innerText = '';
              bubbleWrapMeters.value = "";
              result.field5 = false;

          }
      } else {
          cost_5.innerText = '';
          bubbleWrapMeters.value = "";
          result.field5 = false;

      }
  } else {
      cost_5.innerText = '';
      bubbleWrapMeters.value = "";
      result.field5 = false;
  }
  

  const floorLift = document.getElementById('floorLift');
  let status = document.getElementById('status_for_info');
  weight = data.packages[0].weight;
  console.log(weight);
  if (checkboxService6.checked) {
      if (weight <= 150) {
          acsentToTheFloor.style.display = 'block';
          status.style.display = 'none';
      } else if (weight > 150) {
          acsentToTheFloor.style.display = 'none';
          status.style.display = 'block';
          floorLift.value = '';
          manualRadio.checked = false;
          liftRadio.checked = false;
          status.innerText = 'Обратитесь к менеджеру для индивидуального расчета';
      } else {
        acsentToTheFloor.style.display = 'block';
        status.style.display = 'none';
        cost_6.style.display = 'none';
      
      }
  } else {
      acsentToTheFloor.style.display = 'none';
      status.innerText = '';
      status.style.display = 'none';
      cost_6.innerText = '';
      floorLift.value = '';
      result.field6 = false;

  }

  const floorType = document.querySelector('input[name="floorType"]:checked');
  let cost = 0;

  if (checkboxService6.checked && weight <= 30){
      status.style.display = 'block';
      status.innerText = 'Доставка бесплатная';
      acsentToTheFloor.style.display = 'none';
      status.style.display = 'block';
      floorLift.value = '';
      manualRadio.checked = false;
      liftRadio.checked = false;
      cost_6.innerText = '';
      result.field6 = false;
  }



  if (checkboxService6.checked && floorType && floorLift.value.trim() !== "") {
      

      const floorsValue = floorLift.value.trim();
  
      if (/^\d+$/.test(floorsValue)) {
          const floors = parseInt(floorsValue, 10);
  
          if (!isNaN(floors) && floors >= 0) {

                  if (floorType.value === "manual") {
                      if (weight >= 30 && weight <= 50) {
                          cost += 70 * floors;
                      } else if (weight <= 100) {
                          cost += 100 * floors;
                      } else if (weight <= 150) {
                          cost += 130 * floors;
                      }
                  } else if (floorType.value === "lift") {
                      if (weight >= 30 && weight <= 50) {
                          cost += 70;
                      } else if (weight <= 100) {
                          cost += 100;
                      } else if (weight <= 150) {
                          cost += 130;
                      }
                  }
                  totalcost += cost;
                  if (cost === 0){
                    cost_6.innerText = '';
                  } else {
                    cost_6.innerText = `${cost}₽`;

                  }
  
                  result.field6 = [`${cost}₽`,floorsValue, floorType.value];

              }
          } else {
              floorLift.value = "";
              cost_6.innerText = '';
              result.field6 = false;

          }
      } else {
          floorLift.value = "";
          cost_6.innerText = '';
          result.field6 = false;

      }
  
  

  const boxCountInputs = document.querySelectorAll('.box-count-input');
  box_cost = 0;

  boxCountInputs.forEach((countInput) => {
      const count = parseFloat(countInput.value) || 0;
      const boxName = countInput.closest('.box').querySelector('.box_name').textContent;

      if (count > 0) {
          box_cost += count * parseFloat(boxData[boxName].стоимость);
      } 
  });

  cost_7.innerText = box_cost > 0 ? `${box_cost}p.` : ''; 
  result.field7 = box_cost > 0 ? `${box_cost}p.` : false; ; 

  totalcost = initialTotalCost + additionalCost + box_cost + cost;

  if (totalcost > 0) {
      if (star) {
          additionalCostElement.textContent = `Стоимость доп. услуг: ${totalcost}₽*`;
      } else {
          additionalCostElement.textContent = `Стоимость доп. услуг: ${totalcost}₽`;
      }
  } else {
      additionalCostElement.textContent = 'Доп. услуги не выбраны';
  }

}


checkboxService7.addEventListener('change', showBoxOptions);

function showBoxOptions() {
    const boxesContainer = document.getElementById('boxesContainer');
    boxesContainer.innerHTML = '';
  
    if (checkboxService7.checked) {
      if (!data || !data.packages || data.packages.length === 0) {
        for (const boxName in boxData) {
          const box = boxData[boxName];
          addBoxToContainer(boxName, box, boxesContainer);
        }
      } else {
        const width = data.packages[0].width;
        const length = data.packages[0].length;
        const height = data.packages[0].height;
  
        if (!width || !length || !height) {
          for (const boxName in boxData) {
            const box = boxData[boxName];
            addBoxToContainer(boxName, box, boxesContainer);
          }
        } else {
          for (const boxName in boxData) {
            const box = boxData[boxName];
            if (box.ширина > width && box.длина > length && box.высота > height) {
              addBoxToContainer(boxName, box, boxesContainer);
            }
          }
        }
      }
      boxesContainer.style.display = 'grid';
    } else {
      boxesContainer.style.display = 'none';
      cost_7.innerText = '';
      updateCost();
      result.field7 = [];
    }
  }
  
  function addBoxToContainer(boxName, box, container) {
    const boxElement = document.createElement('div');
    boxElement.classList.add('box');
  
    const boxNameElement = document.createElement('p');
    boxNameElement.classList.add('box_name');
    boxNameElement.textContent = boxName;
  
    const boxDetailsElement = document.createElement('p');
    boxDetailsElement.classList.add('box_details');
    boxDetailsElement.textContent = `до ${box.вес} кг. (${box.ширина} x ${box.длина} x ${box.высота})`;
  
    const boxCounterElement = document.createElement('div');
    boxCounterElement.classList.add('box_counter');
  
    const decreaseButton = document.createElement('button');
    decreaseButton.classList.add('counter-button');
    decreaseButton.textContent = '-';
    decreaseButton.type = 'button';
    decreaseButton.id = `decreaseButton`;
  
    decreaseButton.addEventListener('click', () => updateBoxCount(boxName, -1));
  
    const countInput = document.createElement('input');
    countInput.classList.add('box-count-input');
    countInput.type = 'text';
    countInput.value = '0';
    countInput.addEventListener('input', (event) => updateBoxCount(boxName, event.target.value));
  
    const increaseButton = document.createElement('button');
    increaseButton.classList.add('counter-button');
    increaseButton.textContent = '+';
    increaseButton.type = 'button';
    increaseButton.id = `increaseButton`;
  
    increaseButton.addEventListener('click', () => updateBoxCount(boxName, 1));
  
    boxCounterElement.appendChild(decreaseButton);
    boxCounterElement.appendChild(countInput);
    boxCounterElement.appendChild(increaseButton);
  
    boxElement.appendChild(boxNameElement);
    boxElement.appendChild(boxDetailsElement);
    boxElement.appendChild(boxCounterElement);
  
    container.appendChild(boxElement);
  }
  
  





function updateBoxCount(boxName, newValue) {
  const boxes = document.querySelectorAll('.box');

  for (const box of boxes) {
      const nameElement = box.querySelector('.box_name');

      if (nameElement && nameElement.textContent.includes(boxName)) {
          const countInput = box.querySelector('.box-count-input');
          let count = parseFloat(countInput.value) || 0;

          if (typeof newValue === 'number') {
              count += newValue;
          } else {
              count = parseFloat(newValue) || 0;
          }

          count = Math.max(0, count);
          countInput.value = count;
          if (count > 0) {
              box.style.backgroundColor = '#30cc5f';
          } else {
              box.style.backgroundColor = '';
          }

          updateCost();

          const selectedBoxData = boxData[boxName];

          if (typeof globalResult.field7 !== 'object' || globalResult.field7 === null) {
              globalResult.field7 = {};
          }

          if (count > 0) {
              globalResult.field7[boxName] = {
                  название: boxName,
                  размер: `${selectedBoxData.ширина} x ${selectedBoxData.длина} x ${selectedBoxData.высота}`,
                  вес: selectedBoxData.вес,
                  кол_во: count,
                  стоимость: count * selectedBoxData.стоимость
              };
          } else {
              delete globalResult.field7[boxName];
          }

          break;
      }
  }
}





function calculateInitialCost() {
  let totalcost = 0;
  let packageType = data.packages[0].type.toLowerCase();
  let weight = data.packages[0].weight;
  console.log(packageType);
  console.log(weight);
  document.getElementById('totalcost').innerText = `Стоимость доставки: ${selectedCost}`;
  let doorLocation = '';
  let status = document.getElementById('floor_status');

  if (weight < 30 || weight > 150){
      status.innerText = '';
      status.style.display = 'none';
      return 0;
      
  } 
  const packageParts = packageType.split("-").map(part => part.trim().toLowerCase());
  console.log(packageParts);
  if (packageParts.includes('дверь')) {
      if (packageParts[0].includes("дверь") && packageParts[1].includes("дверь")) {
          doorLocation = 'отправителя и получателя';
      } else if (packageParts[0].includes("дверь")) {
          doorLocation = 'отправителя';
      } else if (packageParts[1].includes("дверь")) {
          doorLocation = 'получателя';
      }
  }
  
  let cost = 0;
  let prr = 0;
  if (packageType.includes('дверь')) {
      let mult = 1;
      if (doorLocation === 'отправителя и получателя') {
          mult = 2;
      }

      if (weight >= 30 && weight <= 50) {
          cost += 300 * mult;
          prr += 300 * mult;
      } else if (weight > 50 && weight <= 75) {
          cost += 600 * mult;
          prr += 600 * mult;
      } else if (weight > 75 && weight <= 100) {
          cost += 1000 * mult;
          prr += 1000 * mult;
      } else if (weight > 100 && weight <= 150) {
          cost += 1500 * mult;
          prr += 1500 * mult;
      }
  }
  console.log(doorLocation);
  totalcost += cost;
  if (doorLocation) {
      status.style.display = 'block';
      status.innerText = `*В стоимость включены погрузка-разгрузочные работы у ${doorLocation} (${prr}₽)`;
      star = true
  } else {
      status.style.display = 'none';
  }
  if (cost > 0) {
      if (star) {
          additionalCostElement.textContent = `Стоимость доп. услуг: ${totalcost}₽*`;

      } else {
          additionalCostElement.textContent = `Стоимость доп. услуг: ${totalcost}₽`;

      }
  } else {
      additionalCostElement.textContent = 'Доп. услуги не выбраны';
  }
  return cost;
}





const status4 = document.getElementById('status4');


let recipientPlaceCounter = 2;
let senderPlaceCounter = 2;

function addNumberPhone(role) {
  let placeCounter;

  if (role === 'recipient') {
    placeCounter = recipientPlaceCounter;
    recipientPlaceCounter++;
  } else {
    placeCounter = senderPlaceCounter;
    senderPlaceCounter++;
  } 

  const newPlace = document.createElement('div');
  newPlace.classList.add(`${role}_numbers`);
  newPlace.id = `${role}_numbers${placeCounter}`;

  newPlace.innerHTML = `
  <div class="numbers-flex"> 
    <div style="margin-right: 20px;"> 
      <label>Номер</label>
      <input type="text" class="${role}_mobile" id="${role}_mobile${placeCounter}" name="${role}_mobile${placeCounter}" placeholder="Введите номер">
    </div>

    <div>
      <label>Добавочный</label>
      <input type="text" class="${role}_addit" id="${role}_addit${placeCounter}" name="${role}_addit${placeCounter}" placeholder="Введите номер">
    </div>
  </div>
  <button class="addNumberButton" id="for_delete" type="button" onclick="removeNumberPhone('${role}', '${role}_numbers${placeCounter}')">Удалить</button>`;
  document.getElementById(`${role}_numbers-container`).appendChild(newPlace);
}

function removeNumberPhone(role, placeId) {
  const placeToRemove = document.getElementById(placeId);
  placeToRemove.remove();

  let placeCounters;
  if (role === 'recipient') {
    placeCounters = recipientPlaceCounter;
    recipientPlaceCounter--;
  } else {
    placeCounters = senderPlaceCounter;
    senderPlaceCounter--;
  } 

  const places = document.getElementsByClassName(`${role}_numbers`);
  for (let i = 0; i < places.length; i++) {
    const currentNumber = places[i];
    const newPlaceCounter = i + 1;

    currentNumber.id = `${role}_numbers${newPlaceCounter}`;

    currentNumber.querySelectorAll(`[id^='${role}_mobile'], [id^='${role}_addit']`).forEach(element => {
      const currentElementId = element.id;
      element.id = currentElementId.replace(/\d+$/, newPlaceCounter);
    });

    const deleteButton = currentNumber.querySelector('button');
    if (deleteButton) {
      deleteButton.setAttribute('onclick', `removePlace('${role}', '${role}_numbers${newPlaceCounter}')`);
    }
  }
}
document.addEventListener('click', function(event) {
  if (event.target && event.target.matches('button[id^="delete"]')) {
      const buttonId = event.target.id;
      const placeId = buttonId.replace('delete', 'place');
      removePlace(placeId);
  }
});

let pvz_from_list = false;


function check_inputs_page4() {
  const recipientNumbers = document.getElementsByClassName('recipient_numbers');
  const senderNumbers = document.getElementsByClassName('sender_numbers');
  let isValid = true;

  function validateInput(input, validationFunction) {
      return input.trim() !== '' && !validationFunction(input);
  }

  function processInputs(inputs, prefix) {
      for (let i = 0; i < inputs.length; i++) {
          const currentNumber = inputs[i];
          const mobile = currentNumber.querySelector(`#${prefix}_mobile${i + 1}`);
          const addit = currentNumber.querySelector(`#${prefix}_addit${i + 1}`);

          removeErrorStyle(mobile);
          removeErrorStyle(addit);

          let mobileValid = validateInput(mobile.value, isValidMobileNumber);
          let additValid = validateInput(addit.value, isValidAddit);

          if (mobileValid || additValid) {
              isValid = false;

              if (mobileValid) {
                  applyErrorStyle(mobile);
              }

              if (additValid) {
                  applyErrorStyle(addit);
              }
          }
      }
  }

  processInputs(recipientNumbers, 'recipient', isValidMobileNumber);
  processInputs(senderNumbers, 'sender', isValidMobileNumber);
  const senderPoint = document.getElementById('sender_point');
  if (senderPoint && senderPoint.value !== ""){
    removeErrorStyle(senderPoint);

    if (!pvz_from_list) {

      isValid = false;

      applyErrorStyle(senderPoint);
    }
  }






  if (isValid) {
    for (let i = 1; i <= placeCounter - 1;i++){
      HashMap[i] = 1;
    }
    sliderShowPoint(5);
    showPlacesOnload();
  } else {
    status4.innerText = 'Заполните все поля корректно';
  }
}


function isValidMobileNumber(number) {
  const pattern = /^(\+7|8)[\s\d\(\)\-]{9}\d$/;
  return pattern.test(number);
}


function isValidAddit(value) {
    return /^[0-9#*]+$/.test(value);
}

function applyErrorStyle(element) {
  element.style.borderColor = "red";
}

function removeErrorStyle(element) {
  element.style.borderColor = "";
}





function gatherFormDataPage4() {
  let formData = {
    recipient: {
      company: document.getElementById('recipient_company').value,
      fullname: document.getElementById('recipient_fullname').value,
      numbers: []
    },
    sender: {
      company: document.getElementById('sender_company').value,
      fullname: document.getElementById('sender_fullname').value,
      numbers: []
    }
  };

  function push_numbers(role) {
    let i = 1;
    while (true) {
      let mobileId = `${role}_mobile${i}`;
      let additId = `${role}_addit${i}`;
  
      let mobileElement = document.getElementById(mobileId);
      let additElement = document.getElementById(additId);
  
      if (!mobileElement && !additElement) {
        break;
      }
  
      let formattedMobile = (mobileElement.value || '').replace(/[^\d]/g, '');
  
      let placeData = {
        [`${role}_mobile${i}`]: formattedMobile !== '' ? `+7${formattedMobile.substring(1)}` : '',
        [`${role}_addit${i}`]: additElement.value || '',
      };
  
      formData[role].numbers.push(placeData);
  
      i++;
    }
  }
  
  
  
  
  

  push_numbers('recipient');
  push_numbers('sender');

  return formData;
}




document.addEventListener('input', function(event) {
  const targetClassList = event.target.classList;

  if (targetClassList.contains('recipient_mobile')) {
    handleMobileInput(event, 'recipient');
  } else if (targetClassList.contains('sender_mobile')) {
    handleMobileInput(event, 'sender');
  }
});

function handleMobileInput(event) {
  let inputValue = event.target.value;

  if (inputValue.length === 1 && (inputValue === '7' || inputValue === '8')) {
    event.target.value = '+7';
  } else if (inputValue.length === 0) {
    event.target.value = '';
  }
}


let filterTimeoutPvz;
let lastInputValuePvz = '';
let selectedPoint;

function handleInputPvz(inputElement, list, input_value, otherList) {
  clearTimeout(filterTimeoutPvz);

  const trimmedInputValue = input_value.trim();

  if (trimmedInputValue.length < 2) {
      list.style.display = 'none';
      return;
  }

  filterTimeoutPvz = setTimeout(async () => {
      const response = await fetch(`/search_points?query=${encodeURIComponent(trimmedInputValue)}`);
      const result = await response.json();
      if (inputElement.value !== lastInputValuePvz) {
          return;
      }
      const filtered_cities = result.data;
      console.log(filtered_cities);

      dropdownListPvz(list, filtered_cities, [], trimmedInputValue, inputElement, otherList);
  }, 300);

  lastInputValuePvz = inputElement.value;
}

function displayAllItemsPvz(list, display_items, input_value, inputElement) {
  list.innerHTML = '';
  const inputLower = input_value.toLowerCase();
  display_items.forEach(item => {
      const li = document.createElement('li');
      li.className = 'dropdown-item';
      const index = item.lastIndexOf(",");
      const cityText = index !== -1 ? item.substring(0, index) : item;
      const cityNumber = index !== -1 ? item.substring(index + 1) : '';
      const matchIndex = cityText.toLowerCase().indexOf(inputLower);
      if (matchIndex !== -1) {
          const before = document.createTextNode(cityText.substring(0, matchIndex));
          const match = document.createElement('span');
          match.style.fontWeight = 'bold';
          match.textContent = cityText.substring(matchIndex, matchIndex + inputLower.length);
          const after = document.createTextNode(cityText.substring(matchIndex + inputLower.length));

          li.appendChild(before);
          li.appendChild(match);
          li.appendChild(after);
      } else {
          li.textContent = cityText;
      }
      li.addEventListener('click', function () {
        inputElement.value = cityText.trim();
        list.style.display = 'none';
        if (list === senderPointList) {
            pvz_from_list = true;
            selectedPoint = cityNumber.trim();
        }
    });
      list.appendChild(li);
      li.classList.add('fade-in');
      li.addEventListener('animationend', () => {
          list.style.display = 'block';
      });
  });
}

function dropdownListPvz(list, filtered_cities, filtered_regions, input_value, inputElement, otherList) {
    let itemsToDisplay = [];
    if (input_value !== '') {
        if (filtered_cities.length > 0) {
            itemsToDisplay = filtered_cities;
        } else if (filtered_regions.length > 0) {
            itemsToDisplay = filtered_regions;
        }
    }
    list.style.display = itemsToDisplay.length > 0 ? 'block' : 'none';
    if (itemsToDisplay.length > 0) {
        displayAllItemsPvz(list, itemsToDisplay, input_value, inputElement);
    }
    if (otherList) {
        otherList.style.display = 'none';
    }
}

let senderPoint;
let senderPointList;


function handleInputPvzChange(inputElement, list, otherList) {
  const trimmedInputValue = inputElement.value.trim();
  handleInputPvz(inputElement, list, trimmedInputValue, otherList);
}

function setupEventListenersPvz() {
    senderPoint.addEventListener('input', () => handleInputPvzChange(senderPoint, senderPointList));

    document.addEventListener('click', event => {
        if (event.target !== senderPoint) {
            senderPointList.style.display = 'none';
        }
    });

    senderPoint.addEventListener('blur', () => clearTimeout(filterTimeoutPvz));
}



function submit_info() {
  status4.innerText = '';
  let additRecepient = document.querySelector(".additionalRecepientInputs")
  let additSender = document.querySelector(".additionalSenderInputs")
  needCheckPvz = false;

  sliderShowPoint(4);

  if (selectedType.toLowerCase() === 'не выбран') {

  } else if (selectedType.toLowerCase() === 'дверь - дверь'){
    additSender.innerHTML = `<label>Адрес</label>
    <input type="text" id="sender_address" name="sender_address" placeholder="Введите адрес">
    <label>Дом</label>
    <input type="text" id="sender_house" name="sender_house" placeholder="Введите дом">
    <label>Квартира</label>
    <input type="text" id="sender_flat" name="sender_flat" placeholder="Введите квартиру">`;

    additRecepient.innerHTML = `<label>Адрес</label>
    <input type="text" id="recipient_address" name="recipient_address" placeholder="Введите адрес">
    <label>Дом</label>
    <input type="text" id="recipient_house" name="recipient_house" placeholder="Введите дом">
    <label>Квартира</label>
    <input type="text" id="recipient_flat" name="recipient_flat" placeholder="Введите квартиру">`;

  } else if (selectedType.toLowerCase() === 'дверь - склад'){

    additRecepient.innerHTML = `<label>Адрес</label>
    <input type="text" id="recipient_address" name="recipient_address" placeholder="Введите адрес">
    <label>Дом</label>
    <input type="text" id="recipient_house" name="recipient_house" placeholder="Введите дом">
    <label>Квартира</label>
    <input type="text" id="recipient_flat" name="recipient_flat" placeholder="Введите квартиру">`;

    additSender.innerHTML = `<label>Адрес пункта выдачи заказа</label>
    <div class="destination_points_dropdown">

    <input type="text" id="sender_point" name="sender_point" placeholder="Введите адрес ПВЗ">
    <ul id="sender_point-list" data-cities="{{ data }}"></ul>`;

    senderPoint = document.getElementById('sender_point');
    senderPointList = document.getElementById('sender_point-list');
    setupEventListenersPvz();


  
  } else if (selectedType.toLowerCase() === 'склад - дверь'){
    additSender.innerHTML = `<label>Адрес</label>
    <input type="text" id="sender_address" name="sender_address" placeholder="Введите адрес">
    <label>Дом</label>
    <input type="text" id="sender_house" name="sender_house" placeholder="Введите дом">
    <label>Квартира</label>
    <input type="text" id="sender_flat" name="sender_flat" placeholder="Введите квартиру">`;

    additRecepient.innerHTML = ``;
    
  
  } else if (selectedType.toLowerCase() === 'склад - склад'){
    additRecepient.innerHTML = ``;

    additSender.innerHTML = `<label>Адрес пункта выдачи заказа</label>
    <div class="destination_points_dropdown">

    <input type="text" id="sender_point" name="sender_point" placeholder="Введите адрес ПВЗ">
    <ul id="sender_point-list" data-cities="{{ data }}"></ul>`;

    senderPoint = document.getElementById('sender_point');
    senderPointList = document.getElementById('sender_point-list');
    setupEventListenersPvz();

  }

}


//////////////////

function showDropdownPage5(inputID) {
  var dropdown = document.getElementById(inputID);
  if (dropdown) {
    dropdown.style.display = "block";
  }
}


function selectRolePage5(value, text, inputId, listId, getID, whereID) {
  var input = document.getElementById(inputId);
  var list = document.getElementById(listId);
  input.value = text;
  if (value === '') {
    return;
    
  }

  if (value === 'without' || value === 'zero') {
      document.getElementById(whereID).value = '0';
  } else {
      var amount = parseFloat(document.getElementById(`${getID}`).value);
      var ndsRate = parseFloat(text);
      calculateTotalPage5(amount, ndsRate, whereID);
  }
  list.style.display = 'none';
}

function calculateTotalPage5(amount, ndsRate, whereID) {
  var total;
  
  if (!amount || isNaN(amount)) {
    total = ''; 
  } else if (ndsRate === 0 || ndsRate === 'Нет НДС' || ndsRate === 'zero') {
    total = 0;
  } else {
    var prod;
    if (ndsRate == '10') {
      prod = 9.090909;
    } else if (ndsRate == '20') {
      prod = 16.666667;
    }
    
    total = amount * prod / 100;
  }

  document.getElementById(whereID).value = total === '' ? '' : total.toFixed(2);
}


document.getElementById('amount').addEventListener('input', function() {
  var amount = parseFloat(this.value);
  var hiddenDiv = document.querySelector('.hidden_div');
  if (!isNaN(amount) && amount > 0) {
      hiddenDiv.style.display = 'block';
  } else {
      hiddenDiv.style.display = 'none';
      document.getElementById('combobox_value').value = '';
      document.getElementById('calculation').value = '';
  }
});


var amountInput = document.getElementById("amount");
  var ndsInput = document.getElementById("combobox_value_page5");

  amountInput.addEventListener("input", function() {
    if (amountInput.value !== '' && ndsInput.value !== '') {
      calculateTotalPage5();
    } else {
      document.getElementById("calculation").value = '';
    }
  });
  
  ndsInput.addEventListener("change", function() {
    if (amountInput.value !== '' && ndsInput.value !== '') {
      calculateTotalPage5();
    } else {
      document.getElementById("calculation").value = '';
    }
  });

  function calculateTotalPage5() {
    var amount = parseFloat(document.getElementById("amount").value);
    var ndsRateText = document.getElementById("combobox_value").value;
    var calculationInput = document.getElementById("calculation");
    var ndsRate;
    if (ndsRateText === '10%' || ndsRateText === '20%') {
      ndsRate = parseInt(ndsRateText);
    } else {
      ndsRate = 0;
    }

    var prod;
    if (ndsRate === 10) {
      prod = 9.090909;
    } else if (ndsRate === 20) {
      prod = 16.666667;
    } else {
      prod = 0;
    }

    var total = amount * prod / 100;
    calculationInput.value = total.toFixed(2);
  }



let HashMap = {};




function addInputListenerPage5(amountInput, ndsInput, i, current) {
  amountInput.addEventListener('input', function() {
      var amount = parseFloat(amountInput.value);
      var ndsRateText = ndsInput.value;
      var ndsRate;
      if (ndsRateText.trim() !== '') {
          switch (ndsRateText) {
              case 'Нет НДС':
              case 'zero':
                  ndsRate = 0;
                  break;
              case '10%':
                  ndsRate = 10;
                  break;
              case '20%':
                  ndsRate = 20;
                  break;
              default:
                  ndsRate = 0;
          }

          calculateTotalPage5(amount, ndsRate, `nds_cost${i+1}_${current}`);
      } 
  });
}


function showPlacesOnload() {
  var keys = Object.keys(HashMap);
  
  for (let i = 0; i < keys.length; i++) {
    let current = HashMap[keys[i]];
    const newPlace = document.createElement('div');
    newPlace.id = `place${i+1}`;
    newPlace.innerHTML = `
          <div class="places-container_page5" id="places-container_page5${i+1}">
          <p class="place_title_page5"> Место ${i+1}</p>
          <div class="places" id="place${i+1}_${current}">
              <p class="items">Товар 1</p>
              <label>Код артикула</label>
              <input class="code" type="text" id="code${i+1}_${current}" name="code" placeholder="Введите артикул">
              <label>Наименование товара</label>
              <input class="title" type="text" id="title${i+1}_${current}" name="title" value="ТНП" placeholder="Введите товар">
              <label>Стоимость ед. товара в ₽</label>
              <input type="number" id="place_cost${i+1}_${current}" name="place_cost" placeholder="Введите стоимость">


              <div class="weight_input">
                  <div class="left_input" id="left_input${i+1}_${current}">
                      <label>Вес ед. товара (кг)</label>
                      <input class="weight" type="number" id="weight${i+1}_${current}"  name="weight" placeholder="Введите кг.">
                  </div>
                  <div>
                      <label>Кол-во ед.</label>
                      <input class="count" type="number" id="count${i+1}_${current}" onkeypress="return event.charCode >= 48 && event.charCode <= 57" name="count" placeholder="Введите шт.">
                  </div>  
              </div>

              <label>Оплата получателя за ед. товара в т.ч. НДС ₽</label>
              <input type="number" class="cost" id="cost${i+1}_${current}" name="cost_with_nds" value="0" placeholder="Введите стоимость">
              <div class="nds-flex">
                  <div class="left_input_place" id="left_input_place${i+1}_${current}">
                      <label>Ставка НДС, %</label>
                      <input type="text" class="place_combobox_value" id="place_combobox_value${i+1}_${current}" onclick="showDropdownPage5('place_ndsList${i+1}_${current}')" placeholder="НДС" readonly>
                      <ul id="place_ndsList${i+1}_${current}" class="dropdown-list_page5">
                          <li value="without" data-id="without" class="option" onclick="selectRolePage5('without', 'Нет НДС','place_combobox_value${i+1}_${current}', 'place_ndsList${i+1}_${current}','cost${i+1}_${current}','nds_cost${i+1}_${current}')">Нет НДС</li>
                          <li value="zero" data-id="zero" class="option" onclick="selectRolePage5('zero', '0%','place_combobox_value${i+1}_${current}', 'place_ndsList${i+1}_${current}','cost${i+1}_${current}','nds_cost${i+1}_${current}')">0%</li>
                          <li value="ten" data-id="ten" class="option" onclick="selectRolePage5('ten', '10%','place_combobox_value${i+1}_${current}', 'place_ndsList${i+1}_${current}','cost${i+1}_${current}','nds_cost${i+1}_${current}')">10%</li>
                          <li value="twenty" data-id="twenty" class="option" onclick="selectRolePage5('twenty', '20%','place_combobox_value${i+1}_${current}', 'place_ndsList${i+1}_${current}','cost${i+1}_${current}','nds_cost${i+1}_${current}')">20%</li>
                      </ul>
                  </div>

                  <div>
                      <label>Сумма НДС, ₽</label>
                      <input type="text" class="nds_cost" id="nds_cost${i+1}_${current}" name="nds_cost" placeholder="Подсчет">
                  </div>
              </div>
          </div>
      </div>
      <button class="created" type="button" id="add" onclick="addPlacePage5(${i+1})" >+ Добавить товар</button>`
    document.querySelector('.all_places').appendChild(newPlace);
    var amountInput = document.getElementById(`cost${i+1}_${current}`);
    var ndsInput = document.getElementById(`place_combobox_value${i+1}_${current}`);

    addInputListenerPage5(amountInput, ndsInput, i, current);

      }
}


function addPlacePage5(id) {
  let counter = HashMap[id]+1;
  const newPlace = document.createElement('div');
  newPlace.classList.add('places');
  newPlace.id = `place${id}_${counter}`;

  newPlace.innerHTML = `
      <p class="items">Товар ${counter}</p>
      <label>Код артикула</label>
      <input class="code" type="text" id="code${id}_${counter}" name="code" placeholder="Введите артикул">
      <label>Наименование товара</label>
      <input class="title" type="text" id="title${id}_${counter}" name="title" value="ТНП" placeholder="Введите товар">
      <label>Стоимость ед. товара в ₽</label>
      <input type="number" id="place_cost${id}_${counter}" name="place_cost" placeholder="Введите стоимость">

      <div class="weight_input">
          <div class="left_input" id="left_input${id}_${counter}">
              <label>Вес ед. товара (кг)</label>
              <input class="weight" type="number" id="weight${id}_${counter}" name="weight" placeholder="Введите кг.">
          </div>
          <div>
              <label>Кол-во ед.</label>
              <input class="count" type="number" id="count${id}_${counter}" onkeypress="return event.charCode >= 48 && event.charCode <= 57" name="count" placeholder="Введите шт.">
          </div>  
      </div>

      <label>Оплата получателя за ед. товара в т.ч. НДС ₽</label>
      <input type="number" class="cost" id="cost${id}_${counter}" name="cost_with_nds" value="0" placeholder="Введите стоимость">
      <div class="nds-flex">
          <div class="left_input_place" id="left_input_place${id}_${counter}">
              <label>Ставка НДС, %</label>
              <input type="text" class="place_combobox_value" id="place_combobox_value${id}_${counter}" onclick="showDropdownPage5('place_ndsList${id}_${counter}')" placeholder="НДС" readonly>
              <ul id="place_ndsList${id}_${counter}" class="dropdown-list_page5">
                  <li value="without" data-id="without" class="option" onclick="selectRolePage5('without', 'Нет НДС','place_combobox_value${id}_${counter}', 'place_ndsList${id}_${counter}', 'cost${id}_${counter}', 'nds_cost${id}_${counter}')">Нет НДС</li>
                  <li value="zero" data-id="zero" class="option" onclick="selectRolePage5('zero', '0%','place_combobox_value${id}_${counter}', 'place_ndsList${id}_${counter}', 'cost${id}_${counter}', 'nds_cost${id}_${counter}')">0%</li>
                  <li value="ten" data-id="ten" class="option" onclick="selectRolePage5('ten', '10%','place_combobox_value${id}_${counter}', 'place_ndsList${id}_${counter}', 'cost${id}_${counter}', 'nds_cost${id}_${counter}')">10%</li>
                  <li value="twenty" data-id="twenty" class="option" onclick="selectRolePage5('twenty', '20%','place_combobox_value${id}_${counter}', 'place_ndsList${id}_${counter}', 'cost${id}_${counter}', 'nds_cost${id}_${counter}')">20%</li>
              </ul>
          </div>

          <div>
              <label>Сумма НДС, ₽</label>
              <input type="text" class="nds_cost" id="nds_cost${id}_${counter}" name="nds_cost" placeholder="Подсчет">
          </div>
      </div>
      <button class="created" id="for_delete" type="button" onclick="removePlacePage5('${newPlace.id}')">Удалить</button>
  `;
  document.getElementById(`places-container_page5${id}`).appendChild(newPlace);
  var amountInput = document.getElementById(`cost${id}_${counter}`);
  var ndsInput = document.getElementById(`place_combobox_value${id}_${counter}`);
  
  amountInput.addEventListener('input', function() {
    var amount = parseFloat(amountInput.value);
    var ndsRateText = ndsInput.value.trim();
    
    if (amount && ndsRateText !== '') {
        var ndsRate;
        
        switch (ndsRateText) {
            case 'zero':
                ndsRate = 0;
                break;
            case '10%':
                ndsRate = 10;
                break;
            case '20%':
                ndsRate = 20;
                break;
            default:
                ndsRate = 0;
        }

        calculateTotalPage5(amount, ndsRate, `nds_cost${id}_${counter}`);
    } else {
        document.getElementById(`nds_cost${id}_${counter}`).value = '';
    }
});



  HashMap[id]++;
  
}


function removePlacePage5(placeId) {
  const placeToRemove = document.getElementById(placeId);
  if (!placeToRemove) return;

  const parentId = placeToRemove.parentElement.id;
  const parentIdNum = parentId.match(/\d+/)[0];

  placeToRemove.remove();

  const counter = placeId.match(/\d+$/)[0];
  delete HashMap[parentIdNum + '_' + counter];

  const places = document.querySelectorAll(`#${parentId} .places`);
  places.forEach((place, index) => {
    const newCounter = index + 1;
    const newPlaceId = `place${parentIdNum}_${newCounter}`;
    place.id = newPlaceId;
    place.querySelector('p').textContent = `Товар ${newCounter}`;
    place.querySelectorAll('input').forEach(input => {
      const inputIdArray = input.id.split('_');
      inputIdArray[inputIdArray.length - 1] = newCounter;
      input.id = inputIdArray.join('_');
    });

    const leftInputPlace = place.querySelector('.left_input_place');
    if (leftInputPlace) {
      leftInputPlace.id = `left_input_place${parentIdNum}_${newCounter}`;
      const inputInsideLeftInputPlace = leftInputPlace.querySelector('input');
      if (inputInsideLeftInputPlace) {
        inputInsideLeftInputPlace.id = `place_combobox_value${parentIdNum}_${newCounter}`;
        inputInsideLeftInputPlace.setAttribute('onclick', `showDropdownPage5('place_ndsList${parentIdNum}_${newCounter}')`);
      }
      const dropdownList = leftInputPlace.querySelector('.dropdown-list_page5');
      if (dropdownList) {
        dropdownList.id = `place_ndsList${parentIdNum}_${newCounter}`;
        dropdownList.querySelectorAll('li').forEach((li, idx) => {
          const idNum = parentIdNum + '_' + newCounter;
          li.setAttribute('onclick', `selectRolePage5('${li.dataset.id}', '${li.textContent}', 'place_combobox_value${idNum}', 'place_ndsList${idNum}', 'cost${idNum}', 'nds_cost${idNum}')`);
        });
      }
    }
    const button = place.querySelector('button');
    if (button) {
      button.setAttribute('onclick', `removePlacePage5('${newPlaceId}')`);
    }

    HashMap[parentIdNum] = newCounter;
  });
}


document.getElementById('amount').addEventListener('input', function() {
  var amount = parseFloat(this.value);
  var hiddenDiv = document.querySelector('.hidden_div');
  if (!isNaN(amount) && amount > 0) {
      hiddenDiv.style.display = 'block';
  } else {
      hiddenDiv.style.display = 'none';
      document.getElementById('combobox_value').value = '';
      document.getElementById('calculation').value = '';
  }
});
