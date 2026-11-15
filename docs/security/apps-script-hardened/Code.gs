/**
 * Piazza Marconi Cafe — Apps Script "Menu Admin" (versione PROTETTA)
 *
 * La versione precedente accettava scritture (update/add/delete) da chiunque conoscesse l'URL,
 * e quell'URL è finito in un repository pubblico. Questa versione richiede un segreto condiviso.
 *
 * Installazione (una tantum, dal proprietario del Google Sheet):
 *  1. Apri il progetto Apps Script collegato al foglio del menu e sostituisci Code.gs con questo file.
 *  2. Impostazioni progetto > Proprietà script: aggiungi
 *       ADMIN_SECRET = <stringa casuale di almeno 32 caratteri>
 *       SHEET_ID     = <ID del Google Sheet del menu>
 *  3. Esegui il deployment > Gestisci deployment > ARCHIVIA il vecchio deployment (il suo URL è compromesso)
 *     e crea un NUOVO deployment "App web". Il nuovo URL non va mai salvato in un file tracciato da git.
 *  4. Qualsiasi pannello admin che scrive sul foglio deve inviare il campo "secret" nel corpo JSON,
 *     chiedendolo all'operatore a ogni sessione (mai scritto nel codice).
 */
function doPost(e) {
  try {
    var props = PropertiesService.getScriptProperties();
    var expected = props.getProperty("ADMIN_SECRET");
    var data = sanitize_(JSON.parse(e.postData.contents));

    // AUTENTICAZIONE: senza il segreto condiviso nessuna scrittura è possibile.
    if (!expected || expected.length < 24 || !safeEqual_(String(data.secret || ""), expected)) {
      Utilities.sleep(1500); // rallenta i tentativi a forza bruta
      return json_({ success: false, error: "Unauthorized" });
    }

    var sheet = SpreadsheetApp.openById(props.getProperty("SHEET_ID")).getSheets()[0];
    var action = data.action;
    if (["update", "add", "delete"].indexOf(action) === -1) {
      return json_({ success: false, error: "Unknown action" });
    }
    
    var rows = sheet.getDataRange().getValues();
    var headers = rows[0];
    
    var nameIdx = headers.indexOf("Nome");
    var sezIdx = headers.indexOf("Sezione");
    var descIdx = headers.indexOf("Descrizione");
    var highIdx = headers.indexOf("HighlightTier");
    var priceIdx = headers.indexOf("Prezzo");
    var priceHalfIdx = headers.indexOf("PrezzoMezzo");
    var allIdx = headers.indexOf("Allergeni");
    
    // Auto-create Order column if missing
    var orderIdx = headers.indexOf("Order");
    if (orderIdx === -1) {
      orderIdx = headers.length;
      sheet.getRange(1, orderIdx + 1).setValue("Order");
      headers.push("Order");
    }

    // Auto-create Tipo column if missing
    var tipoIdx = headers.indexOf("Tipo");
    if (tipoIdx === -1) {
      tipoIdx = headers.length;
      sheet.getRange(1, tipoIdx + 1).setValue("Tipo");
      headers.push("Tipo");
    }
    
    if (action === "update") {
      var name = data.name;
      var newName = data.newName;
      var newSezione = data.sezione;
      var newDescrizione = data.descrizione;
      var newHighlight = data.highlightTier;
      var newOrder = data.order;
      var newPrice = data.price;
      var newPriceHalf = data.priceHalf;
      var newAllergeni = data.allergeni;
      var newTipo = data.tipo;
      
      var rowIndex = -1;
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][nameIdx] === name) {
          rowIndex = i + 1;
          break;
        }
      }
      
      if (rowIndex !== -1) {
        if (newName !== undefined && nameIdx !== -1) sheet.getRange(rowIndex, nameIdx + 1).setValue(newName);
        if (newSezione !== undefined && sezIdx !== -1) sheet.getRange(rowIndex, sezIdx + 1).setValue(newSezione);
        if (newDescrizione !== undefined && descIdx !== -1) sheet.getRange(rowIndex, descIdx + 1).setValue(newDescrizione);
        if (newHighlight !== undefined && highIdx !== -1) sheet.getRange(rowIndex, highIdx + 1).setValue(newHighlight);
        if (newOrder !== undefined && orderIdx !== -1) sheet.getRange(rowIndex, orderIdx + 1).setValue(newOrder);
        if (newPrice !== undefined && priceIdx !== -1) sheet.getRange(rowIndex, priceIdx + 1).setValue(newPrice);
        if (newPriceHalf !== undefined && priceHalfIdx !== -1) sheet.getRange(rowIndex, priceHalfIdx + 1).setValue(newPriceHalf);
        if (newAllergeni !== undefined && allIdx !== -1) sheet.getRange(rowIndex, allIdx + 1).setValue(newAllergeni);
        if (newTipo !== undefined && tipoIdx !== -1) sheet.getRange(rowIndex, tipoIdx + 1).setValue(newTipo);
        return ContentService.createTextOutput(JSON.stringify({success: true}))
            .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({success: false, error: "Not found"}))
            .setMimeType(ContentService.MimeType.JSON);
      }
    } else if (action === "add") {
      var newRow = [];
      for (var j = 0; j < headers.length; j++) newRow.push("");
      if (nameIdx !== -1) newRow[nameIdx] = data.name || "";
      if (sezIdx !== -1) newRow[sezIdx] = data.sezione || "";
      if (descIdx !== -1) newRow[descIdx] = data.descrizione || "";
      if (priceIdx !== -1) newRow[priceIdx] = data.price || "";
      if (priceHalfIdx !== -1) newRow[priceHalfIdx] = data.priceHalf || "";
      if (allIdx !== -1) newRow[allIdx] = data.allergeni || "";
      if (highIdx !== -1) newRow[highIdx] = data.highlightTier || "";
      if (orderIdx !== -1) newRow[orderIdx] = data.order || "";
      if (tipoIdx !== -1) newRow[tipoIdx] = data.tipo || "";
      
      sheet.appendRow(newRow);
      return ContentService.createTextOutput(JSON.stringify({success: true}))
          .setMimeType(ContentService.MimeType.JSON);
    } else if (action === "delete") {
      var name = data.name;
      var rowIndex = -1;
      for (var i = 1; i < rows.length; i++) {
        if (rows[i][nameIdx] === name) {
          rowIndex = i + 1;
          break;
        }
      }
      if (rowIndex !== -1) {
        sheet.deleteRow(rowIndex);
        return ContentService.createTextOutput(JSON.stringify({success: true}))
            .setMimeType(ContentService.MimeType.JSON);
      } else {
        return ContentService.createTextOutput(JSON.stringify({success: false, error: "Not found"}))
            .setMimeType(ContentService.MimeType.JSON);
      }
    }
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({success: false, error: err.message}))
        .setMimeType(ContentService.MimeType.JSON);
  }
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

// Confronto a tempo costante.
function safeEqual_(a, b) {
  if (a.length !== b.length) return false;
  var diff = 0;
  for (var i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return diff === 0;
}

// Limita la lunghezza dei campi e neutralizza le formule (=, +, -, @) per evitare "formula injection".
function sanitize_(data) {
  var out = {};
  for (var k in data) {
    var v = data[k];
    if (typeof v === "string") {
      v = v.slice(0, 500);
      if (k !== "secret" && /^[=+\-@]/.test(v)) v = "'" + v;
    }
    out[k] = v;
  }
  return out;
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({status: "ok"}))
      .setMimeType(ContentService.MimeType.JSON);
}
