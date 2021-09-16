const userCollection = []; //test variable
var ADMIN = false; //access admin

let content = document.querySelector('#section-about');
//form
let btnForm = document.querySelector('.show-form');
let userForm = document.querySelector('.forms');
let forms = document.querySelector('#form-ui-ui');
let input = document.querySelectorAll('.inp');
let logOut = document.querySelector('.out');
let sendButton = document.querySelector('.btn-form-send')
let saveButton = document.querySelector('.btn-form-save')
let btnHide = document.querySelector('#btn-form');
//input value
const names = document.querySelector('input.username');
const stack = document.querySelector('textarea.stack');
const skills = document.querySelector('textarea.skills');
const description = document.querySelector('textarea.description');
const avatar = document.querySelector('input.avatar');
const cv = document.querySelector('input.cv');
const checkbox = document.querySelector('.verify');
//autorize
const formAutorize = document.querySelector('.autorize-form');
const username = document.querySelector('input.user-autorize');
const password = document.querySelector('input.pass-autorize');
//popup
const popup = document.querySelector('.content-popup');
const cancel = document.querySelector('.btn-cancel');
//form of interview
const interviewForm = document.querySelector('.the-interview-form');
const userEmail = document.querySelector('input.email');
const userName = document.querySelector('input.name');
const btnPopupForm = document.querySelector('.btn-popup');

//validate form
const validateInterviewForm = (email, name) => {
    const validate = true;

    if (!email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
        validate = false
    }
    if (!name.value) {
        validate = false
    }
    return validate
}
//post interview
const clientDataForAccessToInterviews = () => {
    const onClosePopup = () => {
        const asd = popup.style.display = 'none';
        return popup && asd
    }

    if (interviewForm) {
        interviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateInterviewForm(userEmail, userName)) return

            const data = {
                email: userEmail.value,
                name: userName.value
            }
            axios({
                method: 'post',
                url: 'https://evacodes-blockchain.herokuapp.com/api/v1/data/interview',
                data: data
            })
                .then(data => {
                    if (data) {
                        userEmail.value = ''
                        userName.value = ''
                        setTimeout(() => onClosePopup(), 1000)
                    }
                    console.log(data, 'interview request completed successfully')
                })
                .catch(err => {
                    console.log(err, 'err with interview request')
                })

        })
    }
}

clientDataForAccessToInterviews()

// autorize

const adminAuthorization = () => {
    console.log(1)
    if (formAutorize) {
        formAutorize.addEventListener('submit', (e) => {
            e.preventDefault();

            const data = {
                username: username.value,
                password: password.value
            };
            axios({
                method: 'post',
                url: 'https://evacodes-blockchain.herokuapp.com/api/v1/login/autorization',
                data: data
            })
                .then(data => {
                    console.log(2)

                    const { token } = data.data;
                    ADMIN = !ADMIN
                    window.Cookies.set('admin', `${token}`, { expires: 7 })
                    if (data.status === 200) {
                        ADMIN = true
                        localStorage.setItem('ADMIN', ADMIN)
                        document.location.href = `https://blockchain.evacodes.com/test/test.html`
                    }
                })
                .catch(err => {
                    console.log(err, 'err with updating user name')
                })
                .finally(() => {
                    ADMIN = !ADMIN
                    console.log(ADMIN, 'AD')
                })
        })

    }
}
adminAuthorization()

// admin log out

if (logOut) {
    logOut.addEventListener('click', () => {
        // let mydate = new Date();
        // mydate.setTime(mydate.getTime() - 1);
        window.Cookies.remove('admin')
        localStorage.clear();
        adminForm();
    })
}

const postUserData = () => {

    if (forms) {
        forms.addEventListener('submit', (e) => {
            console.log(names.value, 'names.value')
            e.preventDefault()
            let formData = new FormData();
            if (names) formData.append("username", names.value);
            if (skills) formData.append("skills", skills.value);
            if (description) formData.append("description", description.value);
            if (stack) formData.append("stack", stack.value);
            if (cv) formData.append("cv", cv.files[0]);
            if (avatar) formData.append("avatar", avatar.files[0]);
            if (checkbox) formData.append("checkbox", checkbox.checked);

            axios({
                method: 'post',
                url: 'https://evacodes-blockchain.herokuapp.com/api/v1/user',
                headers: {
                    'Content-Type': 'multipart/form-data',
                    authorization: 'Bearer ' + window.Cookies.get('admin')
                },
                data: formData
            })
                .then((data) => {
                    console.log('Пользователь отпрвлен в базу данных')
                    if (data) {
                        getUsersData();
                        clearForm();
                        forms.reset()

                    }

                })
                .catch(err => {
                    console.log(err, 'err with updating user name')
                })
        })
    }
}

postUserData();

// AWS s3
(() => {
    if (document.querySelector(".avatar")) document.querySelector(".avatar").onchange = () => {
        const files = document.querySelector('.avatar').files;
        const file = files[0];
        // file.name = withoutSpaces(file.name);
        // console.log(withoutSpaces(file.name), 'file')
        if (file == null) {
            return alert('No file selected.');
        }
        getSignedRequest(file);
    };
})();
const ADMIN_ACCESS = localStorage.getItem('ADMIN')

if (ADMIN_ACCESS) {
    (() => {
        document.querySelector(".cv").onchange = () => {
            const files = document.querySelector('.cv').files;
            const file = files[0];
            if (file == null) {
                return alert('No file selected.');
            }
            getSignedRequest(file);
        };
    })();
}


function getSignedRequest(file) {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', `https://evacodes-blockchain.herokuapp.com/api/v1/sign-s3?file-name=${file.name}&file-type=${file.type}`);
    xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
            if (xhr.status === 200) {
                const response = JSON.parse(xhr.responseText);
                uploadFile(file, response.signedRequest, response.url);
            }
            else {
                alert('Could not get signed URL.');
            }
        }
    };
    xhr.send();
}
function uploadFile(file, signedRequest, url) {
    const xhr = new XMLHttpRequest();
    xhr.open('PUT', signedRequest);
    // https://evacodes.s3.amazonaws.com/
    // http://127.0.0.1:5000/
    xhr.send(file);
}

function loadImage(id, src) {
    var article = document.getElementById(id);

    const avatar = article?.dataset.avatar
    let images = src + avatar;

    var ts = Date.now(), img = new Image, timer;
    console.log(img, 'load')
    img.onerror = function () {
        if (Date.now() - ts < 10000) {
            timer = setTimeout(function () { img.images = images; }, 1000);
            clearInterval(timer)
        }
    }
    img.onload = function () {
        // clearInterval(timer)
        document.getElementById(id).images = images;
    }
    img.images = images;
}

const getUsersData = async () => {
    const ADMIN_ACCESS = localStorage.getItem('ADMIN')
    let users = [];
    try {
        let response = await fetch('https://evacodes-blockchain.herokuapp.com/api/v1/users');
        users = await response.json();
        console.log(users, 'users')
    } catch (error) {
        console.log(error + 'err in fetch users data api!');
    }
    if (users?.length) userCollection.push(users);
    let usersCards = users?.map((user) => {

        if (!!ADMIN_ACCESS) {
            return `
            <div class="content content-box" id='contents'>
            <p class='edit' 
            data-name="${user.username}"
            data-skills="${user.skills}"
            data-stack="${user.stack}"
            data-description="${user.description}"
            data-id="${user._id}"
            >Редактировать</p>
            <div class="image">
                <img src="${'https://evacodes.s3.amazonaws.com/' + user.avatar}" alt="${user.avatar}" class="user-image" id="myImage" data-avatar="${user.avatar}" />
            </div>
            <div class="desc">
                <p>
                    Hello! I’m Daniel Curry. Web designer from USA, California, 
                    San Francisco. I have rich experience in web site design and building, 
                    also I am good at wordpress. I love to talk with you about our unique.
                </p>
                <div class="info-list">
                    <ul id='desk'>
                        <li>
                            <strong contenteditable="false">Username:</strong> 
                            <span class='field-username' data-username="${user.username}" data-skills="${user.skills}">${user.username}</span>
                        </li>
                        <li>
                            <strong contenteditable="false">Skills:</strong>
                            <span id='skills' class='field-skills' data-skills="${user.skills}">${user.skills}</span>
                        </li>
                        <li>
                            <strong contenteditable="false">Stack:</strong> 
                            <span id='stack' class='field-stack' data-stack="${user.stack}">${user.stack}</span></li>
                        <li>
                            <strong contenteditable="false">Description:</strong>
                            <span id='description' class='field-description' data-description="${user.description}">${user.description}</span>
                        </li>
                    </ul>
                </div>
                <div class="bts">
                    <button class="btns remove hover-animated" id="btn-delete" data-id="${user._id}" data-avatar="${user.avatar}" data-cv=${user.cv}>
                        <span class="circle" id="value"></span>
                        <span class="lnk">Delete user</span>
                    </button>
                    <div class="container-cv"> <button class="btn-cv" data-cv="${user.cv}">Открыть CV</button> </div>
                </div>     
            </div>
        </div> `
        } else {
            return `
            <div class="content content-box" id='contents'>
            <div class="image">
                <img src="${'https://evacodes.s3.amazonaws.com/' + user.avatar}" alt="${user.avatar}" class="user-image" />
            </div>
            ${user.checkbox ? '<img src="../images/mark.png" alt="done" class="done" />' : ''}
            <div class="desc">
                <p>Hello! I’m Daniel Curry. Web designer from USA, California, 
                    San Francisco. I have rich experience in web site design and building, 
                    also I am good at wordpress. I love to talk with you about our unique.</p>
                <div class="info-list">
                    <ul id='desk'>
                        <li><strong>Username:</strong> <span>${user.username}</span></li>
                        <li><strong>Skills:</strong> <span id='skills'>${user.skills}</span></li>
                        <li><strong>Stack:</strong> <span id='stack'>${user.stack}</span></li>
                        <li><strong>Description:</strong> <span id='description'>${user.description}</span></li>
                    </ul>
                </div>
                <div class="container-cv">
                    <button class="btn-cv" data-cv="${user.cv}">Open CV</button>
                    ${user.checkbox ? '<button class="btn-interview" id="pos-interview">Look interview</button>' : ''}              
                </div>
            </div>
        </div> `
        }

    }).join('')

    if (content) {
        content.innerHTML = usersCards;
        loadImage('myImage', 'https://evacodes.s3.amazonaws.com/')
    }

}
getUsersData()


// Edit user data

$(document).on('click', '.edit', function (e) {
    const updateName = $(this).data('name');
    const updateStack = $(this).data('stack');
    const updateSkills = $(this).data('skills');
    const updateDescription = $(this).data('description');
    const id = $(this).data('id');

    sendButton.style.display = 'none'
    saveButton.style.display = 'block'
    saveButton.setAttribute('data-id', id)
    console.log('sho')
    names.value = updateName
    stack.value = updateStack
    skills.value = updateSkills
    description.value = updateDescription
    console.log(updateName);

    window.scrollTo(0, 400);
})


const updateUserData = async () => {
    let users = [];
    // getting user id 
    try {
        let response = await fetch('https://evacodes-blockchain.herokuapp.com/api/v1/users');
        if (response.ok) {
            users = await response.json();
        }
    } catch (error) {
        console.log(error);
    }

    $(document).on('click', '.btn-form-save', function (e) {

        if (users?.length) {
            const updateUserData = document.querySelector('.btn-form-save')
            const id = updateUserData.dataset.id
            //newUserdata
            let newName = names.value;
            let newStack = stack.value;
            let newSkills = skills.value;
            let newDesc = description.value;
            let newCv = cv?.files[0]?.name;
            let newAvatar = avatar?.files[0]?.name;
            console.log(users, 'users')
            const userId = users.find(user => user._id === id)
            //oldUserdata
            let oldName = userId?.username;
            // console.log(oldName, 'oldName oldName')
            let oldStack = userId?.stack;
            let oldSkills = userId?.skills;
            let oldDesc = userId?.description;
            let oldCv = userId?.cv;
            let oldAvatar = userId?.avatar;

            sendButton.style.display = 'block'
            saveButton.style.display = 'none'

            const data = {
                newName,
                newStack,
                newSkills,
                newDesc,
                newCv,
                newAvatar,
                oldName,
                oldStack,
                oldSkills,
                oldDesc,
                oldCv,
                oldAvatar,
            }

            axios({
                method: 'post',
                url: 'https://evacodes-blockchain.herokuapp.com/api/v1/update/user',
                data: data
            })
                .then(data => {
                    console.log(data, 'user update')
                    clearForm()
                    getUsersData()
                    forms.reset()
                })
                .catch(err => {
                    console.log(err, 'err with update')
                })
        }
    })
}
updateUserData()


// delete user

$(document).on('click', '#btn-delete', function (e) {
    const id = $(this).data('id');
    const avatar = $(this).data('avatar');
    const cv = $(this).data('cv');

    axios({
        method: 'delete',
        url: `https://evacodes-blockchain.herokuapp.com/api/v1/users/${id}`,
        data: {
            id: id,
            avatar: avatar,
            cv: cv
        }
    })
        .then(data => {
            console.log(data, 'user deleted')
            if (e.target.offsetParent.offsetParent) e.target.offsetParent.offsetParent.style.display = 'none'
        })
        .catch(err => {
            console.log(err, 'error to delete user')
        })
});

// open cv

$(document).on('click', '.btn-cv', function (e) {
    e.preventDefault();
    const cv = $(this).data('cv');
    console.log(cv, 'cv')
    window.open(`https://evacodes.s3.amazonaws.com/${cv}`, '_blank');
});

//look interview

$(document).on('click', '.btn-interview', function (e) {
    popup.style.display = 'flex'
});

//cancel popup

cancel && cancel.addEventListener('click', (e) => {
    if (popup) popup.style.display = 'none'
})

const formUser = () => {
    if (forms) {
        forms.addEventListener('submit', (e) => {
            e.preventDefault()
        })
    }
    if (btnHide) {
        btnHide.addEventListener('click', (e) => {
            e.preventDefault()
            hideForm()
        })
    }
}

formUser();

const withoutSpaces = (str) => {
    if (str?.length) {
        return str.replace(/\s/g, '')
    };
    return str
}

function hideForm() {
    forms.style.display = "none";
    btnForm.innerHTML = `<button class='btns' onclick='showForm()'>Вернуть форму</button>`;
}

function showForm() {
    forms.style.display = "block";
    btnForm.innerHTML = ''
}

function clearForm() {
    names.value = '',
        skills.value = '',
        description.value = '',
        stack.value = ''
}


function adminForm() {
    ADMIN = false;
    const ADMIN_ACCESS = localStorage.getItem('ADMIN')
    if (!!ADMIN_ACCESS) {
        if (userForm) userForm.style.display = 'block';
    } else {
        if (userForm) userForm.style.display = 'none';
    }
}

adminForm();

