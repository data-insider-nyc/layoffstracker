
function calcuateAvgScore(answer_key, student_answers) {
    
    let totalScore = 0;
    let studentCount = 0;
    const totalQuestions = answer_key.length;

    for (const student in student_answers ){
        const answers = student_answers[student];
        let correct = 0;

        for ( let i = 0 ; i < totalQuestions; i++ ) {
            if (answers[i] === answer_key[i])
                correct++;
        }

        const percetage = (correct / totalQuestions);
        totalScore += percetage;
        studentCount++;
    }

    return (totalScore / studentCount)

}

const answer_key = ["A", "B", "C", "D", "A", "B", "C", "D"];
const student_answers = {
  Alice: ["A", "B", "C", "C", "A", "B", "C", "D"],
  Bob: ["B", "B", "C", "C", "A", "B", "C", "D"],
  Charlie: ["C", "C", "C", "C", "C", "C", "C", "C"],
  Dave: ["A", "B", "C", "C", "B", "B", "C", "D"],
  Eve: ["A", "B", "C", "D", "D", "C", "B", "A"],
};

// const avgScore = calcuateAvgScore(answer_key, student_answers);
// console.log("Avg class score: ", avgScore)



function calcuateMediancore(answer_key, student_answers) {
  let totalScore = 0;
  let studentCount = 0;
  const totalQuestions = answer_key.length;

  const scores = []

  for (const student in student_answers) {
    const answers = student_answers[student];
    let correct = 0;

    for (let i = 0; i < totalQuestions; i++) {
      if (answers[i] === answer_key[i]) correct++;
    }

    const percetage = correct / totalQuestions;
    totalScore += percetage;
    studentCount++;

    scores.push(percetage)
    
  }
  // checked the scores
  console.log(scores)

  scores.sort((a, b)=>a-b)
  console.log(scores);

  const n = scores.length;

  if (n%2 === 1) {
    return scores[Math.floor(n/2)]
  } else {
    return (scores[[n / 2 - 1]] + scores[[n / 2]]) / 2;
  }

}

// const avgScore = calcuateMediancore(answer_key, student_answers);
// console.log("Avg median score: ", avgScore);

function calculateMostFrequentScore(answerKey, studentAnswers) {
  const totalQuestions = answerKey.length;
  const scoreFreq = new Map();

  for (const student in studentAnswers) {
    const answers = studentAnswers[student];
    let correct = 0;

    for (let i = 0; i < totalQuestions; i++) {
      if (answers[i] === answerKey[i]) {
        correct++;
      }
    }

    // Use number instead of string for score
    const percentage = parseFloat(
      ((correct / totalQuestions)).toFixed(2)
    );

    scoreFreq.set(percentage, (scoreFreq.get(percentage) || 0) + 1);
  }

  // Find the mode
  let modeScore = null;
  let maxFreq = 0;

  for (const [score, freq] of scoreFreq.entries()) {
    if (freq > maxFreq) {
      maxFreq = freq;
      modeScore = score;
    }
  }

  console.log(modeScore);
}
// console.log("Avg median score: ", avgScore);

calculateMostFrequentScore(answer_key, student_answers)