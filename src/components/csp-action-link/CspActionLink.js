const html = require('./CspActionLink.html')

//Fix since Safaris Elements are objects and not class functions
var WrappedHTMLAnchorElement = function () {}
WrappedHTMLAnchorElement.prototype = Object.create(HTMLAnchorElement.prototype)

class CspActionLink extends WrappedHTMLAnchorElement {

  constructor() {
    super()
  }

  static get extends() { return "a" }

  createdCallback() {
    this.innerHTML += html

    this._buttonTop = this.querySelector("#button-top")
    this._handleClick = this._handleClick.bind(this)
  }

  attachedCallback() {
    this.addEventListener("click", this._handleClick)
  }

  _handleClick(event) {
    event.preventDefault()
    this.classList.add("animate")

    //Run animation before going to new url
    const action = event => {
      this._buttonTop.removeEventListener("animationend", action)
      window.location = this.href;
    }

    this._buttonTop.addEventListener("animationend", action)
  }
}

document.registerElement("csp-action-link", CspActionLink)
