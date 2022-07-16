// 화면 그리기
function init() {
  var inputTitle = document.createElement("input");
  inputTitle.setAttribute("name", "my-input");
  inputTitle.setAttribute("placeholder", "제목을 입력해 주세요");

  var btnAdd = document.createElement("button");
  btnAdd.setAttribute("name", "my-btn");
  btnAdd.textContent = "등록";
  btnAdd.addEventListener("click", handleClickAdd);

  var btnSave = document.createElement("button");
  btnSave.textContent = "저장";
  btnSave.addEventListener("click", handleClickSave);

  var divTable = document.createElement("div");
  divTable.setAttribute("name", "div-table");

  const main = document.querySelector("#main");
  main.appendChild(inputTitle);
  main.appendChild(btnAdd);
  main.appendChild(btnSave);
  main.appendChild(divTable);

  selectTodoListHistory(); // 전체이력조회
}

// 등록클릭
function handleClickAdd(ev) {
  var myInput = document.querySelector('[name="my-input"]');
  if (myInput.value.trim() === "" || myInput.value.trim() == null) {
    alert("제목을 입력해 주세요.");
    myInput.focus();
    return;
  }

  var divRow = document.createElement("div");

  var spanTitle = document.createElement("span");
  spanTitle.innerHTML = myInput.value;
  myInput.value = "";
  spanTitle.setAttribute("style", "display:inline-block; width:300px;");

  var spanClose = document.createElement("span");
  spanClose.innerHTML = "❌";
  spanClose.addEventListener("click", function (ev) {
    document.querySelector('[name="div-table"]').removeChild(this.parentElement);
  });

  divRow.appendChild(spanTitle);
  divRow.appendChild(spanClose);
  document.querySelector('[name="div-table"]').appendChild(divRow);
  myInput.focus();
}

// 저장클릭
function handleClickSave(ev) {
  const saveArr = [];
  var divSaveList = document.querySelector('[name="div-table"]').children;
  for (let i = 0; i < divSaveList.length; i++) {
    saveArr.push({ title: divSaveList[i].children[0].innerHTML });
  }
  saveTodoList(saveArr);
}

// TodoList 전체이력조회
async function selectTodoListHistory() {
  let res = await fetch("http://localhost:3000/selectTodoListHistory?");
  let resJson = await res.json();

  const divHistory = document.querySelector("#history");
  while (divHistory.hasChildNodes()) {
    divHistory.removeChild(divHistory.firstChild);
  }

  for (let i = 0; i < resJson.length; i++) {
    const divRow = document.createElement("div");

    const spanTitle = document.createElement("span");
    spanTitle.innerHTML = `<a href='${resJson[i].TL_DATE}'>${resJson[i].TL_DATE_FORMAT} ${resJson[i].TL_TITLE}</a>`;
    spanTitle.setAttribute("style", "display:inline-block; width:300px;");
    spanTitle.addEventListener("click", function (ev) {
      ev.preventDefault();
      selectTodoList(this.childNodes[0].getAttribute("href"));
    });

    const spanDelete = document.createElement("span");
    spanDelete.innerHTML = `<a href='${resJson[i].TL_DATE}'>❌</a>`;
    spanDelete.addEventListener("click", function (ev) {
      ev.preventDefault();
      deleteTodoListHistory(this.childNodes[0].getAttribute("href"));
    });

    divRow.appendChild(spanTitle);
    divRow.appendChild(spanDelete);
    divHistory.appendChild(divRow);
  }
}

// TodoList조회
async function selectTodoList(P_TL_DATE) {
  let res = await fetch(
    "http://localhost:3000/selectTodoList?" +
      new URLSearchParams({
        TL_DATE: P_TL_DATE,
      })
  );
  let resJson = await res.json();

  const main = document.querySelector("#main");
  main.removeChild(document.querySelector('[name="div-table"]'));

  var divTable = document.createElement("div");
  divTable.setAttribute("name", "div-table");

  for (let i = 0; i < resJson.length; i++) {
    var divRow = document.createElement("div");

    var spanTitle = document.createElement("span");
    spanTitle.innerHTML = resJson[i].TL_TITLE;
    spanTitle.setAttribute("style", "display:inline-block; width:300px;");

    var spanClose = document.createElement("span");
    spanClose.innerHTML = "❌";
    spanClose.addEventListener("click", function (ev) {
      document.querySelector('[name="div-table"]').removeChild(this.parentElement);
    });

    divRow.appendChild(spanTitle);
    divRow.appendChild(spanClose);
    divTable.appendChild(divRow);
  }
  main.appendChild(divTable);
}

/**
 * TodoList 저장
 * @param
 * @return
 */
async function saveTodoList(P_TODO_LIST_ARR) {
  const paramArr = { TODO_LIST_ARR: P_TODO_LIST_ARR };
  const rawResponse = await fetch("http://localhost:3000/saveTodoList", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(paramArr),
  });

  const res = await rawResponse.json();
  if (JSON.parse(res).RST_MSG !== "저장성공") alert(JSON.parse(res).RST_MSG);

  selectTodoListHistory();
}

/**
 * TodoList 이력삭제
 * @param
 * @return
 */
async function deleteTodoListHistory(P_TL_DATE) {
  const rawResponse = await fetch("http://localhost:3000/deleteTodoListHistory", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ TL_DATE: P_TL_DATE }),
  });

  const res = await rawResponse.json();
  if (JSON.parse(res).RST_MSG !== "저장성공") alert(JSON.parse(res).RST_MSG);

  selectTodoListHistory();
}

init();
