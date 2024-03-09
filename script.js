const transitionCont = document.querySelector(".dynamic-input")


const iniStateValues = []
const inputValues = []
const toStateValues =[]
const language = []

var totalTransitions = 1;

class stateTrans{
    constructor(state, input, toState){
        this.state = state
        this.input = input
        this.toState = state
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

const DFAStates = [];
const DFAinputs = []


function dataFilter(){
    const iniStates = document.querySelectorAll(".single-inp-state")
    const inputs = document.querySelectorAll(".single-inp-inp")
    const toStates = document.querySelectorAll(".single-inp-tstate")
    document.getElementById("language").value.split(",").forEach(element => {
        language.push(element)
    });
    for(let i = 0; i<totalTransitions; i++){
        iniStateValues.push(iniStates[i].value)
        inputValues.push(inputs[i].value)
        toStateValues.push(toStates[i].value)
    }
    console.log(iniStateValues)
    console.log(inputValues)
    console.log(toStateValues)
}

function DFAGenerator(){
    for(let i=0; i<totalTransitions; i++){
        iniStateValues[i]
    }
}