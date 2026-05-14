document.addEventListener("DOMContentLoaded", () => {
    console.log("DOM loaded");

    const form = document.getElementById("registerForm");

    if (!form) {
        console.error("registerForm not found");
        return;
    }

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

       const btn = form.querySelector("button");
       const btnText = btn.querySelector(".btn-text");
       const spinner = btn.querySelector(".spinner");

// Start loading
      btnText.innerText = "Registering...";
      spinner.classList.remove("d-none");
      btn.disabled = true;

        const data = {
            username: document.getElementById("username").value,
            email: document.getElementById("email").value,
            password: document.getElementById("password").value
        };

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

           const messageEl = document.getElementById("message");

if (response.ok) {
    localStorage.setItem("email", data.email);
    localStorage.setItem("username", data.username);

    messageEl.innerHTML = "✔ Registered successfully";
    messageEl.className = "success";

    setTimeout(() => {
        window.location.href = "/verify.html"; // safer
    }, 1500);
}

            // Success
            localStorage.setItem("email", data.email);
            localStorage.setItem("username", data.username);

            messageEl.innerHTML = "✔ Registered successfully";
            messageEl.className = "success";

            setTimeout(() => {
                window.location.href = "verify.html";
            }, 1500);

        } catch (error) {
            // Error
            messageEl.innerHTML = `❌ ${error.message}`;
            messageEl.className = "error";
        } finally {
            // Reset button
           btnText.innerText = "Register";
spinner.classList.add("d-none");
btn.disabled = false;
        }
    });
});