# Fiumi in glifi

Esercitazione 3 — Una visione di insieme.

Un soffione raccoglie le 100 righe di `rivers.csv`, raggruppate per continente. I petali sono sfalsati su tre distanze per lasciare spazio ai simboli. Al passaggio del mouse il petalo si illumina e compare il nome del fiume.

| Dato | Segno |
| --- | --- |
| Bacino idrografico | Alone: raggio da 18 a 40 px |
| Portata d'acqua | Nucleo: diametro da 7 a 26 px |
| Affluenti | Da 3 a 24 tacche, arrotondate |
| Lunghezza | Arco verde petrolio da 0 a 360° |

Le scale partono da zero e arrivano al massimo del dataset. Le tacche sintetizzano il numero di affluenti; non corrispondono a un affluente ciascuna. L'azzurro è uguale per tutti i fiumi.

`setup()` trova i massimi. `draw()` disegna la tavola. `disegnaGruppo()` conta i fiumi del continente, li posiziona e controlla il mouse con `dist()`. `disegnaPetalo()` costruisce il simbolo. Titolo e legenda hanno due funzioni dedicate.

Per aprire il progetto, avvia `python3 -m http.server 8000` da questa cartella e visita `http://localhost:8000`. Nell'editor p5.js usa la versione **1.11.11** e carica `sketch.js` e `rivers.csv`.

La canvas misura 1800 × 1810 px; `style.css` la adatta alla finestra. Il CSV fornito resta invariato. Le colonne della temperatura non sono usate.
