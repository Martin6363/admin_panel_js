const userName = document.getElementById("username");
const surName = document.getElementById("surname");
const age = document.getElementById("age");
const button = document.getElementById("button");
const disableBtn = document.getElementById("disable-btn");
const userTable = document.getElementById("table-user");
const searchInput = document.getElementById("search");
const searchButton = document.getElementById("search-button");
const loadingBar = document.getElementById("loading");
const percentLoading = document.getElementById("percent");
const loadingContainer = document.getElementById("loading-cont");
let editId;


let userData = [];
userTableData();

getUsers()
.then((data) => {
  userData = data;
  userTableData();
})

function setUserTable (data) {
    const rows = data.map((elem, i) => {
        return  `
            <tr>
                <td class="td-users">${i + 1}</td>
                <td class="td-users">${elem.name}</td>
                <td class="td-users">${elem.surname}</td>
                <td class="td-users">${elem.age}</td>
                <td class="td-users"><button class="edit-btn" onclick="onEdit(${i})">Edit</button> 
                <button class="delete-btn" onclick="deleteUser(${i})">Delete</button></td>
            </tr>
        `;
    })

    rows.unshift(`
        <tr>
            <td class="td-users"></td>
            <td class="td-users"><strong>Name</strong></td>
            <td class="td-users"><strong>Surname</strong></td>
            <td class="td-users"><strong>Age</strong></td>
            <td class="td-users"></td>
        </tr>
    `);
    averageAge(userData, rows);
    return rows;
};



// Table Create Data
function userTableData () {   

    userTable.innerHTML =
    `
        <thead>
            <tr>
                <th class="th-users">No.</th>
                <th class="th-users">Username</th>
                <th class="th-users">Surname</th>
                <th class="th-users"><span class="th-age" title="Reset" onclick="resetSort()">Age</span><span class="sort-age-cont"><i class="fa-sharp sort-down fa-solid fa-chevron-down" onclick="sortAgeUp()"></i>
                <i class="fa-sharp sort-up fa-solid fa-chevron-up" onclick="sortAgeDown()"></i></span></th>
                <th class="th-users">Action</th>
            </tr>
        </thead>
     
    `
    userTable.innerHTML += setUserTable(userData).join('');

};


// Average Age number
function averageAge (array, avgAge) {
    let avAge;
    const age =  array.map(obj => Number(obj.age));
    age.length > 0 ? avAge = age.reduce((a, b) =>{
        return +a + +b
    }) / age.length : avAge = 0;  

    avgAge.push(`
        <tr>
            <td colspan="3" class="td-users">Average Age</td>
            <td class="td-users">${avAge}</td>
            <td></td>
        </tr>
    `);
    return avAge;
}


function onEdit (i) {
    userName.value = userData[i].name;
    surName.value = userData[i].surname;
    age.value = userData[i].age;
    
    button.textContent ="Save";
    editId = userData[i].id;
}
  


function search () {
    let search = searchInput.value.toUpperCase();
    
    let filterData = userData.filter((val) => {
        let fullName = val.name + " " + val.surname + " " + val.age;
        return fullName.toUpperCase().includes(search);
   
    });
    userTable.innerHTML = setUserTable(filterData).join("");
}


// Validation Input
function userNameValid (nameInput) {
    let isValid = true;
    const name = nameInput.value;

    if (name === "") {
        inputError(nameInput, "Username is required");
        isValid = false;
    } else if (!checkReGexUserName(name)) {
        inputError(nameInput, "Spelling error");
        isValid = false;
    } else {
        inputSuccess(nameInput);
    }

    return isValid;
}


function surNameValid (nameInput) {
    let isValid = true;
    const name = nameInput.value;

    if (name === "") {
        inputError(nameInput, "Surname is required");
        isValid = false;
    } else if (!checkReGexUserName(name)) {
        inputError(nameInput, "Spelling error");
        isValid = false;
    } else {
        inputSuccess(nameInput);
    }

    return isValid;
}


function ageValid (ageNum) {
    let isValid = true;
    const ageN = ageNum.value
    if (!ageN) {
        inputError(ageNum, "Age is required");
        isValid = false;
    } else if (ageN < 10) {
        inputError(ageNum, "Age must be 10 or older");
        isValid = false;
    } else if (ageN > 100) {
        inputError(ageNum, "Age should not be more than 100")
        isValid = false;
    } else {
        inputSuccess(ageNum)
    }
    return isValid;
}


// Clear input value
function clearInputValue () {
    document.getElementById("username").value = "";
    document.getElementById("surname").value = "";
    document.getElementById("age").value = "";
}



// Delete User api
function deleteUser (i) {
    console.log(i)
    deleteUsersResp(userData[i].id).then(data => {
        return getUsers();
    }).then(users => {
        userData = users;
       userTableData()
    })
}


// Check Regex username
function checkReGexUserName (user) {
    const nameRegex =  /^[a-zA-Z]+([._]?[a-zA-Z]+)*$/;
    return nameRegex.test(user)
}

// Check error & success
function inputSuccess (input) {
    const inputCont = input.parentElement;
    inputCont.classList = 'input-cont success';
}


function inputError (input, message) {
    const inputCont = input.parentElement;
    inputCont.classList.add('error');
    const errorText = inputCont.querySelector('#text');
    errorText.innerText = message;
}


function sortAgeDown () {
        userData.sort((a, b) =>{
            return b.age - a.age
        });
        userTable.classList.remove("up");
        userTable.classList.remove("down");
        userTableData();
};


function sortAgeUp () {
    userData.sort((a, b) =>{
        return a.age - b.age
    });
    userTable.classList.add("up");
    userTable.classList.add("down");
    userTableData();
};


function resetSort () {
    userData = [...userData].sort((a, b) =>{
        return userData.indexOf(a) - userData.indexOf(b);
    });
    userTableData();
}



// Oninput Check Valid
userName.oninput = function () {
    userNameValid(userName)
}
surName.oninput = function () {
    surNameValid(surName)
}
age.oninput = function () {
    ageValid(age)
}


// Loading animation
function loadingAnimate () {
    let count = 0;
    let loading = setInterval(() => {
        count++
    loadingBar.style.width = count + '%';
    percentLoading.textContent = count + '%';
    if (count >= 100) {
        clearInterval(loading);
    }
    if (count === 100) {
        userTableData();
        clearInputValue();
        percentLoading.style.color = '#00ff00';
        percentLoading.textContent = 'Success';
        disableBtn.style.display = "none";
        button.style.display = "block";
        setTimeout(() => {
            loadingContainer.style.display = 'none';
        }, 2 * 1000);
        button.textContent = 'Create'
        search()
    }
    // Disable button 
    disableBtn.onclick = function () {
        disableBtn.style.display = "none";
        button.style.display = "block";
            clearInterval(loading);
            loadingContainer.style.display = 'none';
    }
}, 10);
}


function createUserResponse (user) {
    createUser(user).then(data => {
        return getUsers();
    }).then((users) => {
        console.log("User data added successfully");
        userData = users;
        console.log(userData, "sada")
        userTableData();
    })
}


function createUserResp (newUser) {
    let userNameX = userName.value;
    let surNameX = surName.value;
    let ageX = age.value;

    newUser = {name: userNameX, surname: surNameX, age: ageX};
    createUserResponse(newUser);
}



function checkUsersAndPush () {
    let userNameX = userName.value;
    let surNameX = surName.value;
    let ageX = age.value;

    if (userNameValid(userName) && surNameValid(surName) && ageValid(age)) {
        if (editId) {
           putUserData({name: userNameX, surname: surNameX, age: ageX, id: editId})
        .then((rec) => {
            return getUsers();
        }).then((data) => {
            userData = data;
            userTableData();
        })
        } else {
            createUserResp(userData);
        }
        percentLoading.style.color = '#fff'
        loadingContainer.style.display = 'block';
        if (!loadingAnimate()) {
            button.style.display = "none";
            disableBtn.style.display = "block";
        }
    };
}


// Button Create
button.onclick = function () {
    userNameValid(userName);
    surNameValid(surName);
    ageValid(age);
    checkUsersAndPush()
    if (button.textContent === "Save") { 
        button.textContent ="Create";
    }
}


searchButton.onclick = function () {
    loadingContainer.style.display = 'block';
    loadingAnimate()
}

// Enter key down Search user data
document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && searchInput.value !== "") {
        searchButton.click();
    }
})
