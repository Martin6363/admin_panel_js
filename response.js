
async function createUser (data) {
    let req = await fetch('http://localhost:3000/users', {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    })
    return await req.json();
};


async function deleteUsersResp(id) {
    let req = await  fetch(`http://localhost:3000/users/${id}`, {
        method: 'DELETE',
        headers: {
            "Content-Type": "application/json",
        }
    });
    return await req.json();
}
  

async function getUsers() {
    let req = await fetch('http://localhost:3000/users', {
        method: 'GET',
        headers: {
            "Content-Type": "application/json",
        }
    });
    return await req.json();
}


async function putUserData(userId, userData) {
    const response = await fetch(`http://localhost:3000/users${userId}`, {
      method: 'PUT',
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify(userData),
    });
  
    return await response.json();
}  