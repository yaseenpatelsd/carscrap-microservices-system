document.addEventListener("DOMContentLoaded", () => {

    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
        const usernameInput = document.getElementById("username");
        usernameInput.value = savedUsername;
        usernameInput.readOnly = true;
    }

    document.getElementById("otpForm").addEventListener("submit", function (e) {
        e.preventDefault();

       const btn = e.target.querySelector("button");
const btnText = btn.querySelector(".btn-text");
const spinner = btn.querySelector(".spinner");

btnText.innerText = "Sending...";
spinner.classList.remove("d-none");
btn.disabled = true;

        const messageBox = document.getElementById("message");

        const username = document.getElementById("username").value.trim();

        // save username for next page
        localStorage.setItem("username", username);

        const data = {
            username: username
        };

        fetch("/api/auth/otp-request", {
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
            messageBox.innerHTML =
                `<span style="color: green;">✔ OTP sent successfully</span>`;

            setTimeout(() => {
                window.location.href = "verify.html";
            }, 1500);

           btnText.innerText = "Send OTP";
spinner.classList.add("d-none");
btn.disabled = false;
        })
        .catch(err => {
            messageBox.innerHTML =
                `<span style="color: red;">❌ ${err.message}</span>`;
           btnText.innerText = "Send OTP";
spinner.classList.add("d-none");
btn.disabled = false;
        });
    });

});