document.addEventListener("DOMContentLoaded", () => {
    console.log("working");

    const form = document.getElementById("loginForm");
    const messageBox = document.getElementById("message");
    const usernameInput = document.getElementById("username");

    // Prefill username
    const savedUsername = localStorage.getItem("username");
    if (savedUsername) {
        usernameInput.value = savedUsername;
    }

    function getRoleFromToken(token) {
        try {
            const payload = token.split('.')[1];
            const decoded = JSON.parse(atob(payload));
            return decoded.role;
        } catch (e) {
            console.error("❌ Failed to decode token", e);
            return null;
        }
    }

    function resetButton(btn, btnText, spinner) {
        btnText.innerText = "Login";
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
        btnText.innerText = "Logging in...";
        spinner.classList.remove("d-none");
        btn.disabled = true;

        const data = {
            username: usernameInput.value.trim(),
            password: document.getElementById("password").value
        };

        fetch("/api/auth/login", {
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
            return res.text().then(text => text ? JSON.parse(text) : {});
        })
        .then(data => {

            if (!data.token) {
                throw new Error("Invalid server response");
            }

            localStorage.setItem("token", data.token);

            const role = getRoleFromToken(data.token);

            messageBox.innerHTML = `<span class="success">✔ Login successful</span>`;

            setTimeout(() => {
                if (role === "SUPER_ADMIN") {
                    window.location.href = "super-admin-dashboard.html";
                } else if (role === "ADMIN") {
                    window.location.href = "admin-dashboard.html";
                } else if (role === "STAFF") {
                    window.location.href = "staff-dashboard.html";
                } else {
                    window.location.href = "dashboard.html";
                }
            }, 1500);

            resetButton(btn, btnText, spinner);
        })
        .catch(err => {
            messageBox.innerHTML = `<span class="error">❌ ${err.message}</span>`;
            resetButton(btn, btnText, spinner);
        });
    });
});