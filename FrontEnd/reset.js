document.addEventListener("DOMContentLoaded", () => {

    const username = document.getElementById("username");
    const otp = document.getElementById("otp");
    const password = document.getElementById("password");

    const sendBtn = document.getElementById("sendOtpBtn");
    const resetBtn = document.getElementById("resetBtn");
    const message = document.getElementById("message");

    const btnText = resetBtn.querySelector(".btn-text");
    const spinner = resetBtn.querySelector(".spinner");

    let timer = 60;
    let interval;

    // Autofill username
    const saved = localStorage.getItem("username");
    if (saved) {
        username.value = saved;
        username.readOnly = true;
    }

    function show(msg, type) {
        message.innerHTML = `<span class="${type}">${msg}</span>`;
    }

    // SEND OTP
    sendBtn.addEventListener("click", () => {

        const user = username.value.trim();

        if (!user) {
            show("Enter username first", "error");
            return;
        }

        sendBtn.disabled = true;
        sendBtn.innerText = "Sending...";

        fetch("/api/auth/otp-request-password-reset", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ username: user })
        })
        .then(res => {
            if (!res.ok) throw new Error("Failed to send OTP");
            return res.json();
        })
        .then(data => {
            show("✔ " + data.message, "success");
            startTimer();
        })
        .catch(() => {
            show("❌ Failed to send OTP", "error");
            sendBtn.disabled = false;
            sendBtn.innerText = "Send OTP";
        });
    });

    // RESET PASSWORD
    document.getElementById("resetForm").addEventListener("submit", (e) => {
        e.preventDefault();

        if (resetBtn.disabled) return;

        btnText.innerText = "Resetting...";
        spinner.classList.remove("d-none");
        resetBtn.disabled = true;

        fetch("/api/auth/password-change", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({
                username: username.value.trim(),
                otp: otp.value.trim(),
                password: password.value
            })
        })
        .then(res => {
            if (!res.ok) return res.text().then(err => { throw new Error(err); });
            return res.text();
        })
        .then(() => {
            show("✔ Password changed successfully", "success");

            setTimeout(() => {
                window.location.href = "login.html";
            }, 1500);
        })
        .catch(err => {
            show("❌ " + err.message, "error");
        })
        .finally(() => {
            btnText.innerText = "Reset Password";
            spinner.classList.add("d-none");
            resetBtn.disabled = false;
        });
    });

    function startTimer() {
        timer = 60;
        sendBtn.innerText = `Resend (${timer}s)`;

        interval = setInterval(() => {
            timer--;
            sendBtn.innerText = `Resend (${timer}s)`;

            if (timer <= 0) {
                clearInterval(interval);
                sendBtn.disabled = false;
                sendBtn.innerText = "Send OTP";
            }
        }, 1000);
    }

});