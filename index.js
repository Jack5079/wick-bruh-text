/* global JSZip, fetch */

async function addProject (proj) {
  if (
    proj.name.endsWith('.wick')
  ) {
    const folder = await new JSZip().loadAsync(await proj.arrayBuffer())
    const json = JSON.parse(await folder.files['project.json'].async('string')) // .wick files are just .zip files. most of the data is in project.json

    // this replaces all .mp3 assets with the bruh sound
    // this is done BEFORE the text replacement as it also lowers the .wick file's size a ton, which hopefully makes it easier to work with
    const mp3files = Object.keys(folder.files)
      .filter(e => e.startsWith('assets/') && e.endsWith('.mp3')) // .mp3 files in the assets folder
    if (mp3files.length) {
      const sound = await (await fetch('./assets/sound.mp3')).blob()
      mp3files.forEach(id => {
        folder.file(id, sound) // Overwrite the files with the bruh sound blob.
      })
    }

    // this replaces every text with "bruh"
    Object.keys(json.objects).filter(id => { // Clips, text, paths, etc. are stored in the project.json file. We will get the IDs of every single object, and filter it.
      if (!json.objects[id].json) return false // If it doesn't have the data we need, ignore it.
      return json.objects[id].json[0] === 'PointText' // If does have the data but it isn't text, ignore it.
    }).forEach(id => { // Now for the actual text replacement
      json.objects[id].json[1].content = 'bruh'
    })

    const blob = await folder.file('project.json', JSON.stringify(json)).generateAsync({ type: 'blob' })

    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = json.project.name + '.wick'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    URL.revokeObjectURL(link.href)
  }
}

document.getElementById('import').addEventListener('change', event => {
  const projects = [...event.currentTarget.files]
  projects.forEach(addProject)
})
