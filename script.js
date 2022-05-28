//--------------------VARIAVEIS----------------------------------------------------------------------------------------------------------------------------------------------------------------

//--------------------INTEIROS (INT)--------------------//
var contador = 0;

let a = 0;
let b = 0;

var numCoisa = 0;

//--------------------VETORES--------------------//
var nos = [];

//--------------------BOOLEAN--------------------//
var pause = false;
var criado = false;

var primeiraVez = false; // ( ͡° ͜ʖ ͡°) //

var funcionando = false;

//--------------------OUTRAS--------------------//
var matriz;
var tipoDeMemoria;
var simulacao;
var virar;

var ID;

//--------------------SCRIPTS BASICOS----------------------------------------------------------------------------------------------------------------------------------------------------------------
function informacoesDoProcesso(nos, algoritimos) {
    quantum = document.getElementById("entradaDeQuantum").value

    sobrecarga = document.getElementById("entradaDeSobrecarga").value

    numeroDePaginas = document.getElementById("entradaDeQuantidadeDePaginas").value

    tempoDeIO = document.getElementById("entradaDeTempoDeIO").value

    tipoDeMemoria = document.getElementById('entradaSubstituicaoDePaginas').value

    processos = []

    for(var i in nos) {
        processos.push({
            idNome:parseInt(nos[i]),
            id:parseInt(i),
            tempoDeArquivo:document.getElementById("entradaDeTempoDeIO" + nos[i]).value, 
            tempoDeExecucao:document.getElementById("entradaDeTempoDeExecucao" + nos[i]).value, 
            deadline:document.getElementById("entradaDeDeadline" + nos[i]).value, 
            priority:document.getElementById("entradaDePrioridade" + nos[i]).value,
            totalTime:0,
            noIO:false,
            naFilaDeTempoDeIO:false,
            exists:false
        });
    }
    if(tipoDeMemoria == "FIFO") {
        memoria = new MemoriaFIFO(numeroDePaginas, processos.length)
    }
    if(tipoDeMemoria == "MRU") {
        memoria = new MemoriaMRU(numeroDePaginas, processos.length)
    }

    if(algoritimos == "FIFO") {
        simulacao = new SimulacaoFIFO(processos, memoria, tempoDeIO, quantum, sobrecarga)
    }  
    if(algoritimos == "SJF") {
        simulacao = new SimulacaoSJF(processos, memoria, tempoDeIO, quantum, sobrecarga)
    }
    if(algoritimos == "ROUND") {
        simulacao = new SimulacaoROUND(processos, memoria, tempoDeIO, quantum, sobrecarga)
    }
    if(algoritimos == "EDF") {
        simulacao = new SimulacaoEDF(processos, memoria, tempoDeIO, quantum, sobrecarga)
    } 
}
function pausarSimulacao() {
    pause = true;    
    $('#botaoPausar').attr("disabled" , true);
    $('#botaoLimpar').attr("disabled", false);
    $('#iniciarSimulacaoFIFO').attr("disabled", false);
    $('#iniciarSimulacaoSJF').attr("disabled", false);
    $('#iniciarSimulacaoROUND').attr("disabled", false);
    $('#iniciarSimulacaoEDF').attr("disabled", false);
}
function excluir(id) {
    x = nos.indexOf(id); 
    aux = document.getElementsByClassName("grupoDoFormulario execucaoFluid removivel")[x];
    document.getElementById("processoss").removeChild(aux);
    aux = document.getElementsByClassName("grupoDoFormulario ProcessosFluid botaoExcluir")[x];
    document.getElementById("processoss").removeChild(aux); 
    aux = document.getElementsByClassName("intdiv")[x];
    document.getElementById("processoss").removeChild(aux);  
    aux = document.getElementById("linha"+id);
    document.getElementById('tabela').removeChild(aux);
    graf = document.getElementById('grafico').style.height;
    graf.replace("px", '');
    graf = parseInt(graf);
    if(graf>200) {
        graf-=30;
        document.getElementById('grafico').style.height = graf + "px";
    }  
    nos.splice(x, 1);
}
function moatrar(id) {
    x = nos.indexOf(id); 
    aux = document.getElementsByClassName("intdiv")[x];
    var height;
    var id;
    if(aux.style.height == "0px") {
        height = 0;
        id = setInterval(quadro, 5);
        function quadro() {
            if (height == 210) {
                limparIntervalo(id);
            } else {
                height+=5; 
                aux.style.height = height + 'px'; 
                aux.style.height = height + 'px'; 
            }
        }
    }
    else {
        height = 210;
        id = setInterval(quadro, 5);
        function quadro() {
            if (height == 0) {
                limparIntervalo(id);
            } else {
                height-=5; 
                aux.style.height = height + 'px'; 
                aux.style.height = height + 'px'; 
            }
        }
    }    
}
function quadro() {
    if(!pause) {
        informacoes = simulacao.simularTempo();
        funcionando = true;
    }     
    else {
        limparIntervalo(ID);
        funcionando = false;
    }
    if(informacoes == null) {
        pause = true;
        limparIntervalo(ID);
        document.getElementById('iniciarSimulacao').setAttribute('disabled',"true");
        document.getElementById('botaoPausar').setAttribute('disabled',"true");
        $('#botaoLimpar').attr("disabled", false);
    }
    if(!pause) {
        numTime = document.createElement('td');
        numTime.setAttribute('class',"square");
        numTime.innerHTML = numCoisa;
        numTime.setAttribute('align', "center");
        document.getElementById('nomes-tabela').appendChild(numTime);
        numCoisa++;        
        excluirFilaDeProcessos();
        for (b ; b < informacoes.coluna.length; b++) {
            if(pause)
                break; 
            atualTr = document.getElementById("linha" + nos[b]);
            newCol = document.createElement('td');
            newCol.setAttribute('class',"square");
            newCol.style.height = "30px";
            newCol.style.width = "30px";
            newCol.style.border = "solid 5px lightgrey";

            if(informacoes.coluna[b]=='D') {
                newCol.style.backgroundColor = "gray";
                
                spanIO = document.createElement('span');
                spanIO.style.backgroundColor = "gray";
                spanIO.setAttribute('class',"processo-principal");
                
                spanIO.innerHTML = $(atualTr).first()[0].innerHTML;
                document.getElementById('IODoProcess').appendChild(spanIO);

            }
            if(informacoes.coluna[b]=='E') {
                newCol.style.backgroundColor = "rgb(64, 224, 32)";

                spanEXEC = document.createElement('span');
                spanEXEC.style.backgroundColor = "rgb(64, 224, 32)";
                spanEXEC.setAttribute('class',"processo-principal");
                
                spanEXEC.innerHTML = $(atualTr).first()[0].innerHTML;
                document.getElementById('processoExecutando').appendChild(spanEXEC);
            }
            if(informacoes.coluna[b]=='L') {
                newCol.style.backgroundColor = "rgb(132, 201, 116)";

                spanEXEC = document.createElement('span');
                spanEXEC.style.backgroundColor = "rgb(64, 224, 32)";
                spanEXEC.setAttribute('class',"processo-principal");
                
                spanEXEC.innerHTML = $(atualTr).first()[0].innerHTML;
                document.getElementById('processoExecutando').appendChild(spanEXEC);
            }
            if(informacoes.coluna[b]=='X')
                newCol.style.backgroundColor = "rgb(198, 73, 73)";
            if(informacoes.coluna[b]=='-')
                newCol.style.backgroundColor = "rgb(252, 241, 67)";
            if(informacoes.coluna[b]=='Q')
                newCol.style.backgroundColor = "lightgray";  

            atualTr.appendChild(newCol);       
            var maxScrollLeft = document.getElementById('grafico').scrollWidth - document.getElementById('grafico').clientWidth;
            $('#grafico').scrollLeft(maxScrollLeft);
            document.getElementById('turnaround').innerHTML = "Turnaround médio = " + informacoes.ta;
        }
        for(let x=0; x < informacoes.vm.length; x++) {
            let celula = document.getElementById('celula'+x);
            let spanDentroDaCelula = document.getElementById('span'+x);
            if(informacoes.vm[x]==null) {                
                if(spanDentroDaCelula.innerHTML != '-') {
                    celula.style.backgroundColor = 'gray'
                    celula.style.color = 'white'
                }
                else {
                    celula.style.backgroundColor = 'transparent'
                    celula.style.color = 'black' 
                }
                spanDentroDaCelula.innerHTML = '-';
            }    
            else {
                spanDentroDaCelula.innerHTML = informacoes.vm[x];
            }            
        }
        for(let x=0; x < informacoes.rm.length; x++) {
            if(informacoes.rm[x]==null) {
                document.getElementById("real"+(x)).innerHTML = '-';
            }
            else {
                document.getElementById("real"+(x)).innerHTML = informacoes.rm[x];
            }
        }
        virar = informacoes.ta;  
        for(let i in informacoes.exec) {
            filaDeExecucaoDeTd = document.createElement('td');
            filaDeExecucaoDeTd.setAttribute('class', "secundarios")
            filaDeExecucaoDeSpam = document.createElement('span');
            filaDeExecucaoDeSpam.setAttribute('class',"processo-coad");
            filaDeExecucaoDeSpam.style.backgroundColor = "rgb(221, 207, 42)";
            filaDeExecucaoDeSpam.innerHTML = "P" + informacoes.exec[i].idNome;
            filaDeExecucaoDeTd.appendChild(filaDeExecucaoDeSpam);
            document.getElementById('listaDeExecucao').appendChild(filaDeExecucaoDeTd);
        }
        for(let i = 1; i < informacoes.io.length; i++) {
            filaDeExecucaoDeTd = document.createElement('td');
            filaDeExecucaoDeTd.setAttribute('class', "secundarios")
            filaDeExecucaoDeSpam = document.createElement('span');
            filaDeExecucaoDeSpam.setAttribute('class',"processo-coad");
            filaDeExecucaoDeSpam.style.backgroundColor = "lightgray";
            filaDeExecucaoDeSpam.innerHTML = "P" + informacoes.io[i].idNome;

            filaDeExecucaoDeTd.appendChild(filaDeExecucaoDeSpam);
            document.getElementById('listaDeIO').appendChild(filaDeExecucaoDeTd);
        }
    }      
    b = 0;   
}
function VelocidadeDeExecucao() {
    if(funcionando) {
        limparIntervalo(ID);
        ID = setInterval(quadro,  1000 - document.getElementById('velocidadeExecucao').value);
    }     
}
function excluirFilaDeProcessos() {
    let trIO = document.getElementById('listaDeIO');
    let trEXE = document.getElementById('listaDeExecucao');

    let tdIO = document.getElementById('IODoProcess');
    let tdEXE = document.getElementById('processoExecutando');
    if(tdIO.childNodes.length > 0) {
        tdIO.removeChild(tdIO.childNodes[0]);
    }
    if(tdEXE.childNodes.length > 0) {
        tdEXE.removeChild(tdEXE.childNodes[0]);
    }
    $('.secundarios').remove()
}
function iniciarASimulacao(algoritimos) {    
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
        informacoesDoProcesso(nos, algoritimos);
        primeiraVez = true;
    } 
    quadro();
    document.getElementById('botaoInserirProcesso').setAttribute('disabled', "true");
    ID = setInterval(quadro, 1000 - document.getElementById('velocidadeExecucao').value);
}
function limparDados() {
    pause = true;
    $('.square').remove();
    $('.removeButton').css("display" , "block");
    $('body :input').attr("disabled" , false);
    $('#botaoPausar').attr("disabled", true);
    $('#botaoLimpar').attr("disabled", true);
    $('#iniciarSimulacao').attr("disabled", false);
    $('.incrementoDeMemoriaVirtual').remove();
    $('.substituirMemoria').html('-');
    $('#turnaround').html('Tunraround médio = ...');
    excluirFilaDeProcessos();
    primeiraVez = false;
    criado = false;
    a = 0;
    b = 0;
    numCoisa = 0;
}
function inserirProcesso() {
    var i3 = document.createElement("div");
    i3.setAttribute('class', "grupoDoFormulario execucaoFluid removivel");
    i3.setAttribute('style',"margin-bottom: 0px;");
    if(nos.length == 0) {
        contador = 1;
    }
    else {
        min = 0;
        for (let i = 0; i < nos.length; i++) {
           if(nos[i]>=min) min = nos[i];
        }
        contador = min + 1;
    }
    var botao = document.createElement("input");
    botao.setAttribute('value', "Processo " + contador);
    botao.setAttribute('type', "button");
    botao.setAttribute('onClick', "moatrar(" + contador +")");
    botao.setAttribute('style', "opacity: 0;");
    botao.setAttribute('class', "coluna12 button-process");
    i3.appendChild(botao);
    
    var opacity = 0;
    var idOpa = setInterval(quadro, 30);
    function quadro() {
        if (botao.style.opacity == "1") {
            limparIntervalo(idOpa);
        } 
        else {
            opacity += 0.1; 
            botao.style.opacity = opacity;
        }
    }

    var i2emeio = document.createElement("div");
    i2emeio.setAttribute('class', "intdiv");
    i2emeio.setAttribute('style',"margin: -10px 0px 10px 5px;");
    var i2 = document.createElement("div");
    i2.setAttribute('class', "linhaDoFormulario");

    //----------Tempo de chegada------------------------------------------------------------------------------
    var i = document.createElement("div");
    i.setAttribute('class',"grupoDoFormulario coluna5");
    var p = document.createElement("label");
    p.setAttribute('for', "nsei");
    p.innerHTML = "<br>Tempo de chegada";
    var t = document.createElement("input");
    t.setAttribute('type', "number");
    t.setAttribute('class', "controleDeFormulario ajuste");
    t.setAttribute('min', "0");
    t.setAttribute('id', "entradaDeTempoDeIO" + parseInt(contador));
    t.setAttribute('value', "0");
    i.appendChild(p);
    i.appendChild(t);
    i2.appendChild(i);

    //----------Tempo de execução----------------------------------------------------------------------------------------
    i = document.createElement("div");
    i.setAttribute('class',"grupoDoFormulario coluna5");
    p = document.createElement("label");
    p.setAttribute('for', "nsei");
    p.innerHTML = "<br>Tempo de execução";
    t = document.createElement("input");
    t.setAttribute('type', "number");
    t.setAttribute('class', "controleDeFormulario ajuste");
    t.setAttribute('min', "0");
    t.setAttribute('id', "entradaDeTempoDeExecucao" + parseInt(contador));
    t.setAttribute('value', "0");
    i.appendChild(p);
    i.appendChild(t);
    i2.appendChild(i);
    i2emeio.appendChild(i2);
    document.getElementById('parametrosBasicos').appendChild(i3);
    i2.appendChild(i);
    i2emeio.appendChild(i2);
    i2 = document.createElement("div");
    i2.setAttribute('class', "linhaDoFormulario");

    //----------Deadline----------------------------------------------------------------------------------------
    i = document.createElement("div");
    i.setAttribute('class',"grupoDoFormularioroup coluna5");
    p = document.createElement("label");
    p.setAttribute('for', "nsei");
    p.innerHTML = "<br>Deadline";
    t = document.createElement("input");
    t.setAttribute('type', "number");
    t.setAttribute('class', "controleDeFormulario ajuste");
    t.setAttribute('min', "0");
    t.setAttribute('id', "entradaDeDeadline" + parseInt(contador));
    t.setAttribute('value', "0");
    i.appendChild(p);
    i.appendChild(t);
    i2.appendChild(i);
    
    //----------Prioridade-------------------------------------------------------------------------------------
    i = document.createElement("div");
    i.setAttribute('class',"grupoDoFormulario coluna5");
    p = document.createElement("label");
    p.setAttribute('for', "nsei");
    p.innerHTML = "<br>Prioridade";
    t = document.createElement("input");
    t.setAttribute('type', "number");
    t.setAttribute('class', "controleDeFormulario ajuste");
    t.setAttribute('id', "entradaDePrioridade" + parseInt(contador));
    t.setAttribute('value', "0");
    i.appendChild(p);
    i.appendChild(t);
    i2.appendChild(i);
    i2emeio.appendChild(i2);
    i2emeio.style.overflowY = "hidden";
    i2emeio.style.overflowX = "hidden";
    i2emeio.style.height = "0px";
    i = document.createElement("div");
    i.setAttribute('class',"grupoDoFormulario processosFluid botaoExcluir");
    i.setAttribute('style',"position: relative;");    
    t = document.createElement("button");
    t.setAttribute('type', "button");
    t.setAttribute('class', "removeButton btn btn-primary");
    t.setAttribute('style', "height: 43px !important; top: 0px; position: absolute;");
    t.setAttribute('onClick', "excluir(" + contador + ")");
    t.innerHTML = "X";
    i.appendChild(t);
    document.getElementById('process').appendChild(i3);
    document.getElementById('process').appendChild(i);
    document.getElementById('process').appendChild(i2emeio);
    item = document.createElement('tr');
    item.setAttribute('id', "linha" + contador);
    item.style.border = "solid 5px lightgrey";
    itemCol = document.createElement('td');
    itemCol.setAttribute('width', "80px")
    itemCol.setAttribute('align', "center");
    itemCol.innerHTML = 'P' + contador;
    item.appendChild(itemCol);

    atualHeight = document.getElementById('grafico').style.height;
    
    if (atualHeight == "") atualHeight = 200;
    else {    
        atualHeight.replace('px','');
        atualHeight = parseInt(atualHeight);
    }
    
    if(atualHeight <= ((nos.length+2) * 35)) {
        atualHeight += 35;
        document.getElementById('grafico').style.height = atualHeight + "px";
    }
    
    document.getElementById('tabela').appendChild(item);
    
    nos.push(contador);    
}

//--------------------CRIADORES----------------------------------------------------------------------------------------------------------------------------------------------------------------
function CriarTabelaDeMemoriaVirtual(paginas) {
    for (let i = 0; i < (nos.length); i++) {
        tr = document.createElement('tr');
        tr.setAttribute('class',"incrementoDeMemoriaVirtual");
        tr.setAttribute('align',"center");
        num = document.createElement('td');
        num.innerHTML = "P" + nos[i];
        num.style.fontSize = '15pt';
        tr.appendChild(num);

        for(let j = 0; j<paginas; j++) {
            td=document.createElement('td');
            td.setAttribute('id', "celula"+ ((parseInt(paginas) * parseInt(i)) + parseInt(j) ));
            td.setAttribute('align', "center");
            td.setAttribute('width', "5px");
            span = document.createElement('span');
            td.style.position = 'relative';
            span.style.position = 'absolute';
            span.style.top = '0px';
            span.style.left = '5px';
            span2 = document.createElement('span');
            span2.setAttribute('id', "span"+((parseInt(paginas)*parseInt(i))+parseInt(j) ));
            span2.innerHTML = '-';
            td.style.fontSize = '20pt';
            td.style.minWidth = '50px';
            td.style.maxWidth = '50px';
            span.style.fontSize = '10pt';
            span.innerHTML = i * parseInt(paginas) + j ;
            td.appendChild(span);
            td.appendChild(span2);
            tr.appendChild(td);
        }
        document.getElementById('primeiraLinhaDaMemoriaVirtual').setAttribute('colspan', paginas + 1);
        document.getElementById('memoriaVirtual').appendChild(tr);
    }
}
function criarTabelaDeMemoriaReal() {   
    for (let i = 0; i < 50; i++) {
        td = document.createElement('td');
        td.setAttribute('align', "center");
        td2 = document.createElement('td');
        td2.setAttribute('align', "center");
        td2.setAttribute('class', "substituirMemoria");
        td2.setAttribute('id', "real" + i);
        td.style.fontSize = "10pt";
        td.innerHTML = i;
        td.style.backgroundColor = "lightgrey";
        td2.innerHTML = "-";
        td2.style.fontSize = "20pt";
        td2.style.minWidth = "80px";
        td2.style.maxWidth = "80px";

        document.getElementById('primeiraLinhaDaMemoriaReal').appendChild(td);
        document.getElementById('segundaLinhaDaMemoriaReal').appendChild(td2);
    }
}

//--------------------PEGADORES----------------------------------------------------------------------------------------------------------------------------------------------------------------
function getMaiorTempoDeExecucao(processos) {
    for(var i in processos) {
        if(processos[i].tempoDeExecucao > processos[0].tempoDeExecucao) {
            processos[0].tempoDeExecucao = processos[i].tempoDeExecucao
        }
    }
    return processos[0].tempoDeExecucao
}

//--------------------MEMORIA----------------------------------------------------------------------------------------------------------------------------------------------------------------
class Memoria {
	constructor(numeroDePaginas) {
        this.memoriaReal = Array(50).fill(null)
        this.ponteiro = 0
        this.numeroDePaginas = numeroDePaginas
    }
    referencePages(numeroDoProcesso, tempoPercorrido) {}
    colocarPaginas(numeroDoProcesso) {}
    PonteiroDeIncremento() {
    	this.ponteiro++
    	if(this.ponteiro == 50) {
    		this.ponteiro = 0
    	}
    }   
    temTodasAsPaginas(numeroDoProcesso) {
    	for (var i = numeroDoProcesso * (this.numeroDoProcesso); i < (numeroDoProcesso+1)*this.numeroDePaginas; i++) {
    		if(this.memoriaVirtual[i] == null) {
    			return false
    		}
    	}
    	return true
    }
}

class MemoriaFIFO extends Memoria {
    constructor(numeroDePaginas, numeroDeProcessos) {
        super(numeroDePaginas)
        this.memoriaVirtual = Array(numeroDeProcessos * numeroDePaginas).fill(null)
        this.filaFIFO = []
    }
    colocarPaginas(numeroDoProcesso, numeroAtual) {
    	for (var i = (numeroDoProcesso)*(this.numeroDePaginas); i < (numeroDoProcesso+1)*this.numeroDePaginas; i++) {
            if(this.memoriaVirtual[i] == null) {
                this.filaFIFO.push(i)
                if(this.memoriaReal[this.ponteiro] == null) {
                    this.memoriaVirtual[i] = this.ponteiro
                    this.memoriaVirtual[ this.memoriaReal[this.ponteiro] ] = null
                    this.memoriaReal[this.ponteiro] = i
                    this.PonteiroDeIncremento()
                }
                else {
                    let aux = []
                    while(parseInt(this.filaFIFO[0]/this.numeroDePaginas) == numeroAtual || parseInt(this.filaFIFO[0]/this.numeroDePaginas) == numeroDoProcesso) {
                        aux.push(this.filaFIFO[0])
                        this.filaFIFO.splice(0, 1)
                    }
                    let victmPage = this.filaFIFO[0]
                    let quadro = this.memoriaVirtual[victmPage]
                    this.memoriaVirtual[victmPage] = null
                    this.memoriaVirtual[i] = quadro
                    this.memoriaReal[quadro] = i
                    this.filaFIFO.splice(0, 1)
                    this.filaFIFO = aux.concat(this.filaFIFO)
                }
    		}            
    	}  	
    }

}
class MemoriaMRU extends Memoria {
	constructor(numeroDePaginas, numeroDeProcessos) {
		super(numeroDePaginas)
        this.memoriaVirtual = Array(numeroDeProcessos * this.numeroDePaginas).fill(null)
        this.contadorDeReferencias = Array(numeroDeProcessos * this.numeroDePaginas).fill(0)
	}
    colocarPaginas(numeroDoProcesso, numeroAtual) {
        let primeiraPagina = (numeroDoProcesso)*this.numeroDePaginas

        for (var i = 0; i < this.numeroDePaginas; i++) {
            let paginaAtual = parseInt(primeiraPagina)+parseInt(i)

            if(this.memoriaVirtual[paginaAtual] == null) {
                if(this.memoriaReal[this.ponteiro] == null) {
                    this.memoriaVirtual[paginaAtual] = this.ponteiro
                    this.memoriaVirtual[ this.memoriaReal[this.ponteiro] ] = null
                    this.memoriaReal[this.ponteiro] = paginaAtual
                    this.PonteiroDeIncremento()
                }
                else {
                    let victmPage = this.encontrarContadorMinimo(numeroDoProcesso, numeroAtual)
                    let quadro = this.memoriaVirtual[victmPage]
                    this.memoriaVirtual[victmPage] = null
                    this.memoriaVirtual[paginaAtual] = quadro
                    this.memoriaReal[quadro] = paginaAtual
                }
            }
        }
    }
    encontrarContadorMinimo(numeroDoProcesso, numeroAtual) {
        let min = Infinity
        let escolhido = null
        for(var i = 0; i < this.memoriaReal.length; i++) {            
            let proprietario = parseInt(this.memoriaReal[i]/this.numeroDePaginas)
            let contadorDeReferencia = this.contadorDeReferencias[this.memoriaReal[i]]
            if(proprietario != numeroDoProcesso && proprietario != numeroAtual && contadorDeReferencia < min) {
                min = this.contadorDeReferencias[this.memoriaReal[i]]
                escolhido = this.memoriaReal[i]
            }
        }
        return escolhido
    }
    referencePages(numeroDoProcesso, tempoPercorrido) {
        let primeiraPagina = (numeroDoProcesso) * (this.numeroDePaginas)
        for(var i = 0; i < this.numeroDePaginas; i++) {
            this.contadorDeReferencias[parseInt(primeiraPagina) + parseInt(i)] = tempoPercorrido;
        }
    }
}

//--------------------SIMULACOES----------------------------------------------------------------------------------------------------------------------------------------------------------------
class Simulacao {
    constructor(processos, memoriaDoAlgoritimo, tempoDeIO, quantum, sobrecarga) {
        this.processos = processos
        this.memoria = memoriaDoAlgoritimo
        this.tempoDeIO = tempoDeIO
        this.tempoDeIOUsado = this.tempoDeIO
        this.atual = null
        this.tempoPercorrido = 0
        this.contador = processos.length
        this.filaDeTempoDeIO = new FilaNormal()
        this.quantum = quantum
        this.sobrecarga = sobrecarga
        this.overloadUsado = sobrecarga
        this.usedQuantum = quantum
        this.preemption = false
        this.increment = (1/(processos.length+1))
    }
    simular() {
        var matrix = []
        let turn = 0
        while(true) {
            var x = this.simularTempo()
            if(x == null) {
                break;
            }
            matrix.push(x.coluna)
            turn = x.ta
        }
        console.log("TurnAround Médio = "+turn)
        return matrix
    }

    simularTempo() {
        this.checkArrived()
        this.atualizarInformacoesdeInicializacao()
        let turnAround = 0
        let contador = 0
        for(var i = 0; i < this.processos.length; i++) {
            if(this.tempoPercorrido >= this.processos[i].tempoDeArquivo) {
                turnAround = parseInt(turnAround) + parseInt(this.processos[i].totalTime)
                contador++;
            }
        }
        if(contador != 0) {
            turnAround = turnAround/contador
        }
        if(this.contador <= 0) {
            return null
        }
        if(this.overloadUsado  <= 0 && this.usedQuantum <= 0) {
            this.preemption = false
        }
        if(this.usedQuantum <= 0) {
            this.preemption = true
        }
        if(this.tempoDeIOUsado <= 0) {
            this.tempoDeIOUsado = this.tempoDeIO
            let x = this.filaDeTempoDeIO.desenfileirar()
            x.naFilaDeTempoDeIO = false
            if(x != null) {
                x.noIO = false
                if(this.atual != null && this.preemption == false) {
                    this.memoria.colocarPaginas(x.id, this.atual.id)
                }
                else {
                    this.memoria.colocarPaginas(x.id, -1)
                }
                this.FilaPronta.fila(x)
            }      
        }            
        if(this.overloadUsado <= 0 && this.usedQuantum <= 0) {
            this.preemption = false
            this.overloadUsado = this.sobrecarga
            this.usedQuantum = this.quantum
            if(this.atual != null) {
                this.FilaPronta.fila(this.atual)
            }            
            this.atual = null
        }
        if(this.usedQuantum <= 0) {
            this.preemption = true
            this.overloadUsado--
        }
        if(this.preemption == false) {
            if(this.atual == null) {
                let contadorAuxiliar = 0;
                while(this.FilaPronta.length != 0) {
                    var x = this.FilaPronta.desenfileirar()
                    this.memoria.referencePages(x.id, this.tempoPercorrido + contadorAuxiliar)
                    if(this.memoria.temTodasAsPaginas(x.id) ) {
                        this.atual = x
                        break
                    }
                    else {
                        this.filaDeTempoDeIO.fila(x)
                        x.naFilaDeTempoDeIO = true
                        contadorAuxiliar += this.increment
                    }
                }
            }
            if(this.atual != null) {                
                this.atual.tempoDeExecucao--
            }
        }
        if(this.filaDeTempoDeIO.length != 0) {
            this.tempoDeIOUsado--
            this.filaDeTempoDeIO.procurar().noIO = true
        }
        let colunaAtual = this.criarColuna(this.preemption, this.atual)
        if(this.atual != null && this.atual.tempoDeExecucao == 0) {            
            this.usedQuantum = this.quantum
            this.atual.exists = false
            this.atual = null
            this.contador--
        }
        if (this.atual != null && this.preemption == false && this.atual.noIO == false) {
            this.usedQuantum--
        }
        this.tempoPercorrido++
        let filaDeIO = this.filaDeTempoDeIO.arr
        let filaDeExecucao = this.FilaPronta.arr;
        return {coluna:colunaAtual, rm:this.memoria.memoriaReal, vm:this.memoria.memoriaVirtual, ta:turnAround, io:filaDeIO, exec:filaDeExecucao}
    }
    checkArrived() {
        for(var i in this.processos) {
            if(this.processos[i].tempoDeArquivo == this.tempoPercorrido) {
                if(this.processos[i].tempoDeExecucao == 0) {
                    this.contador--
                    break;
                }
                this.processos[i].exists = true
                this.FilaPronta.fila(this.processos[i])
            }
        }
    }
    atualizarInformacoesdeInicializacao() {
        for(var i in this.processos) {
            if(this.processos[i].exists) {
                this.processos[i].totalTime++
            }
        }
    }
    criarColuna(isPreemption, atual) {
        var coluna = []
        var value
        for(var i in this.processos) {
            if(this.atual == this.processos[i]) {
                if(isPreemption == true) {
                    value = "X"
                }
                else if(this.atual.deadline < 0) {
                    value = "L"
                }
                else {
                    value = "E"
                }              
            }
            else if (this.processos[i].exists) {
                value = "-"
            }
            else {
                value = " "
            }
            if(this.processos[i].exists && this.processos[i].naFilaDeTempoDeIO) {
                value = "Q"
            }
            if(this.processos[i].exists && this.processos[i].noIO) {
                value = "D"
            }
            coluna.push(value)
        }
        return coluna
    }
}
class SimulacaoFIFO extends Simulacao {
    constructor(processos, memoriaDoAlgoritimo, tempoDeIO, quantum, sobrecarga) {
        super(processos, memoriaDoAlgoritimo, tempoDeIO, quantum, sobrecarga)
        this.FilaPronta = new FilaNormal() 
        this.quantum = getMaiorTempoDeExecucao(processos) + 1
        this.usedQuantum = this.quantum
        this.sobrecarga = 0       
    }
}
class SimulacaoSJF extends Simulacao {
    constructor(processos, memoriaDoAlgoritimo, tempoDeIO, quantum, sobrecarga) {
        super(processos, memoriaDoAlgoritimo, tempoDeIO)
        this.compareFunc = function(a, b)
        {
           if(a.tempoDeExecucao != b.tempoDeExecucao) {
               return a.tempoDeExecucao - b.tempoDeExecucao
           }
           else if(a.tempoDeArquivo != b.tempoDeArquivo) {
               return a.tempoDeArquivo - b.tempoDeArquivo
           }
           else {
                return a.id - b.id
           }
        }
        this.FilaPronta = new FilaDePrioridade(this.compareFunc)
        this.quantum = quantum = getMaiorTempoDeExecucao(processos) + 1
        this.usedQuantum = this.quantum
        this.sobrecarga = 0 
    }
} 
class SimulacaoROUND extends Simulacao {
    constructor(processos, memoriaDoAlgoritimo, tempoDeIO, quantum, sobrecarga) {
        super(processos, memoriaDoAlgoritimo, tempoDeIO, quantum, sobrecarga)
        this.FilaPronta = new FilaNormal()
    }
}
class SimulacaoEDF extends Simulacao {
    constructor(processos, memoriaDoAlgoritimo, tempoDeIO, quantum, sobrecarga) {
        super(processos, memoriaDoAlgoritimo, tempoDeIO, quantum, sobrecarga)
        this.compareFunc = function(a,b)
        {
            return a.deadline - b.deadline
        }
        this.FilaPronta = new FilaDePrioridade(this.compareFunc)
    }
    atualizarInformacoesdeInicializacao() {
        super.atualizarInformacoesdeInicializacao()
        for(var i in this.processos) {
            if(this.processos[i].exists) {                
                this.processos[i].deadline -= 1;
            }
        }
    }
}

//--------------------FILAS----------------------------------------------------------------------------------------------------------------------------------------------------------------
class FilaNormal {
    constructor() {
        this.arr = []
        this.length = 0
    }
    desenfileirar() {
        if(this.arr.length > 0) {
            this.length--
            return this.arr.shift()
        }
    }
    fila(a) {
        if(a != null) {
            this.arr.push(a)
            this.length++
        }        
    }
    procurar() {
        return this.arr[0]
    }
}
class FilaDePrioridade {
    constructor(compFunc) {
        this.arr = []
        this.length = 0
        this.compFunc = compFunc
    }
    procurar() {
        return this.arr[0]
    }
    desenfileirar() {
        if(this.arr.length > 0) {
            this.length--
            return this.arr.shift()
        }
    }
    fila(a) {
        if(a != null) {
            for(var i = 0; i < this.arr.length; i++) {
                if(this.compFunc(a,this.arr[i]) < 0) {
                    this.arr.splice(i, 0, a);
                    this.length++
                    return;
                }
            }
            this.arr.push(a)
            this.length++
        }
    }
}