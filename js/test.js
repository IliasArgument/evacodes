const userCollection = [];
var ADMIN = false;

let content = document.querySelector('#section-about');
let btnHide = document.querySelector('#btn-form');
//form
let btnForm = document.querySelector('.show-form');
let Allform = document.querySelector('.forms');
let forms = document.querySelector('#form-ui-ui');
let input = document.querySelectorAll('.inp');
let logOut = document.querySelector('.out');
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
const validateForm = (email, name) => {
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
const postUserDataInterview = () => {
    const onClose = () => {
        const asd = popup.style.display = 'none';
        return popup && asd
    }

    if (interviewForm) {
        interviewForm.addEventListener('submit', (e) => {
            e.preventDefault();

            if (!validateForm(userEmail, userName)) return

            const data = {
                email: userEmail.value,
                name: userName.value
            }
            axios({
                method: 'post',
                url: 'http://localhost:5000/api/v1/data/interview',
                data: data
            })
                .then(data => {
                    if (data) {
                        userEmail.value = ''
                        userName.value = ''
                        setTimeout(() => onClose(), 1000)
                    }
                    console.log(data, 'VSE GOOD')
                })
                .catch(err => {
                    console.log(err, 'err with interview user')
                })

        })
    }
}
postUserDataInterview()

const updateUserLogin = () => {
    if (formAutorize) {
        formAutorize.addEventListener('submit', (e) => {
            e.preventDefault();

            const data = {
                username: username.value,
                password: password.value
            };
            axios({
                method: 'post',
                url: 'http://localhost:5000/api/v1/login/autorization',
                data: data
            })
                .then(data => {
                    const { token } = data.data;
                    ADMIN = !ADMIN
                    document.cookie = `${token}`
                    if (data.status === 200) {
                        ADMIN = !ADMIN
                        localStorage.setItem('ADMIN', ADMIN)
                        document.location.href = "http://127.0.0.1:5500/test.html"
                    }
                })
                .catch(err => {
                    console.log(err, 'err with updating user name')
                })
                .finally(() => {
                    ADMIN = !ADMIN

                })
        })

    }
}
setInterval(() => updateUserLogin(), 4000)

if (logOut) {
    logOut.addEventListener('click', () => {
        let mydate = new Date();
        mydate.setTime(mydate.getTime() - 1);
        document.cookie = "username=; expires=" + mydate.toGMTString();
        localStorage.clear();
        adminSttings();
    })
}


const postUserData = () => {

    if (forms) {
        forms.addEventListener('submit', (e) => {
            console.log(avatar, 'ava')
            console.log(cv, 'cv')

            e.preventDefault()
            let formData = new FormData();
            console.log(avatar, 'api form Data')
            if (names) formData.append("username", names.value);
            if (skills) formData.append("skills", skills.value);
            if (description) formData.append("description", description.value);
            if (stack) formData.append("stack", stack.value);
            if (cv) formData.append("cv", cv.files[0]);
            if (avatar) formData.append("avatar", avatar.files[0]);
            if (checkbox) formData.append("checkbox", checkbox.checked);

            axios({
                method: 'post',
                url: 'http://localhost:5000/api/v1/user',
                headers: {
                    'Content-Type': 'multipart/form-data',

                    authorization: 'Bearer ' + document.cookie

                },
                data: formData
            })
                .then((data) => {
                    console.log('Пользователь отпрвлен в базу данных')
                    if (data) {
                        getUsersData();
                        clearInput();
                    }

                })
                .catch(err => {
                    console.log(err, 'err with updating user name')
                })
        })
    }
}

postUserData();


const getUsersData = async () => {
    let response = await fetch('http://localhost:5000/api/v1/users');
    // ADMIN = true
    let users = await response.json();

    userCollection.push(users);
    const ADMIN_BOOL = localStorage.getItem('ADMIN')
    //class='field-username' data-username=${city.username}
    let listItems = users?.map((city) => {

        if (!!ADMIN_BOOL) {
            return `
            <div class="content content-box" id='contents'>
            <div class="image">
                <img src=${'http://localhost:5000/' + city.avatar} alt=${city.avatar} class="user-image" />
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
                            <span contenteditable="true" class='field-username' data-username=${city.username}>${city.username}</span>
                        </li>
                        <li>
                            <strong contenteditable="false">Skills:</strong>
                            <span id='skills' contenteditable="true" class='field-skills' data-skills=${city.skills}>${city.skills}</span>
                        </li>
                        <li>
                            <strong contenteditable="false">Stack:</strong> 
                            <span id='stack' contenteditable="true" class='field-stack' data-stack=${city.stack}>${city.stack}</span></li>
                        <li>
                            <strong contenteditable="false">Description:</strong>
                            <span id='description' contenteditable="true" class='field-description' data-description=${city.description}>${city.description}</span>
                        </li>
                    </ul>
                </div>
                <div class="bts">
                    <button class="btns remove hover-animated" id="btn-delete" data-id=${city._id} data-avatar=${city.avatar} data-cv=${city.cv}>
                        <span class="circle" id="value"></span>
                        <span class="lnk">Delete user</span>
                    </button>
                    <div class="container-cv"> <button class="btn-cv" data-cv=${city.cv}>Открыть CV</button> </div>
                </div>
                
            </div>
    
        </div> `
        } else {
            return `
            <div class="content content-box" id='contents'>
    
            <div class="image">
                <img src=${'http://localhost:5000/' + city.avatar} alt=${city.avatar} class="user-image" />
            </div>
            ${city.checkbox ? '<img src="../images/mark.png" alt="done" class="done" />' : ''}
    
            <div class="desc">
                <p>Hello! I’m Daniel Curry. Web designer from USA, California, 
                    San Francisco. I have rich experience in web site design and building, 
                    also I am good at wordpress. I love to talk with you about our unique.</p>
                <div class="info-list">
                    <ul id='desk'>
                        <li><strong>Username:</strong> <span>${city.username}</span></li>
                        <li><strong>Skills:</strong> <span id='skills'>${city.skills}</span></li>
                        <li><strong>Stack:</strong> <span id='stack'>${city.stack}</span></li>
                        <li><strong>Description:</strong> <span id='description'>${city.description}</span></li>
                    </ul>
                </div>
                <div class="container-cv">
                    <button class="btn-cv" data-cv=${city.cv}>Open CV</button>
                    ${city.checkbox ? '<button class="btn-interview" id="pos-interview">Look interview</button>' : ''}              
                </div>
            </div>
    
        </div> `
        }

    }).join('')

    if (content) {
        content.innerHTML = listItems;
    }

}

getUsersData();

// delete user
$(document).on('click', '#btn-delete', function (e) {
    const id = $(this).data('id');
    const avatar = $(this).data('avatar');
    const cv = $(this).data('cv');

    console.log(id, 'id')
    axios({
        method: 'delete',
        url: `http://localhost:5000/api/v1/users/${id}`,
        data: {
            id: id,
            avatar: avatar,
            cv: cv
        }
    })
        .then(data => {
            console.log(data, 'УДАЛЕННН')
            if (e.target.offsetParent.offsetParent) e.target.offsetParent.offsetParent.style.display = 'none'
        })
        .catch(err => {
            console.log(err, 'err delete user')
        })
});

////

$(document).on('click', '.field-username', function (e) {
    const username = $(this).data('username');
    console.log(username, 'usernames')
    $(document).on('keypress', '.field-username', (e) => {
        const newName = $(this).text();
        if (username) newName
        const data = { newName, username }
        if (e.keyCode == 13) {
            e.preventDefault()
            axios({
                method: 'post',
                url: 'http://localhost:5000/api/v1/change/name',
                data: data
            })
                .then(data => {
                    console.log(data, 'VSE GOOD')
                })
                .catch(err => {
                    console.log(err, 'err with interview user')
                })
        }
    })
})

$(document).on('click', '.field-skills', function (e) {
    const skills = $(this).data('skills');

    $(document).on('keypress', '.field-skills', (e) => {
        const newSkills = $(this).text();
        if (skills) newSkills
        const data = { skills, newSkills }

        if (e.keyCode == 13) {
            e.preventDefault();
            axios({
                method: 'post',
                url: 'http://localhost:5000/api/v1/change/skills',
                data: data
            })
                .then(data => {
                    console.log(data, 'VSE GOOD')
                })
                .catch(err => {
                    console.log(err, 'err with interview user')
                })
        }
    })
})

$(document).on('click', '.field-stack', function (e) {
    const stack = $(this).data('stack');

    $(document).on('keypress', '.field-stack', (e) => {
        const newStack = $(this).text();
        if (stack) newStack
        const data = { stack, newStack }

        if (e.keyCode == 13) {
            e.preventDefault();
            axios({
                method: 'post',
                url: 'http://localhost:5000/api/v1/change/stack',
                data: data
            })
                .then(data => {
                    console.log(data, 'VSE GOOD')
                })
                .catch(err => {
                    console.log(err, 'err with interview user')
                })
        }
    })
})

$(document).on('click', '.field-description', function (e) {
    const desk = $(this).data('description');

    $(document).on('keypress', '.field-description', (e) => {
        const newDesk = $(this).text();
        if (desk) newDesk
        const data = { desk, newDesk }

        if (e.keyCode == 13) {
            e.preventDefault();
            axios({
                method: 'post',
                url: 'http://localhost:5000/api/v1/change/description',
                data: data
            })
                .then(data => {
                    console.log(data, 'VSE GOOD')
                })
                .catch(err => {
                    console.log(err, 'err with interview user')
                })
        }
    })
})

////

$(document).on('click', '.btn-cv', function (e) {
    e.preventDefault();
    const cv = $(this).data('cv');
    window.open(`http://localhost:5000/api/v1/cv/upload/${cv}`, '_blank');
});

//look interview
$(document).on('click', '.btn-interview', function (e) {
    popup.style.display = 'flex'
    console.log('popup')

});

//cancel popup
cancel.addEventListener('click', (e) => {
    if (popup) popup.style.display = 'none'
})

// get cv
$(document).on('click', '.btn-cv', function (e) {
    e.preventDefault();
    const cv = $(this).data('cv');
    window.open(`http://localhost:5000/api/v1/cv/upload/${cv}`, '_blank');
});


const formUser = () => {

    if (forms) {
        forms.addEventListener('submit', (e) => {
            e.preventDefault()
            console.log('psp')
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

function hideForm() {
    forms.style.display = "none";
    btnForm.innerHTML = `<button class='btns' onclick='showForm()'>Вернуть форму</button>`;
}

function showForm() {
    forms.style.display = "block";
    btnForm.innerHTML = ''
}

function clearInput() {
    names.value = '',
        skills.value = '',
        description.value = '',
        stack.value = ''
}


function adminSttings() {
    ADMIN = false;
    const ADMIN_BOOL = localStorage.getItem('ADMIN')

    if (!!ADMIN_BOOL) {
        if (Allform) Allform.style.display = 'block';
    } else {
        if (Allform) Allform.style.display = 'none';
    }
}

adminSttings();

