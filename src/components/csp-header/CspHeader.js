// Fix since Safaris Elements are objects and not class functions
const WrappedHTMLElement = function () {}
WrappedHTMLElement.prototype = Object.create(window.HTMLElement.prototype)

class CspHeader extends WrappedHTMLElement {

  get _effectStart () {
    return Number(this.getAttribute('effect-start'))
  }

  createdCallback () {
    this._scrolling = false
    this._lastScrollTop = 0
    this._setupScrollListener = this._setupScrollListener.bind(this)
    this._removeScrollListener = this._removeScrollListener.bind(this)
    this._scroll = this._scroll.bind(this)
    this._toggleVisible = this._toggleVisible.bind(this)
  }

  attachedCallback () {
    this._views = Array.from(document.querySelectorAll('csp-view'))
    this._height = this._effectStart || this.offsetHeight

    // Add listeners for all views
    this._views.forEach(this._setupScrollListener)
  }

  detachedCallback () {
    this._views.forEach(this._removeScrollListener)
  }

  _setupScrollListener (view) {
    view.addEventListener('scroll', this._scroll)
  }

  _removeScrollListener (view) {
    view.removeEventListener('scroll', this._scroll)
  }

  _scroll (event) {
    // Only run toggle function each 250 ms
    if (!this._waitForScrollAction) {
      this._waitForScrollAction = true
      setTimeout(() => this._toggleVisible(event.target), 250)
    }
  }

  _toggleVisible (view) {
    const scrollTop = view.scrollTop

    // Check if user scrolled up or down and toggle header
    if (scrollTop > this._lastScrollTop && scrollTop > this._height) {
      this.classList.add('hide')
    } else {
      if (scrollTop + window.innerHeight < view.scrollHeight) {
        this.classList.remove('hide')
      }
    }

    // Set last scroll position and remove wait flag
    this._lastScrollTop = scrollTop
    this._waitForScrollAction = false
  }

}

document.registerElement('csp-header', CspHeader)
