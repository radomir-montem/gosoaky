class CartUpsellForm extends HTMLElement {
  constructor() {
    super();
    this.form = this.querySelector('form')
    this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer')
    this.submitButton = this.querySelector('[type="submit"]')
    this.form.addEventListener('submit', this.onSubmitHander.bind(this))
  }

  onSubmitHander(e) {
    e.preventDefault()

    this.submitButton.classList.add('loading')
    this.querySelector('.loading-overlay__spinner').classList.remove('hidden')

    const config = fetchConfig('javascript');
    config.headers['X-Requested-With'] = 'XMLHttpRequest';
    delete config.headers['Content-Type'];

    const formData = new FormData(this.form);
    if (this.cart) {
        formData.append('sections', this.cart.getSectionsToRender().map((section) => section.id));
        formData.append('sections_url', window.location.pathname);
        this.cart.setActiveElement(document.activeElement);
    }
    config.body = formData;

    fetch(`${routes.cart_add_url}`, config)
    .then((response) => response.json())
    .then((response) => {
        if (response.status) {
            this.error = true;
            return;
        } else if (!this.cart) {
            window.location = window.routes.cart_url;
            return;
        }

        this.error = false;
        this.cart.renderContents(response);
    })
    .catch((e) => {
        console.error(e);
    })
    .finally(() => {
        this.submitButton.classList.remove('loading')
        if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty')
        this.querySelector('.loading-overlay__spinner').classList.add('hidden')
    });
  }
}

customElements.define('cart-upsell-form', CartUpsellForm);