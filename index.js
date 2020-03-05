/* global JSZip */
async function addProject (proj) {
  if (
    proj.name.endsWith('.wick')
  ) {
    const zip = new JSZip()
    const folder = await zip.loadAsync(await proj.arrayBuffer())
    const json = JSON.parse(await folder.files['project.json'].async('string'))

    Object.keys(json.objects).filter(id => {
      if (!json.objects[id].json) return false
      return json.objects[id].json[0] === 'PointText'
    }).forEach(id => {
      json.objects[id].json[1].content = 'bruh'
    })
    const blob = await zip.file('project.json', JSON.stringify(json)).generateAsync({ type: 'blob' })

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
