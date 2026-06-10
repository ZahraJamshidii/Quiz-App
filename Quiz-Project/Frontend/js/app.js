const API_URL = "http://127.0.0.1:8000/api/questions/?amount=5";

let questions = [];
let currentIndex = 0;
let score = 0;
let timer;
let timeLeft = 20;
let results = [];

const startScreen = document.getElementById("start-screen");
const quizScreen = document.getElementById("quiz-screen");
const resultScreen = document.getElementById("result-screen");

document
.getElementById("start-btn")
.addEventListener("click", startQuiz);

async function startQuiz(){

    const difficulty =
    document.getElementById("difficulty").value;

    const response = await fetch(
        `${API_URL}&difficulty=${difficulty}`
    );

    const data = await response.json();

    questions = data.results;

    currentIndex = 0;
    score = 0;
    results = [];

    startScreen.classList.add("hidden");
    startScreen.classList.remove("active");

    quizScreen.classList.remove("hidden");

    showQuestion();
}

function showQuestion(){

    clearInterval(timer);

    timeLeft = 20;

    startTimer();

    const q = questions[currentIndex];

    document.getElementById("question")
    .textContent = q.question;

    document.getElementById("progress")
    .textContent =
    `Question ${currentIndex + 1} / ${questions.length}`;

    document.getElementById("score")
    .textContent =
    `Score: ${score}`;

    const answers = [
        ...q.incorrect_answers,
        q.correct_answer
    ].sort(() => Math.random() - 0.5);

    const container =
    document.getElementById("answers");

    container.innerHTML = "";

    answers.forEach(answer => {

        const btn =
        document.createElement("button");

        btn.className = "answer-btn";
        btn.textContent = answer;

        btn.onclick = () =>
        selectAnswer(answer);

        container.appendChild(btn);

    });

    saveState();
}

function startTimer(){

    const timerText =
    document.getElementById("timer-text");

    const timerBar =
    document.getElementById("timer-bar");

    timer = setInterval(() => {

        timeLeft--;

        timerText.textContent =
        `${timeLeft}s`;

        timerBar.style.width =
        `${(timeLeft/20)*100}%`;

        if(timeLeft <= 0){

            clearInterval(timer);

            selectAnswer("No Answer");

        }

    },1000);

}

function selectAnswer(answer){

    clearInterval(timer);

    const q = questions[currentIndex];

    const isCorrect =
    answer === q.correct_answer;

    if(isCorrect){
        score++;
    }

    results.push({
        question:q.question,
        correct:q.correct_answer,
        user:answer,
        result:isCorrect
    });

    currentIndex++;

    if(currentIndex >= questions.length){

        showResults();

        return;
    }

    showQuestion();
}

function showResults(){

    quizScreen.classList.add("hidden");
    resultScreen.classList.remove("hidden");

    document.getElementById("final-score")
    .textContent =
    `Final Score: ${score}/${questions.length}`;

    const tbody =
    document.getElementById("result-body");

    tbody.innerHTML = "";

    results.forEach(item=>{

        tbody.innerHTML += `
        <tr>
            <td>${item.question}</td>
            <td>${item.correct}</td>
            <td>${item.user}</td>
            <td>${item.result ? "✅" : "❌"}</td>
        </tr>
        `;
    });

    localStorage.removeItem("quizState");
}

function saveState(){

    localStorage.setItem(
        "quizState",
        JSON.stringify({
            questions,
            currentIndex,
            score,
            results
        })
    );

}

function restartQuiz(){

    localStorage.clear();

    location.reload();

}