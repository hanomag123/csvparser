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
      // productWeight: row["Weight"],
      // h: row["Height"],
      // l: row["Lenght"],
      // productWidth: row["Width"],
      // TypeSlaper: row["Type Slaper"],
      // MaximaleMatrasdikte: row["Maximale Matrasdikte"],
      // doelgroup: row["doelgroup"],
      // TypeBank: row["Type Bank"],
      "Type Plaid": row["Type Plaid "],
      // AantalZitplekken: row["Aantal Zitplekken"],
      // TypeBed: row["Geschick Voor Type Bed "],
      // verpakkingsinhound: row["Verpakkingsinhound"],
      // Wasvoorschrift: row["Wasvoorschrift"],
      // Woonthema: row["Woonthema"],
      // "Ligcomfort Matras": row["Ligcomfort Matras"],
      // "Max. Belastbaar Gewicht": row["Max. Belastbaar Gewicht"],
      // "Type Matraskern": row["Typ Matraskern"],
      // "Material Buitenkant": row["Material Buitenkant"],
      // Materiaal: row["Materiaal"],
      // Kleur: row["Kleur"],
      // "Materiaal Vulling": row["Material Vulling"]
      // Maatvoering: row["Maatvoering"]
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
    //   switch (el["Material Buitenkant"].trim()) {
    //     case "Baumwolle":
    //     case "100% Premium-Baumwolle":
    //     case "Leinwandbindung":
    //     case "100% Baumwolle":
    //       return {
    //         ...el,
    //         ["Material Buitenkant"]: "Katoen",
    //       };
    //     case "Fleece":
    //     case "60% Viscose, 40% Polyester":
    //     case "100% Polyester":
    //     case "70% Polyester, 30% Lyocell":
    //     case "60% Polyester, 40% Viskose\nSENSICE�-Cooling-Technologie":
    //     case "60% Polyester, 40% Viscose":
    //     case "60% Polyester, 40% Viskose":
    //       return {
    //         ...el,
    //         ["Material Buitenkant"]: "Polyester",
    //       };
    //     default:
    //       return el;
    //   }
    // });

    // results = results.map((el) => {
    //   switch (el["Materiaal"].trim()) {
    //     case "Federkern, Kaltschaum und Memory Foam":
    //     case "Polyurethan-Schaum und Memory-Schaum":
    //     case "Cloud Air Memory Foam":
    //     case "Kaltschaum (PU Foam)":
    //     case "Traagschuim":
    //       return {
    //         ...el,
    //         ["Materiaal"]: "Polyurethaan",
    //       };
    //     case "Baumwolle":
    //     case "100% Premium-Baumwolle":
    //     case "Leinwandbindung":
    //     case "100% Baumwolle":
    //       return {
    //         ...el,
    //         ["Materiaal"]: "Katoen",
    //       };
    //     case "Glasperlen":
    //     case "Fleece":
    //     case "60% Viscose, 40% Polyester":
    //     case "100% Polyester":
    //     case "70% Polyester, 30% Lyocell":
    //     case "60% Polyester, 40% Viskose\nSENSICE�-Cooling-Technologie":
    //     case "60% Polyester, 40% Viscose":
    //     case "60% Polyester, 40% Viskose":
    //       return {
    //         ...el,
    //         ["Materiaal"]: "Polyester",
    //       };
    //     default:
    //       return el;
    //   }
    // });

    // results = results.map((el) => {
    //   switch (el.Wasvoorschrift.trim()) {
    //     case "Bei 30 Grad waschbar":
    //     case "Waschbar bei 30 Grad im Schonwaschgang":
    //     case "Waschmaschinen geeignet, bei 30 Grad waschbar":
    //     case "Maschinenw?sche bei max. 30�C (Schonwaschgang)":
    //     case "waschbar bei 30�C nicht trocknergeeignet Bleichmittel meiden":
    //     case "30�C Schonwaschgang, nicht trocknergeeignet, nicht bleichen, nicht b?geln":
    //     case "Waschmaschinen geeignet,  bei 30 Grad waschbar":
    //     case "Maschinenw?sche im Schonwaschgang bei max. 30�C, nicht trocknergeeignet, Bleichmittel meiden, nicht b?geln":
    //       return {
    //         ...el,
    //         Wasvoorschrift: "Machinewas 30 °C",
    //       };
    //     case "Maschinenw?sche":
    //     case "Bezug Waschmaschinen geeignet,  bei 40 Grad waschbar":
    //     case "Waschbar bei 40�C Nicht trocknergeeignet Bleichmittel meiden":
    //     case "Waschbar bei 40�C, nicht trocknergeeignet, Bleichmittel meiden":
    //     case "Bezug bei maximal 40 Grad waschen, nicht trocknergeeignet, Bleichmittel meiden":
    //     case "Waschmaschinen geeignet,  bei 40 Grad waschbar":
    //       return {
    //         ...el,
    //         Wasvoorschrift: "Machinewas 40 °C",
    //       };
    //     case "Waschmaschinen geeignet,  bei 60 Grad waschbar":
    //       return {
    //         ...el,
    //         Wasvoorschrift: "Machinewas 60 °C",
    //       };
    //     default:
    //       return el;
    //   }
    // });
    // results = results.map((el) => {
    //   switch (el["Kleur"].trim()) {
    //     case "Wei?":
    //       return { ...el, Kleur: "Weiß" };

    //     default:
    //       return el;
    //   }
    // });

    // results = results.map((obj) => {
    //   const newObj = {};
    //   Object.entries(obj).forEach(([key, value]) => {
    //     // Check if value is a string and contains 'cm'
    //     if (typeof value === "string" && value.includes("cm")) {
    //       newObj[key] = value.replace(/cm/g, "");
    //     } else {
    //       newObj[key] = value;
    //     }
    //   });
    //   return newObj;
    // });

    results = results.map((obj) => {
      return Object.fromEntries(
        Object.entries(obj).filter(
          ([key, value]) =>
            value !== "" && value !== null && value !== undefined,
        ),
      );
    });

    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), "utf8");
    console.log("Готово! JSON сохранён в", outputFile);
  });
// node generate-json.js
