const fs = require("fs");
const csv = require("csv-parser");

const inputFile = "master.csv"; // путь к твоему CSV
const outputFile = "data.json"; // куда сохранить JSON

let results = [];

fs.createReadStream(inputFile)
  .pipe(csv({ separator: ";" })) // если разделитель ; — поменяй здесь
  .on("data", (row) => {
    results.push({
      sku: row["Artikelnummer"],
      weight: row["Carton weight"],
      length: row["Carton lenght"],
      height: row["Carton height"],
      width: row["Carton width"],
      TypeSlaper: row["Type Slaper"],
      MaximaleMatrasdikte: row["Maximale Matrasdikte"],
      doelgroup: row["doelgroup"],
      TypeBank: row["Type Bank"],
      AantalZitplekken: row["Aantal Zitplekken"],
      TypeBed: row["Geschick Voor Type Bed "],
      verpakkingsinhound: row["Verpakkingsinhound"],
    });
  })
  .on("end", () => {
    results = results.map((el) => {
      switch (el.TypeBed.trim()) {
        case "F?r alle Betttypen geeignet":
          return { ...el, TypeBed: "Für alle Betttypen geeignet" };
        default:
          return el;
      }
    });
    results = results.map((el) => {
      switch (el.TypeSlaper.trim()) {
        case "Seiten- und R?ckenschl?fer":
          return { ...el, TypeSlaper: "Seiten- und Rückenschläfer" };

        case "R?ckenschl?fer":
          return { ...el, TypeSlaper: "Seiten- und Rückenschläfer" };
        default:
          return el;
      }
    });
    results = results.map((el) => {
      switch (el.verpakkingsinhound.trim()) {
        case "1 mal Cover f?r Dailydream Gewichtsdecke":
          return {
            ...el,
            verpakkingsinhound: "1 mal Cover für Dailydream Gewichtsdecke",
          };
        case "Cover f?r Dailydream Gewichtsdecke":
          return {
            ...el,
            verpakkingsinhound: "Cover für Dailydream Gewichtsdecke",
          };
        case "Schutzh?lle":
          return {
            ...el,
            verpakkingsinhound: "Schutzhülle",
          };
        case "Bezug f?r Kinder Gewichtsdecke":
          return {
            ...el,
            verpakkingsinhound: "Bezug für Kinder Gewichtsdecke",
          };
        default:
          return el;
      }
    });
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), "utf8");
    console.log("Готово! JSON сохранён в", outputFile);
  });
// node generate-json.js
