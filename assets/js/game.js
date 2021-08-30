const question = document.querySelector('#question');
const choices = Array.from(document.querySelectorAll('.choice-text'));
const progressText = document.querySelector('#progressText');
const scoreText = document.querySelector('#score');
const progressBarFull = document.querySelector('#progressBarFull');

let currentQuestion = {};
let acceptingAnswers = true;
let score = 100;
let timeLeft = 100;
let questionCounter = 0;
let availableQuestions = [];

let questions = [
    {
        question: "What does HTML stand for?",
        choice1: 'Hyper Trainer Marking Language',
        choice2: 'Hyper Text Markup Language',
        choice3: 'Hyper Text Marketing Language',
        choice4: 'Hyper Text Markup Leveler',
        answer: 2,
    },
    {
        question: "What symbol is used to call a class in CSS?",
        choice1: '.',
        choice2: ':',
        choice3: '#',
        choice4: 'None of the above',
        answer: 1,
    },
    {
        question: "What symbol is used to call an ID in CSS?",
        choice1: '.',
        choice2: ':',
        choice3: '#',
        choice4: 'None of the above',
        answer: 3,
    },
    {
        question: "What tag can you use to include JavaScript in an HTML file?",
        choice1: '<script>',
        choice2: '<style>',
        choice3: '<page>',
        choice4: '<java>',
        answer: 1,
    }
]

const SCORE_PENALTY = 10;
const MAX_QUESTIONS = 4;

// Timer that counts down from 100
countdown = () => {
    timeInterval = setInterval(function() {
        if (timeLeft > 1) {
            scoreText.textContent = timeLeft + " seconds remaining.";
            timeLeft--;
        }
        else if (timeLeft === 1) {
            scoreText.textContent = timeLeft + " second remaining.";
            timeLeft--;
        }
        else {
            scoreText.textContent = "";
            clearInterval(timeInterval);
            return window.location.assign('end.html');
        }
    }, 1000);
}

startGame = () => {
    questionCounter = 0;
    score = 100;
    timeLeft = 100;
    availableQuestions = [...questions];
    countdown();
    getNewQuestion();
}

getNewQuestion = () => {
    if(availableQuestions.length === 0 || questionCounter > MAX_QUESTIONS) {
        localStorage.setItem('mostRecentScore', timeLeft);

        return window.location.assign('end.html');
    }

    questionCounter++;
    progressText.innerText = `Question ${questionCounter} of ${MAX_QUESTIONS}`
    progressBarFull.style.width = `${(questionCounter/MAX_QUESTIONS) * 100}%`

    const questionsIndex = Math.floor(Math.random() * availableQuestions.length);
    currentQuestion = availableQuestions[questionsIndex];
    question.innerText = currentQuestion.question;

    choices.forEach(choice => {
        const number = choice.dataset['number'];
        choice.innerText = currentQuestion['choice' + number];
    })

    availableQuestions.splice(questionsIndex, 1);

    acceptingAnswers = true;
}

choices.forEach(choice => {
    choice.addEventListener('click', e => {
        if(!acceptingAnswers) return;

        acceptingAnswers = false;
        const selectedChoice = e.target;
        const selectedAnswer = selectedChoice.dataset['number'];

        let classToApply = selectedAnswer == currentQuestion.answer ? 'correct' : 'incorrect';

        if(classToApply === 'incorrect') {
            decrementScore(SCORE_PENALTY);
        }

        selectedChoice.parentElement.classList.add(classToApply);

        setTimeout(() => {
            selectedChoice.parentElement.classList.remove(classToApply);
            getNewQuestion();
        }, 1000);
    })
})

decrementScore = num => {
    score = score - num;
    timeLeft = timeLeft - num;
}

startGame();