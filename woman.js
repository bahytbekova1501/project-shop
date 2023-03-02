//? api для запросов
let API2 = " http://localhost:8000/productsWoman";

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

// ?первоначальное отображенеие данных
getProducts2();
// ?стягиваем данные с сервера
async function getProducts2() {
  const res2 = await fetch(API2);
  const data2 = await res2.json();
  render(data2);
}

async function addProduct2(product) {
  await fetch(API2, {
    method: "POST",
    body: JSON.stringify(product),
    headers: {
      "Content-Type": "application/json",
    },
  });
  //? стягиваем и отображаем актуальные данные
  getProducts2();
}

async function deleteProduct2(id) {
  //?await для того чтобы getProducts(); подождала пока данные добавяться , потому что fetch асинхронный
  await fetch(`${API2}/${id}`, {
    method: "DELETE",
  });
  //?  стягиваем и отображаем актуальные данные
  getProducts2();
}

//? функция для получения одного продукта
async function getOneProduct2(id) {
  const res = await fetch(`${API2}/${id}`);
  const data = await res.json(); // ? расшифровка данных
  //?  возвращаем продукт с db.json
  return data;
}

//? функция что бы изменить данные
async function editProduct2(id, editedProduct) {
  //?await для того чтобы getProducts(); подождала пока данные добавяться , потому что fetch асинхронный
  await fetch(`${API2}/${id}`, {
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
    src = "${item.image}"
    class "card-img-top"
    alt = "..."
    />
    <div class="card-body">
      <h5 class="card-title">${item.title}</h5>
      <p class="card-text">${item.description}</p>
      <p class="card-text">${item.price}</p>
      <button id = "${item.id}" class="btn btn-secondary btn-delete ">удалить</button>
      <button data-bs-toggle='modal' data-bs-target='#exampleModal' id = "${item.id}" class="btn btn-dark btn-edit">изменить</button>
     </div>
  </div>
        `;
  });
}

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
  const product = {
    title: titleInp.value,
    description: descriptionInp.value,
    price: priceInp.value,
    image: imageInp.value,
  };
  //?оправдяем объект в db.json
  addProduc2(product);
  //? очищаем инпуты
  titleInp.value = "";
  descriptionInp.value = "";
  priceInp.value = "";
  imageInp.value = "";
});

//?событие клик при удалении карточки
document.addEventListener("click", async (e) => {
  if (e.target.classList.contains("btn-delete")) {
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
    const product = await getOneProduct2(e.target.id);
    //? заполняем инпуты данными продукта getOneProduct асинхронная функция
    editTitleInp.value = product.title;
    editPriceInp.value = product.price;
    editDescriptionInp.value = product.description;
    editImageInp.value = product.image;
  }
});

//? обработчик события на сохранение данных
editSaveBtn2.addEventListener("click", () => {
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
  editProduct2(id, editedProduct);
});
