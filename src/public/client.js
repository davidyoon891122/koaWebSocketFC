// @ts-check
// IIFE
;(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
  const formEl = document.getElementById('form')
  const chatsEl = document.getElementById('chats')
  /** @type {HTMLInputElement | null} */
  // @ts-ignore
  const inputEl = document.getElementById('input')

  if (!formEl || !inputEl || !chatsEl) {
    throw new Error('Init Failed')
  }

  /**
   * @typedef Chat
   * @property {string} nickname
   * @property {string} message
   */

  /**
   * @type {Chat[]}
   */
  const chats = []

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
    chats.push(JSON.parse(event.data))
    chatsEl.innerHTML = ''
    chats.forEach(({ nickname, message }) => {
      const div = document.createElement('div')
      div.innerText = `${nickname}: ${message}`
      chatsEl.appendChild(div)
    })
  })
})()
