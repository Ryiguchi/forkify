import icons from 'url:../../img/icons.svg';

export default class View {
  _data;
  // gets the data and stores it as a private variable so it can be used throughout the class

  /**
   * Render the received object to the dom
   * @param {Object | Object[]} data The data to be rendered (e.g. recipe)
   * @param {boolean} [render=true] If false, creates markup string instead of rendering to DOM
   * @returns {undefined | string} A markup is returned if render = false
   * @this {Object} View instance
   * @author Ryan Iguchi
   */
  render(data, render = true) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;
    // remove spinner
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    // to create and compare DOM elements so only what is different gets updated
    // create virtual DOM
    const newDOM = document.createRange().createContextualFragment(newMarkup);
    // get array of virtual DOM
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    // get array of current DOM
    const curElements = Array.from(this._parentElement.querySelectorAll('*'));
    // loop through and compare
    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];
      // UPDATES CHANGED TEXT
      // what contains the text is the (firstChild Node)
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        // console.log(newEl.firstChild.nodeValue.trim());
        curEl.textContent = newEl.textContent;
      }

      // UPDATE CHANGED ATTRIBUTES
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(attr =>
          curEl.setAttribute(attr.name, attr.value)
        );
    });
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  renderSpinner() {
    const markup = `
      <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderError(message = this._errorMessage) {
    const markup = `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  renderMessage(message = this._message) {
    const markup = `
      <div class="message">
        <div>
          <svg>
            <use href="${icons}#icon-smile"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
