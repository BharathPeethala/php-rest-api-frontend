const statesAndUTs = [
	"Andaman and Nicobar Islands",
	"Andhra Pradesh",
	"Arunachal Pradesh",
	"Assam",
	"Bihar",
	"Chandigarh",
	"Chhattisgarh",
	"Dadra and Nagar Haveli and Daman and Diu",
	"Delhi",
	"Goa",
	"Gujarat",
	"Haryana",
	"Himachal Pradesh",
	"Jammu and Kashmir",
	"Jharkhand",
	"Karnataka",
	"Kerala",
	"Ladakh",
	"Lakshadweep",
	"Madhya Pradesh",
	"Maharashtra",
	"Manipur",
	"Meghalaya",
	"Mizoram",
	"Nagaland",
	"Odisha",
	"Puducherry",
	"Punjab",
	"Rajasthan",
	"Sikkim",
	"Tamil Nadu",
	"Telangana",
	"Tripura",
	"Uttar Pradesh",
	"Uttarakhand",
	"West Bengal",
];
let usersDB;
const URL = "http://localhost/rest-api-employees-list/controllers/api.php";
const createStateDropDown = () => {
	const state = document.querySelector("#input-state");
	let optionsStr = `<option value="">State</option>`;
	for (let i = 0; i < statesAndUTs.length; i++) {
		optionsStr += `<option value=${i}>${statesAndUTs[i]}</option>`;
	}
	state.innerHTML = optionsStr;
};
let deletFlag = true;
let deletUserId;
const addRemoveUserForm = () => {
	const addUserForm = document.querySelector("#addUserForm");
	addUserForm.style.display =
		addUserForm.style.display === "none" ? "block" : "none";
};
const fetchUsers = () => {
	let httpRequest = new XMLHttpRequest();
	httpRequest.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			generateUsersTable(this.responseText);
			storeUsers(this.responseText);
		}
	};
	httpRequest.open("GET", URL, true);
	httpRequest.send();
};
const storeUsers = (data) => {
	usersDB = JSON.parse(data);
};

const generateUsersTable = (usersAPI) => {
	const usersTable = document.querySelector("#usersTable");
	let tableStr = `
    <tr>
      <th scope="col">Name</th>
      <th scope="col">Age</th>
      <th scope="col">state</th>
      <th scope="col">Functions</th>
    </tr>`;

	let users = JSON.parse(usersAPI);
	// console.log(users);
	for (let user of users) {
		// console.log(user);
		tableStr += `<tr>
      <td  id="username-${user.id}">${user.name}</td>
      <td  id="userage-${user.id}">${user.age}</td>
      <td  id="userstate-${user.id}">${statesAndUTs[user.state]}</td>
      <td class='btn-group w-100'>
      <button class='btn btn-info ' onclick='updateUser(${
				user.id
			})'><i class="bi bi-pen-fill"></i></button>
      <button class='btn btn-danger ' data-bs-toggle="modal" data-bs-target="#exampleModal" onclick='generatePopUp(${
				user.id
			})'><i class="bi bi-trash-fill"></i></button>
	<button class='btn btn-success' id='saveUpdate-${
		user.id
	}' style='display:none' onclick ='saveChanges(${
			user.id
		})'><i class="bi bi-arrow-up-circle-fill"></i></button>
      </td>
    </tr>`;
	}
	usersTable.innerHTML = tableStr;
};

function addUser() {
	const inputUserName = document.querySelector("#input-userName");
	const inputAge = document.querySelector("#input-age");
	const inputState = document.querySelector("#input-state");
	const user = `name=${inputUserName.value}&age=${inputAge.value}&state=${inputState.value}`;
	addUsertoMock(user);
}

function addUsertoMock(user) {
	let httpRequest = new XMLHttpRequest();
	httpRequest.open("POST", URL, true);
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			fetchUsers();
		}
	};
	httpRequest.setRequestHeader(
		"Content-type",
		"application/x-www-form-urlencoded"
	);
	httpRequest.send(user);
	addRemoveUserForm();
}

function generatePopUp(id) {
	deletUserId = id;
	for (let user of usersDB) {
		if (user.id == id) {
			var deleteUsername = document.querySelector("#modal-username");
			deleteUsername.textContent = " " + user.name;
		}
	}
}

function confirmDelete() {
	let id = deletUserId;
	let httpRequest = new XMLHttpRequest();
	console.log(id);
	httpRequest.open("DELETE", URL + `?id=${id}`);
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status === 200) {
			fetchUsers();
		}
	};
	httpRequest.setRequestHeader(
		"Content-type",
		"application/x-www-form-urlencoded"
	);
	httpRequest.send();
}

function updateUser(id) {
	const updateUserName = document.querySelector(`#username-${id}`);
	const updateAge = document.querySelector(`#userage-${id}`);
	const updateState = document.querySelector(`#userstate-${id}`);
	const saveChangesbtn = document.querySelector(`#saveUpdate-${id}`);
	let selectStr = `<select class='form-control' name="update-state" id="update-state-${id}" required>`;
	saveChangesbtn.style.display =
		saveChangesbtn.style.display == "block" ? "none" : "block";
	// alert(id);
	if (saveChangesbtn.style.display === "block") {
		updateUserName.setAttribute("contenteditable", true);
		updateAge.setAttribute("contenteditable", true);
		for (let i = 0; i < statesAndUTs.length; i++) {
			if (updateState.textContent == statesAndUTs[i]) {
				selectStr += `<option value=${i} selected>${statesAndUTs[i]}</option>`;
			} else {
				selectStr += `<option value=${i}>${statesAndUTs[i]}</option>`;
			}
		}
		updateState.innerHTML = selectStr + "</select>";
	} else {
		updateUserName.setAttribute("contenteditable", false);
		updateAge.setAttribute("contenteditable", false);
		for (let user in usersDB) {
			console.log(usersDB[user].id, id);
			if (usersDB[user].id == id) {
				updateState.innerHTML = `<p>${statesAndUTs[usersDB[user].state]}</p>`;
			}
		}
	}

	console.log(document.querySelector("#input-state"));
}

function saveChanges(id) {
	const updateUserName = document.querySelector(`#username-${id}`);
	const updateAge = document.querySelector(`#userage-${id}`);
	let user = {
		id: id,
		name: updateUserName.textContent,
		age: Number.parseInt(updateAge.textContent),
		state: document.querySelector(`#update-state-${id}`).value,
	};
	let httpRequest = new XMLHttpRequest();
	httpRequest.open("PUT", URL);
	httpRequest.onreadystatechange = function () {
		if (httpRequest.readyState == 4 && httpRequest.status == 200) {
			fetchUsers();
		}
	};
	httpRequest.setRequestHeader("Content-type", "application/json");
	httpRequest.send(JSON.stringify(user));
}
// fetchUsers();
createStateDropDown();
