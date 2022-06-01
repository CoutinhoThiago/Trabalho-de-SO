//--------------------VARIAVEIS----------------------------------------------------------------------------------------------------------------------------------------------------------------

var cont = 0;

let a = 0;
let b = 0;

var numCoisa = 0;

//--------------------------------------------------

var nodes = [];

//--------------------------------------------------

var pause = false;
var criado = false;

var primeiraVez = false; // ( ͡° ͜ʖ ͡°) //

var RUNNING = false;

//--------------------------------------------------

var matriz;
var tipoDeMemoria;
var simulacao;
var turnArround;

var ID;

//--------------------SCRIPTS BASICOS----------------------------------------------------------------------------------------------------------------------------------------------------------------

function processInfo(nodes, algorithm) {
    quantum = document.getElementById("entradaDeQuantum").value

    sobrecarga = document.getElementById("entradaDeSobrecarga").value

    numeroDePaginas = document.getElementById("entradaDeQuantidadeDePaginas").value

    tempoDeIO = document.getElementById("entradaDeTempoDeIO").value

    tipoDeMemoria = document.getElementById('entradaEscalonamentoDePaginas').value

    processos = []

    for(var i in nodes) {
        processos.push({
            idNome:parseInt(nodes[i]),
            id:parseInt(i),
            arriveTime:document.getElementById("entradaDeTempoDeIO"+nodes[i]).value, 
            execTime:document.getElementById("inputexecute"+nodes[i]).value, 
            deadline:document.getElementById("inputdeadline"+nodes[i]).value, 
            priority:0,
            totalTime:0,
            inIO:false,
            inIOqueue:false,
            exists:false
        });
    }

    // Criando memoria
    if(tipoDeMemoria == "FIFO"){
        memoria = new MemoriaFIFO(numeroDePaginas, processos.length)
    }
    if(tipoDeMemoria == "MRU"){
        memoria = new MemoriaMRU(numeroDePaginas, processos.length)
    }

    // Criando a simulação
    if(algorithm == "FIFO"){
        simulacao = new SimulacaoFIFO(processos, memoria, tempoDeIO, quantum, sobrecarga)
    }  
    if(algorithm == "EDF"){
        simulacao = new SimulacaoEDF(processos, memoria, tempoDeIO, quantum, sobrecarga)
    }
    if(algorithm == "SJF"){
        simulacao = new SimulacaoSJF(processos, memoria, tempoDeIO, quantum, sobrecarga)
    }
    if(algorithm == "ROUND"){
        simulacao = new SimulacaoROUND(processos, memoria, tempoDeIO, quantum, sobrecarga)
    }
}


function CriarTabelaDeMemoriaVirtual(paginas) {
    for (let i = 0; i < (nodes.length); i++) {
        tr = document.createElement('tr');
        tr.setAttribute('class',"shedule-mem-v");
        tr.setAttribute('align',"center");

        
        num = document.createElement('td');
        num.innerHTML = "P"+nodes[i];
        num.style.fontSize = '15pt';
        
        tr.appendChild(num);

        for(let j=0; j<paginas; j++){
            td=document.createElement('td');
            td.setAttribute('id', "celula"+ ((parseInt(paginas)*parseInt(i))+parseInt(j) ));
            td.setAttribute('align', "center");
            

            td.setAttribute('width', "5px");
            span = document.createElement('span');
            td.style.position = 'relative';
            
            span.style.position = 'absolute';
            span.style.top = '0px';
            span.style.left = '3px';
            span2 = document.createElement('span');
            span2.setAttribute('id', "span"+((parseInt(paginas)*parseInt(i))+parseInt(j) ));
            span2.innerHTML = '-';
            td.style.fontSize = '12pt';
            td.style.minWidth = '40px';
            td.style.maxWidth = '40px';
            span.style.fontSize = '8pt';
            span.innerHTML = i*parseInt(paginas) + j ;
            td.appendChild(span);
            td.appendChild(span2);
            tr.appendChild(td);
        }

        document.getElementById('primeiraLinhaDaMemoriaVirtual').setAttribute('colspan', paginas + 1);
        document.getElementById('memoriaVirtual').appendChild(tr);
    }
}
function criarTabelaDeMemoriaReal(){   
    for (let i = 0; i < 50; i++) {
        td = document.createElement('td');
        td.setAttribute('align',"center");
        td2 = document.createElement('td');
        td2.setAttribute('align',"center");
        td2.setAttribute('class', "replaceMem");
        td2.setAttribute('id', "real"+i);
        td.style.fontSize = "8pt";
        td.innerHTML = i;
        td.style.backgroundColor = "lightgrey";
        td2.innerHTML = "-";
        td2.style.fontSize = "13pt";
        td2.style.minWidth = "60px";
        td2.style.maxWidth = "60px";
      
        
        
        document.getElementById('primeiraLinhaDaMemoriaReal').appendChild(td);
        document.getElementById('segundaLinhaDaMemoriaReal').appendChild(td2);
    }
}



function deleteno(id){
    x = nodes.indexOf(id); 
    aux = document.getElementsByClassName("form-group execucaoFluid removivel")[x];
    document.getElementById("process").removeChild(aux);

    aux = document.getElementsByClassName("form-group ProcessosFluid delete-button")[x];
    document.getElementById("process").removeChild(aux); 
    
    aux = document.getElementsByClassName("intdiv")[x];
    document.getElementById("process").removeChild(aux);  
    
    aux = document.getElementById("linha"+id);
    document.getElementById('tabela').removeChild(aux);

    graf = document.getElementById('grafico').style.height;

    graf.replace("px", '');
    graf = parseInt(graf);

    if(graf>200){
        graf-=30;
        document.getElementById('grafico').style.height = graf+"px";
    }
      
    nodes.splice(x, 1);
}

function show(id){
    x = nodes.indexOf(id); 
    aux = document.getElementsByClassName("intdiv")[x];

    var height;
    var id;
    if(aux.style.height == "0px"){
        height = 0;
        id = setInterval(frame, 5);
        function frame() {
            if (height == 210) {
                clearInterval(id);
            } else {
                height+=5; 
                aux.style.height = height + 'px'; 
                aux.style.height = height + 'px'; 
            }
        }
    }
    else {
        height = 210;
        id = setInterval(frame, 5);
        function frame() {
            if (height == 0) {
                clearInterval(id);
            } else {
                height-=5; 
                aux.style.height = height + 'px'; 
                aux.style.height = height + 'px'; 
            }
        }
    }    
}

function pausarSimulacao(){
    pause = true;    
    $('#botaoPausar').attr("disabled" , true);
    $('#botaoLimpar').attr("disabled", false);
    $('#iniciarSimulacao').attr("disabled", false);
}

function frame(){
    if(!pause){
        informations = simulacao.simularTempo();
        RUNNING = true;
    }     
    else{
        clearInterval(ID);
        RUNNING = false;
    }
       
    
    if(informations == null){
        pause = true;
        clearInterval(ID);
        document.getElementById('iniciarSimulacao').setAttribute('disabled',"true");
        document.getElementById('botaoPausar').setAttribute('disabled',"true");
        $('#botaoLimpar').attr("disabled", false);
    }
    if(!pause){
         
        numTime = document.createElement('td');
        numTime.setAttribute('class',"square");
        numTime.innerHTML = numCoisa;
        numTime.setAttribute('align', "center");

        document.getElementById('nomes-tabela').appendChild(numTime);

        numCoisa++;        

        deleteProcessQueue();
        for (b ; b < informations.column.length; b++) {
            if(pause)
                break; 
            atualTr = document.getElementById("linha"+nodes[b]);
            newCol = document.createElement('td');
            newCol.setAttribute('class',"square");
            newCol.style.height = "30px";
            newCol.style.width = "30px";
            newCol.style.border = "solid 5px lightgrey";

            if(informations.column[b]=='D'){
                newCol.style.backgroundColor = "gray";
                
                spanIO = document.createElement('span');
                spanIO.style.backgroundColor = "gray";
                spanIO.setAttribute('class',"processo-principal");
                
                spanIO.innerHTML = $(atualTr).first()[0].innerHTML;
                document.getElementById('IODoProcess').appendChild(spanIO);

            }
            if(informations.column[b]=='E'){
                newCol.style.backgroundColor = "rgb(64, 224, 32)";

                spanEXEC = document.createElement('span');
                spanEXEC.style.backgroundColor = "rgb(64, 224, 32)";
                spanEXEC.setAttribute('class',"processo-principal");
                
                spanEXEC.innerHTML = $(atualTr).first()[0].innerHTML;
                document.getElementById('processoExecutando').appendChild(spanEXEC);
            }
            if(informations.column[b]=='L'){
                newCol.style.backgroundColor = "rgb(132, 201, 116)";

                spanEXEC = document.createElement('span');
                spanEXEC.style.backgroundColor = "rgb(64, 224, 32)";
                spanEXEC.setAttribute('class',"processo-principal");
                
                spanEXEC.innerHTML = $(atualTr).first()[0].innerHTML;
                document.getElementById('processoExecutando').appendChild(spanEXEC);
            }
            if(informations.column[b]=='X')
                newCol.style.backgroundColor = "rgb(198, 73, 73)";
            if(informations.column[b]=='-')
                newCol.style.backgroundColor = "rgb(252, 241, 67)";
            if(informations.column[b]=='Q')
                newCol.style.backgroundColor = "lightgray";  

            atualTr.appendChild(newCol);       
            var maxScrollLeft = document.getElementById('grafico').scrollWidth - document.getElementById('grafico').clientWidth;
            $('#grafico').scrollLeft(maxScrollLeft);
            document.getElementById('turnaround').innerHTML = "Turnaround médio = "+informations.ta;
            
        }

        // Memoria virtual
        for(let x=0; x<informations.vm.length; x++){
            let celula = document.getElementById('celula'+x);
            let spanDentroDaCelula = document.getElementById('span'+x);
            if(informations.vm[x]==null){                
                if(spanDentroDaCelula.innerHTML != '-'){
                    celula.style.backgroundColor = 'gray'
                    celula.style.color = 'white'
                }
                else{
                    celula.style.backgroundColor = 'transparent'
                    celula.style.color = 'black' 
                }
                spanDentroDaCelula.innerHTML = '-';
            }    
            else{
                spanDentroDaCelula.innerHTML = informations.vm[x];
            }            
        }

        // Memoria real
        for(let x=0; x<informations.rm.length; x++){
            if(informations.rm[x]==null){
                document.getElementById("real"+(x)).innerHTML = '-';
            }
            else{
                document.getElementById("real"+(x)).innerHTML = informations.rm[x];
            }
        }

        turnArround = informations.ta;  

        for(let i in informations.exec){
            tdQueueExec = document.createElement('td');
            tdQueueExec.setAttribute('class', "secundarios")
            spanQueueExec = document.createElement('span');
            spanQueueExec.setAttribute('class',"processo-coad");
            spanQueueExec.style.backgroundColor = "rgb(221, 207, 42)";
            spanQueueExec.innerHTML = "P"+informations.exec[i].idNome;

            tdQueueExec.appendChild(spanQueueExec);
            document.getElementById('listaDeExecucao').appendChild(tdQueueExec);
        }
        for(let i = 1; i < informations.io.length; i++){
            tdQueueExec = document.createElement('td');
            tdQueueExec.setAttribute('class', "secundarios")
            spanQueueExec = document.createElement('span');
            spanQueueExec.setAttribute('class',"processo-coad");
            spanQueueExec.style.backgroundColor = "lightgray";
            spanQueueExec.innerHTML = "P"+informations.io[i].idNome;

            tdQueueExec.appendChild(spanQueueExec);
            document.getElementById('listaDeIO').appendChild(tdQueueExec);
        }

    }      
    b = 0;   
}

function VelocidadeDeExecucao(){
    if(RUNNING){
        clearInterval(ID);
        ID = setInterval(frame,  1000 - document.getElementById('velocidadeExecucao').value);
    }    
    
}

function deleteProcessQueue() {
    let trIO = document.getElementById('listaDeIO');
    let trEXE = document.getElementById('listaDeExecucao');

    let tdIO = document.getElementById('IODoProcess');
    let tdEXE = document.getElementById('processoExecutando');

    // Remove os principais
    if(tdIO.childNodes.length > 0){
        tdIO.removeChild(tdIO.childNodes[0]);
    }
    if(tdEXE.childNodes.length > 0){
        tdEXE.removeChild(tdEXE.childNodes[0]);
    }

    $('.secundarios').remove()

}

function iniciarASimulacao(algorithm) {    
    $('#iniciarSimulacao').attr("disabled", true);
    $('.removeButton').css("display" , "none");
    $('body :input').attr("disabled" , true);
    $('#botaoPausar').attr("disabled" , false);
    $('#botaoLimpar').attr("disabled", true);
    $('.button-process').attr("disabled", false);
    $('#velocidadeExecucao').attr("disabled", false);
    pause = false;

    if(!criado) {
        criarTabelaDeMemoriaReal()
        CriarTabelaDeMemoriaVirtual(document.getElementById("entradaDeQuantidadeDePaginas").value);
        criado = true;
    }
   
    if(primeiraVez == false) {
        processInfo(nodes, algorithm);
        primeiraVez = true;
    } 

    frame();
    
    
    document.getElementById('botaoInserirProcesso').setAttribute('disabled', "true");

    ID = setInterval(frame, 1000 - document.getElementById('velocidadeExecucao').value);
 
   
}



function limparDados(){
    pause = true;
    $('.square').remove();
    $('.removeButton').css("display" , "block");
    $('body :input').attr("disabled" , false);
    $('#botaoPausar').attr("disabled", true);
    $('#botaoLimpar').attr("disabled", true);
    $('#iniciarSimulacao').attr("disabled", false);
    $('.shedule-mem-v').remove();
    $('.replaceMem').html('-');
    $('#turnaround').html('Tunraround médio = ...');
    deleteProcessQueue();
    primeiraVez = false;
    criado = false;
    a = 0;
    b = 0;
    numCoisa = 0;
}

function inserirProcesso() {
    var i3 = document.createElement("div");
    i3.setAttribute('class', "form-group execucaoFluid removivel");
    i3.setAttribute('style',"margin-bottom: 0px;");
    if(nodes.length == 0) {
        cont = 1;
    }
    else {
        min = 0;
        for (let i = 0; i < nodes.length; i++) {
           if(nodes[i]>=min) min = nodes[i];
        }
        cont = min+1;
    }
    var botao = document.createElement("input");
    botao.setAttribute('value', "Processo "+cont);
    botao.setAttribute('type', "button");
    botao.setAttribute('onClick', "show("+cont+")");
    botao.setAttribute('style', "opacity: 0;");
    botao.setAttribute('class', "col-12 button-process");
    i3.appendChild(botao);
    
    var opacity = 0;
    var idOpa = setInterval(frame, 30);
    function frame() {
        if (botao.style.opacity == "1") {
            clearInterval(idOpa);
        } 
        else {
            opacity+=0.1; 
            botao.style.opacity = opacity;
        }
    }

    var i2emeio = document.createElement("div");
    i2emeio.setAttribute('class', "intdiv");
    i2emeio.setAttribute('style',"margin: -10px 0px 10px 5px;");


    var i2 = document.createElement("div");
    i2.setAttribute('class', "form-row");

    var i = document.createElement("div");
    i.setAttribute('class',"form-group col-sm-5");

    var p = document.createElement("label");
    p.setAttribute('for', "nsei");
    
    p.innerHTML = "<br>Chegada";
    var t = document.createElement("input");
    t.setAttribute('type', "number");
    t.setAttribute('class', "form-control ajuste");
    t.setAttribute('min', "0");
    t.setAttribute('id', "entradaDeTempoDeIO" + parseInt(cont));//
    t.setAttribute('value', "0");
    
    i.appendChild(p);
    i.appendChild(t);
    i2.appendChild(i);

    //

    i = document.createElement("div");
    i.setAttribute('class',"form-group col-sm-5");
    
    p = document.createElement("label");
    p.setAttribute('for', "nsei");
    p.innerHTML = "<br>Tempo";

    t = document.createElement("input");
    t.setAttribute('type', "number");
    t.setAttribute('class', "form-control ajuste");
    t.setAttribute('min', "0");
    t.setAttribute('id', "inputexecute"+parseInt(cont));//
    t.setAttribute('value', "0");

    i.appendChild(p);
    i.appendChild(t);
    i2.appendChild(i);
    i2emeio.appendChild(i2);

    document.getElementById('parametrosBasicos').appendChild(i3);

    i2.appendChild(i);

    //
    //
    
    i = document.createElement("div");
    i.setAttribute('class',"form-group col-sm-5");
    
    p = document.createElement("label");
    p.setAttribute('for', "nsei");
    p.innerHTML = "<br>Deadline";

    t = document.createElement("input");
    t.setAttribute('type', "number");
    t.setAttribute('class', "form-control ajuste");
    t.setAttribute('min', "0");
    t.setAttribute('id', "inputdeadline"+parseInt(cont));//
    t.setAttribute('value', "0");

    i.appendChild(p);
    i.appendChild(t);
    i2.appendChild(i);

    //

    i2emeio.appendChild(i2);

    i2emeio.style.overflowY = "hidden";
    i2emeio.style.overflowX = "hidden";
    i2emeio.style.height = "0px";

    i = document.createElement("div");
    i.setAttribute('class',"form-group processosFluid delete-button");
    i.setAttribute('style',"position: relative;");    

    t = document.createElement("button");
    t.setAttribute('type', "button");
    t.setAttribute('class', "removeButton btn btn-primary");
    t.setAttribute('style', "height: 43px !important; top: 0px; position: absolute;");
    t.setAttribute('onClick', "deleteno("+cont+")");
    t.innerHTML = "X";

    i.appendChild(t);

    document.getElementById('process').appendChild(i3);
    document.getElementById('process').appendChild(i);
    document.getElementById('process').appendChild(i2emeio);

    item = document.createElement('tr');
    item.setAttribute('id', "linha"+cont);
    item.style.border = "solid 5px lightgrey";

    itemCol = document.createElement('td');
    itemCol.setAttribute('width', "76.4px")
    itemCol.setAttribute('align', "center");
    itemCol.innerHTML = 'P'+cont;

    item.appendChild(itemCol);

    atualHeight = document.getElementById('grafico').style.height;
    
    if (atualHeight == "") atualHeight = 200;
    else {    
        atualHeight.replace('px','');
        atualHeight = parseInt(atualHeight);
    }
    
    if(atualHeight <= ((nodes.length+2)*35)){
        atualHeight += 35;
        document.getElementById('grafico').style.height = atualHeight +"px";
    }
    
    document.getElementById('tabela').appendChild(item);
    
    nodes.push(cont);    
}

//--------------------MEMORIA----------------------------------------------------------------------------------------------------------------------------------------------------------------

class Memoria {
	constructor(numeroDePaginas) {
        this.memoriaReal = Array(50).fill(null)
        this.ponteiro = 0
        this.numeroDePaginas = numeroDePaginas
    }

    referencePages(processNumber, tempoPercorrido){}

    putPages(processNumber){}

    PonteiroDeIncremento() {
    	this.ponteiro++
    	if(this.ponteiro == 50){
    		this.ponteiro = 0
    	}
    }   

    hasAllPages(processNumber) {
    	for (var i = processNumber*(this.numeroDePaginas); i < (processNumber+1)*this.numeroDePaginas; i++){
    		if(this.memoriaVirtual[i] == null){
    			return false
    		}
    	}
    	return true
    }
}



class MemoriaFIFO extends Memoria{
    constructor(numeroDePaginas, nProcessos){
        super(numeroDePaginas)
        this.memoriaVirtual = Array(nProcessos*numeroDePaginas).fill(null)
        this.fifoQueue = []
    }



    putPages(processNumber, currentNumber){
    	for (var i = (processNumber)*(this.numeroDePaginas); i < (processNumber+1)*this.numeroDePaginas; i++){
            if(this.memoriaVirtual[i] == null){
                this.fifoQueue.push(i)
                if(this.memoriaReal[this.ponteiro] == null){
                    this.memoriaVirtual[i] = this.ponteiro
                    this.memoriaVirtual[ this.memoriaReal[this.ponteiro] ] = null
                    this.memoriaReal[this.ponteiro] = i
                    this.PonteiroDeIncremento()
                }
                else{
                    let aux = []
                    while(parseInt(this.fifoQueue[0]/this.numeroDePaginas) == currentNumber || 
                         parseInt(this.fifoQueue[0]/this.numeroDePaginas) == processNumber){
                        aux.push(this.fifoQueue[0])
                        this.fifoQueue.splice(0, 1)
                    }
                    let victmPage = this.fifoQueue[0]
                    let frame = this.memoriaVirtual[victmPage]
                    this.memoriaVirtual[victmPage] = null
                    this.memoriaVirtual[i] = frame
                    this.memoriaReal[frame] = i
                    this.fifoQueue.splice(0,1)
                    this.fifoQueue = aux.concat(this.fifoQueue)
                }
    		}            
    	}  	
    }

}

class MemoriaMRU extends Memoria{
	constructor(numeroDePaginas, nProcessos){
		super(numeroDePaginas)
        this.memoriaVirtual = Array(nProcessos*this.numeroDePaginas).fill(null)
        this.referenceCount = Array(nProcessos*this.numeroDePaginas).fill(0)
	}

    referencePages(processNumber, tempoPercorrido){
        let firstPage = (processNumber) * (this.numeroDePaginas)
        for(var i=0; i < this.numeroDePaginas; i++){
            this.referenceCount[parseInt(firstPage)+parseInt(i)] = tempoPercorrido;
        }
    }

    findMinCount(processNumber, currentNumber) {
        let min = Infinity
        let chosen = null
        for(var i=0; i < this.memoriaReal.length; i++) {            
            let owner = parseInt(this.memoriaReal[i]/this.numeroDePaginas)
            let refCount = this.referenceCount[this.memoriaReal[i]]
            if(owner != processNumber && owner != currentNumber && refCount < min) {
                min = this.referenceCount[this.memoriaReal[i]]
                chosen = this.memoriaReal[i]
            }
        }
        return chosen
    }

    putPages(processNumber, currentNumber) {
        let firstPage = (processNumber)*this.numeroDePaginas

        for (var i = 0; i < this.numeroDePaginas; i++) {
            let currentPage = parseInt(firstPage)+parseInt(i)

            if(this.memoriaVirtual[currentPage] == null) {
                if(this.memoriaReal[this.ponteiro] == null){
                    // console.log("Botou direto")
                    this.memoriaVirtual[currentPage] = this.ponteiro
                    this.memoriaVirtual[ this.memoriaReal[this.ponteiro] ] = null
                    this.memoriaReal[this.ponteiro] = currentPage
                    this.PonteiroDeIncremento()
                }
                else {
                    let victmPage = this.findMinCount(processNumber, currentNumber)
                    let frame = this.memoriaVirtual[victmPage]
                    this.memoriaVirtual[victmPage] = null
                    this.memoriaVirtual[currentPage] = frame
                    this.memoriaReal[frame] = currentPage
                }
            }
        }
    }
}

//--------------------SIMULACOES----------------------------------------------------------------------------------------------------------------------------------------------------------------

function getMaxExecTime(processos) {
    maxExec = processos[0].execTime
    for(var i in processos) {
        if(processos[i].execTime > maxExec) {
            maxExec = processos[i].execTime
        }
    }
    return maxExec
}

class NormalQueue {
    constructor(){
        this.arr = []
        this.length = 0
    }
    queue(a) {
        if(a != null) {
            this.arr.push(a)
            this.length++
        }        
    }
    dequeue() {
        if(this.arr.length > 0) {
            this.length--
            return this.arr.shift()
        }
    }
    seek(){
        return this.arr[0]
    }
}

class Simulacao {
    constructor(processos, memoryAlgorithm, tempoDeIO, quantum, sobrecarga) {
        this.processos = processos
        this.memoria = memoryAlgorithm
        this.tempoDeIO = tempoDeIO
        this.tempoDeIOUsado = this.tempoDeIO
        this.current = null
        this.tempoPercorrido = 0
        this.count = processos.length
        this.ioQueue = new NormalQueue()
        this.quantum = quantum
        this.sobrecarga = sobrecarga
        this.usedOverload = sobrecarga
        this.usedQuantum = quantum
        this.preemption = false
        this.increment = (1/(processos.length+1))
    }

    simulate() {
        var matrix = []
        let turn = 0
        while(true) {
            var x = this.simularTempo()
            if(x == null) break;
            matrix.push(x.column)
            turn = x.ta
        }
        console.log("TurnAround Médio = "+turn)
        return matrix
    }

    simularTempo() {
        this.checkArrived()
        this.atualizarInformacoesdeInicializacao()

        let turnAround = 0
        let count = 0
        for(var i=0; i < this.processos.length; i++){
            if(this.tempoPercorrido >= this.processos[i].arriveTime) {
                turnAround = parseInt(turnAround) + parseInt(this.processos[i].totalTime)
                count++;
            }
        }
        if(count != 0) {
            turnAround = turnAround/count
        }
        
        if(this.count <= 0) return null

        if(this.usedOverload <= 0 && this.usedQuantum <= 0) {
            this.preemption = false
        }
        if(this.usedQuantum <= 0) {
            this.preemption = true
        }

        if(this.tempoDeIOUsado <= 0) {
            this.tempoDeIOUsado = this.tempoDeIO
            let x = this.ioQueue.dequeue()
            x.inIOqueue = false
            if(x != null) {
                x.inIO = false
                if(this.current != null && this.preemption == false) {
                    this.memoria.putPages(x.id, this.current.id)
                }
                else{
                    this.memoria.putPages(x.id, -1)
                }
                
                this.readyQueue.queue(x)
            }      
        }            

        // Se a preempção anterior terminou
        if(this.usedOverload <= 0 && this.usedQuantum <= 0){
            this.preemption = false
            this.usedOverload = this.sobrecarga
            this.usedQuantum = this.quantum
            if(this.current != null){
                this.readyQueue.queue(this.current)
            }            
            this.current = null
        }

        // Se começou a preempçao agora
        if(this.usedQuantum <= 0){
            this.preemption = true
            this.usedOverload--
        }
       

        // Executa se nao for preempção
        if(this.preemption == false){
            if(this.current == null){
                let auxCount = 0;
                while(this.readyQueue.length != 0){
                    var x = this.readyQueue.dequeue()
                    this.memoria.referencePages(x.id, this.tempoPercorrido+auxCount)
                    if(this.memoria.hasAllPages(x.id)){
                        this.current = x
                        break
                    }
                    else{
                        this.ioQueue.queue(x)
                        x.inIOqueue=true
                        auxCount += this.increment
                    }
                }
            }
            if(this.current != null){                
                this.current.execTime--
            }
        }

        // Seta o topo da fila de IO como IO
        if(this.ioQueue.length != 0){
            this.tempoDeIOUsado--
            this.ioQueue.seek().inIO = true
        }

        let currentColumn = this.createColumn(this.preemption, this.current)

        if(this.current != null && this.current.execTime == 0){            
            this.usedQuantum = this.quantum
            this.current.exists = false
            this.current = null
            this.count--
        }
        
        if (this.current != null && this.preemption == false && this.current.inIO == false){
            this.usedQuantum--
        }


        // Finaliza
        this.tempoPercorrido++
        let IOQueue = this.ioQueue.arr
        let EXEQueue = this.readyQueue.arr;

        return {column:currentColumn, rm:this.memoria.memoriaReal, vm:this.memoria.memoriaVirtual, ta:turnAround, io:IOQueue, exec:EXEQueue}
    }

    checkArrived() {
        for(var i in this.processos) {
            
            if(this.processos[i].arriveTime == this.tempoPercorrido) {
                if(this.processos[i].execTime == 0){
                    this.count--
                    break;
                }
                this.processos[i].exists = true
                this.readyQueue.queue(this.processos[i])
            }
        }
    }

    atualizarInformacoesdeInicializacao() {
        for(var i in this.processos){
            if(this.processos[i].exists) {
                this.processos[i].totalTime++
            }
        }
    }

    createColumn(isPreemption, current) {
        var column = []
        var value
        for(var i in this.processos) {
            if(this.current == this.processos[i]) {
                if(isPreemption == true) {
                    value = "X"
                }
                else{
                    if(this.current.deadline < 0) {
                        value = "L"
                    }
                    else{
                        value = "E"
                    }
                }                
            }
            else if (this.processos[i].exists) {
                value = "-"
            }
            else{
                value = " "
            }
            
            if(this.processos[i].exists ) {
                if(this.processos[i].inIOqueue)
                    value = "Q"
                if(this.processos[i].inIO)
                    value = "D"
            }


            column.push(value)
        }
        return column
    }

    
}

class SimulacaoFIFO extends Simulacao {

    constructor(processos, memoryAlgorithm, tempoDeIO, quantum, sobrecarga) {
        super(processos, memoryAlgorithm, tempoDeIO, quantum, sobrecarga)
        this.readyQueue = new NormalQueue() 
        this.quantum = getMaxExecTime(processos) + 1
        this.usedQuantum = this.quantum
        this.sobrecarga = 0       
    }
}

class PrioQueue{
    constructor(compFunc){
        this.arr = []
        this.length = 0
        this.compFunc = compFunc
    }
    queue(a){
        if(a != null){
            for(var i=0; i < this.arr.length; i++) {
                if(this.compFunc(a,this.arr[i]) < 0){
                    this.arr.splice(i, 0, a);
                    this.length++
                    return;
                }
            }
            this.arr.push(a)
            this.length++
        }
    }
    dequeue(){
        if(this.arr.length > 0) {
            this.length--
            return this.arr.shift()
        }
    }
    seek(){
        return this.arr[0]
    }
}

class SimulacaoSJF extends Simulacao{
    constructor(processos, memoryAlgorithm, tempoDeIO, quantum, sobrecarga){
        super(processos, memoryAlgorithm, tempoDeIO)

        this.compareFunc = function(a,b)
        {
           if(a.execTime != b.execTime){
               return a.execTime - b.execTime
           }
           else if(a.arriveTime != b.arriveTime){
               return a.arriveTime - b.arriveTime
           }
           else{
                return a.id - b.id
           }
        }
        this.readyQueue = new PrioQueue(this.compareFunc)
        this.quantum = quantum = getMaxExecTime(processos) + 1
        this.usedQuantum = this.quantum
        this.sobrecarga = 0 
    }
} 

class SimulacaoROUND extends Simulacao{
    constructor(processos, memoryAlgorithm, tempoDeIO, quantum, sobrecarga){
        super(processos, memoryAlgorithm, tempoDeIO, quantum, sobrecarga)
        this.readyQueue = new NormalQueue()
    }
}

class SimulacaoEDF extends Simulacao{
    constructor(processos, memoryAlgorithm, tempoDeIO, quantum, sobrecarga){
        super(processos, memoryAlgorithm, tempoDeIO, quantum, sobrecarga)
        this.compareFunc = function(a,b)
        {
            return a.deadline - b.deadline
        }
        this.readyQueue = new PrioQueue(this.compareFunc)
    }

    atualizarInformacoesdeInicializacao(){
        super.atualizarInformacoesdeInicializacao()
        for(var i in this.processos){
            if(this.processos[i].exists){                
                this.processos[i].deadline -= 1;
            }
        }
    }
}