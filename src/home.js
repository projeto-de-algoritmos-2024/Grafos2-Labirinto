let headerYOffset = 0;

function setup() {
  createCanvas(500, 488);
  frameRate(10);
}

function draw() {
  background(0);
  update();
  drawHeader();
  drawOptions();
}

function update() {
  headerYOffset = getOffsetY();
}

function drawOptions() {
  let x = 80;
  let y = 60;

  fill(255);
  text('[I]Iniciar', x, y);
  text('[C]Controles', x, y + 20);
  text('[ESC]Sair', x, y + 40);
}

function drawHeader() {
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

function getOffsetY() {
  let fc = frameCount % 5;

  if (fc >= 0 && fc <= 2) {
    return 0;
  } else {
    return 1;
  }
}
