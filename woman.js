//? api для запросов
const API2 = "http://localhost:8000/productsWoman";

const list2 = document.querySelector("#products-list-2");
//?форма с inputами для ввода данных
const addForm2 = document.querySelector("#add-form-2");
const titleInp2 = document.querySelector("#title-2");
const descriptionInp2 = document.querySelector("#description-2");
const priceInp2 = document.querySelector("#price-2");
const imageInp2 = document.querySelector("#image-2");

//? вытаскивам инпуты и кнопка из модалки
const editTitleInp2 = document.querySelector("#edit-title-2");
const editPriceInp2 = document.querySelector("#edit-price-2");
const editDescriptionInp2 = document.querySelector("#edit-descr-2");
const editImageInp2 = document.querySelector("#edit-image-2");
const editSaveBtn2 = document.querySelector("#btn-save-edit-2");
//? то где отображаем кнокпи для пагинации
const paginationList2 = document.querySelector(".pagination-list");
const prev2 = document.querySelector(".prev");
const next2 = document.querySelector(".next");

// //? input для поиска
// const searchInp2 = document.querySelector("#search");
// //? переменная по которой делаем запрос
// let searchVal = "";

// //? максимальное количество продуктов на одной странице
// const limit = 6;

// //? текущая страница
// let currentPage = 1;

// //? маскимальное / общее количество страниц
// let pageTotalCount = 1;

// ?первоначальное отображенеие данных
getProducts2();
//? вместо изначального кода нужен этот
//? стягиваем данные с сервера
async function getProducts2() {
  const res2 = await fetch(
    //`${
    API2 //}?title_like=${searchVal}&_limit=${limit}&_page=${currentPage}`
  );
  // const count = res2.headers.get("x-total-count");
  // pageTotalCount = Math.ceil(count / limit);
  const data2 = await res2.json();
  //? расшифровка данных
  //? отображаем актуальные данные
  render2(data2);
}
async function addProduct2(product2) {
  console.log(product2);
  await fetch(API2, {
    method: "POST",
    body: JSON.stringify(product2),
    headers: {
      "Content-Type": "application/json",
    },
  });
  //? стягиваем и отображаем актуальные данные
  getProducts2();
}

async function deleteProduct2(id2) {
  //?await для того чтобы getProducts(); подождала пока данные добавяться , потому что fetch асинхронный
  await fetch(`${API2}/${id2}`, {
    method: "DELETE",
  });
  //?  стягиваем и отображаем актуальные данные
  getProducts2();
}

//? функция для получения одного продукта
async function getOneProduct2(id2) {
  const res2 = await fetch(`${API2}/${id2}`);
  const data2 = await res2.json(); // ? расшифровка данных
  //?  возвращаем продукт с db.json
  return data2;
}

//? функция что бы изменить данные
async function editProduct2(id2, editedProduct) {
  //?await для того чтобы getProducts(); подождала пока данные добавяться , потому что fetch асинхронный
  await fetch(`${API2}/${id2}`, {
    method: "PATCH",
    body: JSON.stringify(editedProduct),
    headers: {
      "Content-Type": "application/json",
    },
  });
  //?  стягиваем и отображаем актуальные данные
  getProducts2();
}
//? отображаем на странице
function render2(arr) {
  list2.innerHTML = "";
  arr.forEach((item) => {
    list2.innerHTML += `
    <div class="card m-5" style="width: 18rem" >
    <img
    src = "${item.image2}"
    class "card-img-top"
    alt = "..."
    />
    <div class="card-body">
      <h5 class="card-title">${item.title2}</h5>
      <p class="card-text">${item.description2}</p>
      <p class="card-text">${item.price2}</p>
      <button id2 = "${item.id2}" class="btn btn-secondary btn-delete-2 ">удалить</button>
      <button data-bs-toggle='modal' data-bs-target='#exampleModal' id2 = "${item.id2}" class="btn btn-dark btn-edit-2">изменить</button>
     </div>
  </div>
        `;
  });
  //? добавляем эту функцию
  // renderPagination2();
}

// //? функция для отображения кнопок для пагинации
// function renderPagination2() {
//   paginationList2.innerHTML = "";
//   for (let i = 1; i <= pageTotalCount; i++) {
//     paginationList2.innerHTML += `
//       <li class="page-item ${currentPage == i ? "active" : ""}">
//       <a class="page-link page_number text-black" href="#">${i}</a>
//       </li>
//       `;
//   }
//   //? проверка для того чтоб кнопка превьюс была не активной на первой странице
//   if (currentPage == 1) {
//     prev2.classList.add("disabled");
//   } else {
//     prev2.classList.remove("disabled");
//   }

//   //? проверка для того чтоб кнопка некст была не активной на последней странице
//   if (currentPage == pageTotalCount) {
//     next2.classList.add("disabled");
//   } else {
//     next2.classList.remove("disabled");
//   }
// }
//? обработчик события для добавления(create)

addForm2.addEventListener("submit", (e) => {
  //?что бы стр не перезагружалась
  e.preventDefault();
  //? проверка на заполненность полей
  if (
    !titleInp2.value.trim() ||
    !descriptionInp2.value.trim() ||
    !priceInp2.value.trim() ||
    !imageInp2.value.trim()
  ) {
    alert("заполните все поля");
    return;
  }
  //?создаем объект для добавления db.json
  const product2 = {
    title2: titleInp2.value,
    description2: descriptionInp2.value,
    price2: priceInp2.value,
    image2: imageInp2.value,
  };
  //?оправдяем объект в db.json
  addProduct2(product2);
  //? очищаем инпуты
  titleInp2.value = "";
  descriptionInp2.value = "";
  priceInp2.value = "";
  imageInp2.value = "";
});

//?событие клик при удалении карточки
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete-2")) {
    deleteProduct2(e.target.id2);
  }
});

//? переменная что бы сохранить id продукта на который мы нажали
let id2 = null;
//?обработчик события на открытие и заполнение модалки
document.addEventListener("click", async (e) => {
  //? в условии пишем содержит ли такой класс
  if (e.target.classList.contains("btn-edit-2")) {
    //?сохраняем id продукта
    id2 = e.target.id2;
    //?получаем объект продукта на который мы нажали
    const product = await getOneProduct2(e.target.id2);
    //? заполняем инпуты данными продукта getOneProduct асинхронная функция
    editTitleInp2.value = product.title2;
    editPriceInp2.value = product.price2;
    editDescriptionInp2.value = product.description2;
    editImageInp2.value = product.image2;
  }
});

//? обработчик события на сохранение данных
editSaveBtn2.addEventListener("click", () => {
  //? проверка на пустоту инпутов
  if (
    !editTitleInp2.value.trim() ||
    !editPriceInp2.value.trim() ||
    !editDescriptionInp2.value.trim() ||
    !editImageInp2.value.trim()
  ) {
    alert("заполните все поля ");
    //? если хотя бы один инпут пустой , выводим предупреждение  и останавливаем функцию
    return;
  }
  //?собираем измененный объект для изменения продукта
  const editedProduct = {
    title2: editTitleInp2.value,
    price2: editPriceInp2.value,
    description2: editDescriptionInp2.value,
    image2: editImageInp2.value,
  };
  //?вызываем функцию для изменения
  editProduct2(id2, editedProduct);
});

// //? обработчик события чтобы перейти на определенную страницу
// document.addEventListener("click", (e) => {
//   if (e.target.classList.contains("page_number")) {
//     currentPage = e.target.innerText;
//     getProducts2();
//   }
// });

// //? обработчик события чтобы перейти на следующую страницу
// next2.addEventListener("click", () => {
//   if (currentPage == pageTotalCount) {
//     return;
//   }

//   currentPage++;
//   getProducts2();
// });

// //? обработчик события чтобы перейти на предыдущую страницу
// prev2.addEventListener("click", () => {
//   if (currentPage == 1) {
//     return;
//   }
//   currentPage--;
//   getProducts2();
// });

// //? обработчик события для поиска
// searchInp2.addEventListener("input", () => {
//   searchVal = searchInp.value;
//   currentPage = 1;
//   getProducts2();
// });
