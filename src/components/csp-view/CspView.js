// Fix since Safaris Elements are objects and not class functions
const WrappedHTMLElement = function () {}
WrappedHTMLElement.prototype = Object.create(window.HTMLElement.prototype)

function _ajax (url) {
  return new Promise((resolve, reject) => {
    const request = new window.XMLHttpRequest()
    request.open('GET', url)

    request.onload = _ => {
      request.status === 200 ? resolve(request.responseText) : reject(request.status)
    }
    request.send(null)
  })
}

class CspView extends WrappedHTMLElement {

  attachedCallback () {
    if (this._lazyLoad) this._loadContent()
  }

  get _lazyLoad () {
    return this.getAttribute('lazy-load')
  }

  get route () {
    return this.getAttribute('route')
  }

  // TODO: Replace with fetch, maybe load on
  _loadContent () {
    _ajax(this._lazyLoad)
      .then(response => { this.innerHTML = response })
      .catch(err => console.warn(`Could not load view content: ${err}`))
  }

  match (location) {
    const regexp = new RegExp(`^${this.route}/{0,1}$`)
    return regexp.test(location)
  }

}

document.registerElement('csp-view', CspView)
