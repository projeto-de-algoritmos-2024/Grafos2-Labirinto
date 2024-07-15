import seedrandom from 'seedrandom';

export class Lab {
    constructor(LARGURA = 39, ALTURA = 19) {
        this.LARGURA = LARGURA;
        this.ALTURA = ALTURA;
        this.rng = seedrandom(this.SEED);
        if (this.LARGURA % 2 !== 1 || this.LARGURA < 3) throw new Error("LARGURA deve ser ímpar e >= 3");
        if (this.ALTURA % 2 !== 1 || this.ALTURA < 3) throw new Error("ALTURA deve ser ímpar e >= 3");
        this.SEED = Math.floor(Math.random() * 1000000) + 1;
        this.randomSeed(this.SEED);

        this.EMPTY = ' ';
        this.MARK = 0;
        this.WALL = String.fromCharCode(9608);
        this.NORTE = 'n';
        this.SUL = 's';
        this.LESTE = 'e';
        this.OESTE = 'w';

        this.labirinto = {};
        for (let x = 0; x < this.LARGURA; x++) {
            for (let y = 0; y < this.ALTURA; y++) {
                this.labirinto[`${x},${y}`] = this.WALL;
            }
        }

        this.hasVisited = [[1, 1]];
        this.visit(1, 1);
    }

    randomSeed(seed) {
        this.rng = seedrandom(seed);
    }

    arrayIncludes(array, [x, y]) {
        return array.some(([a, b]) => a === x && b === y);
    }

    imprimiLab(markX = null, markY = null) {
        for (let y = 0; y < this.ALTURA; y++) {
            let row = '';
            for (let x = 0; x < this.LARGURA; x++) {
                if (markX === x && markY === y) {
                    row += this.MARK;
                } else {
                    row += this.labirinto[`${x},${y}`];
                }
            }
            console.log(row);
        }
    }

    visit(x, y) {
        this.labirinto[`${x},${y}`] = this.EMPTY;

        while (true) {
            let visinhosNaoVisitados = [];
            if (y > 1 && !this.arrayIncludes(this.hasVisited, [x, y - 2])) visinhosNaoVisitados.push(this.NORTE);
            if (y < this.ALTURA - 2 && !this.arrayIncludes(this.hasVisited, [x, y + 2])) visinhosNaoVisitados.push(this.SUL);
            if (x > 1 && !this.arrayIncludes(this.hasVisited, [x - 2, y])) visinhosNaoVisitados.push(this.OESTE);
            if (x < this.LARGURA - 2 && !this.arrayIncludes(this.hasVisited, [x + 2, y])) visinhosNaoVisitados.push(this.LESTE);

            if (visinhosNaoVisitados.length === 0) return;

            let proximaIntercesao = visinhosNaoVisitados[Math.floor(this.rng() * visinhosNaoVisitados.length)];

            let proximoX, proximoY;
            switch (proximaIntercesao) {
                case this.NORTE:
                    proximoX = x;
                    proximoY = y - 2;
                    this.labirinto[`${x},${y - 1}`] = this.EMPTY;
                    break;
                case this.SUL:
                    proximoX = x;
                    proximoY = y + 2;
                    this.labirinto[`${x},${y + 1}`] = this.EMPTY;
                    break;
                case this.OESTE:
                    proximoX = x - 2;
                    proximoY = y;
                    this.labirinto[`${x - 1},${y}`] = this.EMPTY;
                    break;
                case this.LESTE:
                    proximoX = x + 2;
                    proximoY = y;
                    this.labirinto[`${x + 1},${y}`] = this.EMPTY;
                    break;
            }

            this.hasVisited.push([proximoX, proximoY]);
            this.visit(proximoX, proximoY);
        }
    }

    toIO() {
        let aux = Array.from({ length: this.ALTURA }, () => Array(this.LARGURA).fill(0));

        for (let y = 0; y < this.ALTURA; y++) {
            for (let x = 0; x < this.LARGURA; x++) {
                if (this.labirinto[`${x},${y}`] === this.WALL) {
                    aux[y][x] = 1;
                }
            }
        }

        return aux;
    }
}
