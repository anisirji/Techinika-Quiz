// console.log("this");
const start_btn = document.querySelector(".start_btn button");
const info_box = document.querySelector(".info_box");
const exit_btn = info_box.querySelector(".buttons .quit");
const continue_btn = info_box.querySelector(".buttons .restart");
const quiz_box = document.querySelector(".quiz_box");

const option_list = document.querySelector(".option_list");
// const result_box=document.querySelector('.result_box');

const timeCount = quiz_box.querySelector(".timer .timer_sec");
const timeLine = quiz_box.querySelector("header .time_line");
const timeOff = quiz_box.querySelector("header .time_left_txt");

//Details of participants
const pName = document.getElementById("pName");
const pUName = document.getElementById("pUName");
const pEnroll = document.getElementById("pEnroll");

//warning message input field
const warning = document.getElementById("warning");

//To start the quiz
start_btn.onclick = function () {
  info_box.classList.add("activeInfo"); //show info box
};
//To Exit from Quiz
exit_btn.onclick = function () {
  info_box.classList.remove("activeInfo");
};

//To continue  Quiz

continue_btn.onclick = function () {
  //checking if user entered their details or not

  if (pName.value && pUName.value && pEnroll.value) {
    info_box.classList.remove("activeInfo"); //hide the info box

    quiz_box.classList.add("activeQuiz"); //show the Quiz box

    showQuestion(0);
    queCounter(1);
    startTimer(30);
    startTimerLine(0);
  } else {
    warning.classList.remove("hidden");
  }
};

let que_count = 0;
let que_numb = 1;

let counter;
let counterLine;

let timeValue = 30;
let widthValue = 0;
let userScore = 0;

let participantAns = [];
let userAns;

const next_btn = quiz_box.querySelector(".next_btn");
const result_box = document.querySelector(".result_box");
const restart_quiz = result_box.querySelector(".buttons .restart");
const quit_quiz = result_box.querySelector(".buttons .Quit");

next_btn.onclick = () => {
  participantAns.push(userAns);
  console.log(participantAns);
  if (que_count < questions.length - 1) {
    que_count++;
    que_numb++;
    showQuestion(que_count);
    queCounter(que_numb);
    clearInterval(counterLine);
    clearInterval(counter);
    startTimer(timeValue);
    startTimerLine(widthValue);
    next_btn.style.display = "none";
    timeOff.textContent = "Time left";

    if (que_count === questions.length - 1) {
      next_btn.innerHTML = "Submit";
    }
  } else {
    const date = new Date();
    const time = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}:${date.getMilliseconds()}`;
    const data = {
      name: pName.value,
      university: pUName.value,
      phoneNo: pEnroll.value, //Phone number hai ye
      pAns: participantAns,
      date: `${date.getDate()}/${date.getMonth()}/${date.getFullYear()}`,
      time: time,
    };
    //posting data to server
    postdata(data);

    console.log(data);
  }
};

async function postdata(data) {
  console.log("in post request option---\n");
  const url = "/participantData";
  const params = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };

  fetch(url, params)
    .then((res) => res.json())
    .then((score) => {
      console.log("we have score now ", score);
      end(score.points);
    })
    .catch((error) => {
      console.error("Error", error);
    });
}

function end(score) {
  clearInterval(counterLine);
  clearInterval(counter);
  showResultBox(score);
}

//getting questions and options from an array.
function showQuestion(index) {
  const que_text = document.querySelector(".que_text");

  let que_tag =
    "<span>" +
    questions[index].numb +
    "." +
    questions[index].question +
    "</span>";
  let option_tag =
    '<div class="option">' +
    questions[index].options[0] +
    "<span></span></div>" +
    '<div class="option">' +
    questions[index].options[1] +
    "<span></span></div>" +
    '<div class="option">' +
    questions[index].options[2] +
    "<span></span></div>" +
    '<div class="option">' +
    questions[index].options[3] +
    "<span></span></div>";

  console.log(option_tag.split(","));
  const parser = new DOMParser();

  console.log(parser.parseFromString(option_tag, "text/html"));

  que_text.innerHTML = que_tag;
  option_list.innerHTML = option_tag;
  const option = option_list.querySelectorAll(".option");
  let selected;
  for (let i = 0; i < option.length; i++) {
    option[i].addEventListener("click", () => {
      selected = i;
      optionSelected();
    });
  }
  function optionSelected() {
    if (selected == 0) {
      option[selected].style.cssText = "background-color:lightgreen";
      option[1].style.cssText = "background-color:white";
      option[2].style.cssText = "background-color:white";
      option[3].style.cssText = "background-color:white";
    } else if (selected == 1) {
      option[selected].style.cssText = "background-color:lightgreen";
      option[0].style.cssText = "background-color:white";
      option[2].style.cssText = "background-color:white";
      option[3].style.cssText = "background-color:white";
    } else if (selected == 2) {
      option[selected].style.cssText = "background-color:lightgreen";
      option[1].style.cssText = "background-color:white";
      option[0].style.cssText = "background-color:white";
      option[3].style.cssText = "background-color:white";
    } else if (selected == 3) {
      option[selected].style.cssText = "background-color:lightgreen";
      option[1].style.cssText = "background-color:white";
      option[2].style.cssText = "background-color:white";
      option[0].style.cssText = "background-color:white";
    }

    const answer = option[selected];
    console.log(option[selected]);
    userAns = answer.textContent;
    next_btn.style.display = "block";
  }
}

function startTimer(time) {
  counter = setInterval(timer, 1000);
  function timer(params) {
    timeCount.textContent = time;
    time--;

    if (time < 9) {
      let addZero = timeCount.textContent;
      timeCount.textContent = "0" + addZero;
    }
    if (time < 0) {
      clearInterval(counter);
      timeCount.textContent = "00";

      timeOff.textContent = "Time off";
      let correctAns = questions[que_count].answer;
      let allOptions = option_list.children.length;
      for (let i = 0; i < allOptions; i++) {
        option_list.children[i].classList.add("disabled");
      }
      next_btn.style.display = "block";
    }
  }
}

function startTimerLine(time) {
  counterLine = setInterval(timer, 70);
  function timer() {
    time += 1;
    timeLine.style.width = time + "px";
    if (time > 449) {
      clearInterval(counterLine);
    }
  }
}

function queCounter(index) {
  const bottom_ques_counter = quiz_box.querySelector(".total_que");

  let totalQuesCountTag =
    "<span><p>" +
    index +
    "</p>of<p>" +
    questions.length +
    "<p>Questions</span>";

  bottom_ques_counter.innerHTML = totalQuesCountTag;
}

function showResultBox(score) {
  info_box.classList.remove("activeInfo"); //hide the info box
  quiz_box.classList.remove("activeQuiz");
  result_box.classList.add("activeResult");
  const scoreText = result_box.querySelector(".score_text");
  if (userScore < 12) {
    let scoreTag =
      "<span>You are not selected as you scored<p>" +
      score +
      "</p>out of <p>" +
      questions.length +
      "</p></span>";
    scoreText.innerHTML = scoreTag;
  } else if (userScore >= 12) {
    let scoreTag =
      " <span> Congratulations your final score is<p>" +
      score +
      "</p>out of <p>" +
      questions.length +
      "</p></span>";
    scoreText.innerHTML = scoreTag;
  } else {
    // let scoreTag = ' <span>and sorry you got<p>' + userScore + '</p>out of <p>' + questions.length + '</p></span>';
    // scoreText.innerHTML = scoreTag;
  }
}
