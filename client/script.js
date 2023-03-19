import bot from './assets/bot.svg';
import user from './assets/user.svg';
import { v4 as uuidv4 } from 'uuid';

const form = document.querySelector('form');
const chatContainer = document.querySelector('#chat_container');

let loadInterval;

function loader(elem) {
    elem.textContent = '';
    loadInterval = setInterval(() => {
        elem.textContent += '.';
        if (elem.textContent === '....') {
            elem.textContent = '';
        }
    }, 300);
}

function textDisplaying(element, text) {
    let i = 0;

    let interval = setInterval(() => {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
        } else {
            clearInterval(interval);
        }
    }, 20);
}

function uniqueId(){
    const UID = uuidv4();
    return UID;
}

function chatDisplay (isAi, value, uniqueId){
    return(
        `
            <div class = "wrapper ${isAi && 'ai'}">
                <div class = "chat"> 
                    <div class = "profile">
                        <img
                            src="${isAi ? bot : user}"
                            alt="${isAi ? 'bot' : 'user'}"
                        />
                    </div>
                    <div class="message" id="${uniqueId}">${value}</div>
                </div>
            </div>
        `
    )
}

const handleSumbit = async (e) => {
    e.preventDefault();

    const data = new FormData(form);
    
    // users chat
    chatContainer.innerHTML += chatDisplay(false, data.get('prompt'));
    form.reset();

    // bots chat
    const UId = uniqueId(); 
    chatContainer.innerHTML += chatDisplay(true, " ", UId);

    chatContainer.scrollTop = chatContainer.scrollHeight;

    const msgDiv = document.getElementById(UId);

    loader(msgDiv);

    // fetch data from server

    const response = await fetch('http://localhost:5000', {
        method : 'POST',
        headers : {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval);
    msgDiv.innerHTML = '';

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim();

        textDisplaying(msgDiv, parsedData);
    } else {
        const error = await response.text();
        msgDiv.innerHTML = "Something went Wrong!!";
        alert(error);
    }
}

form.addEventListener('submit', handleSumbit);
form.addEventListener('keyup', (e)=>{
    if (e.keyCode === 13) {
        handleSumbit(e);
    }
});
