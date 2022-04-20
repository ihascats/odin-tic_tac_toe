function FieldConstructor(){
    let _playingField = {
        0:null,
        1:null,
        2:null,
        3:null,
        4:null,
        5:null,
        6:null,
        7:null,
        8:null
    }
    return(_playingField)
}

const Field = function(){
    let currentField = new FieldConstructor()
    // Returns current field state
    const fieldState = () => currentField;
    // Sets field keys and values
    const setField = (key, value)=>{
        currentField[key] = value;
    }
    // Reset field
    const fieldReset = () => {
        Object.keys(currentField).forEach(element =>{
            currentField[element] = null;
        });
    };
    // Sets player playground ui (temp)
    const displayField = () => {
        document.querySelectorAll('.square').forEach(element => {
            if (currentField[element.getAttribute('data-value')]!=null && element.childNodes.length == 0){
                let img = document.createElement('img');
                if (currentField[element.getAttribute('data-value')]=='X'){
                    img.setAttribute('src', './img/close.png');
                    img.setAttribute('width', '68px');
                }
                if (currentField[element.getAttribute('data-value')]=='O'){
                    img.setAttribute('src', './img/checkbox-blank-circle-outline.png')
                    img.setAttribute('width', '56px');
                }
                element.appendChild(img);
            }
            if (currentField[element.getAttribute('data-value')]==null && element.childNodes.length != 0){
                element.lastElementChild.remove(element.lastElementChild);
            }

            if (element.childNodes.length != 0){
                element.classList.remove('emptySquare')
            }
        })
    }

    return{setField, fieldState, displayField, fieldReset}
}


const Player = function(player, shape, field) {
    let _player = player;
    let _shape = shape
    let _fieldCall = field;
    let _playerPov = new FieldConstructor();
    let turn = true;

    const playerName = () => _player;

    const playerTable = () => _playerPov;

    // Determines if player has the first move or not
    const firstMove = function(){
        turn = _shape == 'X';
    }

    const move = function(dataValue){
        if (turn){
            field.setField(dataValue, _shape);
            playerTableSetState();
            conditions().winningCondition();
            turn = !turn
        } else {
            turn = !turn
        }
        return {turn}
    }

    const playerTableSetState = function(){
        for(let [key, value] of Object.entries(_fieldCall.fieldState())){
            // If value is null set player[key] to null, else to true or false
            value == null ? (_playerPov[key] = null) : _shape == value ? (_playerPov[key] = true) : (_playerPov[key] = false);
        };
    }

    const conditions = function(){
        let allConditions = {
            0 : [ {0:_playerPov[0]}, {1:_playerPov[1]}, {2:_playerPov[2]} ] ,
            1 : [ {3:_playerPov[3]}, {4:_playerPov[4]}, {5:_playerPov[5]} ] ,
            2 : [ {6:_playerPov[6]}, {7:_playerPov[7]}, {8:_playerPov[8]} ] ,
            3 : [ {0:_playerPov[0]}, {3:_playerPov[3]}, {6:_playerPov[6]} ] ,
            4 : [ {1:_playerPov[1]}, {4:_playerPov[4]}, {7:_playerPov[7]} ] ,
            5 : [ {2:_playerPov[2]}, {5:_playerPov[5]}, {8:_playerPov[8]} ] ,
            6 : [ {0:_playerPov[0]}, {4:_playerPov[4]}, {8:_playerPov[8]} ] ,
            7 : [ {2:_playerPov[2]}, {4:_playerPov[4]}, {6:_playerPov[6]} ] ,
        }
        const winningCondition = function(){
            for(let values of Object.values(allConditions)){
                let objValues = []
                values.forEach(obj => {
                    objValues.push(Object.values(obj)[0]);
                });
                // If it doesn't contain null or false
                if (!objValues.includes(null) && !objValues.includes(false)){
                    let squares = document.querySelectorAll('.square');
                    squares.forEach(square => {
                        square.classList.remove('emptySquare');
                    });
                    return {winCon: true, playerName};
                }
                
            };
        }
        return {winningCondition, allConditions}
    }

    return{
        firstMove, 
        playerTable,
        playerTableSetState,
        conditions,
        move,
        playerName
    }
    
}

const UserInput = function() {
    const shapeSelector = function(button) {
        let unhide = document.querySelector('.p2');
        unhide.classList.remove('hide');
        let buttons = document.querySelectorAll('.shape>button');
        buttons.forEach(button => {
            button.classList.remove('target');
            button.disabled = false;
        });
        button.classList.add('target');
        button.disabled = true;
    }
    const playerSelector = function(button) {
        let unhide = document.querySelector('.game-controls');
        unhide.classList.remove('hide');
        let buttons = document.querySelectorAll('.player2-choice>button');
        buttons.forEach(button => {
            button.classList.remove('target');
            button.disabled = false;
        });
        button.classList.add('target');
        button.disabled = true;
        if (button.textContent == 'PC'){
            let div = document.createElement('div');
            let label = document.createElement('label');
            let input = document.createElement('input');
            div.appendChild(label);
            div.appendChild(input);
            // div
            div.style = 'display:grid; gap: 8px;'
            div.classList.add('mark');
            // label
            label.textContent = 'PLAYER_2 NAME:';
            label.setAttribute('for', 'player2');

            // input
            input.style = 'width: -webkit-fill-available;';
            input.setAttribute('type','text');
            input.setAttribute('name', 'player2');
            input.setAttribute('id','player2');

            button.parentElement.parentElement.appendChild(div);
        }
        if (button.textContent == 'CPU'){
            if (button.parentElement.parentElement.lastElementChild.classList.contains('mark')){
                button.parentElement.parentElement.removeChild(button.parentElement.parentElement.lastChild);
            }
        }
    }
    const gameControls = function(button) {
        let buttons = document.querySelectorAll('.game-controls>button');
        let gameButtonReset = function(){
            buttons.forEach(button => {
                button.classList.remove('target');
                button.disabled = false;
            });
        }
        gameButtonReset();
        button.classList.add('target');
        button.disabled = true;
        const field = Field();
        if (button.textContent=='START'){
            // start game code here...
            let playerButtons = document.querySelectorAll('.player2-choice>button');
            playerButtons.forEach(button => {
                button.disabled = true;
            });
            let shapeButtons = document.querySelectorAll('.shape>button');
            shapeButtons.forEach(button => {
                button.disabled = true;
            });
            document.querySelectorAll('input').forEach(element => {
                element.disabled = true;
            });
            resultDisplay = document.querySelector('.result');
            resultDisplay.classList.add('hide');

            // start pvp game
            if (document.querySelector('.player2-choice').firstElementChild.classList.contains('target')){
                let squares = document.querySelectorAll('.square');
                squares.forEach(square => square.classList.add('emptySquare'));
                const play = PlayerVsPlayer(field);
                play.play();
            }
            // start pvc game
            if (document.querySelector('.player2-choice').lastElementChild.classList.contains('target')){
                // code here..
                let squares = document.querySelectorAll('.square');
                squares.forEach(square => square.classList.add('emptySquare'));
                const playComputer = PlayerVsComputer(field);
                playComputer.play();
            }
        }
        if (button.textContent=='RESET'){
            field.displayField();
            // reset left-input here...
            document.querySelectorAll('input').forEach(element => {
                element.disabled = false;
            });
            // reset gameControls (self)
            gameButtonReset();
            button.parentElement.classList.add('hide');

            // reset playerSelector
            let p2 = document.querySelector('.p2');
            if (p2.lastElementChild.classList.contains('mark')){
                p2.removeChild(p2.lastChild);
            }
            let playerButtons = document.querySelectorAll('.player2-choice>button');
            playerButtons.forEach(button => {
                button.classList.remove('target');
                button.disabled = false;
            });
            p2.classList.add('hide');

            // reset shapeSelector
            let shapeButtons = document.querySelectorAll('.shape>button');
            shapeButtons.forEach(button => {
                button.classList.remove('target');
                button.disabled = false;
            });
            let player1 = document.querySelector('#player1');
            player1.value = '';

            // reset game here...

        }
    }
    return{shapeSelector, playerSelector, gameControls}
}

const PlayerVsPlayer = function(field){
    let name1 = document.querySelector('#player1').value;
    let name2 = document.querySelector('#player2').value;
    if (name1 == ''){
        name1 = 'Player 1'
    }
    if (name2 == ''){
        name2 = 'Player 2'
    }
    let shapePick = document.querySelectorAll('.shape>button');
    let p1Shape;
    let p2Shape;
    shapePick.forEach(button => {
        if (button.classList.contains('target')){
            p1Shape = button.id;
        } else {
            p2Shape = button.id;
        }
    })
    const playerOne = Player(name1, p1Shape, field);
    const playerTwo = Player(name2, p2Shape, field);
    playerOne.firstMove();
    playerTwo.firstMove();

    const play = function(){
        const playField = document.querySelector('.playingField');
        field.displayField();
        playField.onclick = function(event){
            let square = event.target.closest('.square');
            if (!square || !square.classList.contains("emptySquare")) return
            playerOne.move(square.getAttribute('data-value'));
            playerTwo.move(square.getAttribute('data-value'));
            field.displayField();
            let winningPlayer;
            if ((winningPlayer = playerOne.conditions().winningCondition()) || (winningPlayer = playerTwo.conditions().winningCondition())){
                playField.onclick = null;
                field.fieldReset();
                result = document.querySelector('.result>h3');
                result.textContent = 'WINNER IS '+ winningPlayer.playerName()+'!';
                result.parentElement.classList.remove('hide');
            } else if (!Object.values(field.fieldState()).includes(null)){
                result = document.querySelector('.result>h3');
                result.textContent = "IT'S A DRAW!";
                result.parentElement.classList.remove('hide');
            }
        }
    }
    return {play}
}
const PlayerVsComputer = function(field){
    let name1 = document.querySelector('#player1').value;
    if (name1 == ''){
        name1 = 'Player 1'
    }
    let shapePick = document.querySelectorAll('.shape>button');
    let p1Shape;
    let p2Shape;
    shapePick.forEach(button => {
        if (button.classList.contains('target')){
            p1Shape = button.id;
        } else {
            p2Shape = button.id;
        }
    });
    const playerOne = Player(name1, p1Shape, field);
    const cpu = ComputerPlayer(p2Shape, field);
    
    
    const play = function(){
        const playField = document.querySelector('.playingField');
        if (cpu.firstMove()){
            cpu.computerMove();
        }
        field.displayField();
        playField.onclick = function(event){
            let square = event.target.closest('.square');
            if (!square || !square.classList.contains("emptySquare")) return
            playerOne.move(square.getAttribute('data-value'));
            cpu.computerMove();
            playerOne.move().turn = true;
            field.displayField();

        }
    }
    return {play}
}

const ComputerPlayer = function(shape, field){
    let _name = 'Albert';
    let _shape = shape;
    let _field = field;
    let turn;
    
    const name = ()=>_name;

    const firstMove = function(){
        turn = _shape == 'X';
        return turn;
    }

    const computerMove = function(){
        if (turn){
            // if middle square is empty fill it
            if (_field.fieldState()[4]==null){
                _field.fieldState()[4] = _shape;
            }
            if (true){}



            turn = !turn;
        }
        turn = !turn;
    }
    return {computerMove, name, firstMove}
}

const input = UserInput();

(function(){
    let shapes = document.querySelectorAll('.shape>button');
    shapes.forEach(button => button.addEventListener('click', ()=>input.shapeSelector(button)));
    let secondPlayer = document.querySelectorAll('.player2-choice>button');
    secondPlayer.forEach(button => button.addEventListener('click', ()=>input.playerSelector(button)));
    let gameControls = document.querySelectorAll('.game-controls>button');
    gameControls.forEach(button => button.addEventListener('click', ()=>input.gameControls(button)));
})();