CREATE TABLE Kayttajat (
    ID serial,
    Etunimi VARCHAR(20),
    Sukunimi VARCHAR(30),
    Rooli VARCHAR(20),
    Sähköposti VARCHAR(30),
    Salasana VARCHAR(30)
);

CREATE TABLE Segmentit (
    ID SERIAL,
    Nimi VARCHAR(30),
    Koordinaatit VARCHAR(30),
    Lumilaatu VARCHAR(20)
);

CREATE TABLE Alasegmentit (
    ID SERIAL,
    Nimi VARCHAR(30),
    Koordinaatit VARCHAR(30),
    Lumilaatu VARCHAR(20),
    Lumivyöryvaara  BOOLEAN
);