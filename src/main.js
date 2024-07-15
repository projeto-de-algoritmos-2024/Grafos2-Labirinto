// Importando classes e funções relevantes dos arquivos convertidos
import { Lab } from './criaLib.js';
import { Home } from './home.js';
import { Dijkstra } from './dijkstra.js';

class Player {
    constructor(x = 1, y = 1, block_size = 18, color = 7, matrix = [[0, 0], [0, 0]]) {
        this.block_size = block_size;
        this.x = x;
        this.y = y;
        this.color = color;
        this.matrix = matrix;
    }

    get_player() {
        return [this.x * this.block_size, this.y * this.block_size, this.block_size, this.block_size, this.color];
    }

    move_x(valor) {
        if (this.x + valor >= 0 && this.x + valor < this.matrix[0].length) {
            if (this.matrix[this.y][this.x + valor] === 0 || this.matrix[this.y][this.x + valor] === 2) {
                this.x += valor;
            }
        }
    }

    move_y(valor) {
        if (this.y + valor >= 0 && this.y + valor < this.matrix.length) {
            if (this.matrix[this.y + valor][this.x] === 0 || this.matrix[this.y + valor][this.x] === 2) {
                this.y += valor;
            }
        }
    }
}

class App {
    constructor(block_size = 2.5) {
        this.block_size = block_size;
        this.matrix = new Lab(69, 35).toIO();
        this.shortest_path = new Dijkstra([...this.matrix], [1, 1], [this.matrix.length - 2, this.matrix[0].length - 2]).shortestPath;
        this.reach_the_end = false;
        this.ofset_x = 2.5;
        this.ofset_y = 2.5;
        this.page = "home";
        this.home = new Home();

        createCanvas(192, 108);
        frameRate(10);
        this.draw = this.draw.bind(this);
        this.update = this.update.bind(this);
    }

    cor(j, i) {
        const valor = this.matrix[j][i];
        if (valor === 1) {
            return color(11);
        } else {
            return color(0);
        }
    }

    draw() {
        background(0);
        if (this.page === "home") {
            this.home.draw();
        } else {
            this.draw_matrix();
            if (keyIsPressed && key === 'p') {
                this.draw_short_path();
            }
            this.draw_player();

            if (this.player.x === 67 && this.player.y === 33 && !this.reach_the_end) {
                this.reach_the_end = true;
                alert("Parabéns! Você venceu!");
            }
        }
    }

    draw_player() {
        const p_values = this.player.get_player();
        fill(p_values[4]);
        rect(p_values[0] + this.ofset_x, p_values[1] + this.ofset_y, p_values[2], p_values[3]);
    }

    update() {
        if (this.page === "maze") {
            if (keyIsPressed) {
                if (keyCode === RIGHT_ARROW) {
                    this.player.move_x(1);
                } else if (keyCode === LEFT_ARROW) {
                    this.player.move_x(-1);
                } else if (keyCode === UP_ARROW) {
                    this.player.move_y(-1);
                } else if (keyCode === DOWN_ARROW) {
                    this.player.move_y(1);
                }
            }
        } else if (this.page === "home") {
            this.home.update();
            if (keyIsPressed && key === 'i') {
                this.page = "maze";
            } else if (keyIsPressed && key === 'c') {
                alert("*Para se mover no labirinto utilize as setas do teclado ou as teclas WASD\nW -> Se move para o norte\nS  -> Se move para o sul\nD  -> Se move para o oeste\nA  -> Se move para o leste\n\n*Para saber o caminho mais curto do labirinto utilize a tecla P\n*Para ganhar o jogo você deve chegar até o ponto dourado no fim do labirinto, BOA SORTE\n");
            }
        }
    }

    draw_matrix() {
        const size = this.block_size;
        const matrix = this.matrix;
        for (let i = 0; i < matrix[0].length; i++) {
            for (let j = 0; j < matrix.length; j++) {
                fill(this.cor(j, i));
                rect(this.ofset_x + (i * size), this.ofset_y + (j * size), size, size);
            }
        }
    }

    draw_short_path() {
        const size = this.block_size;
        const path = this.shortest_path;
        for (let item of path) {
            fill(color(9));
            rect(this.ofset_x + (item[1] * size), this.ofset_y + (item[0] * size), size, size);
        }
    }
}

function setup() {
    let app = new App();
    draw = app.draw;
    update = app.update;
}
