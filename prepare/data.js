const gdx = require('node-gdx')
const http = require('http')
const fs = require('fs')
const _ = require('lodash')
const path = require('path')
const file = require('./config')
const create = require('./create')

function serverRunning() {
  return new Promise((resolve, reject) => {
    http
      .request({
        method:'HEAD',
        host: 'http://localhost:5000/',
        port:80,
        path: '/'
      }, (r) => {
        resolve(r.statusCode >= 200 && r.statusCode < 400 )
      })
      .on('error', reject)
      .end()
  })

}

;(async () => {
  try {
    const exportData = {}
    const data = await gdx.read(file)

    exportData.cropHa = data.p_crop.filter(d => d['1'] === 'cropHA').map(d => [d['2'],d.Value])
    exportData.dryMatter = data.p_crop.filter(d => d['1'] === 'cropProduction').map(d => [d['2'],d['3'],d.Value])
    exportData.profitFct = data.p_ProfitFct.map(d => [d['1'],d['2'],d.Value])
    exportData.soldOutputQuant = data.p_other.filter(d => d['1'] === 'SoldOutputQuant').map(d => [d['2'],d.Value])
    exportData.inputQuant = data.p_other.filter(d => d['1'] === 'inputQuant').map(d => [d['2'],d.Value])
    exportData.feedHerdsByMonth = _.groupBy(data.p_other.filter(d => d['3'] === 'Feed').map(d => [d['1'],d['2'],d['4'],d.Value]), a => a[1])
    exportData.lu = data.p_sumHerd.filter(d => d['3'] === 'LU').map(d => [d['1'],d.Value])
    exportData.n = data.p_crop.filter(d => d['3'] === 'N').map(d => [d['2'],d['1'],d.Value])
    exportData.P = data.p_crop.filter(d => d['3'] === 'P').map(d => [d['2'],d['1'],d.Value])
    exportData.sumHerd = data.p_sumHerd.filter(zeile => zeile['3'] === 'No').map(zeile => [zeile['1'],zeile['2'],zeile.Value])
    exportData.envi = data.p_envi.filter(zeile => zeile['2'] === 'total').map(zeile => [zeile['1'],zeile.Value])
    exportData.GWP = data.p_envi.filter(zeile => zeile['2'] === 'GWP').map(zeile => [zeile['3'],zeile.Value])
    exportData.PMFP = data.p_envi.filter(zeile => zeile['2'] === 'PMFP').map(zeile => [zeile['3'],zeile.Value])
    exportData.TAP = data.p_envi.filter(zeile => zeile['2'] === 'TAP').map(zeile => [zeile['3'],zeile.Value])
    exportData.FEP = data.p_envi.filter(zeile => zeile['2'] === 'FEP').map(zeile => [zeile['3'],zeile.Value])
    exportData.MEP = data.p_envi.filter(zeile => zeile['2'] === 'MEP').map(zeile => [zeile['3'],zeile.Value])
    exportData.work = data.p_soci.filter(zeile => zeile['2']).map(zeile => [zeile['3'],zeile['2'],zeile.Value])
    exportData.work1 = data.p_soci.filter(zeile => zeile['3'] === 'sum').map(zeile => [zeile['1'],zeile.Value])
    exportData.calorie = data.p_soci.filter(zeile => zeile['3'] === 'Calorie').map(zeile => [zeile['1'],zeile.Value])
    const exportString = `window.data = ${JSON.stringify(exportData)}`
    fs.writeFileSync('export.js', exportString,'utf8')
    
    // if server is running, update graphs and pdf
    if (await serverRunning()) {
      await create(path.basename(file,'.gdx'))
    }
  } catch (e) {
    console.log(e)
  }
})()
