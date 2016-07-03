// Fix since Safaris Elements are objects and not class functions
const WrappedHTMLElement = function () {}
WrappedHTMLElement.prototype = Object.create(window.HTMLElement.prototype)

// private static member to keep the same state
let _state = {}

class CspState extends WrappedHTMLElement {

  /* TODO:
      * Handle arrays (add keys for tracking status)
      * deep copy stored value
  */

  createdCallback () {
    if (!this.store) return

    const _storedState = JSON.parse(window.localStorage.getItem(this.storeName))

    // Clear localStorage if new store should be used
    if (!_storedState) window.localStorage.clear()

    _state = _storedState || _state
  }

  get storeName () {
    return this.getAttribute('store-name') || 'state-storage'
  }

  get store () {
    return this.getAttribute('store') !== undefined && window.localStorage
  }

  getValue (path) {
    return path
      .split('.')
      .reduce((cursor, field) => typeof cursor === 'object' ? cursor[field] : undefined, _state)
  }

  updateValue (path, newValue) {
    // Copy state
    let newState = Object.assign({}, _state)
    let oldValue

    path.split('.').reduce((cursor, field, i, fields) => {
      // get old value and set new value when on last field
      if (i === fields.length - 1) {
        oldValue = cursor[field]
        cursor[field] = newValue
        return
      }
      // Update state value
      cursor[field] = this._cloneValue(cursor[field]) || {}

      // Return next copy
      return cursor[field]
    }, newState)

    if (oldValue === newValue) return

    /*
    console.log(
      'Old state', _state, '\n',
      'New state', newState, '\n',
      'Old value', oldValue, '\n',
      'New value', newValue, '\n',
      'Path', path)

    */
    _state = newState
    this._fireChangeEvent({path, oldValue, newValue})

    if (!this.store) return

    window.localStorage.setItem(this.storeName, JSON.stringify(newState))
  }

  _cloneValue (value) {
    if (value === undefined) {
      value = undefined
    } else if (typeof value === 'object') {
      value = Object.assign({}, value)
    } else {
      throw new Error('Field is not undefined or an object')
    }
    return value
  }

  _fireChangeEvent (detail) {
    const event = new window.CustomEvent('cspStateChange', {
      detail,
      bubbles: true,
      cancelable: true
    })

    this.dispatchEvent(event)
  }
}

document.registerElement('csp-state', CspState)
