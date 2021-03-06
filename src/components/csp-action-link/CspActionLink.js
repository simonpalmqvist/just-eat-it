import html from './CspActionLink.html'

// Fix since Safaris Elements are objects and not class functions
const WrappedHTMLAnchorElement = function () {}
WrappedHTMLAnchorElement.prototype =
  Object.create(window.HTMLAnchorElement.prototype)

class CspActionLink extends WrappedHTMLAnchorElement {

  static get extends () { return 'a' }

  createdCallback () {
    this.innerHTML += html

    this._buttonTop = this.querySelector('#button-top')
    this._handleClick = this._handleClick.bind(this)
  }

  attachedCallback () {
    this.addEventListener('click', this._handleClick)
  }

  detachedCallback () {
    this.removeEventListener('click', this._handleClick)
  }

  _handleClick (event) {
    event.preventDefault()

    const buttonSize = this._buttonTop.getBoundingClientRect().width
    const maxWindowSize = Math.max(window.innerHeight, window.innerWidth)
    const scale = ((maxWindowSize / buttonSize) * 1.4).toFixed(1)

    this._buttonTop.style.willChange = 'transform'

    const keyFrames = [
      { transform: 'translateY(1%)', offset: 0 },
      { transform: 'translateY(10%)', offset: 0.35 },
      { transform: 'translateY(9%)', offset: 0.40 },
      { transform: `scale(${scale},${scale})`, offset: 1 }
    ]

    const player = this._buttonTop.animate(keyFrames, { duration: 700 })

    player.onfinish = () => {
      this._buttonTop.style.willChange = 'auto'
      document.querySelector('csp-router').go(this.href)
    }
  }

}

document.registerElement('csp-action-link', CspActionLink)
