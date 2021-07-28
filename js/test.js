const userCollection = [];

let constent = document.querySelector('#section-about');
let btnHide = document.querySelector('#btn-form')

let forms = document.querySelector('#form-ui-ui')
let btnForm = document.querySelector('.show-form')

let Allform = document.querySelector('.forms')


//show-form


const getUsersData = async () => {

    let response = await fetch('http://localhost:5000/api/v1/users');

    let users = await response.json();

    userCollection.push(users);

    let listItems = users.map(city => {

        return `
        <div class="content content-box" id='contents'>

        <div class="image">
            <img src="images/man2.jpg" alt="" />
        </div>

        <div class="desc">
            <p>Hello! I’m Daniel Curry. Web designer from USA, California, 
                San Francisco. I have rich experience in web site design and building, 
                also I am good at wordpress. I love to talk with you about our unique.</p>
            <div class="info-list">
                <ul id='desk'>
                    <li><strong>Skills:</strong> <span id='skills'>${city.skills}</span></li>
                    <li><strong>Stack:</strong> <span id='stack'>${city.stack}</span></li>
                    <li><strong>Email:</strong> <span id='email'>${city.email}</span></li>
                    <li><strong>Username:</strong> <span id='username'>${city.username}</span></li>
                    <li><strong>Description:</strong> <span id='description'>${city.description}</span></li>
                </ul>
            </div>
            <div class="bts">
                <button class="btns hover-animated" onclick="onDeleteUser('${city._id}')">
                    <span class="circle" id="value"></span>
                    <span class="lnk">Delete user</span>
                </button>
            </div>
        </div>

    </div>
    
        `
    })

    constent.innerHTML = listItems;

}

getUsersData()

function onDeleteUser(id) {
    constent.addEventListener('click', (e) => {
        if (userCollection[0].find(user => user._id === id && e.path[4].id === 'contents')) {
            e.path[4].style.display = 'none';

            axios({
                method: 'delete',
                url: `http://localhost:5000/api/v1/users/${id}`,
                data: {
                    id: id
                }
            })
                .then(data => {
                    console.log(data, 'deletingSS')
                })
                .catch(err => {
                    console.log(err, 'err delete user')
                })
        }
    })
}

function formUser() {

    forms.addEventListener('submit', (e) => {
        e.preventDefault()
        console.log('psp')
    })
      btnHide.addEventListener('click', (e) => {
            // e.preventDefault()
            hideForm()
            //style.visibility = "visible";
        })
}
formUser()

function hideForm() {
    forms.style.display = "none";
    btnForm.innerHTML = `<button onclick='showForm()'>Вернуть форму</button>`
}

function showForm() {
    console.log('jimmmms')
    forms.style.display = "block";
    btnForm.innerHTML = ''
}




