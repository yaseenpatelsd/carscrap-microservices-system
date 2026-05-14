document.addEventListener("DOMContentLoaded", () => {

    const form = document.getElementById("resetOtpForm");
    const messageBox = document.getElementById("message");
    const usernameInput = document.getElementById("username");

    function resetButton(btn, btnText, spinner) {
        btnText.innerText = "Send OTP";
        spinner.classList.add("d-none");
        btn.disabled = false;
    }

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const btn = form.querySelector("button");
        const btnText = btn.querySelector(".btn-text");
        const spinner = btn.querySelector(".spinner");

        if (btn.disabled) return;

        // Start loading
        btnText.innerText = "Sending...";
        spinner.classList.remove("d-none");
        btn.disabled = true;

        const username = usernameInput.value.trim();

        fetch("/api/auth/otp-request-password-reset", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username })
        })
        .then(res => {
            if (!res.ok) {
                return res.text().then(err => { throw new Error(err); });
            }
            return res.text();
        })
        .then(() => {

            // Save username for next step
            localStorage.setItem("username", username);

            messageBox.innerHTML =
                `<span class="success">✔ OTP sent successfully</span>`;

            setTimeout(() => {
                window.location.href = "reset-password.html";
            }, 1200);

            resetButton(btn, btnText, spinner);
        })
        .catch(err => {
            messageBox.innerHTML =
                `<span class="error">❌ ${err.message}</span>`;

            resetButton(btn, btnText, spinner);
        });

    });

});