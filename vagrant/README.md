# TUNI-Lumitietous-sovellusprojekti
Snow information application for Software Project course in University of Tampere.

# Serverin käynnistys ja yhteydenotto
1.Lataa ja asenna Vagrant ja Virtual Box(tai jokin muu virtualisaatio ohjelma)
2.Siirry TUNI-Lumitietous-sovellusprojekti kansioon, siirry siellä vagrant -kansioon ja anna komento "vagrant up"
3.Kun virtuaalikone on käynnistynyt kirjaudu siihen sisälle "vagrant ssh"
4.navigoi jaettuun kansioo. (kaksi kansiotasoa sisääntuloa ylempänä sijaitseva vagrant kansio)
5.Navigoi src kansioon
6.Asenna pakkaukset komennolla "npm install"
SUOSITUS: npm:n asentaminen omalle koneelle ja kohtien 7-8 tekeminen toisessa konsolissa ilman yhteyttä virtuaalikoneeseen saattaa toimia paremmin
7. Navigoi kansioon TUNI-Lumitietous-sovellusprojekti\src\map-app
8. Suorita "npm install" sekä "npm run build" 

9. Käynnistä serveri komennolla "node app.js"
10. Mikäli ruudulla lukee "listening to 3000" voit ottaa yhteyden serveriin selaimella( http://localhost:3000/)

Olkaa ongelmien tapauksessa yhteydessä virtualisaatio on joskus mutkikasta
