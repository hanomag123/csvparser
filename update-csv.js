const fs = require("fs");
const csv = require("csv-parser");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

// Маппинг JSON → CSV колонки
const FIELD_MAP = {
  // weight: 'Variant Metafield: custom.verpakkingsgewicht [single_line_text_field]',
  // length: 'Variant Metafield: custom.verpakking_lengte [single_line_text_field]',
  // height: 'Variant Metafield: custom.verpakking_hoogte [single_line_text_field]',
  // width:  'Variant Metafield: custom.verpakking_breedte [single_line_text_field]',
  // waterResistance: "Variant Metafield: custom.bol_water_resistance [single_line_text_field]"
  // TypeSlaper: "Variant Metafield: custom.bol_type_slaper [single_line_text_field]",
  // MaximaleMatrasdikte: "Variant Metafield: custom.bol_maximale_matrasdikte [single_line_text_field]",
  // doelgroup: "Variant Metafield: custom.bol_doelgroep [single_line_text_field]",
  // TypeBank: "Variant Metafield: custom.bol_type_bank [single_line_text_field]",
  // AantalZitplekken: "Variant Metafield: custom.bol_aantal_zitplekken [single_line_text_field]",
  // TypeBed:
  //   "Variant Metafield: custom.bol_geschikt_voor_type_bed [single_line_text_field]",
  // verpakkingsinhound: "Variant Metafield: custom.bol_verpakkingsinhoud [single_line_text_field]",
  // Wasvoorschrift: "Variant Metafield: custom.bol_wasvoorschrift [single_line_text_field]",
  // Woonthema: "Variant Metafield: custom.bol_woonthema [single_line_text_field]",
  // "Ligcomfort Matras": "Variant Metafield: custom.bol_ligcomfort_matras [single_line_text_field]",
  // "Max. Belastbaar Gewicht": "Variant Metafield: custom.bol_max_belastbaar_gewicht [single_line_text_field]",
  // "Type Matraskern": "Variant Metafield: custom.bol_type_matraskern [single_line_text_field]",
  // "Material Buitenkant": "Variant Metafield: custom.bol_material_buitenkant [single_line_text_field]",
  // Materiaal: "Variant Metafield: custom.bol_material [single_line_text_field]",
  // Kleur: "Variant Metafield: custom.bol_color [single_line_text_field]",
  // "Maatvoering": "Variant Metafield: custom.bol_maatvoering [single_line_text_field]",
// "h": "Variant Metafield: custom.hohe_ [single_line_text_field]",
// "l": "Variant Metafield: custom.lange_ [single_line_text_field]",
// "productWidth": "Variant Metafield: custom.breite_ [single_line_text_field]",
  // "Materiaal Vulling": "Variant Metafield: custom.bol_materiaal_vulling [single_line_text_field]"
  // "TARIC": "Variant Metafield: custom.galaxus_taric [single_line_text_field]",
  // "Supplier": "Variant Metafield: custom.galaxus_supplier [single_line_text_field]",
  // "Verkaufspreis": "Variant Metafield: custom.galaxus_price [single_line_text_field]",
  "Preis Galaxus no VAT": "Variant Metafield: custom.galaxus_pricenovat [single_line_text_field]",
  "UVP": "Variant Metafield: custom.galaxus_uvp [single_line_text_field]"
};

const SKU_FIELD = "Variant SKU";

// Чтение CSV
async function readCSV(filePath) {
  const results = [];
  let headers = null;

  return new Promise((resolve, reject) => {
    fs.createReadStream(filePath)
      .pipe(
        csv({
          mapHeaders: ({ header }) => header.replace(/^\uFEFF/, "").trim(),
        }),
      )
      .on("headers", (h) => (headers = h))
      .on("data", (data) => results.push(data))
      .on("end", () => resolve({ rows: results, headers }))
      .on("error", reject);
  });
}

// Чтение JSON
function readJSON(filePath) {
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    console.error("Ошибка чтения JSON:", e);
    return [];
  }
}

async function updateCSVWithJSONData(
  csvFilePath,
  jsonFilePath,
  outputFilePath,
) {
  try {
    const { rows: csvData, headers } = await readCSV(csvFilePath);
    const jsonData = readJSON(jsonFilePath);

    console.log(`CSV строк: ${csvData.length}`);
    console.log(`JSON записей: ${jsonData.length}`);

    // Проверка колонок
    if (!headers.includes(SKU_FIELD)) {
      console.warn(`Колонка SKU "${SKU_FIELD}" не найдена!`);
    }

    Object.values(FIELD_MAP).forEach((col) => {
      if (!headers.includes(col)) {
        console.warn(`Колонка "${col}" не найдена в CSV!`);
      }
    });

    // Создаём быстрый поиск по SKU
    const skuMap = new Map();
    jsonData.forEach((item) => {
      if (item.sku) skuMap.set(String(item.sku).trim(), item);
    });

    let updated = 0;
    let notFound = 0;

    const updatedCsv = csvData.map((row) => {
      const sku = row[SKU_FIELD]?.trim();
      if (!sku) return row;

      if (skuMap.has(sku)) {
        const jsonItem = skuMap.get(sku);

        // Обновляем все поля из FIELD_MAP
        for (const [jsonKey, csvColumn] of Object.entries(FIELD_MAP)) {
          if (jsonItem[jsonKey] != null) {
            const oldValue = row[csvColumn];
            row[csvColumn] = jsonItem[jsonKey];

            console.log(
              `SKU ${sku}: ${csvColumn} "${oldValue}" → "${jsonItem[jsonKey]}"`,
            );
          }
        }

        updated++;
        skuMap.delete(sku);
      } else {
        notFound++;
      }

      return row;
    });

    console.log(`\nОбновлено строк: ${updated}`);
    console.log(`SKU без совпадений: ${notFound}`);

    if (skuMap.size > 0) {
      console.log(`\nSKU из JSON, которых нет в CSV (${skuMap.size}):`);
      skuMap.forEach((v, k) => console.log(` - ${k}`));
    }

    // Запись CSV
    const csvWriter = createCsvWriter({
      path: outputFilePath,
      header: headers.map((h) => ({ id: h, title: h })),
      alwaysQuote: true,
    });

    await csvWriter.writeRecords(updatedCsv);
    console.log(`\nГотово! Файл сохранён: ${outputFilePath}`);
  } catch (err) {
    console.error("Ошибка:", err);
  }
}

// Запуск
updateCSVWithJSONData("input.csv", "data.json", "output.csv");
