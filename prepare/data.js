const gdx = require('node-gdx')
const fs = require('fs')
const _ = require('lodash')

// const file = process.argv[2]  Fr.Cant-CC  FR.Cant-DCC  Fr.Lim-CC  FR.Lor-BF  GE.BAV-F  GE.LS-F  GE.NRW-DF  IT-F.226  IT-F.913
const file = 'N:/em/work1/FarmDyn/FamrDyn_Kokemohr/running_file_3/trunk/results/SustainBeef/FR.Lor-BF.gdx'

;(async () => {
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
})()
