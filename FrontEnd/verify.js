document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("verifyForm");
    const usernameInput = document.getElementById("username");
    const otpInput = document.getElementById("otp");
    const message = document.getElementById("message");

    // Autofill username
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
        usernameInput.value = savedUsername;
        usernameInput.readOnly = true;
    }

    function resetButton(btn, btnText, spinner) {
        btnText.innerText = "Verify";
        spinner.classList.add("d-none");
        btn.disabled = false;
    }

    function show(msg, type) {
        message.innerHTML = `<span class="${type}">${msg}</span>`;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const btn = form.querySelector("button");
        const btnText = btn.querySelector(".btn-text");
        const spinner = btn.querySelector(".spinner");

        if (btn.disabled) return;

        // Start loading
        btnText.innerText = "Verifying...";
        spinner.classList.remove("d-none");
        btn.disabled = true;

        const data = {
            username: usernameInput.value.trim(),
            otp: otpInput.value.trim()
        };

        fetch("/api/auth/account-verified", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(err => { throw new Error(err); });
            }
            return res.text();
        })
        .then(() => {

            show("✔ Account verified successfully", "success");

            setTimeout(() => {
                localStorage.removeItem("username");
                window.location.href = "login.html";
            }, 1500);

            resetButton(btn, btnText, spinner);
        })
        .catch(err => {
            show("❌ " + err.message, "error");
            resetButton(btn, btnText, spinner);
        });
    });

});