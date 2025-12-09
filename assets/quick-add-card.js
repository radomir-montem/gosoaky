if (!customElements.get('quick-add-card')) {
    customElements.define('quick-add-card', class QuickAddCard extends HTMLElement {
        constructor() {
            super();
            this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer');
            this.atcButtons = this.querySelectorAll('.go-product-card-atc__button');
            this.atcButtons.forEach(button => {
                button.addEventListener('click', this.onSubmitHandler.bind(this));
            });
            this.openButton = this.previousElementSibling;
            this.overlap = this.openButton.previousElementSibling;
            this.openButton.addEventListener('click', (e) => {
                e.preventDefault();
                this.classList.add('active');
                this.overlap.classList.add('active');
            });
            this.overlap.addEventListener('click', (e) => {
                e.preventDefault();
                this.classList.remove('active');
                this.overlap.classList.remove('active');
            });
            document.body.addEventListener('click', (e) => {
                const target = e.target;
                const quickCard = target.closest('quick-add-card');
                if(quickCard == null) {
                    this.classList.remove('active');
                    this.overlap.classList.remove('active');
                } else if (quickCard == this) return;
                else {
                    this.classList.remove('active');
                    this.overlap.classList.remove('active');
                }
                
            });
        }

        onSubmitHandler(evt) {
            evt.preventDefault();
            const submitButton = evt.currentTarget;
            if (submitButton.disabled) return;

            submitButton.setAttribute('aria-disabled', true);
            submitButton.classList.add('loading');
            submitButton.querySelector('.loading-overlay__spinner').classList.remove('hidden');

            const config = fetchConfig('javascript');
            config.headers['X-Requested-With'] = 'XMLHttpRequest';
            delete config.headers['Content-Type'];

            const formData = new FormData();
            formData.append('id', submitButton.dataset.id || '');
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
                }

                this.error = false;
                this.cart.renderContents(response);
            })
            .catch((e) => {
                console.error(e);
            })
            .finally(() => {
                submitButton.classList.remove('loading');
                if (this.cart && this.cart.classList.contains('is-empty')) this.cart.classList.remove('is-empty');
                if (!this.error) submitButton.removeAttribute('aria-disabled');
                submitButton.querySelector('.loading-overlay__spinner').classList.add('hidden');
                this.classList.remove('active');
                this.overlap.classList.remove('active');
            });
        }
    });
}
