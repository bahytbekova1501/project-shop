//? api для запросов
const API = "http://localhost:8000/productsWoman";

const list = document.querySelector("#products-list-2");
//?форма с inputами для ввода данных
const addForm = document.querySelector("#add-form-2");
const titleInp = document.querySelector("#title-2");
const descriptionInp = document.querySelector("#description-2");
const priceInp = document.querySelector("#price-2");
const imageInp = document.querySelector("#image-2");

//? вытаскивам инпуты и кнопка из модалки
const editTitleInp = document.querySelector("#edit-title");
const editPriceInp = document.querySelector("#edit-price");
const editDescriptionInp = document.querySelector("#edit-descr");
const editImageInp = document.querySelector("#edit-image");
const editSaveBtn = document.querySelector("#btn-save-edit");
//? то где отображаем кнокпи для пагинации
const paginationList = document.querySelector(".pagination-list");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");

// //? input для поиска
const searchInp = document.querySelector("#search");
// //? переменная по которой делаем запрос
let searchVal = "";

// //? максимальное количество продуктов на одной странице
const limit = 6;

// //? текущая страница
let currentPage = 1;

// //? маскимальное / общее количество страниц
let pageTotalCount = 1;

// ?первоначальное отображенеие данных
getProducts();
//? вместо изначального кода нужен этот
//? стягиваем данные с сервера
async function getProducts() {
  const res = await fetch(
    `${API}?&title_like=${searchVal}&_limit=${limit}&_page=${currentPage}`
  );
  const count = res.headers.get("x-total-count");
  pageTotalCount = Math.ceil(count / limit);
  const data = await res.json();
  //? расшифровка данных
  //? отображаем актуальные данные
  render(data);
}
async function addProduct(product) {
  await fetch(API, {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
  //? стягиваем и отображаем актуальные данные
  getProducts();
}

async function deleteProduct(id) {
  //?await для того чтобы getProducts(); подождала пока данные добавяться , потому что fetch асинхронный
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  //?  стягиваем и отображаем актуальные данные
  getProducts();
}

//? функция для получения одного продукта
async function getOneProduct(id) {
  const res = await fetch(`${API}/${id}`);
  const data = await res.json(); // ? расшифровка данных
  //?  возвращаем продукт с db.json
  return data;
}

//? функция что бы изменить данные
async function editProduct(id, editedProduct) {
  //?await для того чтобы getProducts(); подождала пока данные добавяться , потому что fetch асинхронный
  await fetch(`${API}/${id}`, {
    method: "PATCH",
    body: JSON.stringify(editedProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });
  //?  стягиваем и отображаем актуальные данные
  getProducts();
}
//? отображаем на странице
function render(arr) {
  list.innerHTML = "";
  arr.forEach((item) => {
    list.innerHTML += `
    <div class="card m-5" style="width: 18rem" >
    <img
    src = "${item.image}"
    class "card-img-top"
    alt = "..."
    />
    <div class="card-body">
      <h5 class="card-title">${item.title}</h5>
      <p class="card-text">${item.description}</p>
      <p class="card-text">${item.price}</p>
      <button id = "${item.id}" class="btn btn-secondary delete-button ">удалить</button>
      <button data-bs-toggle='modal' data-bs-target='#exampleModal' id = "${item.id}" class="btn btn-dark btn-edit">изменить</button>
     </div>
  </div>
        `;
  });
  //? добавляем эту функцию
  renderPagination();
}

// //? функция для отображения кнопок для пагинации
function renderPagination() {
  paginationList.innerHTML = "";
  for (let i = 1; i <= pageTotalCount; i++) {
    paginationList.innerHTML += `
      <li class="page-item ${currentPage == i ? "active" : ""}">
      <a class="page-link page_number text-black" href="#">${i}</a>
      </li>
      `;
  }
  //   //? проверка для того чтоб кнопка превьюс была не активной на первой странице
  if (currentPage == 1) {
    prev.classList.add("disabled");
  } else {
    prev.classList.remove("disabled");
  }

  //   //? проверка для того чтоб кнопка некст была не активной на последней странице
  if (currentPage == pageTotalCount) {
    next.classList.add("disabled");
  } else {
    next.classList.remove("disabled");
  }
}
//? обработчик события для добавления(create)

addForm.addEventListener("submit", (e) => {
  //?что бы стр не перезагружалась
  e.preventDefault();
  //? проверка на заполненность полей
  if (
    !titleInp.value.trim() ||
    !descriptionInp.value.trim() ||
    !priceInp.value.trim() ||
    !imageInp.value.trim()
  ) {
    alert("заполните все поля");
    return;
  }
  //?создаем объект для добавления db.json
  const product = {
    title: titleInp.value,
    description: descriptionInp.value,
    price: priceInp.value,
    image: imageInp.value,
  };
  //?оправдяем объект в db.json
  addProduct(product);
  //? очищаем инпуты
  titleInp.value = "";
  descriptionInp.value = "";
  priceInp.value = "";
  imageInp.value = "";
});

//?событие клик при удалении карточки
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("delete-button")) {
    deleteProduct(e.target.id);
  }
});

//? переменная что бы сохранить id продукта на который мы нажали
let id = null;
//?обработчик события на открытие и заполнение модалки
document.addEventListener("click", async (e) => {
  //? в условии пишем содержит ли такой класс
  if (e.target.classList.contains("btn-edit")) {
    //?сохраняем id продукта
    id = e.target.id;
    //?получаем объект продукта на который мы нажали
    const product = await getOneProduct(e.target.id);
    //? заполняем инпуты данными продукта getOneProduct асинхронная функция
    editTitleInp.value = product.title;
    editPriceInp.value = product.price;
    editDescriptionInp.value = product.description;
    editImageInp.value = product.image;
  }
});

//? обработчик события на сохранение данных
editSaveBtn.addEventListener("click", () => {
  //? проверка на пустоту инпутов
  if (
    !editTitleInp.value.trim() ||
    !editPriceInp.value.trim() ||
    !editDescriptionInp.value.trim() ||
    !editImageInp.value.trim()
  ) {
    alert("заполните все поля ");
    //? если хотя бы один инпут пустой , выводим предупреждение  и останавливаем функцию
    return;
  }
  //?собираем измененный объект для изменения продукта
  const editedProduct = {
    title: editTitleInp.value,
    price: editPriceInp.value,
    description: editDescriptionInp.value,
    image: editImageInp.value,
  };
  //?вызываем функцию для изменения
  editProduct(id, editedProduct);
});

// //? обработчик события чтобы перейти на определенную страницу
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page_number")) {
    currentPage = e.target.innerText;
    getProducts();
  }
});

// //? обработчик события чтобы перейти на следующую страницу
next.addEventListener("click", () => {
  if (currentPage == pageTotalCount) {
    return;
  }

  currentPage++;
  getProducts();
});

// //? обработчик события чтобы перейти на предыдущую страницу
prev.addEventListener("click", () => {
  if (currentPage == 1) {
    return;
  }
  currentPage--;
  getProducts();
});

// //? обработчик события для поиска
searchInp.addEventListener("input", () => {
  searchVal = searchInp.value;
  currentPage = 1;
  getProducts();
});
