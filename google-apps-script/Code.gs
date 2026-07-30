/**
 * Pegar este código en: script.google.com → Nuevo proyecto
 * vinculado a tu hoja "Pedidos Kitos".
 *
 * 1. Extensiones → Apps Script → pegar TODO este archivo
 * 2. Implementar → Nueva implementación → Aplicación web
 *    - Ejecutar como: Yo
 *    - Quién tiene acceso: Cualquiera
 * 3. Copiar URL /exec a VITE_SHEETS_WEBAPP_URL en .env
 * 4. Cada vez que cambies el código: Implementar → Administrar → Nueva versión
 *
 * Hojas que crea automáticamente:
 * - Pedidos: historial de ventas
 * - Ranking: unidades vendidas por producto (alimenta el badge "Popular")
 */

var TOP_POPULAR = 3
var MIN_UNITS_FOR_POPULAR = 1

function doPost(e) {
  try {
    var data = JSON.parse(e.postData.contents)
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var sheet = getOrCreatePedidos_(ss)

    sheet.appendRow([
      data.folio || '',
      data.fecha || '',
      data.cliente || '',
      data.telefono || '',
      data.tipo || '',
      data.direccion || '',
      data.notas || '',
      data.items || '',
      data.total || 0,
      data.totalTexto || '',
      data.estado || 'Nuevo',
      data.pago || '',
    ])

    // Actualiza ranking con IDs de producto para Popular automático
    updateRanking_(ss, data.lineItems || [])

    return json_({ ok: true })
  } catch (err) {
    return json_({ ok: false, error: String(err) })
  }
}

/**
 * GET → { popular: string[], ranking: [{ id, name, units }] }
 * La web llama esto al cargar para marcar productos Popular.
 */
function doGet() {
  try {
    var ss = SpreadsheetApp.getActiveSpreadsheet()
    var ranking = readRanking_(ss)
    var popular = ranking
      .filter(function (r) {
        return r.units >= MIN_UNITS_FOR_POPULAR
      })
      .slice(0, TOP_POPULAR)
      .map(function (r) {
        return r.id
      })

    return json_({
      ok: true,
      popular: popular,
      ranking: ranking,
    })
  } catch (err) {
    return json_({ ok: false, error: String(err), popular: [], ranking: [] })
  }
}

function getOrCreatePedidos_(ss) {
  var sheet = ss.getSheetByName('Pedidos')
  if (!sheet) {
    sheet = ss.insertSheet('Pedidos')
    sheet.appendRow([
      'Folio',
      'Fecha',
      'Cliente',
      'Teléfono',
      'Tipo',
      'Dirección',
      'Notas',
      'Items',
      'Total',
      'Total Texto',
      'Estado',
      'Pago',
    ])
    sheet.getRange(1, 1, 1, 12).setFontWeight('bold')
    return sheet
  }

  // Si la hoja ya existía sin columna Pago, la agrega
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0]
  var hasPago = headers.some(function (h) {
    return String(h).toLowerCase() === 'pago'
  })
  if (!hasPago) {
    var col = headers.length + 1
    sheet.getRange(1, col).setValue('Pago').setFontWeight('bold')
  }
  return sheet
}

function getOrCreateRanking_(ss) {
  var sheet = ss.getSheetByName('Ranking')
  if (!sheet) {
    sheet = ss.insertSheet('Ranking')
    sheet.appendRow(['ProductId', 'Nombre', 'UnidadesVendidas'])
    sheet.getRange(1, 1, 1, 3).setFontWeight('bold')
  }
  return sheet
}

function updateRanking_(ss, lineItems) {
  if (!lineItems || !lineItems.length) return

  var sheet = getOrCreateRanking_(ss)
  var lastRow = sheet.getLastRow()
  var map = {}

  if (lastRow >= 2) {
    var values = sheet.getRange(2, 1, lastRow, 3).getValues()
    for (var i = 0; i < values.length; i++) {
      var id = String(values[i][0] || '')
      if (!id) continue
      map[id] = {
        row: i + 2,
        name: String(values[i][1] || ''),
        units: Number(values[i][2]) || 0,
      }
    }
  }

  for (var j = 0; j < lineItems.length; j++) {
    var line = lineItems[j]
    var pid = String(line.productId || '')
    if (!pid) continue
    var qty = Number(line.qty) || 0
    var pname = String(line.name || pid)

    if (map[pid]) {
      map[pid].units += qty
      if (pname) map[pid].name = pname
      sheet.getRange(map[pid].row, 2, map[pid].row, 3).setValues([
        [map[pid].name, map[pid].units],
      ])
    } else {
      sheet.appendRow([pid, pname, qty])
      map[pid] = {
        row: sheet.getLastRow(),
        name: pname,
        units: qty,
      }
    }
  }
}

function readRanking_(ss) {
  var sheet = ss.getSheetByName('Ranking')
  if (!sheet || sheet.getLastRow() < 2) return []

  var values = sheet.getRange(2, 1, sheet.getLastRow(), 3).getValues()
  var rows = []
  for (var i = 0; i < values.length; i++) {
    var id = String(values[i][0] || '')
    if (!id) continue
    rows.push({
      id: id,
      name: String(values[i][1] || ''),
      units: Number(values[i][2]) || 0,
    })
  }

  rows.sort(function (a, b) {
    return b.units - a.units
  })
  return rows
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(
    ContentService.MimeType.JSON,
  )
}
