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
    // Sets player playground ui (temp)
    const displayField = () => {
        document.querySelectorAll('.square').forEach(element => {
            element.textContent = currentField[element.getAttribute('data-value')]
        })
    }

    return{setField, fieldState, displayField}
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
            0 : [ _playerPov[0], _playerPov[1], _playerPov[2] ] ,
            1 : [ _playerPov[3], _playerPov[4], _playerPov[5] ] ,
            2 : [ _playerPov[6], _playerPov[7], _playerPov[8] ] ,
            3 : [ _playerPov[0], _playerPov[3], _playerPov[6] ] ,
            4 : [ _playerPov[1], _playerPov[4], _playerPov[7] ] ,
            5 : [ _playerPov[2], _playerPov[5], _playerPov[8] ] ,
            6 : [ _playerPov[0], _playerPov[4], _playerPov[8] ] ,
            7 : [ _playerPov[2], _playerPov[4], _playerPov[6] ] ,
        }
        const winningCondition = function(){
            for(let value of Object.values(allConditions)){
                // If it doesn't contain null or false
                // console.log(value, _player)
                !value.includes(null) && !value.includes(false) ? console.log('Winner') : null
            };
        }
        return {winningCondition}
    }

    return{
        firstMove, 
        playerTable,
        playerTableSetState,
        conditions,
        move
    }
    
}

const field = Field();
const X = Player('X', field);
const O = Player('O', field);

(function(){
    X.firstMove();
    O.firstMove();
    let claimed = []
    window.onclick = (event)=>{
        let square = event.target.closest('.square');
        let dataValue = square.getAttribute('data-value');
        if (square==null || claimed.includes(dataValue)) return;


        claimed.push(dataValue)
        console.log(dataValue, claimed)
        X.move(dataValue);
        O.move(dataValue);
        field.displayField();
    }
})();