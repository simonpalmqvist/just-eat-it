// Fix since Safaris Elements are objects and not class functions
const WrappedHTMLElement = function () {}
WrappedHTMLElement.prototype = Object.create(window.HTMLElement.prototype)

class CspRouter extends WrappedHTMLElement {

  createdCallback () {
    this._handleRoute = this._handleRoute.bind(this)
    this._views = []
  }

  attachedCallback () {
    window.addEventListener('popstate', this._handleRoute)
    this._initViews()
    this._handleRoute()
  }

  detachedCallback () {
    window.removeEventListener('popstate', this._handleRoute)
  }

  go (url) {
    window.history.pushState(null, null, url)
    this._handleRoute()
  }

  _initViews () {
    Array.from(this.querySelectorAll('csp-view')).forEach(view => {
      let route = view.route
      if (route && !this._views.find(v => v.route === route)) {
        this._views.push(view)
      }
    })
  }

  _handleRoute (event) {
    if (event) event.preventDefault()
    const location = window.location.pathname

    const newView = this._views.find(v => v.match(location))

    if (!newView) return

    if (this._currentView) {
      this._currentView.classList.remove('active')
    }

    newView.classList.add('active')
    this._currentView = newView
  }
}

document.registerElement('csp-router', CspRouter)
