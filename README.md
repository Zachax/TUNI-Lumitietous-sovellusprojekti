# TUNI-Lumitietous-sovellusprojekti
Snow information application for Software Project course in University of Tampere.

# Serverin käynnistys ja yhteydenotto
1.Lataa ja asenna Vagrant ja Virtual Box(tai jokin muu virtualisaatio ohjelma)
2.Siirry TUNI-Lumitietous-sovellusprojekti kansioon ja anna komento "vagrant up"
3.Kun virtuaalikone on käynnistynyt kirjaudu siihen sisälle "vagrant ssh"
4.navigoi jaettuun kansioo. (kaksi kansiotasoa sisääntuloa ylempänä sijaitseva Vagrant kansio)
5.Navigoi src kansioon
6.Asenna pakkaukset komennolla "npm install"
7.Käynnistä serveri komennolla "node app.js"
8.Mikäli ruudulla lukee "listening to 3000" voit ottaa yhteyden serveriin selaimella( http://localhost:3000/)

Olkaa ongelmien tapauksessa yhteydessä virtualisaatio on joskus mutkikasta