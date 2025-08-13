class stickyAtc extends HTMLElement {
    constructor() {
        super();
        this.productForm = document.querySelector('.sg-product-hero .sg-product-page-hero');
        this.atcButton = document.querySelector('.sg-product-page-button');
        this.stickyButton = this.querySelector('.sticky__button');
        this.stickySelect = this.querySelector('[name="id"]');
        this.priceElement = this.querySelector('.sticky-stc-price');
        this.variantSelect = document.querySelector('.sg-product-page-hero').querySelector('[data-type="add-to-cart-form"]').querySelector('[name="id"]');
        this.variantPicker = document.querySelector('.sg-product-page-wrapper variant-radios') || document.querySelector('.sg-product-page-wrapper variant-selects');
    }

    connectedCallback() {
        const _this = this;
        const handleIntersection = (entries, observer) => {
            entries.forEach(entrie => {
                _this.classList.toggle('hidden', entrie.isIntersecting && window.scrollY > _this.productForm.getBoundingClientRect().bottom);
                _this.classList.toggle('show', !entrie.isIntersecting && window.scrollY > _this.productForm.getBoundingClientRect().bottom);
            });
        }

        new IntersectionObserver(handleIntersection.bind(this.productForm), { rootMargin: `-500px 0px 0px 0px` }).observe(this.productForm);
        this.stickyButton.addEventListener('click', this.onClickAtcButton.bind(this));
        this.stickySelect.addEventListener('change', this.onChangeStickySelect.bind(this));
        this.variantSelect.addEventListener('change', this.onChangeVariantSelect.bind(this));
    }

    onClickAtcButton() {
        this.atcButton.click();
    }

    onChangeStickySelect() {
        const option = this.stickySelect.querySelector(`option[value="${this.stickySelect.value}"]`);
        const price = option.dataset.price;
        const options = option.textContent.trim().split(' / ');
        document.querySelectorAll('.sg-product-page-wrapper .product-form__input').forEach((variantWrapper, index) => {
            if (index > 0) {
                variantWrapper.querySelectorAll('input').forEach(input => {
                    if (!input.checked && options.indexOf(input.value) > -1) {
                        input.checked = true;
                        input.dispatchEvent(new Event('change'));
                        this.variantPicker.dispatchEvent(new Event('change'));
                    }
                });
            }
        });
        this.variantSelect.value = this.stickySelect.value;
        this.priceElement.textContent = price;
    };

    onChangeVariantSelect() {
        const variantValue = this.variantSelect.value;
        const stickyOption = this.stickySelect.querySelector(`option[value="${variantValue}"]`);
        stickyOption.selected = true;
        const price = stickyOption.dataset.price;
        this.priceElement.textContent = price;
    }
}

customElements.define('sticky-atc-button', stickyAtc);