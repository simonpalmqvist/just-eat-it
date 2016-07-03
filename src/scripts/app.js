const arrowFun = _ => console.log('ooh')

arrowFun()

const input = document.querySelector('#test-data-binding')
const state = document.querySelector('csp-state')

input.addEventListener('keyup', () => {
  state.updateValue('purchase.amount', input.value)
})
