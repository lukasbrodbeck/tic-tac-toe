# Tic Tac Toe aka Dodelschach, 3 Gewinnt, etc.
In diesem Repo habe ich eine basis Implementation für das allseits bekannte Tic Tac Toe Spiel erstellt.

Spielregeln: Das Spielfeld ist 3 Felder hoch und 3 Felder breit. Die Spieler wählen abwechselnd Felder und markieren sie dabei. Dies erfolgt solange, bis ein Spieler drei Felder in horizontaler, vertikaler oder diagonaler Richtung markiert hat, oder alle Felder bereits markiert wurden.

[Wikipedia](https://de.wikipedia.org/wiki/Tic-Tac-Toe)

## Aktuelle Funktionen:
Das Spielfeld wird automatisch generiert und erkennt Markierungen und auch sobald ein Spiel beendet wurde.

Die Spieler markieren 

Vor dem Start kann der Benutzer einen Schwierigkeitsgrad wählen.
Dieser besteht aus:
* Menschlicher Gegner: hierbei wählt der Benutzer abwechselnd für die beiden Spieler ein Feld.
* Easy: Der Computer wählt jedesmal ein rein zufälliges Feld aus.
* Medium: Der Computer erkennt mögliche Siegbedingungen und setzt wählt die entsprechenden Felder. Genauso versucht er mögliche Siegbedingungen des Spielers zu verhindern. Wenn keine Siegbedingung zu erkennen ist, wählt er ein zufälliges Feld. So kann man ihn noch austricksen.
* Hard *(coming soon)*: Diesen Computerspieler kann man nicht mehr überlisten. Es ist genau berechnet, dass der menschliche Spieler nur ein Unentschieden oder eine Niederlage erreichen kann.


## Vernwendete Technologien
Das Spiel ist ausschließlich in Javascript / ECMA script geschrieben. Um mich aber mehr um den tatsächlichen Code zu konzentrieren und entsprechend wenig mit Kleinigkeiten und Cross-Browser Support aufzuhalten, wurden verschiedene Libraries integriert.

* Als Basis hierzu wurde eine [HTML Boilerplate](https://html5boilerplate.com/) verwendet, welche unter anderem auch [jQuery](https://jquery.com/) und [Modernizr](https://modernizr.com/) verwerndet.

* Für das Styling wurde auf [Semantic UI](https://semantic-ui.com) zurückgegriffen

## ES Lint for codestyling
In order to improve the code style, we use ES Lint. To start this, run `npm run lint` 
