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
        this.isFinal = 0
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
    conmbineSameInputs()
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
    finalStates = document.getElementById("finalState").value.split(",")

    for(let k = 0; k<stateTransitions.length; k++){
        if(stateTransitions[k].input.includes(">")){
            resolveLambdaValues(k)
        }
    }
    if(language.indexOf(">")>-1){
        language.splice(language.indexOf(">"),1)
    }
    DFAGenerator()
}
 

const finalDFAStates = []
const repeatCheckArr = []
let finalStates



function resolveLambdaValues(i){
    let j, ind, output

    // for(i = 0; i<stateTransitions.length;i++){
    //     crntState = stateTransitions[i] 
    //     if(crntState.input.includes(">")){
    //         ind = crntState.input.indexOf(">")
    //         output = crntState.toState[ind]

    //         for(j = 0; j<output.length; j++){
    //             stateTransitions[DFAStates.indexOf(output[j])].input
    //         }
    //     }
    // }

    crntState = stateTransitions[i] 
    if(crntState.input.includes(">")){
        ind = crntState.input.indexOf(">")
        output = crntState.toState[ind]

        for(j = 0; j<output.length; j++){
            if(stateTransitions[DFAStates.indexOf(output[j])].input.includes(">")){
                resolveLambdaValues(DFAStates.indexOf(output[j]))
            }
            // crntState.toState.splice(crntState.input.indexOf(">"), 1)
            // crntState.input.splice(crntState.input.indexOf(">"), 1)

            for(k = 0; k<crntState.input.length;k++){
                nxtStateInd = stateTransitions[DFAStates.indexOf(output[j])].input.indexOf(crntState.input[k])
                crntState.toState[k] = _.union(crntState.toState[k], stateTransitions[DFAStates.indexOf(output[j])].toState[nxtStateInd])
            }
        }
    }

    resolveLambdaForwardValue()
}

function resolveLambdaForwardValue(){
    let crntState
    for(let i = 0;i<stateTransitions.length;i++){
        crntState = stateTransitions[i]
        for(j=0;j<crntState.toState.length;j++){
            for(let g =0;g<crntState.toState[j].length;g++){
                // console.log(crntState.toState[j][g])
                if(stateTransitions[DFAStates.indexOf(crntState.toState[j][g])].input.includes(">")){
                    // console.log("Ineer Exe")
                    nxtStateInd = stateTransitions[DFAStates.indexOf(crntState.toState[j][g])].input.indexOf(">")
                    crntState.toState[j] = _.union(crntState.toState[j],  stateTransitions[DFAStates.indexOf(crntState.toState[j][g])].toState[nxtStateInd])
                }
            }
        }
    }
}



function DFAGenerator(){
    let i;
    // const temp = {}
    // for(i = 0; i<stateTransitions[0].input.length; i++){
    //     if(stateTransitions[0].input[i] in temp){
    //         temp[stateTransitions[0].input[i]] = temp[stateTransitions[0].input[i]] + "," + stateTransitions[0].toState[i].join()
    //     }else{
    //         temp[stateTransitions[0].input[i]] = stateTransitions[0].toState[i].join()
    //     }
    // }    

    const newStates = [stateTransitions[0].state]
    const tempNewState = []

    // Object.values(temp).forEach(nextState =>{
    //     console.log(nextState)
    //     newStates.push(nextState)
    //     tempNewState.push(nextState)
    // })

    // console.log("Initial")
    // console.log(newStates)
    // repeatCheckArr.push(stateTransitions[0].state)

    // finalDFAStates.push(new stateTrans(stateTransitions[0].state, language, tempNewState))
    // console.log("First")
    // console.log(finalDFAStates)

    i = 0;
    while(i<newStates.length){
        tempArr = newStates[i].split(",")
        
        let tempInd, d, f;

        const newInps = []
        const newNxtStates = []
        let nextState, finalStateFlag = 0;
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

            
            if(newStates.indexOf(nextState.sort().join()) < 0){
                newStates.push(nextState.sort().join())
                flagNewState = 1
            }

            // console.log(tempArr)
            // console.log(language[k])
            // console.log("NxtState")
            // console.log(nextState.join())
        
        }

        for(let r=0;r<tempArr.length;r++){
            if(finalStates.includes(tempArr[r])){
                finalStateFlag = 1
                break
            }
        }


        if(repeatCheckArr.indexOf(newStates[i].split(",")) < 0){
            finalDFAStates.push(new stateTrans(newStates[i], newInps, newNxtStates))
            if(finalStateFlag == 1){
                finalDFAStates[finalDFAStates.length-1].isFinal = 1
            }
            repeatCheckArr.push(newStates[i].split(","))
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
        	`

    for(j=0;j<language.length;j++){
        content += `<th>Input (${language[j]})</th><th>Output</th>`
    }

    content += "</tr>"

    for(i = 0; i<finalDFAStates.length; i++){

        if(finalDFAStates[i].isFinal == 1){
            content += `
            <tr>
                <td style="color:red;">${finalDFAStates[i].state}</td>
             `
        }else{
            content += `
            <tr>
                <td>${finalDFAStates[i].state}</td>
            `
        }


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

// function printNFA(){
//     const NFADisplay = document.querySelector(".nfa-display")
//     let i, j;

//     for(i = 0; i<finalDFAStates.length; i++){
//       NFADisplay.innerHTML += `<div class="node${i} node">${finalDFAStates[i].state}</div>`
//     }
//     NFADisplay.style.display = "grid"

// }

function refresh(){
    location.reload()
}
