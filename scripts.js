let arrows = Array.from(document.getElementsByClassName('material-icons')); 
let workAmtElement = document.getElementById('work-amt');
let breakAmtElement = document.getElementById('break-amt');
let roundAmtElement = document.getElementById('round-amt');
let timeDisplayElement = document.getElementById('time');
let resetButtonElement = document.getElementById('butt-reset');
let startButtonElement = document.getElementById('butt-start');
let statusDisplayElement = document.getElementById('status');
let timeLeft;
let t;
let running = false; // Used to check if timer is running or not. Regardless of work or break
let working = true; // Used to track Work or Break sessions
let started = false;
let rounds;
let roundsMax;
let status = {
    initialize: "Set your parameters",
    work: "Working",
    relax: "Take a break",
    pause: "Paused",
    completed: "Pomodoro Complete!"
}


enableUpdate();
resetButtonElement.addEventListener("click", reset); 
startButtonElement.addEventListener("click", startStop);


function timerStart() {
    t = setInterval(decrement, 1000);
}

function decrement() {
    if(timeLeft > 0) {
        timeLeft--; 
    } else if (working && timeLeft === 0) { // working time is down to zero = break time or end
        rounds--;
        if (rounds === 0) {
            sessionComplete();
            return;
        }
        working = false;
        timeLeft = parseInt(breakAmtElement.innerHTML) * 60;
        statusDisplayElement.innerHTML = status.relax;
        statusDisplayElement.className = '';
        statusDisplayElement.classList.add("break");
    } else if (!working && timeLeft === 0) { // break time is down to zero = start next round
        working = true; 
        workIt();
        timeLeft = parseInt(workAmtElement.innerHTML) * 60;
    }
    
    timeDisplayElement.innerHTML = convertTime(timeLeft);
}


function startStop() {
    if (!started) { // Initial start clicked
        roundsMax = parseInt(roundAmtElement.innerHTML);
        rounds = parseInt(roundAmtElement.innerHTML);
        timeLeft = parseInt(workAmtElement.innerHTML) * 60;
        started = true; 
        workIt();
    }
    
    if (running) { // clicked stop aka Paused
        statusDisplayElement.innerHTML = status.pause;
        statusDisplayElement.className = '';
        statusDisplayElement.classList.add("pause");
        startButtonElement.innerHTML = "Resume";
        clearInterval(t);
    }
    
    if (!running) { // Clicked start
        workIt();
        startButtonElement.innerHTML = "Pause";
        disableUpdate();
        timerStart();
    }
    running = !running; 
}

function sessionComplete() {
    statusDisplayElement.innerHTML = status.completed;
    statusDisplayElement.className = '';
    statusDisplayElement.classList.add("complete");
    clearInterval(t);
    timeDisplayElement.innerHTML = 0;
    startButtonElement.removeEventListener("click", startStop);
    startButtonElement.style.display = "none";
    startButtonElement.innerHTML = "Start"
    running = false;
}

function workIt() {
    statusDisplayElement.innerHTML = status.work;
    statusDisplayElement.className = '';
    statusDisplayElement.classList.add("work"); 
}


function reset() {
    if (!running) { // Can only reset when the timer is stopped 
        enableUpdate();
        started = false;
        workAmtElement.innerHTML = 25;
        breakAmtElement.innerHTML = 5;
        roundAmtElement.innerHTML = 3;
        timeDisplayElement.innerHTML = "25:00";
        startButtonElement.addEventListener("click", startStop);
        startButtonElement.innerHTML = "Start";
        statusDisplayElement.innerHTML = status.initialize;
        statusDisplayElement.className = '';
        statusDisplayElement.classList.add("initialize");
        startButtonElement.style.display = "block";
    }
}

function enableUpdate() {
    arrows.forEach((arrow, index) => {
        arrow.addEventListener("click", updateSettings);
    });
}

function disableUpdate() {
    arrows.forEach((arrow, index) => {
        arrow.removeEventListener("click", updateSettings);
    });
}

function updateSettings(evt) {
    let section = evt.target.parentNode.parentNode.id;
    let clickedArrow = evt.target.innerHTML;
    let directionLeft;
    (clickedArrow == "keyboard_arrow_left") ? directionLeft = true : directionLeft = false;

    switch(section) {
        case "work-amt-sect":
            let workAmt = parseInt(workAmtElement.innerHTML);
            if (directionLeft) { // left work arrow clicked
                (workAmt > 5) ? workAmt -= 5 : false;
            } else { // right work arrow clicked
                (workAmt <= 55) ? workAmt +=5 : false;
            }
            workAmtElement.innerHTML = workAmt;
            timeDisplayElement.innerHTML = workAmt + ":00";
            break;
            
        case "break-amt-sect":
            let breakAmt = parseInt(breakAmtElement.innerHTML);
            if (directionLeft) {
                (breakAmt > 1) ? breakAmt -= 1 : false;
            } else {
                (breakAmt < 15) ? breakAmt += 1 : false;
            }
            breakAmtElement.innerHTML = breakAmt;
            break;
        case "round-amt-sect":
            let roundAmt = parseInt(roundAmtElement.innerHTML);
            if (directionLeft) {
                (roundAmt > 1) ? roundAmt -= 1 : false;
            } else {
                (roundAmt < 5) ? roundAmt += 1 : false;
            }
            roundAmtElement.innerHTML = roundAmt;
            break;
    }
}

function convertTime(s) {
    return(s-(s%=60))/60+(9<s?':':':0')+s
}