// Fix since Safaris Elements are objects and not class functions
const WrappedHTMLElement = function () {}
WrappedHTMLElement.prototype = Object.create(window.HTMLElement.prototype)

class CspRouter extends WrappedHTMLElement {

  createdCallback () {
    this._handleRoute = this._handleRoute.bind(this)
    this._routes = new Map()
  }

  attachedCallback () {
    window.addEventListener('popstate', this._handleRoute)
    this._initRoutes()
    this._handleRoute()
  }

  detachedCallback () {
    window.removeEventListener('popstate', this._handleRoute)
  }

  go (url) {
    window.history.pushState(null, null, url)
    this._handleRoute()
  }

  _initRoutes () {
    for (let view of document.querySelectorAll('csp-view')) {
      let route = view.route
      if (!route || this._routes.has(route)) continue

      this._routes.set(new RegExp(`^${view.route}/{0,1}$`), view)
    }
  }

  _handleRoute (event) {
    if (event) event.preventDefault()
    const location = window.location.pathname

    const route = Array.from(this._routes.keys())
      .find(r => r.test(location))

    if (!route) return

    const newView = this._routes.get(route)

    if (this._currentRoute) {
      this._currentRoute.classList.remove('active')
    }

    newView.classList.add('active')
    this._currentRoute = newView
  }
}

document.registerElement('csp-router', CspRouter)
