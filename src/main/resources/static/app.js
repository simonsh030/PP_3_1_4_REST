
const renderUsers = (users) => {
    output = '',
        users.forEach(user => {
            output += ` 
              <tr> 
                    <td>${user.id}</td> 
                    <td>${user.name}</td> 
                    <td>${user.lastName}</td> 
                    <td>${user.email}</td> 
                    <td>${user.roles.map(role => role.name === 'ROLE_USER' ? 'USER' : 'ADMIN')}</td> 
                    <td>${user.password}</td> 
              <td> 
                   <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-info" 
                    data-toggle="modal" data-target="modal" id="edit-user" data-id="${user.id}">Edit</button> 
               </td> 
               <td> 
                   <button type="button" class="btn btn-danger" id="delete-user" data-action="delete" 
                   data-id="${user.id}" data-target="modal">Delete</button> 
                    </td> 
              </tr>`
        })
    info.innerHTML = output;
}
let users = [];
const updateUser = (user) => {
    const foundIndex = users.findIndex(x => x.id == user.id);
    users[foundIndex] = user;
    renderUsers(users);
    console.log('users');
}
const removeUser = (id) => {
    users = users.filter(user => user.id != id);
    console.log(users)
    renderUsers(users);
}

// GET ALL users
const info = document.querySelector('#allUsers');
const url = 'http://localhost:8080/api/admin'

fetch(url, {mode: 'cors'})
    .then(res => res.json())
    .then(data => {
        users = data;
        renderUsers(data)
    })

// ADD user

const addUserForm = document.querySelector('#addUser')
const addName = document.getElementById('name3')
const addLastName = document.getElementById('lastname3')
const addEmail = document.getElementById('email3')
const addPassword = document.getElementById('password3')
const addRoles = document.getElementById('roles3')

addUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(url, {
        method: 'POST',
       // redirect: 'manual',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: addName.value,
            lastName: addLastName.value,
            email: addEmail.value,
            password: addPassword.value,
            roles: [
                addRoles.value
            ]
        })
    })
        .then(res => res.json())
        .then(data => {
            users = data;
            renderUsers(users);
        })
        .then(res =>{
            document.getElementById('ta_samaya_knopka').click()
        })
})

const on = (element, event, selector, handler) => {
    element.addEventListener(event, e => {
        if (e.target.closest(selector)) {
            handler(e)
        }
    })
}


// EDIT user
on(document, 'click', '#edit-user', e => {
    const userInfo = e.target.parentNode.parentNode
    document.getElementById('id0').value = userInfo.children[0].innerHTML
    document.getElementById('name0').value = userInfo.children[1].innerHTML
    document.getElementById('lastName0').value = userInfo.children[2].innerHTML
    document.getElementById('email0').value = userInfo.children[3].innerHTML
    document.getElementById('roles0').value = userInfo.children[4].innerHTML
    document.getElementById('password0').value = userInfo.children[5].innerHTML

    $("#modalEdit").modal("show")
})

const editUserForm = document.querySelector('#modalEdit')
editUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            id: document.getElementById('id0').value,
            name: document.getElementById('name0').value,
            lastName: document.getElementById('lastName0').value,
            email: document.getElementById('email0').value,
            password: document.getElementById('password0').value,
            roles: [
                document.getElementById('roles0').value
            ]
        })
    })
        .then(res => res.json()).then(data => updateUser(data))
        .catch((e) => console.error(e))

    $("#modalEdit").modal("hide")
})

// DELETE user
let currentUserId = null;
const deleteUserForm = document.querySelector('#modalDelete')
deleteUserForm.addEventListener('submit', (e) => {
    e.preventDefault();
    e.stopPropagation();
    fetch('http://localhost:8080/api/admin/' + currentUserId, {
        method: 'DELETE'
    })
        .then(res => res.json())
        .then(data => {
            removeUser(currentUserId);
            deleteUserForm.removeEventListener('submit', () => {
            });
            $("#modalDelete").modal("hide")
        })
})

on(document, 'click', '#delete-user', e => {
    const fila2 = e.target.parentNode.parentNode
    currentUserId = fila2.children[0].innerHTML

    document.getElementById('id2').value = fila2.children[0].innerHTML
    document.getElementById('name2').value = fila2.children[1].innerHTML
    document.getElementById('lastName2').value = fila2.children[2].innerHTML
    document.getElementById('email2').value = fila2.children[3].innerHTML
    document.getElementById('roles2').value = fila2.children[4].innerHTML

    $("#modalDelete").modal("show")
})

//Navigation bar
const url3 = 'http://localhost:8080/api/user'
let loggedUserHeaderElem = document.querySelector('#navBarAdmin')

fetch(url3)
    .then(res => res.json())
    .then(data => {
        loggedUserHeaderElem.innerHTML = `<span class="align-middle font-weight-bold mr-1">${data.name}  </span></b> 
                <span class="align-middle mr-1"> with roles:  </span> 
                <span>  ${data.roles.map(role => role.name === 'ROLE_USER' ? 'USER' : 'ADMIN')}</span>`;
    })