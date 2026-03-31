let tela = document.getElementById("jogo");
let ctx = tela.getContext("2d");
let texto = document.getElementById("texto");

// passarinho
let passaro = {
  x: 60,
  y: 200,
  largura: 30,
  altura: 30,
  velocidadeY: 0,
  gravidade: 0.5,
  forcaPulo: -8
};

// variáveis do jogo
let canos = [];
let pontos = 0;
let frames = 0;
let começou = false;
let acabou = false;

// desenha o passarinho
function desenharPassaro() {
  ctx.fillStyle = "yellow";
  ctx.fillRect(passaro.x, passaro.y, passaro.largura, passaro.altura);
}

// cria um cano novo
function criarCano() {
  let alturaCima = Math.floor(Math.random() * 200) + 50;
  let espaço = 120;

  let cano = {
    x: 400,
    largura: 50,
    alturaCima: alturaCima,
    alturaBaixo: alturaCima + espaço,
    marcouPonto: false
  };

  canos.push(cano);
}

// desenha os canos
function desenharCanos() {
  ctx.fillStyle = "green";

  for (let i = 0; i < canos.length; i++) {
    let cano = canos[i];

    // cano de cima
    ctx.fillRect(cano.x, 0, cano.largura, cano.alturaCima);

    // cano de baixo
    ctx.fillRect(
      cano.x,
      cano.alturaBaixo,
      cano.largura,
      tela.height - cano.alturaBaixo
    );
  }
}

// atualiza posição dos canos
function atualizarCanos() {
  for (let i = 0; i < canos.length; i++) {
    canos[i].x -= 2;

    // marcar ponto
    if (canos[i].x + canos[i].largura < passaro.x && canos[i].marcouPonto == false) {
      canos[i].marcouPonto = true;
      pontos++;
    }
  }

  // tirar cano da tela
  canos = canos.filter(function(cano) {
    return cano.x + cano.largura > 0;
  });

  // criar cano a cada certo tempo
  if (frames % 100 == 0) {
    criarCano();
  }
}

// atualizar o passarinho
function atualizarPassaro() {
  passaro.velocidadeY += passaro.gravidade;
  passaro.y += passaro.velocidadeY;

  // bater no chão
  if (passaro.y + passaro.altura >= tela.height) {
    passaro.y = tela.height - passaro.altura;
    fimDoJogo();
  }

  // bater no teto
  if (passaro.y <= 0) {
    passaro.y = 0;
    passaro.velocidadeY = 0;
  }
}

// ver se bateu no cano
function verColisao() {
  for (let i = 0; i < canos.length; i++) {
    let cano = canos[i];

    let bateuNaLargura =
      passaro.x + passaro.largura > cano.x &&
      passaro.x < cano.x + cano.largura;

    let bateuNoCanoDeCima = passaro.y < cano.alturaCima;
    let bateuNoCanoDeBaixo = passaro.y + passaro.altura > cano.alturaBaixo;

    if (bateuNaLargura && (bateuNoCanoDeCima || bateuNoCanoDeBaixo)) {
      fimDoJogo();
    }
  }
}

// mostrar os pontos
function desenharPontos() {
  ctx.fillStyle = "black";
  ctx.font = "20px Arial";
  ctx.fillText("Pontos: " + pontos, 10, 30);
}

// quando perde
function fimDoJogo() {
  acabou = true;
  texto.innerText = "Perdeu! Aperta R para reiniciar";
}

// pular
function pular() {
  if (acabou) {
    return;
  }

  if (começou == false) {
    começou = true;
    texto.innerText = "";
  }

  passaro.velocidadeY = passaro.forcaPulo;
}

// reiniciar
function reiniciar() {
  passaro.y = 200;
  passaro.velocidadeY = 0;
  canos = [];
  pontos = 0;
  frames = 0;
  começou = false;
  acabou = false;
  texto.innerText = "Pressione espaço para iniciar";
}

// desenhar tudo
function desenhar() {
  ctx.clearRect(0, 0, tela.width, tela.height);

  desenharPassaro();
  desenharCanos();
  desenharPontos();
}

// atualizar tudo
function atualizar() {
  if (começou == false || acabou == true) {
    return;
  }

  frames++;
  atualizarPassaro();
  atualizarCanos();
  verColisao();
}

// loop do jogo
function loop() {
  atualizar();
  desenhar();
  requestAnimationFrame(loop);
}

// teclado
document.addEventListener("keydown", function(event) {
  if (event.code == "Space") {
    pular();
  }

  if (event.key.toLowerCase() == "r") {
    reiniciar();
  }
});

// clique na tela
tela.addEventListener("click", function() {
  pular();
});

loop();