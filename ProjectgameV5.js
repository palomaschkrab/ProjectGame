//Declaring all the global variables 
var multipleChoiceArray = [];
var fillInTheBlanksArray = [];
var getQuestion;
var indexQuestion;
var setTimeOut;
var timeLeft;
var fieldUp = [6, 12, 18, 24];
var diceImageList = ["dice1.jpg", "dice2.jpg", "dice3.jpg", "dice4.jpg", "dice5.jpg", "dice6.jpg"];
var playersList = [];
var indexCurrentPlayer;
var surface = document.getElementById("drawingSurface");
var ctx = surface.getContext("2d");
var dice;
var DEFAULT_TIME = 10;

//loaded on setup
var setup = function () {
    addToMultipleChoiceArray();
    getQuestion = document.getElementById("getQuestion");
    document.getElementById("getQuestion").style.visibility = "hidden";
    document.getElementsByName("getChoice")[0].style.visibility = "hidden";
    document.getElementsByName("getChoice")[1].style.visibility = "hidden";
    document.getElementsByName("getChoice")[2].style.visibility = "hidden";
    document.getElementsByName("getChoice")[3].style.visibility = "hidden";
    document.getElementById("timerZone").style.visibility = "hidden";
};

//shows the game rules
var aboutGame = function () {

    var theRules = "RULES: \n -To win the game you need to achieve the spot numbered 30 " +
        "\n -You can play with maximum three more people" +
        "\n -To win you need to answer questions correctly" +
        "\n -Roll the dice to know how many spots you are gonna walk in case your answer is right" +
		"\n -If your answer is wrong you will not move on the board" +
        "\n -As soon as you roll the dice your question show up and you have 10 seconds to answer it" +
		"\n -As soon as you move, it is time for the next player roll the dice" +
        "\n -No cheating!";

    alert(theRules);

};

//constructor for the questions
var MultipleChoice = function (question, choice1, choice2, choice3, choice4, answer) {

    return {
        question: question,
        choice1: choice1,
        choice2: choice2,
        choice3: choice3,
        choice4: choice4,
        answer: answer
    };

};

//pushes data to the array
var addToMultipleChoiceArray = function () {

    var question1MC = MultipleChoice("What defines the context in which drawing and animation occurs.", "drawing context", "defining context ", "rendering context", "rendering content", 3);
    var question2MC = MultipleChoice("What is the process of checking the conditions and changing the behaviour of the program accordingly.", "conditional execution", "the check method", "behavioural execution", "conditioning", 1);
    var question3MC = MultipleChoice("What command asks the user for an input in JavaScript?", "prompt", "alert", "getInput", "inputCommand", 1);
    var question4MC = MultipleChoice("What is a block of code that has a name and are executed when they are called.", "variable", "function", "array", "object", 2);
    var question5MC = MultipleChoice("What is an interactive thing that can happen on the page, for example, a button pressed, a key pressed, a timer expiring, etc.", "interactive", " interactive handler", "object", "event", 4);
    var question6MC = MultipleChoice("What is a special variable that accepts more than one declaration value.", "array", "function", "event", "object", 1);
    var question7MC = MultipleChoice("What is the symbol used for the operator type, remainder?", "/", "&", "%", "||", 3);
    var question8MC = MultipleChoice("Id, width, and height are all main attributes of what html tag?", "body", "main", "script", "canvas", 4);

    multipleChoiceArray.push(question1MC);
    multipleChoiceArray.push(question2MC);
    multipleChoiceArray.push(question3MC);
    multipleChoiceArray.push(question4MC);
    multipleChoiceArray.push(question5MC);
    multipleChoiceArray.push(question6MC);
    multipleChoiceArray.push(question7MC);
    multipleChoiceArray.push(question8MC);
};

//Displays the question and choices
var showQuestionandChoices = function () {
	indexQuestion = Math.floor(Math.random() * 8);
    getQuestion.innerHTML = multipleChoiceArray[indexQuestion].question;
    getChoice1.innerHTML = multipleChoiceArray[indexQuestion].choice1;
    getChoice2.innerHTML = multipleChoiceArray[indexQuestion].choice2;
    getChoice3.innerHTML = multipleChoiceArray[indexQuestion].choice3;
    getChoice4.innerHTML = multipleChoiceArray[indexQuestion].choice4;

    document.getElementById("getQuestion").style.visibility = "visible";
    document.getElementsByName("getChoice")[0].style.visibility = "visible";
    document.getElementsByName("getChoice")[1].style.visibility = "visible";
    document.getElementsByName("getChoice")[2].style.visibility = "visible";
    document.getElementsByName("getChoice")[3].style.visibility = "visible";
    document.getElementById("timerZone").style.visibility = "visible";
};

//checking if answer is right or wrong
var answerQuestion = function (x) {
    if (x === multipleChoiceArray[indexQuestion].answer) {
        timeLeft = -1;
        alert("you're right!");
		document.getElementById("move").disabled = false;
    }else{
		document.getElementById("move").disabled = true;
	}
    
   // showQuestionandChoices();
   // showTimer();

    
};

var habilitateAnswerChoices = function(value){
	document.getElementsByName("getChoice")[0].disabled = value;
	document.getElementsByName("getChoice")[1].disabled = value;
    document.getElementsByName("getChoice")[2].disabled = value;
	document.getElementsByName("getChoice")[3].disabled = value;
}

var countDown = function () {
	if(timeLeft >= 0){
		showTimer(timeLeft);
		timeLeft -= 1;
		if (timeLeft >= 0) {
			setTimeout(countDown, 1000);

		} else if (timeLeft <= 0) {
			habilitateAnswerChoices(true);
			callNextPlayer();
			initialize();
			document.getElementById("move").disabled = true;
			document.getElementById("dice").disabled = false;
			timeLeft = DEFAULT_TIME;
			//        alert("Time's Up!");
		}
	}
};



var showTimer = function (timeLeft) {
    if (timeLeft <= DEFAULT_TIME)
		timerZone.innerHTML = timeLeft;

};


// Structure for player
var players = function (timeLeft, image, actualPosition, x, y) {
    return {
        timeLeft: timeLeft,
        image: image,
        actualPosition: actualPosition,
        x: x,
        y: y
    };
};


//Function to initialize the game adding all the images on the screen

var initialize = function () {
    ctx.clearRect(0, 0, 500, 500);
    var imgTable = new Image();
    imgTable.src = "images/table.jpg";

    var imgPlayer = new Image();
    imgPlayer.src = playersList[indexCurrentPlayer].image;
    imgPlayer.onload = function () {
        ctx.drawImage(imgPlayer, 100, 430, 60, 60);
    };

    imgTable.onload = function () {
        ctx.drawImage(imgTable, 0, 0, 400, 400);
        for (var i = 0; i < playersList.length; i++) {
            var imgMovePlayer = new Image();
            imgMovePlayer.src = playersList[i].image;
            ctx.drawImage(imgMovePlayer, playersList[i].x, playersList[i].y, 30, 30);
        }
    };
};


//This function starts the game.
var startGame = function () {
    resetGame();
	aboutGame();
    var numPlayers = 0;
    while (!isValidNumPlayers(numPlayers)) {
        numPlayers = prompt("How many players do you want?");
    }
    createPlayersList(numPlayers);
    //createPlayersList(4);
    indexCurrentPlayer = 0;
    initialize();
    document.getElementById("dice").disabled = false;
};


//Function to reset the game

var resetGame = function () {
    questions = [];
    playersList = [];
    indexCurrentPlayer = 0;
};


//This function validate if the number of players is a number and if it's between 1 and 4 players

var isValidNumPlayers = function (numPlayers) {
    return !isNaN(numPlayers) && (numPlayers >= 1 && numPlayers <= 4)
};


//This function create a list of players
var createPlayersList = function (numPlayers) {
    var x = 0;
    var y = 330;
    for (var i = 1; i <= numPlayers; i++) {
        var player = players(i, "images/player" + i + ".png", 1, x, y);
        playersList.push(player);
        x = x + 35;
        if (i % 2 == 0) {
            x = 0;
            y = y + 35;
        }
    }
};


//Function to print all the players and its positions

var printPlayers = function () {
    for (var i = 0; i < playersList.length; i++) {
        console.log("Number " + playersList[i].number + " Image: " + playersList[i].image + " X: " + playersList[i].x + " Y: " + playersList[i].y);
    }
};


var imgMovePlayer1 = new Image();
imgMovePlayer1.src = "images/player1.png";

var imgMovePlayer2 = new Image();
imgMovePlayer2.src = "images/player2.png";

var imgMovePlayer3 = new Image();
imgMovePlayer3.src = "images/player3.png";

var imgMovePlayer4 = new Image();
imgMovePlayer4.src = "images/player4.png";

var imgTable = new Image();
imgTable.src = "images/table.jpg";
imgTable.onload = function () {
    ctx.drawImage(imgTable, 0, 0, 400, 400);
};

//Function to move the players
var movement = function () {

    console.log("Current Player: " + playersList[indexCurrentPlayer].player);
    for (var i = 0; i < dice; i++) {
        var nextPosition = playersList[indexCurrentPlayer].actualPosition + 1;
        if (isMoveUp(playersList[indexCurrentPlayer].actualPosition, nextPosition)) {
            moveUp(1);
            playersList[indexCurrentPlayer].actualPosition += 1;
        } else if (isMoveRight(playersList[indexCurrentPlayer].actualPosition)) {
            moveRight(1);
            playersList[indexCurrentPlayer].actualPosition += 1;
        } else if (isMoveLeft(playersList[indexCurrentPlayer].actualPosition)) {
            moveLeft(1);
            playersList[indexCurrentPlayer].actualPosition += 1;
        }
        if (playersList[indexCurrentPlayer].actualPosition == 30) {
            alert("Congratulations Player " + playersList[indexCurrentPlayer].number + "! You won!");
            break;
        }
    }
    callNextPlayer();
    initialize();
    document.getElementById("dice").disabled = false;
    document.getElementById("move").disabled = true;
    showQuestionandChoices();
};

var callNextPlayer = function () {
    if (indexCurrentPlayer + 1 > (playersList.length - 1)) {
        indexCurrentPlayer = 0;
    } else {
        indexCurrentPlayer += 1;
    }
}

var moveLeft = function (dice) {
    playersList[indexCurrentPlayer].x -= 67 * dice;
}

var moveRight = function (dice) {
    playersList[indexCurrentPlayer].x += 67 * dice;
}

var moveUp = function (dice) {
    playersList[indexCurrentPlayer].y -= 80 * dice;
}

var moveDown = function (dice) {
    playersList[indexCurrentPlayer].y += 80 * dice;
}

var isMoveRight = function (actualPosition) {
    if ((actualPosition >= 1 && actualPosition <= 5) || (actualPosition >= 13 && actualPosition <= 17) || (actualPosition >= 25 && actualPosition <= 29)) {
        return true;
    }
    return false;
};


var isMoveLeft = function (actualPosition) {
    if ((actualPosition >= 7 && actualPosition <= 11) || (actualPosition >= 19 && actualPosition <= 23)) {
        return true;
    }
    return false;
};

var isMoveUp = function (actualPosition) {
    for (var i = 0; i < fieldUp.length; i++) {
        if (fieldUp[i] == actualPosition) {
            return true;
        }
    }
    return false;
};

var rollDice = function () {

    var indexDice = Math.floor((Math.random() * 6));
    console.log("Dice: " + indexDice);
    dice = indexDice + 1;
    var imgDice = new Image();
    imgDice.src = "images/" + diceImageList[indexDice];
    imgDice.onload = function () {
        ctx.drawImage(imgDice, 200, 430, 60, 60);
    };
    document.getElementById("move").disabled = true;
    document.getElementById("dice").disabled = true;

	var myTimer = setTimeout(countDown, 1000);
	timeLeft = DEFAULT_TIME;
	habilitateAnswerChoices(false);
	cleanAnswers();
    showQuestionandChoices();
};

var cleanAnswers = function(){
	document.getElementsByName("getChoice")[0].checked = false;
    document.getElementsByName("getChoice")[1].checked = false;
    document.getElementsByName("getChoice")[2].checked = false;
    document.getElementsByName("getChoice")[3].checked = false;
}