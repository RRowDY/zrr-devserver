const fs = require("fs");

let circleMinigame = document.getElementById("circle-minigame");
let context = circleMinigame.getContext("2d");
let config = JSON.parse(fs.readFileSync("config/circle_config.json"));

let width = canvas.width;
let height = canvas.height;
let derees = 0;
let newDegress = 0;
let time = 0;
let color = config.color;
let textColor = config.textcolor;
let backgroundColor1 = config.backgroundcolor1;
let backgroundColor2 = config.backgroundcolor2;
let backgroundColor3 = config.backgroundcolor3;
let keyNeedToPress;
let arcStart, arcEnd;
let animationLoop;
let successNeeded = config.defaultNeeded;
let currentStreak = 0;

function getRandomIntegerInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);

    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function clearCanvas(width, height) {
    context.clearRect(0, 0, width, height)
}

function createBackgroundArc(width, height, strokecolor, strokewidth) {
    context.beginPath();
    context.strokeStyle = strokecolor;
    context.lineWidth = strokewidth;
    context.arc(width / 2, height / 2, 100, 0, Math.PI * 2, false);
    context.stroke();
}

function createGreenZone(width, height, successcolor, failcolor, strokewidth) {
    context.beginPath();
    context.strokeStyle = correct === true ? successcolor : failcolor;
    context.lineWidth = strokewidth;
    context.arc(width / 2, height / 2, 100, arcStart - 90 * Math.PI / 180, arcEnd - 90 * Math.PI / 180, false);
    context.stroke();
}

function initializeCircle() {
    clearCanvas(width, height);

    createBackgroundArc(width, height, backgroundColor1, 20);

    createGreenZone(width, height, backgroundColor3, backgroundColor2, 20);
}

function setupAnimationLoop(time) {
    if (typeof animationLoop !== undefined) clearInterval(animationLoop);

    arcStart = getRandomIntegerInclusive(20, 40) / 10;
    arcEnd = getRandomIntegerInclusive(5, 10) / 10;
    arcEnd = arcStart + arcEnd;

    degrees, newDegrees = 0, 360;

    keyNeedToPress = '' + getRandomIntegerInclusive(1,4);

    time = time;

    animationLoop = setInterval(animateTo, time);
}

function updateAnimation() {
    if (degrees >= newDegrees) {
        minigameFail();
        return;
    }

    degrees += 2;
    initializeCircle();
}

function minigameSuccess() {
    currentStreak += 1;

    if (currentStreak == successNeeded) {
        clearInterval(animationLoop);
        minigameEnd(true);
    } else {
        setupAnimationLoop(time);
    };
}

function minigameFail() {
    clearInterval(animationLoop);
    minigameEnd(false);
}

function checkKeyPressed(keyPressed) {
    let allowedKeys = {
        "1": true,
        "2": true,
        "3": true,
        "4": true,
    };

    return allowedKeys[keyPressed] || false;
}

function checkDegrees(degrees, start, end) {
    if (degrees < start || degrees > end) {
        return false;
    }

    return true;
}

document.addEventListener("keydown", function(eventObject) {
    let key = eventObject.key;

    if (!checkKeyPressed(key) || !hasCircleStarted) {
        return;
    }

    let start = (180 / Math.PI) * arcStart;
    let end = (180 / Math.PI) * arcEnd;

    if (key === keyNeedToPress && checkDegrees(degrees, start, end)) {
        minigameSuccess();
    } else {
        minigameFail();
    }
});