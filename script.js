const urlCases = "https://sp-labs.vercel.app/api/cases";
const urlContact = "https://sp-labs.vercel.app/api/contact";
const urlChat = "https://sp-labs.vercel.app/api/chat";

// Get HTML elements by ID:

const body = document.getElementById("body");
const solutionContainer = document.getElementById("solutions-container");
const formContainer = document.getElementById("form");
const thanksContainer = document.getElementById("thanks-section");
const exitButton = document.getElementById("exit-button");
const exitButtonText = document.getElementById("thx-message-box");
const chatBotWindow = document.getElementById("chatWindow");
const openChatButton = document.getElementById("chat-bot-icon-closed");
const closeChatButton = document.getElementById("chat-bot-icon-open");
const expandButton = document.getElementById("larger-button");
const recallButton = document.getElementById("small-button");
const buttonChatBot = document.getElementById("button-submit");
const chatArea = document.getElementById("chat-area");
const chatBotAdvice = document.querySelector(".chat-content");

// Functions:

let datePosted = false;

// API Cases:

function getCases() {
    axios.get(urlCases)
    .then(response => {
        const apiResponse = response.data.cases

        let buildHtml = "";

        apiResponse.forEach(element => {
            buildHtml += ` 
            <div class="solution-section-options-container">

                <p class="solution-section-options-tittle">${element.title}</p>

                <p class="solution-section-options-text">${element.description}</p>

                <a class="solution-section-options-button-container" href="${element.link}">Saiba mais</a>
            </div>
            `
        });

        solutionContainer.innerHTML = buildHtml;
    })
    .catch(error => console.log(error))
}


// API Contact:

function addNewUser(name, email, option, text) {
    axios.post(urlContact, {
        name: name,
        email: email,
        option: option,
        text: text
    })
    .then(response => {

        thanksContainer.classList.remove("disable");
        body.classList.add("scroll-block");

        let apiResponse = JSON.stringify(response.data);
        apiResponse = apiResponse.replaceAll('"', '');
        
        exitButtonText.textContent = apiResponse;

    })
    .catch(error => console.log(error));
}

// Checking if Chatbot is empty

let chatIsEmpty = true;

// Function to show Chatbot historic: 

function showHistoric(message, response) {

    // Trying to see if the date was already posted
    if (!datePosted) {
        postDate();
        datePosted = true;
    }

    // My messages
    let inputMessage = document.createElement("div")
    inputMessage.className = "input-message"

    let myMessage = document.createElement("p")
    myMessage.className = "my-message"
    myMessage.innerHTML = message

    inputMessage.appendChild(myMessage)
    chatArea.appendChild(inputMessage)

    // Chatbot responses
    let outputMessage = document.createElement("div")
    outputMessage.className = "output-message"

    let outputImage = document.createElement("img")
    outputImage.className = "output-image"
    outputImage.src = "./assets/chatbot_img/chat-avatar.png"

    let chatMessage = document.createElement("p")
    chatMessage.className = "chat-message"
    chatMessage.innerHTML = response

    outputMessage.appendChild(outputImage)
    outputMessage.appendChild(chatMessage)
    chatArea.appendChild(outputMessage)

    // Moving chat area
    scrollToBottom();
}

// API Chat:

function postChat(userMessage) {
    axios.post(urlChat, {
        question: userMessage
    })
    .then(response => {
        let apiChatResponse = response.data

        showHistoric(userMessage, apiChatResponse)
    })
    .catch(error => {
        console.log(error)
    })
    
}

// Code execution: 

getCases();

formContainer.addEventListener("submit", event => {
    event.preventDefault();

    const nameValue = document.getElementById("input-name").value;
    const emailValue = document.getElementById("input-email").value;
    const optionValue = document.getElementById("segmento").value;
    const textValue = document.getElementById("input-text").value;

    addNewUser(nameValue, emailValue, optionValue, textValue);
});

exitButton.addEventListener("click", () => {
    thanksContainer.classList.add("disable");
    body.classList.remove("scroll-block");

    document.getElementById("input-name").value = '';
    document.getElementById("input-email").value = '';
    document.getElementById("segmento").value = 'Seu segmento';
    document.getElementById("input-text").value = '';
    document.getElementById("checkbox-input").checked = false;

})

openChatButton.addEventListener("click", () => {
    chatBotWindow.classList.remove("disable");
    openChatButton.classList.add("disable");
    closeChatButton.classList.remove("disable");
})

closeChatButton.addEventListener("click", () => {
    chatBotWindow.classList.add("disable");
    openChatButton.classList.remove("disable");
    closeChatButton.classList.add("disable");
})

expandButton.addEventListener("click", () => {
    chatBotWindow.classList.add("larger-window");
    recallButton.classList.remove("disable");
    expandButton.classList.add("disable");
})

recallButton.addEventListener("click", () => {
    chatBotWindow.classList.remove("larger-window");
    recallButton.classList.add("disable");
    expandButton.classList.remove("disable");
})

function postDate() {
    let now = new Date();

    let currentYear = now.getFullYear();
    let currentMonth = now.getMonth() + 1;
    let currentDay = now.getDate(); 
    let currentDate = "";

    if (currentMonth < 10) {
        currentDate = currentDay + "/" + "0" + currentMonth + "/" + currentYear; 
    } else {
        currentDate = currentDay + "/" + currentMonth + "/" + currentYear; 
    }
    

    let dateBox = document.createElement("div");
    dateBox.className = "date-container";

    let dateText = document.createElement("p");
    dateText.className = "date-content";
    dateText.innerHTML = currentDate;

    dateBox.appendChild(dateText);
    chatArea.appendChild(dateBox);
}

function scrollToBottom() {
    chatArea.scrollTop = chatArea.scrollHeight;
}


function sendMessage() {
    let message = document.getElementById("chatbot-text-input");

    if(!message.value) {
        message.style.border = "0.1rem solid red"
        return
    } else {
        message.style.border = "0.1rem solid var(--Cinza)"
    }
    
    postChat(message.value);

    message.classList.add("input-default");
    message.value = '';

    if (chatIsEmpty) {
        chatIsEmpty = false;
    }

    if(chatIsEmpty == false) {
        chatBotAdvice.classList.add("disable");
    }
}

function checkEnter(event) {
    if (event.keyCode === 13) {
        sendMessage();
    }
    
}