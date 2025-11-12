let applyBtn = document.querySelector("#apply-discount-btn");
let discountCodeInput = document.querySelector("#discount-code");

if (localStorage.getItem('apply_discount')) {
    document.querySelector('#cart-icon-bubble')?.click();
    localStorage.removeItem('apply_discount');
}

applyBtn.addEventListener("click", function (e) {
    e.preventDefault();
    applyDiscount(discountCodeInput.value);
});

function applyDiscount(code) {
    if(!code) return;
    localStorage.setItem('apply_discount', 'true');
    const path = window.location.pathname;
    window.location.href = `/discount/${code}?redirect=${encodeURIComponent(path)}`;
}