// Fix since Safaris Elements are objects and not class functions
const WrappedHTMLElement = function () {}
WrappedHTMLElement.prototype = Object.create(window.HTMLElement.prototype)

class CspView extends WrappedHTMLElement {

  createdCallback () {
  }

  attachedCallback () {
  }

  detachedCallback () {
  }

  get route () {
    return this.getAttribute('route')
  }

  match (location) {
    const regexp = new RegExp(`^${this.route}/{0,1}$`)
    return regexp.test(location)
  }

}

document.registerElement('csp-view', CspView)
