const express = require("express");
const { writeFileSync, appendFileSync } = require("fs");
const ansArray = require("./answers");
const app = express();

app.use(express.static("public"));
app.use(express.json({ limit: "1mb" }));

app.post("/participantData", (req, res) => {
  console.log(req.body);
  const point = calc(req.body.pAns);
  console.log(point, "scored");
  createResult(point, req.body);
  res.json({ points: point });
});

app.listen(5000, () => {
  console.log("Server Running on http://127.0.0.1:5000");
});

//Function to calculate points
function calc(userAns) {
  let points = 0;
  for (let i = 0; i < userAns.length; i++) {
    if (userAns[i] == ansArray[i]) points++;
  }
  return points;
}

async function createResult(points, data) {
  const passMark = 12;
  const rs = points >= passMark ? "PASS" : "FAIL";
  const details = `
    Score of Round 1 Tecinika\n\n

    RESULT : ${rs}

    Subbmission Date: ${data.date}
    Subbmission Time: ${data.time}
    Name: ${data.name}\n
    University: ${data.university}\n
    Phone Number: ${data.phoneNo}\n\n

    score: ${points}/${data.pAns.length}\n

    Answers Selected: ${data.pAns}
    `;

  writeFileSync(`./results_quiz/${data.name}-${data.phoneNo}.txt`, details);
  appendFileSync(
    "./results_quiz/FINAL-SHEET.txt",
    `${data.name}            ${data.phoneNo}        ${data.university}     ${points}      ${rs}\n\n`
  );
  console.log("file created");
}
