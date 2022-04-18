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

    return{setField, fieldState}
}


const Player = function(player, field) {
    let _player = player;
    let _fieldCall = field;
    let _playerPov = new FieldConstructor()

    const playerTable = () => _playerPov
    // Determines if player has the first move or not
    const firstMove = function(){
        return _player == 'X' ? true : false
    }

    const move = function(){
        
    }

    const playerTableSetState = function(){
        for(let [key, value] of Object.entries(_fieldCall.fieldState())){
            _player == value ? _playerPov[key] = true : _playerPov[key] = false;
        };
    }
    return{
        firstMove,  
        playerTable, 
        playerTableSetState
    }
    
}

const field = Field();
const X = Player('X', field);
const O = Player('O', field);

(function(){
    let claimed = []
    window.onclick = (event)=>{
        let square = event.target.closest('.square');
        let dataValue = square.getAttribute('data-value');
        if (square==null || claimed.includes(dataValue)) return;
        claimed.push(dataValue)
        console.log(dataValue, claimed)
        field.setField(dataValue, 'X')
        
    }
})();