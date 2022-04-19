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
        console.log(currentField)
    };
    // Sets player playground ui (temp)
    const displayField = () => {
        console.log('here!')
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


const Player = function(player, field) {
    let _player = player;
    let _fieldCall = field;
    let _playerPov = new FieldConstructor();
    let turn;

    const playerTable = () => _playerPov;

    // Determines if player has the first move or not
    const firstMove = function(){
        turn = _player == 'X';
    }

    const move = function(dataValue){
        if (turn){
            field.setField(dataValue, _player);
            playerTableSetState();
            conditions().winningCondition();
            turn = !turn
        } else {
            turn = !turn
        }
    }

    const playerTableSetState = function(){
        for(let [key, value] of Object.entries(_fieldCall.fieldState())){
            // If value is null set player[key] to null, else to true or false
            value == null ? (_playerPov[key] = null) : _player == value ? (_playerPov[key] = true) : (_playerPov[key] = false);
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
                    return true;
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
        move
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
        if (button.textContent=='START'){
            // start game code here...
            let squares = document.querySelectorAll('.square');
            squares.forEach(square => square.classList.add('emptySquare'));
            const play = PlayerVsPlayer();
            play.play();
        }
        if (button.textContent=='RESET'){

            // reset left-input here...

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

const PlayerVsPlayer = function(){
    const field = Field();
    const X = Player('X', field);
    const O = Player('O', field);
    X.firstMove();
    O.firstMove();

    const play = function(){
        const playField = document.querySelector('.playingField');
        field.displayField();
        playField.onclick = function(event){
            let square = event.target.closest('.square');
            if (!square) return
            X.move(square.getAttribute('data-value'));
            O.move(square.getAttribute('data-value'));
            field.displayField();
            if (X.conditions().winningCondition() || O.conditions().winningCondition()){
                playField.onclick = null;
                field.fieldReset();
            }
        }
    }
    return {play}
}
const input = UserInput();

(function(){
    let shapes = document.querySelectorAll('.shape>button');
    shapes.forEach(button => button.addEventListener('click', ()=>input.shapeSelector(button)));
    let secondPlayer = document.querySelectorAll('.player2-choice>button');
    secondPlayer.forEach(button => button.addEventListener('click', ()=>input.playerSelector(button)));
    let gameControls = document.querySelectorAll('.game-controls>button');
    gameControls.forEach(button => button.addEventListener('click', ()=>input.gameControls(button)));
    // X.firstMove();
    // O.firstMove();
    // let claimed = []
    // window.onclick = (event)=>{
    //     let square = event.target.closest('.square');
    //     let dataValue = square.getAttribute('data-value');
    //     if (square==null || claimed.includes(dataValue)) return;


    //     claimed.push(dataValue);
    //     X.move(dataValue);
    //     O.move(dataValue);
    //     console.log(claimed.length)
    //     field.displayField();
    // }
    
})();