// @ts-check
// IIFE
;(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
  const formEl = document.getElementById('form')
  /** @type {HTMLInputElement | null} */
  // @ts-ignore
  const inputEl = document.getElementById('input')

  if (!formEl || !inputEl) {
    throw new Error('Init Failed')
  }

  formEl.addEventListener('submit', (event) => {
    event.preventDefault()
    socket.send(
      JSON.stringify({
        nickname: '데이비드윤',
        message: inputEl.value,
      })
    )
    inputEl.value = ''
  })

  socket.addEventListener('message', (event) => {
    alert(event.data)
  })
})()
