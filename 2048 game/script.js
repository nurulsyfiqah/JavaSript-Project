document.addEventListener('DOMContentLoaded', () => {
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const highestScoreDisplay = document.getElementById('highestScore');
    const resultDisplay = document.getElementById('result');

    //check highestscore
    //highestScore();

    let highest = localStorage.getItem("highestScore");
    if (highest == null) {
        highestScoreDisplay.innerHTML = 0;
    } else {
        highestScoreDisplay.innerHTML = highest;
    }
    //const playAgainBtn = document.getElementById('play-again-btn')
    const width = 4;
    let squares = [];
    let score = 0;
    //create a playing board

    function createBoard() {
        for (let i = 0; i < width*width; i++) {
            square = document.createElement('div');
            square.innerHTML = 0;
            square.setAttribute('id', i);
            gridDisplay.appendChild(square);
            squares.push(square);
        }
        document.addEventListener('keyup', control);
        generate();
        generate();
    }

    createBoard();
    //generate a number randomly

    function generate() {
        let randomNumber = Math.floor(Math.random()*squares.length);
        if (squares[randomNumber].innerHTML == 0) {
            squares[randomNumber].innerHTML = 2;
            checkForGameOver();
        } else {
            generate();
        }
        generateColour();
    }
    /*
    playAgainBtn.addEventListener("click", function(){
        gridDisplay.innerHTML = "";
        createBoard();
        score = 0;

        localStorage.setItem("score", score);
        scoreDisplay.innerHTML = localStorage.getItem("score");
        resultDisplay.innerHTML = '';
        //document.addEventListener('keyup', control);

    })*/

    //swipe right
    function moveRight() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML;
                let totalTwo = squares[i+1].innerHTML;
                let totalThree = squares[i+2].innerHTML;
                let totalFour = squares[i+3].innerHTML;
                //save the value in the square in an array
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

                //filter and save the row with value
                let filteredRow = row.filter(num => num)

                //save the rows that have no value in it
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);

                //join the array with zeros and filtered row
                let newRow = zeros.concat(filteredRow);

                squares[i].innerHTML = newRow[0];
                squares[i+1].innerHTML = newRow[1];
                squares[i+2].innerHTML = newRow[2];
                squares[i+3].innerHTML = newRow[3];
            }
        }
    }

    //swipe left
    function moveLeft() {
        for (let i = 0; i < 16; i++) {
            if (i % 4 === 0) {
                let totalOne = squares[i].innerHTML;
                let totalTwo = squares[i+1].innerHTML;
                let totalThree = squares[i+2].innerHTML;
                let totalFour = squares[i+3].innerHTML;
                //save the value in the square in an array
                let row = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

                //filter and save the row with value
                let filteredRow = row.filter(num => num)

                //save the rows that have no value in it
                let missing = 4 - filteredRow.length;
                let zeros = Array(missing).fill(0);

                //join the array with filtered row and  zeros
                let newRow = filteredRow.concat(zeros);

                squares[i].innerHTML = newRow[0];
                squares[i+1].innerHTML = newRow[1];
                squares[i+2].innerHTML = newRow[2];
                squares[i+3].innerHTML = newRow[3];
            }
        }
    }
    
    //swipe down 
    function moveDown() {
        for (let i = 0; i < 4; i++) {
            let totalOne = squares[i].innerHTML;
            let totalTwo = squares[i+(width)].innerHTML;
            let totalThree = squares[i+(width*2)].innerHTML;
            let totalFour = squares[i+(width*3)].innerHTML;
            let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];

            let filteredColumns = column.filter(num => num);
            let missing = 4 - filteredColumns.length;
            let zeros = Array(missing).fill(0);
            let newColumn = zeros.concat(filteredColumns);

            squares[i].innerHTML = newColumn[0];
            squares[i+width].innerHTML = newColumn[1];
            squares[i+width*2].innerHTML = newColumn[2];
            squares[i+width*3].innerHTML = newColumn[3];

        }
    }

        //swipe up
        function moveUp() {
            for (let i = 0; i < 4; i++) {
                let totalOne = squares[i].innerHTML;
                let totalTwo = squares[i+(width)].innerHTML;
                let totalThree = squares[i+(width*2)].innerHTML;
                let totalFour = squares[i+(width*3)].innerHTML;
                let column = [parseInt(totalOne), parseInt(totalTwo), parseInt(totalThree), parseInt(totalFour)];
    
                let filteredColumns = column.filter(num => num);
                let missing = 4 - filteredColumns.length;
                let zeros = Array(missing).fill(0);
                let newColumn = filteredColumns.concat(zeros);
    
                squares[i].innerHTML = newColumn[0];
                squares[i+width].innerHTML = newColumn[1];
                squares[i+(width*2)].innerHTML = newColumn[2];
                squares[i+(width*3)].innerHTML = newColumn[3];
            }
        }

    function combineRow() {
        for (let i = 0; i < 15; i++) {
            if (squares[i].innerHTML === squares[i+1].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i+1].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i+1].innerHTML = 0;
                score += combinedTotal;
                localStorage.setItem("score", score);
                scoreDisplay.innerHTML = localStorage.getItem("score");
                //highestScore();
            }
        }
        highestScore();
        checkFor2048();
    }

    function combineColumn() {
        for (let i = 0; i < 12; i++) {
            if (squares[i].innerHTML === squares[i+width].innerHTML) {
                let combinedTotal = parseInt(squares[i].innerHTML) + parseInt(squares[i+width].innerHTML);
                squares[i].innerHTML = combinedTotal;
                squares[i+width].innerHTML = 0;
                score += combinedTotal;
                localStorage.setItem("score", score);
                scoreDisplay.innerHTML = localStorage.getItem("score");
                //highestScore();
            }
        }
        highestScore();
        checkFor2048();
    }

    function control(e) {
        if (e.keyCode === 39) {
            keyRight();
        } else if (e.keyCode === 37) {
            keyLeft();
        } else if (e.keyCode === 40) {
            keyDown();
        } else if (e.keyCode === 38) {
            keyUp();
        }
    }

    function keyRight() {
        moveRight();
        combineRow();
        moveRight();
        generate();
    }

    function keyLeft() {
        moveLeft();
        combineRow();
        moveLeft();
        generate();
    }

    function keyUp() {
        moveUp();
        combineColumn();
        moveUp();
        generate();
    }

    function keyDown() {
        moveDown();
        combineColumn();
        moveDown();
        generate();
    }

    //check for 2048
    function checkFor2048() {
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 2048) {
                resultDisplay.innerHTML = 'Congratulation, You Win!';
                document.removeEventListener('keyup' , control);
            }
        }
    }

    // check if there are no zero
    function checkForGameOver() {
        let zeros = 0;
        //highestScore();
        for (let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                zeros++;
            }
        }

        if (zeros === 0) {
            resultDisplay.innerHTML = 'You Lose!';
            document.removeEventListener('keyup', control);
        }
    }  

    function highestScore() {
        
        var currentSc = localStorage.getItem("score");
        console.log("current "+currentSc);
        var highestSc = localStorage.getItem("highestScore");
        console.log("highest "+highestSc);
        //highestScoreDisplay.innerHTML = highestSc;

        if (parseInt(highestSc) < parseInt(currentSc)) {
            highestSc = localStorage.getItem("score");
            console.log(highestSc + "hello")
            localStorage.setItem("highestScore", highestSc);
            highestScoreDisplay.innerHTML = highestSc;
        }
    }

    function generateColour() {
        let colours = ['#e7d3d3', '#f0e4e4', '#f9f4f4',  '#ffffff', '#fe9c8f', '#feb2a8', '#fec8c1', '#fad9c1', '#f9caa7', '#dfa290', '#c99789', '#dec3c3'];

        for ( let i = 0; i < squares.length; i++) {
            if (squares[i].innerHTML == 0) {
                document.getElementById(squares[i].id).style.background = colours[11];

            } else if (squares[i].innerHTML == 2) {
                document.getElementById(squares[i].id).style.background = colours[0];
            } else if (squares[i].innerHTML == 4) {
                document.getElementById(squares[i].id).style.background = colours[1];
            } else if (squares[i].innerHTML == 8) {
                document.getElementById(squares[i].id).style.background = colours[2];
            } else if (squares[i].innerHTML == 16) {
                document.getElementById(squares[i].id).style.background = colours[3];
            } else if (squares[i].innerHTML == 32) {
                document.getElementById(squares[i].id).style.background = colours[4];
            } else if (squares[i].innerHTML == 64) {
                document.getElementById(squares[i].id).style.background = colours[5];
            } else if (squares[i].innerHTML == 128) {
                document.getElementById(squares[i].id).style.background = colours[6];
            } else if (squares[i].innerHTML == 256) {
                document.getElementById(squares[i].id).style.background = colours[7];
            } else if (squares[i].innerHTML == 512) {
                document.getElementById(squares[i].id).style.background = colours[8];
            } else if (squares[i].innerHTML == 1024) {
                document.getElementById(squares[i].id).style.background = colours[9];
            } else if (squares[i].innerHTML == 2048) {
                document.getElementById(squares[i].id).style.background = colours[10];
            }
        }
    };


});

//disable window from scrolling while using the arrow key
window.addEventListener("keydown", function(e) {
    if(["Space","ArrowUp","ArrowDown","ArrowLeft","ArrowRight"].indexOf(e.code) > -1) {
        e.preventDefault();
    }
}, false);