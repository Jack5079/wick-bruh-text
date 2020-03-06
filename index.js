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

document.getElementById('import').addEventListener('change', event => {
  for (const file of event.target.files) worker.postMessage(file)
})
