/* eslint-env worker */
/* global JSZip */

importScripts('./assets/jszip.min.js')

self.addEventListener('message', async message => {
  const proj = message.data
  const zip = await new JSZip().loadAsync(await proj.arrayBuffer())
  const project = JSON.parse(await zip.files['project.json'].async('string')) // .wick files are just .zip files. most of the data is in project.json

  // this replaces all .mp3 assets with the bruh sound
  // this is done BEFORE the text replacement as it also lowers the .wick file's size a ton, which hopefully makes it easier to work with
  const mp3files = Object.keys(zip.files)
    .filter(filename => filename.startsWith('assets/') && filename.endsWith('.mp3')) // .mp3 files in the assets folder
  if (mp3files.length) {
    const sound = await (await fetch('./assets/sound.mp3')).blob()
    mp3files.forEach(filename => {
      zip.file(filename, sound) // Overwrite the files with the bruh sound blob.
    })
  }

  // this replaces every text with "bruh"
  // Clips, text, paths, etc. are stored in the project.json file. We will get the IDs of every single object, and filter it to only text.
  Object.keys(project.objects)
    .filter(id => project.objects[id].json && project.objects[id].json[0] === 'PointText') // Only objects with data which has the text type
    .forEach(id => { // Now for the actual text replacement
      project.objects[id].json[1].content = 'bruh'
    })

  const blob = await zip.file('project.json', JSON.stringify(project)).generateAsync({ type: 'blob' })

  self.postMessage({
    blob: blob,
    meta: project.project
  })
})
