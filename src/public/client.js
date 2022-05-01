// @ts-check
// IIFE
;(() => {
  const socket = new WebSocket(`ws://${window.location.host}/ws`)
})()

alert('Client.js loaded')
