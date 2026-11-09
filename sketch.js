let fiumi;
let maxLunghezza = 0;
let maxArea = 0;
let maxPortata = 0;
let maxAffluenti = 0;

let centroX = 900;
let centroY = 800;
let raggioSoffione = 450;
let raggioNomi = 650;

function preload() {
  fiumi = loadTable('rivers.csv', 'csv', 'header');
}

function setup() {
  createCanvas(1800, 1810);
  textFont('Helvetica Neue');

  // Massimi del dataset.
  for (let i = 0; i < fiumi.getRowCount(); i++) {
    let lunghezza = fiumi.getNum(i, 'length');
    let area = fiumi.getNum(i, 'area');
    let portata = fiumi.getNum(i, 'discharge');
    let affluenti = fiumi.getNum(i, 'tributaries');

    if (lunghezza > maxLunghezza) maxLunghezza = lunghezza;
    if (area > maxArea) maxArea = area;
    if (portata > maxPortata) maxPortata = portata;
    if (affluenti > maxAffluenti) maxAffluenti = affluenti;
  }
}

function draw() {
  background(255, 249, 239);
  disegnaTitolo();

  noStroke();
  fill(0, 83, 78);
  triangle(185, 1550, 215, 1566, centroX, centroY);

  disegnaGruppo('Asia', 'Asia', 150, 246);
  disegnaGruppo('Europe', 'Europa', 253, 325);
  disegnaGruppo('North America', 'Nord America', 332, 377);
  disegnaGruppo('South America', 'Sud America', 384, 438);
  disegnaGruppo('Africa', 'Africa', 445, 472);
  disegnaGruppo('Australia', 'Australia', 479, 479);
  disegnaGruppo('Oceania', 'Oceania', 486, 486);

  noStroke();
  fill(0, 83, 78);
  ellipse(centroX, centroY, 27, 27);
  disegnaLegenda();
}

function disegnaGruppo(continente, nome, inizio, fine) {
  let numero = 0;
  for (let i = 0; i < fiumi.getRowCount(); i++) {
    if (fiumi.getString(i, 'continent') == continente) numero++;
  }

  let angoloRamo = (inizio + fine) / 2 * PI / 180;
  let ramoX = centroX + cos(angoloRamo) * 185;
  let ramoY = centroY + sin(angoloRamo) * 185;

  stroke(0, 102, 91, 190);
  strokeWeight(1.4);
  line(centroX, centroY, ramoX, ramoY);

  let posizione = 0;
  for (let i = 0; i < fiumi.getRowCount(); i++) {
    if (fiumi.getString(i, 'continent') == continente) {
      let angolo = inizio;
      if (numero > 1) angolo = map(posizione, 0, numero - 1, inizio, fine);
      angolo = angolo * PI / 180;

      // Sfalso i petali su tre distanze.
      let raggio = raggioSoffione + (posizione % 3) * 70;
      let x = centroX + cos(angolo) * raggio;
      let y = centroY + sin(angolo) * raggio;
      let alone = map(fiumi.getNum(i, 'area'), 0, maxArea, 18, 40);
      let acceso = dist(mouseX, mouseY, x, y) < alone + 3;

      stroke(62, 158, 161, 150);
      strokeWeight(0.65);
      if (acceso) {
        stroke(62, 158, 161);
        strokeWeight(1.5);
      }
      line(ramoX, ramoY, x, y);

      push();
      translate(x, y);
      disegnaPetalo(i, acceso);

      if (acceso) {
        rotate(angolo);
        let distanzaNome = raggioNomi - raggio;
        noStroke();
        fill(0, 83, 78);
        textSize(11);
        textAlign(LEFT, CENTER);
        if (cos(angolo) < 0) {
          rotate(PI);
          textAlign(RIGHT, CENTER);
          distanzaNome = -distanzaNome;
        }
        text(fiumi.getString(i, 'name'), distanzaNome, 0);
      }
      pop();
      posizione++;
    }
  }

  push();
  translate(centroX, centroY);
  rotate(angoloRamo);
  noStroke();
  fill(0, 83, 78);
  textSize(10);
  textAlign(LEFT, CENTER);
  if (cos(angoloRamo) < 0) {
    translate(125, 0);
    rotate(PI);
    textAlign(RIGHT, CENTER);
    text(nome, 0, -8);
  } else {
    text(nome, 85, -8);
  }
  pop();
}

function disegnaPetalo(i, acceso) {
  push();
  let raggioAlone = map(fiumi.getNum(i, 'area'), 0, maxArea, 18, 40);
  let diametro = map(fiumi.getNum(i, 'discharge'), 0, maxPortata, 7, 26);
  let tacche = round(map(fiumi.getNum(i, 'tributaries'), 0, maxAffluenti, 3, 24));
  let ampiezza = map(fiumi.getNum(i, 'length'), 0, maxLunghezza, 0, TWO_PI);

  noStroke();
  // Cerchi sovrapposti per sfumare l’alone.
  fill(62, 158, 161, 13);
  if (acceso) fill(62, 158, 161, 28);
  for (let j = 10; j > 0; j--) {
    let r = raggioAlone * j / 10;
    ellipse(0, 0, r * 2, r * 2);
  }

  stroke(62, 158, 161);
  strokeWeight(1.1);
  if (acceso) strokeWeight(1.7);
  for (let j = 0; j < tacche; j++) {
    push();
    rotate(j * TWO_PI / tacche);
    line(diametro / 2 + 4, 0, diametro / 2 + 8, 0);
    pop();
  }

  noStroke();
  fill(62, 158, 161);
  ellipse(0, 0, diametro, diametro);

  let raggioArco = raggioAlone + 3;
  noFill();
  stroke(0, 83, 78, 35);
  strokeWeight(0.5);
  ellipse(0, 0, raggioArco * 2, raggioArco * 2);
  stroke(0, 83, 78);
  strokeWeight(1.8);
  if (acceso) strokeWeight(2.8);
  arc(0, 0, raggioArco * 2, raggioArco * 2, -HALF_PI, -HALF_PI + ampiezza);
  rotate(-HALF_PI + ampiezza);
  noStroke();
  fill(0, 83, 78);
  ellipse(raggioArco, 0, 4.5, 4.5);
  pop();
}

function disegnaTitolo() {
  push();
  noStroke();
  fill(35, 42, 36);
  textAlign(LEFT, BASELINE);
  textFont('Georgia');
  textStyle(BOLD);
  textSize(70);
  text('Fiumi', 60, 136);
  text('in glifi', 60, 214);
  textFont('Helvetica Neue');
  textStyle(NORMAL);
  textSize(12);
  text(
    '100 fiumi racchiusi in un soffione.\n' +
    'Ogni ramo rappresenta un continente,\n' +
    'il quale, tramite i petali, sorregge tutti\n' +
    'i fiumi che gli appartengono. Quattro\n' +
    'segni ne raccontano le caratteristiche.',
    64, 254
  );
  textAlign(RIGHT, BASELINE);
  textSize(11);
  text('ESERCITAZIONE 3', width - 64, 45);
  text('UNA VISIONE D’INSIEME', width - 64, 63);
  text('POLITECNICO DI MILANO', width - 64, 81);
  text('LABORATORIO DI COMPUTERGRAFICA / INFORMATION DESIGN', width - 64, 99);
  pop();
}

function disegnaLegenda() {
  push();
  noStroke();
  fill(35, 42, 36);
  textAlign(LEFT, BASELINE);
  textStyle(BOLD);
  textSize(18);
  text('Come leggere un petalo', 64, 1640);
  stroke(182, 196, 180);
  strokeWeight(0.6);
  line(64, 1654, width - 64, 1654);
  noStroke();

  textSize(15);
  text('Bacino idrografico', 64, 1684);
  text("Portata d'acqua", 482, 1684);
  text('Numero di affluenti', 900, 1684);
  text('Lunghezza', 1318, 1684);
  textStyle(NORMAL);

  for (let esempio = 0; esempio < 3; esempio++) {
    let raggio = map(esempio, 0, 2, 18, 40);
    fill(62, 158, 161, 13);
    for (let j = 10; j > 0; j--) {
      let r = raggio * j / 10;
      ellipse(104 + esempio * 120, 1735, r * 2, r * 2);
    }
  }

  fill(62, 158, 161);
  for (let esempio = 0; esempio < 3; esempio++) {
    let diametro = map(esempio, 0, 2, 7, 26);
    ellipse(522 + esempio * 120, 1735, diametro, diametro);
  }

  for (let esempio = 0; esempio < 3; esempio++) {
    push();
    translate(940 + esempio * 120, 1735);
    let tacche = round(map(esempio, 0, 2, 3, 24));
    stroke(62, 158, 161);
    strokeWeight(1.1);
    for (let j = 0; j < tacche; j++) {
      push();
      rotate(j * TWO_PI / tacche);
      line(10, 0, 14, 0);
      pop();
    }
    pop();
  }

  for (let esempio = 0; esempio < 3; esempio++) {
    push();
    translate(1358 + esempio * 120, 1735);
    let ampiezza = map(esempio, 0, 2, HALF_PI, TWO_PI);
    noFill();
    stroke(0, 83, 78);
    strokeWeight(1.8);
    arc(0, 0, 36, 36, -HALF_PI, -HALF_PI + ampiezza);
    rotate(-HALF_PI + ampiezza);
    noStroke();
    fill(0, 83, 78);
    ellipse(18, 0, 4.5, 4.5);
    pop();
  }

  noStroke();
  fill(35, 42, 36);
  textSize(13);
  text('0–' + maxArea + ' km²', 64, 1785);
  text('0–' + maxPortata + ' m³/s', 482, 1785);
  text('0–' + maxAffluenti + ' affluenti', 900, 1785);
  text('0–' + maxLunghezza + ' km', 1318, 1785);
  pop();
}
