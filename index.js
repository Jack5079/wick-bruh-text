/* global Worker */

const worker = new Worker('./worker.js')

worker.addEventListener('message', message => {
  const link = document.createElement('a')
  console.log(message.data)
  link.href = URL.createObjectURL(message.data.blob)
  link.download = message.data.meta.name + '.wick'
  link.style.display = 'none'
  document.body.appendChild(link)
  link.click()
  URL.revokeObjectURL(link.href)
})
async function addProject (proj) {
  worker.postMessage(proj)
}

document.getElementById('import').addEventListener('change', event => {
  const projects = [...event.currentTarget.files]
  projects.forEach(addProject)
})
