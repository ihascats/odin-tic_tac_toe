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
    const setField = (key, value)=>{
        currentField[key] = value;
        console.log(currentField)
    }
    return{setField}
}


const Player = function(player) {
    let _player = player
    let _fieldState = field
    const firstMove = function(){
        return _player == 'X' ? true : false
    }
    let _playerPov = new FieldConstructor()
    const move = function(){
        
    }
    return{firstMove}
    
}

const field = Field();
const X = Player('X');
const O = Player('O');

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