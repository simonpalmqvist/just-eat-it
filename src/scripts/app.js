const arrowFun = _ => console.log('ooh')

arrowFun()

const input = document.querySelector('#test-data-binding')
const state = document.querySelector('csp-state')

input.addEventListener('keyup', () => {
  state.updateState('purchase.amount', input.value)
})
