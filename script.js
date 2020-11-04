let questions = []
let fakeAnswers = []
let realAnswers = []

questions.push(`What does a[3] return from the following Array: a['apple','dog','3','water','windmill]`)
fakeAnswers.push([`apple`, `dog`, `3`, `windmill`])
realAnswers.push(`water`)

questions.push(`Which of these symbols is the Modulo Operator?`)
fakeAnswers.push([`+`, `-`, `*`, `/`])
realAnswers.push(`%`)

questions.push(`How many times will the following For Loop run: for(let i = 0; i < 5; i += 2)`)
fakeAnswers.push([`Five times`, `Four times`, `Six times`, `Two times`])
realAnswers.push(`Three times`)

questions.push(`How do you access the value from "name" in the following object: person = {name: "John", species: "Deer"}`)
fakeAnswers.push([`person[0]`, `person[1]`, `person.getValue("name")`, `person.name()`])
realAnswers.push(`person.name`)

questions.push(`The Debugger is an excellent tool for ___`)
fakeAnswers.push([`Fixing errors for you`, `Optimizing the code for you`, `Removing the word "bug" from your code`, `Doing nothing. You shouldn't use it`])
realAnswers.push(`Exposing bugs in your code`)

//An array which holds the indexes of questions that haven't been asked
//Used for randomly selecting the next question without repeating any of the previous ones
let randQuestions = []

let questionNum = 0;

//A number tells which answer button is the correct answer
//Created since the order of the answers is randomized
let correctAnswer = 0

//Tells us how much time is left
let quizTime = 0;

//Holds an interval functions that runs every 1000 milliseconds
let quizInterval = undefined;

//The following variables hold HTML elements that are modified throughout the quiz

let viewScores = document.getElementById("viewScores")

let clock = document.getElementById('clock')

let heading = document.getElementById(`heading`)

let desc = document.getElementById(`desc`)

let answerButtons = document.getElementById(`answerButtons`)

let form = document.getElementById(`enterName`)

let input = document.getElementById(`input`)

let answers = []
answers.push(document.getElementById(`answer1`))
answers.push(document.getElementById(`answer2`))
answers.push(document.getElementById(`answer3`))
answers.push(document.getElementById(`answer4`))

let start = document.getElementById(`start`)

let highScores = document.getElementById(`highScores`)

let goBack = document.getElementById(`goBack`)

let clear = document.getElementById(`clear`)

let hr = document.getElementById(`line`)
hr.style.display = `none`

let result = document.getElementById(`result`)
result.style.display = `none`

//When the result for an answer is shown, it should automatically turn invisible again after a few seconds
resultTimer = undefined;

//The highscores that are stored in local storage
//There isn't any highscores, then create a new array for scores
let scores = JSON.parse(localStorage.getItem(`High Scores`))
if (scores === null) {
  scores = []
}

const randInt = (val) => {
  return Math.floor(Math.random() * val)
}

const clearHighscores = () => {
  highScores.textContent = ``
  scores = []
  localStorage.setItem(`High Scores`, JSON.stringify(scores))
}

const showHighscroes = () => {
  heading.textContent = "High Scores"
  highScores.style.display = `block`
  highScores.textContent = ``
  goBack.style.display = "inline"
  clear.style.display = "inline"
  desc.style.display = `none`
  start.style.display = `none`
  form.style.display = `none`

  let len = scores.length
  for (let i = 0; i < len; i++) {
    let scoreItem = document.createElement(`LI`)
    if (i % 2 === 0) {
      scoreItem.classList.add(`listEven`)
    } else {
      scoreItem.classList.add(`listOdd`)
    }

    console.log(scoreItem)
    scoreItem.textContent = `${i}. ${scores[i].name} - ${scores[i].score}`

    highScores.appendChild(scoreItem)
  }

}

const submitHighscore = (initals) => {
  let index = 0
  let len = scores.length
  for (let i = 0; i < len; i++) {
    if (quizTime > scores[i].score) {
      i = len
    }
  }
  console.log(initals)
  scores.splice(index, 0, { name: initals, score: quizTime })
  localStorage.setItem(`High Scores`, JSON.stringify(scores))

  showHighscroes()
}

const stopQuiz = () => {
  clearInterval(quizInterval)
  clock.textContent = ``
  quizTime += -15 * randQuestions.length

  heading.innerHTML = `All done!`
  desc.style.display = `block`
  desc.innerHTML = `Your final score is ${quizTime}`

  answerButtons.style.display = `none`

  form.style.display = `block`
}

const checkAnswer = (answer) => {
  randQuestions.splice(questionNum, 1)
  console.log(randQuestions.length)
  answer = parseInt(answer)
  if (resultTimer !== undefined) {
    clearTimeout(resultTimer)
  }
  if (answer === correctAnswer) {
    result.textContent = "Correct!"
  } else {
    result.textContent = "Wrong!"
    quizTime -= 15
    clock.textContent = `Time: ${quizTime}`
  }
  hr.style.display = "block"
  result.style.display = "block"
  resultTimer = setTimeout(() => {
    hr.style.display = "none"
    result.style.display = "none"
    resultTimer = undefined
  }, 3000);

  if (randQuestions.length < 1) {
    stopQuiz()
  } else {
    nextQuestion()
  }

}

const nextQuestion = () => {
  let randNum = randInt(randQuestions.length)
  questionNum = randNum
  let randQuestion = randQuestions[randNum]

  heading.textContent = questions[randQuestion]

  //Fills the answer buttons with fake answers in a random order
  let randFakeAnswers = [0, 1, 2, 3]
  for (let i = 0; i < 4; i++) {
    randNum = randInt(randFakeAnswers.length)
    let index = randFakeAnswers[randNum]
    answers[i].textContent = `${(i + 1)}. ${fakeAnswers[randQuestion][index]}`
    randFakeAnswers.splice(randNum, 1)
  }

  //Replaces the contents of one of the answer buttons at random with the correct answer
  randNum = randInt(4)
  answers[randNum].textContent = `${(randNum + 1)}. ${realAnswers[randQuestion]}`
  correctAnswer = randNum

}

const startQuiz = () => {
  viewScores.style.display = "none"
  heading.style.display = "block"
  heading.textAlign = "left"

  desc.style.display = "none"

  answerButtons.style.display = "block"

  start.style.display = "none"

  let len = questions.length
  for (let i = 0; i < len; i++) {
    randQuestions.push(i)
  }

  quizTime = 75
  clock.textContent = `Time: ${quizTime}`
  quizInterval = setInterval(() => {
    quizTime--
    clock.textContent = `Time: ${quizTime}`
    if (quizTime < 1) {
      stopQuiz()
    }
  }, 1000)

  nextQuestion()

}

const initPage = () => {
  heading.style.display = "block"
  heading.textContent = "Coding Quiz"
  heading.style.textAlign = "center"

  desc.style.display = "block"
  desc.textContent = "Answer the folloing code related questions before the timer runs out. You'll be scored based off your remaining time. Keep in mind that getting the wrong answer will decrease the timer by 15 seconds."
  desc.style.textAlign = "center"

  answerButtons.style.display = "none"
  form.style.display = "none"
  start.style.display = "block"
  highScores.style.display = "none"
  goBack.style.display = "none"
  clear.style.display = "none"
  hr.style.display = "none"
  result.style.display = "none"
}

initPage()

document.addEventListener('click', event => {
  let btn = event.target
  if (btn.classList.contains('start')) {
    startQuiz()
  } else if (btn.classList.contains('answer')) {
    checkAnswer(btn.getAttribute("value"))
  } else if (btn.classList.contains('submit')) {
    event.preventDefault()
    submitHighscore(input.value)
    input.value = ``
  } else if (btn.classList.contains(`clear`)) {
    clearHighscores()
  } else if (btn.classList.contains(`viewScores`)) {
    showHighscroes()
  }
})
