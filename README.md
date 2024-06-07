# Toto je BE pre Web RUŠ ŠD mladsot. 

Pre prvé spustenie na novom zariadení je potrebné si ako prvé nainštalovať Node.js podľa toho či používame Windows, MacOS alebo Linux sa nám otvára viac variant nainštalovania:

Windows:
Ako prvé je potrebné si stiahnuť inštalačný balík Node.js z oficiálnej stránky

MasOS: 
Pre inštaláciu na MacOS by som odporučil použiť HomeBrew pre jeho inštaláciu stačí do terminálu zadať nasledujúci prílaz:
§ /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew /install/HEAD/install.sh)"
Potom Node.js vieme jednoducho nainštalovať pomocou príkazu § brew install node

Linux:
Pre linux je riešenie veľmi jednoduché a priame, stačí spustiť príkaz: § sudo apt install nodejs npm

potom stačí nainštalovať potrebné knižnice použité v kode pomocou:
npm install

a spustit projekt pomocou: 
npm serve
