// Fix since Safaris Elements are objects and not class functions
const WrappedHTMLElement = function () {}
WrappedHTMLElement.prototype = Object.create(window.HTMLElement.prototype)

class CspStateValue extends WrappedHTMLElement {

  createdCallback () {
    if (!this.path) return

    const state = document.querySelector('csp-state')

    this._updateValue = this._updateValue.bind(this)
    this.textContent = state.getValue(this.path)
  }

  attachedCallback () {
    if (!this.path) return

    document.addEventListener('cspStateChange', this._updateValue)
  }

  detachedCallback () {
    document.removeEventListener('cspStateChange', this._updateValue)
  }

  get path () {
    return this.getAttribute('path')
  }

  _updateValue (e) {
    if (e.detail.path !== this.path) return
    this.textContent = e.detail.newValue
  }
}

document.registerElement('csp-state-value', CspStateValue)
