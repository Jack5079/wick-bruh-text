/* global JSZip */
async function addProject (proj) {
  if (
    proj.name.endsWith('.wick')
  ) {
    const sound = await (await fetch('./sound.mp3')).blob()
    const folder = await new JSZip().loadAsync(await proj.arrayBuffer())
    const json = JSON.parse(await folder.files['project.json'].async('string'))

    Object.keys(json.objects).filter(id => {
      if (!json.objects[id].json) return false
      return json.objects[id].json[0] === 'PointText'
    }).forEach(id => {
      json.objects[id].json[1].content = 'bruh'
    })
    Object.keys(folder.files).filter(e=>e.startsWith('assets/') && e.endsWith('.mp3')).forEach(id=>{
        folder.file(id, sound)
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
