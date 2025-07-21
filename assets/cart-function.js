let applyBtn = document.querySelector("#apply-discount-btn");
let discountCodeInput = document.querySelector("#discount-code");

applyBtn.addEventListener("click", function (e) {
    e.preventDefault();
    applyDiscount(discountCodeInput.value);
});

discountCodeInput.addEventListener('keyup', function (e) {
    applyDiscount(discountCodeInput.value);
});

function applyDiscount(code) {
    window.location.href = `/discount/${code}?redirect=/cart`;
}
