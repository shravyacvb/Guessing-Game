
"use strict";

const guessForm = document.getElementById('guess-form');
const usernameInput = document.getElementById('username');

/*****************************************************************************************************
Guessing - Used to handle the disable/enable action of button and to show errors for invalid guesses 
******************************************************************************************************/

if(guessForm){
    const guessWordInput = guessForm.elements['guess-word'];
    const wordsList = document.getElementById('words');
    const submitFormButton = document.getElementById('guess-btn');
    
    submitFormButton.disabled = true;

    guessWordInput.addEventListener('input',() => {
        submitFormButton.disabled = !guessWordInput.value;
    });

    guessForm.addEventListener('submit', (event) => {

        const errorText = document.getElementById('error');
        
        const remainingWords = wordsList.dataset.remainingWords.split(',');
        if (remainingWords.includes(guessWordInput.value.toLowerCase())) {
            return;
        }

        const allWords = wordsList.dataset.allWords.split(',');

        if(allWords.includes(guessWordInput.value.toLowerCase())){
            event.preventDefault();
            errorText.textContent = "This word was previously guessed";
            return;
        } 

        event.preventDefault();
        errorText.textContent = "This word doesn't exist in the list";
    });
}

/****************************************************************
Login - Used to handle the disable/enable action of button
****************************************************************/
        
if(usernameInput){
    const loginBtn = document.getElementById('login');
    loginBtn.disabled = true;

    usernameInput.addEventListener('input',() => {
        loginBtn.disabled = !usernameInput.value;
    });
}
    



