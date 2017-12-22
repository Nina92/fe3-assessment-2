# Assessment 2

https://nina92.github.io/fe3-assessment-2/

## Omschrijving
In deze grouped bar chart zie je informatie over het aantal inwoners in Nederland tussen 1950 en 2010, onderverdeeld per leeftijdsgroep. Ik heb gebruik gemaakt van "dirty data" en deze gecleand met javascript.

## Werkwijze

De grafiek is gebaseerd op [Mike Bostock's Grouped Bar Chart](https://bl.ocks.org/mbostock/3887051).

Ik wil mijn data op zo'n manier cleanen zodat het hetzelfde format heeft als de data die Mike Bostock heeft gebruikt. Dit is data in een CSV format en inclusief een header.

Mijn data bevat 5 "headers", waarvan er eentje de header is die ik wil gebruiken. De headers daarboven en daaronder moet ik dus weghalen. Dit doe ik door als eerste de index van het begin van de header die ik wil gebruiken op te slaan in een variabele: `var startOfHeaderIndex = doc.indexOf('"Onderwerpen";"Jonger dan 20 jaar"')`. Hier start mijn gecleande data.

De header die daaronder zit noem ik subheader. Deze wil ik weg heben. Met `var startOfSubHeaderIndex = doc.indexOf('"Perioden"')` sla ik de index van het begin van de subheader op in de variabele `startOfSubHeaderIndex`.

Daarna doe ik `var endOfSubHeaderIndex = doc.indexOf('\n', startOfSubHeaderIndex)` om de index van het eind van de subheader op te slaan in de variabele `endOfSubHeaderIndex`.

Vervolgens sla ik de string tussen die twee indexen op in `var subHeader = doc.substring(startOfSubHeaderIndex, endOfSubHeaderIndex)`. Later haal ik deze subheader weg.

Mijn data bevat ook een footer die ik weg wil hebben. Hiervoor sla ik de index van het begin van de footer op in `var startOfFooterIndex = doc.indexOf("Centraal Bureau voor de Statistiek") - 3`. Het lukte me niet om het copyright teken te gebruiken, vandaar de - 3.

Nu kan ik de string die tussen `startOfHeaderIndex` en `startOfFooterIndex` zit opslaan in doc zodat ik alleen datgene overhoud wat ik wil gebruiken. Dat doe ik met `doc = doc.substring(startOfHeaderIndex, startOfFooterIndex).trim()`. Met  `trim()` haal ik de whitespace aan beide kanten weg.

De subheader haal ik weg door middel van `doc = doc.replace(subHeader + '\n', '')`. Hierbij wordt de subheader en de witregel die je overhoudt vervangen door niks.

Vervolgens haal ik alle dubbele aanhalingstekens weg door middel van `doc = doc.replace(/"/g, '')`

Daarna vervang ik met `doc = doc.replace(/;/g, ',')` alle semicolons door komma's zodat ik de data kan uitlezen als een CSV bestand.

De kolomnaam van de eerste kolom is nu "Onderwerpen", dit moet veranderd worden naar "Jaar". Dit doe ik met `doc = doc.replace('Onderwerpen', 'Jaar')`.

Nu is de data gecleand. Ik gebruik nu `d3.csvParse` om van de string een array met objecten te maken. De cijfers over het aantal inwoners zet ik om naar numbers.

```
var data = d3.csvParse(doc, function(d) {
    return {
      Jaar: d.Jaar,
      ['Jonger dan 20 jaar']: +(d['Jonger dan 20 jaar']),
      ['20 tot 40 jaar']: +(d['20 tot 40 jaar']),
      ['40 tot 65 jaar']: +(d['40 tot 65 jaar']),
      ['65 tot 80 jaar']: +(d['65 tot 80 jaar']),
      ['80 jaar of ouder']: +(d['80 jaar of ouder'])
    }
  })
```

Nu is de data klaar om te gebruiken.

## Data
De data die ik heb gebruikt komt van [cbs.nl](http://statline.cbs.nl/Statweb/publication/?DM=SLNL&PA=37296ned&D1=9-13&D2=0,10,20,30,40,50,60&HDR=T&STB=G1&CHARTTYPE=1&VW=T).

Originele data:

```
"Bevolking; kerncijfers"
"Onderwerpen";"Bevolking naar leeftijd (op 1 januari)";"Bevolking naar leeftijd (op 1 januari)";"Bevolking naar leeftijd (op 1 januari)";"Bevolking naar leeftijd (op 1 januari)";"Bevolking naar leeftijd (op 1 januari)"
"Onderwerpen";"Bevolking naar leeftijd, aantallen";"Bevolking naar leeftijd, aantallen";"Bevolking naar leeftijd, aantallen";"Bevolking naar leeftijd, aantallen";"Bevolking naar leeftijd, aantallen"
"Onderwerpen";"Jonger dan 20 jaar";"20 tot 40 jaar";"40 tot 65 jaar";"65 tot 80 jaar";"80 jaar of ouder"
"Perioden";"aantal";"aantal";"aantal";"aantal";"aantal"
"1950";"3742499";"2951369";"2562311";"670995";"99599"
"1960";"4331042";"3098779";"2968611";"864423";"154399"
"1970";"4657606";"3650362";"3338678";"1089232";"221743"
"1980";"4431785";"4441579";"3602326";"1303447";"311877"
"1990";"3822205";"4912128";"4252617";"1477909";"427715"
"2000";"3873008";"4761504";"5076996";"1652103";"500339"
"2010";"3928334";"4192772";"5915555";"1890334";"647994"
"© Centraal Bureau voor de Statistiek, Den Haag/Heerlen 10-10-2017"
```

Gecleande data:

```
Jaar,Jonger dan 20 jaar,20 tot 40 jaar,40 tot 65 jaar,65 tot 80 jaar,80 jaar of ouder
1950,3742499,2951369,2562311,670995,99599
1960,4331042,3098779,2968611,864423,154399
1970,4657606,3650362,3338678,1089232,221743
1980,4431785,4441579,3602326,1303447,311877
1990,3822205,4912128,4252617,1477909,427715
2000,3873008,4761504,5076996,1652103,500339
2010,3928334,4192772,5915555,1890334,647994
```

## Licensie
Released under the [MIT License](https://opensource.org/licenses/MIT) © Nina van den Berg
