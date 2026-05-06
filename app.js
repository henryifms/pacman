const app = document.querySelector("#root");

const tabuleiro =  [
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 2, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2],
    [1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1],
    [0, 0, 0, 0, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 0, 0, 0, 0],
    [0, 0, 0, 0, 1, 2, 1, 2, 2, 2, 2, 2, 2, 2, 1, 2, 1, 0, 0, 0, 0],
    [1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1, 2, 2, 2, 1, 1, 1, 1, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1],
    [1, 1, 2, 2, 1, 2, 1, 2, 1, 1, 1, 1, 1, 2, 1, 2, 1, 2, 2, 1, 1],
    [1, 2, 2, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 1, 2, 2, 2, 2, 2, 1],
    [1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1, 2, 1, 1, 1, 1, 1, 1, 1, 2, 1],
    [1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1],
    [1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
];

const TAMANHO_TILE = 20;
const elementosOtimizados = {
    paredes: [],
    spawns: [],
    frutas: []
};

// Matriz para marcar células já processadas
let visitado = [];

function iniciar() {
    gerarTabuleiro();
    desenharElementos();
    console.log('Paredes otimizadas:', elementosOtimizados.paredes);
    console.log('Spawns otimizados:', elementosOtimizados.spawns);
    console.log('Frutas:', elementosOtimizados.frutas);
}

function gerarTabuleiro() {
    const table = document.createElement("table");
    table.id = "game-board";
    
    // Criar todas as células da tabela
    for (let i = 0; i < tabuleiro.length; i++) {
        const tr = document.createElement("tr");
        
        for (let j = 0; j < tabuleiro[i].length; j++) {
            const td = document.createElement("td");
            td.classList.add("cell");
            
            switch (tabuleiro[i][j]) {
                case 0:
                    td.classList.add("livre");
                    break;
                case 1:
                    td.classList.add("parede");
                    break;
                case 3:
                    td.classList.add("spawn");
                    break;
            }
            
            tr.appendChild(td);
        }
        
        table.appendChild(tr);
    }
    
    app.appendChild(table);
    otimizarElementos2D();
}

function otimizarElementos2D() {
    visitado = Array(tabuleiro.length).fill().map(() => Array(tabuleiro[0].length).fill(false));
    
    for (let i = 0; i < tabuleiro.length; i++) {
        for (let j = 0; j < tabuleiro[i].length; j++) {
            if (tabuleiro[i][j] === 1 && !visitado[i][j]) {
                const retangulo = encontrarRetangulo(i, j, 1);
                elementosOtimizados.paredes.push(retangulo);
                marcarVisitados(retangulo, 1);
            }
        }
    }
    
    visitado = Array(tabuleiro.length).fill().map(() => Array(tabuleiro[0].length).fill(false));
    
    for (let i = 0; i < tabuleiro.length; i++) {
        for (let j = 0; j < tabuleiro[i].length; j++) {
            if (tabuleiro[i][j] === 3 && !visitado[i][j]) {
                const retangulo = encontrarRetangulo(i, j, 3);
                elementosOtimizados.spawns.push(retangulo);
                marcarVisitados(retangulo, 3);
            }
        }
    }
    
    for (let i = 0; i < tabuleiro.length; i++) {
        for (let j = 0; j < tabuleiro[i].length; j++) {
            if (tabuleiro[i][j] === 2) {
                elementosOtimizados.frutas.push({
                    linha: i,
                    coluna: j,
                    posX: j * TAMANHO_TILE,
                    posY: i * TAMANHO_TILE,
                    largura: TAMANHO_TILE,
                    altura: TAMANHO_TILE
                });
            }
        }
    }
}

function encontrarRetangulo(startI, startJ, valor) {
    let maxLargura = tabuleiro[0].length;
    let maxAltura = tabuleiro.length;
    
    let largura = 0;
    for (let j = startJ; j < tabuleiro[startI].length; j++) {
        if (tabuleiro[startI][j] === valor && !visitado[startI][j]) {
            largura++;
        } else {
            break;
        }
    }
    
    let altura = 0;
    for (let i = startI; i < tabuleiro.length; i++) {
        let linhaValida = true;
        for (let j = startJ; j < startJ + largura; j++) {
            if (i >= tabuleiro.length || j >= tabuleiro[i].length || 
                tabuleiro[i][j] !== valor || visitado[i][j]) {
                linhaValida = false;
                break;
            }
        }
        
        if (linhaValida) {
            altura++;
        } else {
            break;
        }
    }
    
    let larguraFinal = largura;
    for (let w = largura; w < maxLargura - startJ; w++) {
        let podeExpandir = true;
        
        for (let i = startI; i < startI + altura; i++) {
            if (startJ + w >= tabuleiro[i].length || 
                tabuleiro[i][startJ + w] !== valor || 
                visitado[i][startJ + w]) {
                podeExpandir = false;
                break;
            }
        }
        
        if (podeExpandir) {
            larguraFinal = w + 1;
        } else {
            break;
        }
    }
    
    // Tentar expandir altura com a nova largura
    let alturaFinal = altura;
    for (let h = altura; h < maxAltura - startI; h++) {
        let podeExpandir = true;
        
        for (let j = startJ; j < startJ + larguraFinal; j++) {
            if (startI + h >= tabuleiro.length || 
                tabuleiro[startI + h][j] !== valor || 
                visitado[startI + h][j]) {
                podeExpandir = false;
                break;
            }
        }
        
        if (podeExpandir) {
            alturaFinal = h + 1;
        } else {
            break;
        }
    }
    
    return {
        linhaInicio: startI,
        colunaInicio: startJ,
        linhaFim: startI + alturaFinal - 1,
        colunaFim: startJ + larguraFinal - 1,
        posX: startJ * TAMANHO_TILE,
        posY: startI * TAMANHO_TILE,
        largura: larguraFinal * TAMANHO_TILE,
        altura: alturaFinal * TAMANHO_TILE
    };
}

function marcarVisitados(retangulo, valor) {
    for (let i = retangulo.linhaInicio; i <= retangulo.linhaFim; i++) {
        for (let j = retangulo.colunaInicio; j <= retangulo.colunaFim; j++) {
            if (tabuleiro[i][j] === valor) {
                visitado[i][j] = true;
            }
        }
    }
}

function desenharElementos() {
    const gameBoard = document.querySelector('#game-board');
    const container = gameBoard.parentElement;
    container.style.position = 'relative';
    gameBoard.style.position = 'relative';
    
    const cells = document.querySelectorAll('.cell');
    cells.forEach(cell => {
        if (cell.classList.contains('parede') || cell.classList.contains('spawn')) {
            cell.style.backgroundColor = 'transparent';
            cell.style.border = 'none';
        }
    });
    
    // Desenhar paredes otimizadas
    elementosOtimizados.paredes.forEach(parede => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${parede.posX}px`;
        div.style.top = `${parede.posY}px`;
        div.style.width = `${parede.largura}px`;
        div.style.height = `${parede.altura}px`;
        div.style.backgroundColor = 'black';
        div.style.border = '1px solid blue';
        div.classList.add('parede-otimizada');
        
        gameBoard.appendChild(div);
    });
    
    // Desenhar spawns otimizados
    elementosOtimizados.spawns.forEach(spawn => {
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.left = `${spawn.posX}px`;
        div.style.top = `${spawn.posY}px`;
        div.style.width = `${spawn.largura}px`;
        div.style.height = `${spawn.altura}px`;
        div.style.backgroundColor = 'gray';
        div.classList.add('spawn-otimizado');
        
        gameBoard.appendChild(div);
    });
}

iniciar();
