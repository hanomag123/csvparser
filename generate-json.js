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
      // weight: row["Carton weight"],
      // length: row["Carton lenght"],
      // height: row["Carton height"],
      // width: row["Carton width"],
      // TypeSlaper: row["Type Slaper"],
      // MaximaleMatrasdikte: row["Maximale Matrasdikte"],
      // doelgroup: row["doelgroup"],
      // TypeBank: row["Type Bank"],
      // AantalZitplekken: row["Aantal Zitplekken"],
      // TypeBed: row["Geschick Voor Type Bed "],
      // verpakkingsinhound: row["Verpakkingsinhound"],
      Wasvoorschrift: row["Wasvoorschrift"],
    });
  })
  .on("end", () => {
    // results = results.map((el) => {
    //   switch (el.TypeBed.trim()) {
    //     case "F?r alle Betttypen geeignet":
    //       return { ...el, TypeBed: "Für alle Betttypen geeignet" };
    //     default:
    //       return el;
    //   }
    // });
    // results = results.map((el) => {
    //   switch (el.TypeSlaper.trim()) {
    //     case "Seiten- und R?ckenschl?fer":
    //       return { ...el, TypeSlaper: "Seiten- und Rückenschläfer" };

    //     case "R?ckenschl?fer":
    //       return { ...el, TypeSlaper: "Seiten- und Rückenschläfer" };
    //     default:
    //       return el;
    //   }
    // });
    // results = results.map((el) => {
    //   switch (el.verpakkingsinhound.trim()) {
    //     case "1 mal Cover f?r Dailydream Gewichtsdecke":
    //       return {
    //         ...el,
    //         verpakkingsinhound: "1 mal Cover für Dailydream Gewichtsdecke",
    //       };
    //     case "Cover f?r Dailydream Gewichtsdecke":
    //       return {
    //         ...el,
    //         verpakkingsinhound: "Cover für Dailydream Gewichtsdecke",
    //       };
    //     case "Schutzh?lle":
    //       return {
    //         ...el,
    //         verpakkingsinhound: "Schutzhülle",
    //       };
    //     case "Bezug f?r Kinder Gewichtsdecke":
    //       return {
    //         ...el,
    //         verpakkingsinhound: "Bezug für Kinder Gewichtsdecke",
    //       };
    //     default:
    //       return el;
    //   }
    // });

    results = results.map((el) => {
      switch (el.Wasvoorschrift.trim()) {
        case "Bei 30 Grad waschbar":
        case "Waschbar bei 30 Grad im Schonwaschgang":
        case "Waschmaschinen geeignet, bei 30 Grad waschbar":
        case "Maschinenw?sche bei max. 30�C (Schonwaschgang)":
        case "waschbar bei 30�C nicht trocknergeeignet Bleichmittel meiden":
        case "30�C Schonwaschgang, nicht trocknergeeignet, nicht bleichen, nicht b?geln":
        case "Waschmaschinen geeignet,  bei 30 Grad waschbar":
        case "Maschinenw?sche im Schonwaschgang bei max. 30�C, nicht trocknergeeignet, Bleichmittel meiden, nicht b?geln":
          return {
            ...el,
            Wasvoorschrift: "Machinewas 30 °C",
          };
        case "Maschinenw?sche":
        case "Bezug Waschmaschinen geeignet,  bei 40 Grad waschbar":
        case "Waschbar bei 40�C Nicht trocknergeeignet Bleichmittel meiden":
        case "Waschbar bei 40�C, nicht trocknergeeignet, Bleichmittel meiden":
        case "Bezug bei maximal 40 Grad waschen, nicht trocknergeeignet, Bleichmittel meiden":
        case "Waschmaschinen geeignet,  bei 40 Grad waschbar":
          return {
            ...el,
            Wasvoorschrift: "Machinewas 40 °C",
          };
        case "Waschmaschinen geeignet,  bei 60 Grad waschbar":
          return {
            ...el,
            Wasvoorschrift: "Machinewas 60 °C",
          };
        default:
          return el;
      }
    });
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), "utf8");
    console.log("Готово! JSON сохранён в", outputFile);
  });
// node generate-json.js
