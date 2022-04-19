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
                // console.log(value, _player)
                !objValues.includes(null) && !objValues.includes(false) ? console.log('Winner') : null
                
            };
        }
        return {winningCondition, allConditions}
    }

    const cpu = function(selected){
        let round = selected.length
        let check0 = true;
        let check1 = false;
        console.log(round)
        playerTableSetState()
        if (round==0){
            move(4)
            selected.push('4');
            check0=false
            return
        }
        if (round==1){
            if(Object.values(playerTable())[4]==null){
                move(4)
                selected.push('4');
                check0=false
                return
            } else {
                let rand = Math.floor(Math.random() * (4 - 0 + 1) + 0)*2
                if (rand == 4){
                    rand = 8;
                }
                move(rand);
                selected.push(rand);
                check0=false
                return
            }
        }
        if(check0){
            for(let values of Object.values(conditions().allConditions)){
                let array = [];
                let trueCount = 0;
                let falseCount = 0;
                let nullCount = 0;

                // values is 3 objects
                // depending on the value of the object increase corresponding count
                values.forEach(obj => {
                    let value = Object.values(obj)[0]
                    array.push(obj)
                    if (value){
                        trueCount++
                    }
                    if (value == false){
                        falseCount++
                    }
                    if (value == null){
                        nullCount++
                    }
                });
                // if 2 fields are true and theres an empty field
                // fill empty field
                if (trueCount==2 && nullCount == 1){
                    let pos;
                    array.forEach(obj => {
                        if (Object.values(obj)[0]==null){
                            pos = Object.keys(obj)[0];
                        }
                    })
                    move(pos);
                    selected.push(pos);
                    return
                }
                // if 2 fields are false and an empty field (enemy about to win)
                // fill the empty field
                if (falseCount==2 && nullCount == 1){
                    let pos;
                    array.forEach(obj => {
                        if (Object.values(obj)[0]==null){
                            pos = Object.keys(obj)[0];
                        }
                    })
                    move(pos);
                    selected.push(pos);
                    return
                } 
                check1=true;
            };
        }
        if(check1){
            for(let values of Object.values(conditions().allConditions)){
                for (let obj of values){
                    if (Object.values(obj)[0]==null){
                        move(Object.keys(obj)[0])
                        return
                    }
                }
            
            }
        }
        
    }

    return{
        firstMove, 
        playerTable,
        playerTableSetState,
        conditions,
        move,
        cpu
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


        claimed.push(dataValue);
        console.log(dataValue, claimed)
        X.move(dataValue);
        O.move(dataValue);
        O.cpu(claimed);
        X.move(dataValue);
        field.displayField();
    }
})();