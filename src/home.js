export class Home {
  headerYOffset = 0;

  setup() {
    createCanvas(500, 488);
    frameRate(10);
  }
  
  draw() {
    background(0);
    update();
    drawHeader();
    drawOptions();
  }
  
  update() {
    headerYOffset = getOffsetY();
  }
  
  drawOptions() {
    let x = 80;
    let y = 60;
  
    fill(255);
    text('[I]Iniciar', x, y);
    text('[C]Controles', x, y + 20);
    text('[ESC]Sair', x, y + 40);
  }
  
  drawHeader() {
    let header = [
      '|||    ||||  ||||||  |||||||| ||||||||',
      '||||  ||||| ||   |||      ||| |||',
      '|| |||| ||| ||||||||   |||    ||||||',
      '||  ||  ||| ||   ||| |||      ||',
      '||      ||| ||   ||| |||||||| ||||||||'
    ];
  
    let x = 80;
    let y = 5 + headerYOffset;
    let blockWidth = 3;
    let blockHeight = 3;
  
    for (let line of header) {
      for (let item of line) {
        if (item === '|') {
          fill(255);
        } else {
          fill(0);
        }
        rect(x, y, blockWidth, blockHeight);
        x += blockWidth;
      }
      x = 80;
      y += blockHeight;
    }
  }
  
  getOffsetY() {
    let fc = frameCount % 5;
  
    if (fc >= 0 && fc <= 2) {
      return 0;
    } else {
      return 1;
    }
  }
}
