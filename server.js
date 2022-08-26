const express = require('express')
const { writeFile } = require('fs')
const ansArray = require('./answers')
const app = express()

app.use(express.static('public'))
app.use(express.json({limit:"1mb"}))

app.post('/participantData',(req,res)=>{
    console.log(req.body);
    const point = calc(req.body.pAns)
    createResult(point,req.body)
    res.json({points:point})
})

app.listen(5000,()=>{
    console.log("Server Running on http://127.0.0.1:5000");
})


//Function to calculate points
function calc(userAns){
    let points=0
    for(let i = 0; i < userAns.length;i++){
        if(userAns[i] == ansArray[i])
        points++
    }
    return points
}

async function createResult(points,data){
    const details = `
    Score of Round 1 Tecinika\n\n
    Name: ${data.name}\n
    University: ${data.university}\n
    Enrollment: ${data.enrollment}\n\n

    score: ${points}/${data.pAns.length}\n

    Answers Selected: ${data.pAns}
    `
    writeFile(`./results_quiz/${data.name}-${data.enrollment}.txt`,details,()=>{
        console.log("File created");
    })
}