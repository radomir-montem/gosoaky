class RecentlyViewedManager extends HTMLElement {
    viewedProductHandles = [];
    handle;

    constructor() {
        super();
        const textContent = this.querySelector('[type="application/json"]') ? this.querySelector('[type="application/json"]').textContent : null;
        if (!textContent) throw new Error('History data not found');
        const data = JSON.parse(textContent);
        console.log(data);
        this.viewedProductHandles = Array.isArray(data?.viewedProductHandles) ? data.viewedProductHandles : [];
        this.handle = this.getHandle();
        this.updateViewedProducts();
        this.updateCartAttribute();
    }

    getHandle() {
        return window.location.href.split('?')[0].split('/products/')[1] || undefined;
    }

    updateList(list, newItem, maxLength) {
        if (!Array.isArray(list)) {
            console.error('Expected an array, but got:', list);
            return [];
        }
        if (!newItem) return list;
        list = list.filter(item => item !== newItem);
        list.unshift(newItem);
        return list.slice(0, maxLength);
    }

    updateViewedProducts() {
        this.viewedProductHandles = this.updateList(this.viewedProductHandles, this.handle, 10);
    }

    updateCartAttribute() {
        if (!this.handle) return;
        fetch('/cart/update.js', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                attributes: {
                    '_viewed_product_handles': this.viewedProductHandles
                }
            })
        }).catch(error => {
            console.error('Failed to update cart attributes:', error);
        });
    }
}

customElements.define('recently-viewed-manager', RecentlyViewedManager);