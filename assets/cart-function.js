let applyBtn = document.querySelector("#apply-discount-btn");
let discountCodeInput = document.querySelector("#discount-code");

applyBtn.addEventListener("click", function (e) {
    e.preventDefault();
    applyDiscount(discountCodeInput.value);
});

function applyDiscount(code) {
    if(!code) return;
    const path = window.location.pathname;
    window.location.href = `/discount/${code}?redirect=${encodeURIComponent(path)}`;
}
