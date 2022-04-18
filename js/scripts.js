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
    const fieldState = () => currentField;
    const setField = (key, value)=>{
        currentField[key] = value;
        console.log(currentField)
    }
    return{setField, fieldState}
}


const Player = function(player, field) {
    let _player = player;
    let _fieldCall = field;
    let _playerPov = new FieldConstructor()

    const firstMove = function(){
        return _player == 'X' ? true : false
    }

    const move = function(){
        
    }

    const conditions = function(){
        for(let [key, value] of Object.entries(_fieldCall.fieldState())){
            console.log(key, value);
        };
    }
    return{firstMove, conditions}
    
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