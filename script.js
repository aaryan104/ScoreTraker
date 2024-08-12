let ballCount = 0;
let currentOverScore = 0;
let currentScore = 0;
let currentOver = 1;
let totalScore = 0;
let wickets = 0;
let overScores = [];
let currentTeam = 1;
let teamScores = [[], []];
let overCount, wicketCount, target;

function addBall(type) {
  if (wickets < wicketCount && ballCount < 6) {
    if (overCount != null && wicketCount != null) {
      const ballsContainer = document.getElementById("balls-container");
      const ball = document.createElement("div");
      ball.classList.add("ball");
      ball.innerText = type === "dot" ? "0" : type;

      if (type === "W") {
        ball.style.backgroundColor = "red";
        ball.style.border = "2px solid black";
        ball.style.color = "white";
      } else if (type == "6") {
        ball.style.backgroundColor = "#06e258";
        ball.style.color = "white";
      } else if (type == "4") {
        ball.style.backgroundColor = "yellow";
      }

      ballsContainer.appendChild(ball);
      ballCount++;

      if (type !== "dot") {
        if (type !== "W") {
          const runs = parseInt(type);
          currentOverScore += runs;
          currentScore += runs;
        } else {
          wickets++;
          if (wickets === wicketCount) {
            endOver();
            return;
          }
        }
      }

      if (ballCount === 6) {
        endOver();
      }
      updateTeamScore();
      displayCurrentScore();
    } else {
      alert("Please Select Over First!");
    }
  }
}

function addExtraBall(type) {
  if (wickets < wicketCount) {
    if (overCount != null) {
      const ballsContainer = document.getElementById("balls-container");
      const ball = document.createElement("div");
      ball.classList.add("ball");
      if (type === "wide" || type === "no") {
        ball.innerText = type === "wide" ? "Wi1" : "N1";
        currentOverScore += 1;
        currentScore += 1;
      }
      ballsContainer.appendChild(ball);

      updateTeamScore();
      displayCurrentScore();
    } else {
      alert("Please Select Over First!")
    }
  }
}

function displayCurrentScore() {
  const currentScoreElement = document.getElementById("current-score");
  let scoreText = `Current Score: ${currentScore} Runs and ${wickets} wickets`;

  if (currentTeam === 2) {
    const team1Score = teamScores[0].reduce((total, score) => total + score, 0);
    const runsRemaining = team1Score + 1 - currentScore;
    const ballsRemaining = (overCount * 6) - ((currentOver - 1) * 6 + ballCount);
    scoreText += ` | Team 2 needs ${runsRemaining} runs from ${ballsRemaining} balls to win`;
  }

  currentScoreElement.innerText = scoreText;
}

function updateTeamScore() {
  const team1Score = teamScores[0].reduce((total, score) => total + score, 0);
  const team2Score = teamScores[1].reduce((total, score) => total + score, 0);

  if (currentTeam === 2 && team2Score > team1Score) {
    declareWinner(2, wicketCount - wickets, "wickets");
  }
}

function setOw() {
  overCount = parseInt(document.getElementById("overCount").value);
  wicketCount = parseInt(document.getElementById("wicketCount").value);
  alert("Total Overs : " + overCount + "\n" 
    +   "Total Wickets : " + wicketCount);
  return false;
}

function endOver() {
  overScores.push(currentOverScore);
  teamScores[currentTeam - 1].push(currentOverScore);
  totalScore += currentOverScore;

  updateLocalStorage();

  const cumulativeScoreDisplay = document.getElementById("cumulative-score");
  const overScoreElement = document.createElement("div");
  overScoreElement.innerText = `Team ${currentTeam}, Over ${currentOver}: ${currentOverScore} runs`;
  cumulativeScoreDisplay.appendChild(overScoreElement);

  currentOver++;
  ballCount = 0;
  currentOverScore = 0;

  const scoreDisplay = document.getElementById("score-display");
  scoreDisplay.innerText = `Team ${currentTeam} Total Score: ${totalScore} runs, Wickets: ${wickets}`;

  if (currentOver > overCount || wickets === wicketCount) {
    endInnings();
  } else {
    disableButtons();
    showNewOverButton();
  }
  displayCurrentScore();
}

function endInnings() {
  const team1Score = teamScores[0].reduce((total, score) => total + score, 0);
  const team2Score = teamScores[1].reduce((total, score) => total + score, 0);

  if (currentTeam === 1) {
    currentTeam = 2;
    target = team1Score + 1;
    resetForNextTeam();
  } else {
    if (team1Score > team2Score) {
      declareWinner(1, team1Score - team2Score, "runs");
    } else {
      declareWinner(2, wicketCount - wickets, "wickets");
    }
  }
}

function resetForNextTeam() {
  overScores = [];
  totalScore = 0;
  wickets = 0;
  currentOver = 1;
  ballCount = 0;
  currentOverScore = 0;
  currentScore = 0;
  const ballsContainer = document.getElementById("balls-container");
  ballsContainer.innerHTML = "";

  const cumulativeScoreDisplay = document.getElementById("cumulative-score");
  cumulativeScoreDisplay.innerHTML = "";

  const scoreDisplay = document.getElementById("score-display");
  scoreDisplay.innerText = `Team ${currentTeam} starts their innings`;

  const buttons = document.querySelectorAll(".buttons-container button");
  buttons.forEach((button) => {
    button.disabled = false;
  });
}

function declareWinner(winningTeam, margin, unit) {
  const scoreDisplay = document.getElementById("score-display");
  let winnerText;
  if (winningTeam === 1) {
    winnerText = `Team 1 wins by ${margin} ${unit}!`;
  } else {
    winnerText = `Team 2 wins by ${margin} ${unit}!`;
  }
  scoreDisplay.innerText = `Match complete! ${winnerText}`;
  disableButtons();

  setTimeout(() => {
    localStorage.clear();
    console.log("Local storage cleared after 5 seconds.");
  }, 5000);
}

function disableButtons() {
  const buttons = document.querySelectorAll(".buttons-container button");
  buttons.forEach((button) => {
    button.disabled = true;
  });
}

function showNewOverButton() {
  const newOverButton = document.createElement("button");
  newOverButton.innerText = "New Over";
  newOverButton.onclick = resetOver;
  document.querySelector(".buttons-container").appendChild(newOverButton);
}

function resetOver() {
  const ballsContainer = document.getElementById("balls-container");
  ballsContainer.innerHTML = "";
  const buttons = document.querySelectorAll(".buttons-container button");
  buttons.forEach((button) => {
    button.disabled = false;
  });
  document.querySelector(".buttons-container").removeChild(
    document.querySelector(".buttons-container button:last-child")
  );
  const scoreDisplay = document.getElementById("score-display");
  scoreDisplay.innerText = "";
}

function updateLocalStorage() {
  localStorage.setItem("teamScores", JSON.stringify(teamScores));
}

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("button-1").onclick = () =>
    addBallAndCheckWinner("1");
  document.getElementById("button-2").onclick = () =>
    addBallAndCheckWinner("2");
  document.getElementById("button-3").onclick = () =>
    addBallAndCheckWinner("3");
  document.getElementById("button-4").onclick = () =>
    addBallAndCheckWinner("4");
  document.getElementById("button-5").onclick = () =>
    addBallAndCheckWinner("5");
  document.getElementById("button-6").onclick = () =>
    addBallAndCheckWinner("6");
  document.getElementById("button-dot").onclick = () =>
    addBallAndCheckWinner("dot");
  document.getElementById("button-wicket").onclick = () =>
    addBallAndCheckWinner("W");
  document.getElementById("button-wide").onclick = () =>
    addExtraBallAndCheckWinner("wide");
  document.getElementById("button-no").onclick = () =>
    addExtraBallAndCheckWinner("no");
});


function addBallAndCheckWinner(type) {
  addBall(type);
  checkWinner();
}

function addExtraBallAndCheckWinner(type) {
  addExtraBall(type);
  checkWinner();
}

function checkWinner() {
  const team1Score = teamScores[0].reduce((total, score) => total + score, 0);
  const team2Score = teamScores[1].reduce((total, score) => total + score, 0);
  if (currentTeam === 2 && currentScore > team1Score) {
    const remainingWickets = wicketCount - wickets;
    declareWinner(2, remainingWickets, "wickets");
  } else if (wickets === wicketCount) {
    if (currentTeam === 1) {
      endInnings();
    } else {
      declareWinner(1, team1Score - currentScore, "runs");
    }
  }
}

function redirect() {
  if (confirm("Are You Sure! 'All Runs Are Clear Parmanetly?'")) {
    window.location = "index.html";
  }
}
