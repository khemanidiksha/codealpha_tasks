document.addEventListener('DOMContentLoaded', () => {
    const flashcard = document.querySelector('.flashcard');
    const questionEl = document.querySelector('.question');
    const answerEl = document.querySelector('.answer');
    const showAnswerBtn = document.getElementById('showAnswerBtn');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const addCardBtn = document.getElementById('addCardBtn');
    const editCardBtn = document.getElementById('editCardBtn');
    const deleteCardBtn = document.getElementById('deleteCardBtn');

    let flashcards = [];
    let currentCardIndex = 0;
    let sessionToken = '';

    async function getSessionToken() {
        try {
            const response = await fetch('https://opentdb.com/api_token.php?command=request');
            const data = await response.json();
            if (data.response_code === 0) {
                sessionToken = data.token;
            }
        } catch (error) {
            console.error('Error getting session token:', error);
        }
    }

    async function fetchQuestions(count) {
        let url = `https://opentdb.com/api.php?amount=${count}&category=18`;
        if (sessionToken) {
            url += `&token=${sessionToken}`;
        }

        try {
            const response = await fetch(url);
            const data = await response.json();
            if (data.response_code === 0) {
                return data.results.map(item => ({
                    question: decodeHtmlEntities(item.question),
                    answer: decodeHtmlEntities(item.correct_answer)
                }));
            } else {
                console.error('API Error:', data.response_code);
                return [];
            }
        } catch (error) {
            console.error('Fetch Error:', error);
            return [];
        }
    }

    function decodeHtmlEntities(text) {
        const textArea = document.createElement('textarea');
        textArea.innerHTML = text;
        return textArea.value;
    }

    async function initializeCards(count) {
        flashcards = await fetchQuestions(count);
        showCard();
    }

    function showCard() {
        if (flashcards.length === 0) {
            questionEl.textContent = 'No cards to display.';
            answerEl.textContent = 'Click "Generate New Card" to start or try refreshing.';
            flashcard.classList.remove('flipped');
            return;
        }
        const card = flashcards[currentCardIndex];
        questionEl.textContent = card.question;
        answerEl.textContent = card.answer;
        flashcard.classList.remove('flipped');
    }

    function flipCard() {
        if (flashcards.length > 0) {
            flashcard.classList.toggle('flipped');
        }
    }

    function nextCard() {
        if (flashcards.length === 0) return;
        currentCardIndex = (currentCardIndex + 1) % flashcards.length;
        showCard();
    }

    function prevCard() {
        if (flashcards.length === 0) return;
        currentCardIndex = (currentCardIndex - 1 + flashcards.length) % flashcards.length;
        showCard();
    }

    showAnswerBtn.addEventListener('click', flipCard);
    nextBtn.addEventListener('click', nextCard);
    prevBtn.addEventListener('click', prevCard);

    addCardBtn.addEventListener('click', async () => {
        const newQuestions = await fetchQuestions(1);
        if (newQuestions.length > 0) {
            flashcards.push(newQuestions[0]);
            currentCardIndex = flashcards.length - 1;
            showCard();
        } else {
            alert("Could not fetch a new question. Please try again later.");
        }
    });

    editCardBtn.addEventListener('click', () => {
        if (flashcards.length === 0) {
            alert('There are no cards to edit.');
            return;
        }
        const card = flashcards[currentCardIndex];
        const newQuestion = prompt('Enter the new question:', card.question);
        const newAnswer = prompt('Enter the new answer:', card.answer);
        if (newQuestion && newAnswer) {
            flashcards[currentCardIndex] = { question: newQuestion, answer: newAnswer };
            showCard();
        }
    });

    deleteCardBtn.addEventListener('click', () => {
        if (flashcards.length === 0) {
            alert('No cards to delete.');
            return;
        }
        const confirmDelete = confirm('Are you sure you want to delete this card?');
        if (confirmDelete) {
            flashcards.splice(currentCardIndex, 1);
            if (currentCardIndex >= flashcards.length) {
                currentCardIndex = Math.max(0, flashcards.length - 1);
            }
            showCard();
        }
    });
    
    async function startApp() {
        await getSessionToken();
        await initializeCards(15);
    }

    startApp();
}); 