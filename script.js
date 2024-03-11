//Author : Devesh Keshavan S aka DeV
const transitionCont = document.querySelector(".dynamic-input")


const iniStateValues = []
const inputValues = []
const toStateValues =[]
const language = []

var totalTransitions = 1

class stateTrans{
    constructor(state, input, toState){
        this.state = state
        this.input = input
        this.toState = toState
    }
}


function addTransition(){
    const transitionNode = document.createElement("div")
    transitionNode.innerHTML+= `<div class="transition">
        <label>From State :
            <input class="single-inp-state single-inp" name="ini-trans" type="text">
        </label>
        <label>Input :
            <input class="single-inp-inp single-inp" name="input-trans" type="text">
        </label>
        <label>To State :
            <input class="single-inp-tstate single-inp" name="to-trans" type="text">
        </label>
    </div>`
    transitionCont.appendChild(transitionNode)

    totalTransitions += 1
}
 

const DFAStates = []
const DFAinputs = []
const DFAtoStates = []

const stateTransitions = []


function dataFilter(){
    const iniStates = document.querySelectorAll(".single-inp-state")
    const inputs = document.querySelectorAll(".single-inp-inp")
    const toStates = document.querySelectorAll(".single-inp-tstate")
    document.getElementById("language").value.split(",").forEach(element => {
        language.push(element)
    });
    // for(let i = 0; i<totalTransitions; i++){
    //     iniStateValues.push(iniStates[i].value)
    //     inputValues.push(inputs[i].value)
    //     toStateValues.push(toStates[i].value)
    // }
    let i, ind;

    for(i=0;i<totalTransitions;i++){
        if(DFAStates.indexOf(iniStates[i].value) < 0 ){
            DFAStates.push(iniStates[i].value)
            DFAinputs.push(Array(inputs[i].value))
            DFAtoStates.push(Array(toStates[i].value))
        }
        else{
            ind = DFAStates.indexOf(iniStates[i].value)
            DFAinputs[ind].push(inputs[i].value)
            DFAtoStates[ind].push(toStates[i].value)
        }
    }


    for(i = 0; i<DFAStates.length; i++){
        transition = new stateTrans(DFAStates[i], DFAinputs[i], DFAtoStates[i]);
        stateTransitions.push(transition)
    }

    // console.log(iniStateValues)
    // console.log(inputValues)
    // console.log(toStateValues)
    console.log(stateTransitions)
}

function conmbineSameInputs(){
    stateTransitions.forEach(t => {
        temp = {}
        for(let i = 0; i<t.input.length; i++){
            if(!(t.input[i] in temp)){
                temp[t.input[i]] = Array(t.toState[i])
            }else{
                temp[t.input[i]].push(t.toState[i])
            }
        }
        const newInputs = []
        const newToState = []

        Object.keys(temp).forEach(inp => {
            newInputs.push(inp)
        })

        Object.values(temp).forEach(nextState =>{
            newToState.push(nextState)
        })
        t.input = newInputs
        t.toState = newToState
    })
}
 

const finalDFAStates = [];
const repeatCheckArr = []

function DFAGenerator(){
    let i, nextDFASate = "";
    const temp = {}
    for(i = 0; i<stateTransitions[0].input.length; i++){
        if(stateTransitions[0].input[i] in temp){
            temp[stateTransitions[0].input[i]] = temp[stateTransitions[0].input[i]] + "," + stateTransitions[0].toState[i].join()
        }else{
            temp[stateTransitions[0].input[i]] = stateTransitions[0].toState[i].join()
        }
    }    

    const newStates = []
    const tempNewState = []

    Object.values(temp).forEach(nextState =>{
        console.log(nextState)
        newStates.push(nextState)
        tempNewState.push(nextState)
    })

    console.log("Initial")
    console.log(newStates)
    repeatCheckArr.push(stateTransitions[0].state)

    finalDFAStates.push(new stateTrans(stateTransitions[0].state, language, tempNewState))
    console.log("First")
    console.log(finalDFAStates)

    i = 0;
    while(i<newStates.length){
        tempArr = newStates[i].split(",")
        
        let tempInd, d, f;

        const newInps = []
        const newNxtStates = []
        let nextState;
        for(let k = 0; k<language.length;k++){
            nextState = []
            for(let j=0; j<tempArr.length; j++){

                if(DFAStates.indexOf(tempArr[j]) == -1){
                    nextState = nextState
                    continue
                }else{
                    d = DFAStates.indexOf(tempArr[j])
                    f = (language[k]).toString()
                    tempInd = stateTransitions[d].input.indexOf(f)
                    
                    if(tempInd >-1){
                        nextState = _.union(nextState, stateTransitions[DFAStates.indexOf(tempArr[j])].toState[tempInd])
                    }
                    // console.log(tempArr + ", " + language[k] +" => " +nextState)
                }
            
            }

            if((nextState.join()) == ""){
                nextState = ['null']
            }

            
            
            newInps.push(language[k])
            newNxtStates.push(nextState.join())

            // console.log("newsTATES :")
            // console.log(newNxtStates)
            // console.log("newINPS :")
            // console.log(newInps)
            // console.log("oot")  
            // console.log(nextState)        

            
            if(newStates.indexOf(nextState.join()) < 0){
                newStates.push(nextState.join())
                flagNewState = 1
            }

            // console.log(tempArr)
            // console.log(language[k])
            // console.log("NxtState")
            // console.log(nextState.join())
        
        }


        if(repeatCheckArr.indexOf(newStates[i]) < 0){
            finalDFAStates.push(new stateTrans(newStates[i], newInps, newNxtStates))
            repeatCheckArr.push(newStates[i])
        }
        // console.log(newStates)

        

        i+=1
    }


   printNFA()
}
 

function printNFA(){
    const NFADisplay = document.querySelector(".nfa-display")
    let i, j;
    content = `
        <table border="1" cellpadding="10px">
            <tr>
                <th>State</th>
    `;

    for(j=0;j<language.length;j++){
        content += `<th>Input (${language[j]})</th><th>Output</th>`
    }

    content += "</tr>"

    for(i = 0; i<finalDFAStates.length; i++){
        content += `
            <tr>
                <td>${finalDFAStates[i].state}</td>
        `
        for(let j = 0; j<language.length; j++){
            content += `<td>${finalDFAStates[i].input[j]}</td>
                        <td>${finalDFAStates[i].toState[j]}</td>
            `
        }

        content += "</tr>"
    }
    NFADisplay.style.display = "grid"
    NFADisplay.innerHTML = `<div class="close-btn" onclick="refresh()">&times; Close</div>`
    NFADisplay.innerHTML += content
}

function refresh(){
    location.reload()
}

