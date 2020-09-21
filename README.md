# TUNI-Lumitietous-sovellusprojekti
Snow information application for Software Project course in University of Tampere.

# Serverin käynnistys ja yhteydenotto
Lataa ja asenna Vagrant ja Virtual Box(tai jokin muu virtualisaatio ohjelma)
Siirry TUNI-Lumitietous-sovellusprojekti kansioon ja anna komento "vagrant up"
Kun virtuaalikone on käynnistynyt kirjaudu siihen sisälle "vagrant ssh"
navigoi jaettuun kansioo. (kaksi kansiotasoa sisääntuloa ylempänä sijaitseva Vagrant kansio)
Navigoi src kansioon
Asenna pakkaukset komennolla "npm install"
Käynnistä serveri komennolla "node app.js"
Mikäli ruudulla lukee "listening to 3000" voit ottaa yhteyden serveriin selaimella( http://localhost:3000/)

Olkaa ongelmien tapauksessa yhteydessä virtualisaatio on joskus mutkikasta