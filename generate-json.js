const fs = require("fs");
const csv = require("csv-parser");

const inputFile =
  "master.csv"; // путь к твоему CSV
const outputFile = "data.json"; // куда сохранить JSON

const results = [];

fs.createReadStream(inputFile)
  .pipe(csv({ separator: "," })) // если разделитель ; — поменяй здесь
  .on("data", (row) => {
    results.push({
      sku: row["Artikelnummer"],
      weight: row["Carton weight"],
      length: row["Carton lenght"],
      height: row["Carton height"],
      width: row["Carton width"],
    });
  })
  .on("end", () => {
    fs.writeFileSync(outputFile, JSON.stringify(results, null, 2), "utf8");
    console.log("Готово! JSON сохранён в", outputFile);
  });
// node generate-json.js
