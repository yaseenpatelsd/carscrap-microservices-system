console.log("Dashboard Fixed");

const API = {
    CAR: "/api",
    YARD: "/api",
    BOOKING: "/api"
};

let isBooking = false;
let currentAppointmentId = null;

function getToken() {
    return localStorage.getItem("token");
}

function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;
    container.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateX(30px)";
    }, 2500);

    setTimeout(() => toast.remove(), 3000);
}

function getErrorMessage(err) {
    if (!err) return "Something went wrong";
    if (typeof err === "string") return err;
    if (err.message) return err.message;
    if (err.error) return err.error;
    if (err.details) return err.details;
    return "Something went wrong";
}

function handleApiError(err, fallbackMessage = "Something went wrong", outputElementId = null) {
    console.log("FRONTEND ERROR:", err);

    const message = getErrorMessage(err) || fallbackMessage;
    const output = outputElementId ? document.getElementById(outputElementId) : null;

    if (output) output.innerText = message;
    showToast(message, "error");

    return message;
}

async function safeFetch(url, options = {}) {
    const token = getToken();
    const fetchOptions = {};
    const customHeaders = options.headers || {};

    Object.keys(options).forEach(key => {
        if (key !== "headers") {
            fetchOptions[key] = options[key];
        }
    });

    fetchOptions.headers = {
        "Content-Type": "application/json"
    };

    if (token) {
        fetchOptions.headers.Authorization = "Bearer " + token;
    }

    Object.keys(customHeaders).forEach(key => {
        fetchOptions.headers[key] = customHeaders[key];
    });

    const res = await fetch(url, fetchOptions);
    const text = await res.text();
    let data;

    try {
        data = text ? JSON.parse(text) : null;
    } catch (err) {
        data = text;
    }

    if (!res.ok) {
        console.error("API ERROR:", { url, status: res.status, response: data });
        throw data || { message: `Request failed with status ${res.status}` };
    }

    return data;
}

document.addEventListener("DOMContentLoaded", () => {
    initUser();
    initModalClose();
    initInterfaceEffects();
    loadRequests();
    loadAppointments();
    initYardFilters();
});

function initUser() {
    const el = document.getElementById("username");
    if (!el) return;

    try {
        const token = getToken();
        if (!token) {
            el.innerText = "Guest";
            return;
        }

        const payload = JSON.parse(atob(token.split(".")[1]));
        el.innerText = payload.username || "User";
    } catch (err) {
        el.innerText = "User";
    }
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.add("active");
    }
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) {
        modal.classList.remove("active");
    }
}

function initModalClose() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", e => {
            const content = modal.querySelector(".modal-content");
            if (content && !content.contains(e.target)) {
                modal.classList.remove("active");
            }
        });
    });
}

function goToPrice() {
    openModal("carModal");
}

function closeCarModal() {
    closeModal("carModal");
}

function openRequestModal() {
    openModal("requestModal");
    loadRequests();
}

function closeRequestModal() {
    closeModal("requestModal");
}

function openAppointmentModal() {
    openModal("appointmentModal");
    loadRequests();
    loadYardOptions();
}

function closeAppointmentModal() {
    closeModal("appointmentModal");
}

function openMyAppointmentModal() {
    openModal("myAppointmentModal");
    loadAppointments();
}

function closeMyAppointmentModal() {
    closeModal("myAppointmentModal");
}

function closeAppointmentDetailModal() {
    closeModal("appointmentDetailModal");
}

function initInterfaceEffects() {
    document.querySelectorAll(".hero-panel, .stat-card, .dashboard-card, .selected-yard-box")
        .forEach((el, index) => {
            el.classList.add("reveal");
            setTimeout(() => el.classList.add("visible"), 90 + index * 70);
        });

    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            document.querySelectorAll(".nav-item").forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
        });
    });
}

function updateStat(id, value) {
    const el = document.getElementById(id);
    if (!el) return;

    const endValue = Number(value) || 0;
    const startValue = Number(el.dataset.count) || 0;
    const duration = 520;
    const startedAt = performance.now();

    el.dataset.count = String(endValue);

    function tick(now) {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = Math.round(startValue + (endValue - startValue) * eased);

        el.innerText = String(current);

        if (progress < 1) {
            requestAnimationFrame(tick);
        }
    }

    requestAnimationFrame(tick);
}

async function getCarPrice() {
    const result = document.getElementById("carResult");
    const payload = {
        name: getValue("carName"),
        registrationYear: getValue("carYear"),
        vehicleType: getValue("vehicleType"),
        fuelType: getValue("fuelType"),
        city: getValue("carCity")
    };

    try {
        if (result) result.innerText = "Calculating...";

        const data = await safeFetch(`${API.CAR}/car/get-price`, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        if (result) {
            result.innerText = "Rs " + Number(data.estimatePrice || 0).toLocaleString();
        }

        loadRequests();
    } catch (err) {
        handleApiError(err, "Something went wrong", "carResult");
    }
}

function getValue(id) {
    const el = document.getElementById(id);
    return el ? el.value : "";
}

async function loadRequests() {
    const list = document.getElementById("requestList");
    const select = document.getElementById("appointmentRequest");

    try {
        const data = await safeFetch(`${API.CAR}/car/all-request`);

        if (list) list.innerHTML = "";
        if (select) select.innerHTML = "";

        data.forEach(r => {
            if (list) {
                list.insertAdjacentHTML("beforeend", `
                    <div class="request-card">
                        <div class="request-header">
                            <span class="car-name">${r.name || "Vehicle"}</span>
                            <span class="price">Rs ${Number(r.estimatePrice || 0).toLocaleString()}</span>
                        </div>
                        <div class="request-body">
                            <span class="city">${r.city || "N/A"}</span>
                            <span class="status ${r.eligible ? "eligible" : "not-eligible"}">
                                ${r.eligible ? "Eligible" : "Not Eligible"}
                            </span>
                        </div>
                        <div class="request-actions">
                            <button onclick="bookFromRequest(${r.id})">Book Appointment</button>
                        </div>
                    </div>
                `);
            }

            if (select) {
                select.insertAdjacentHTML("beforeend", `<option value="${r.id}">${r.name || "Vehicle"}</option>`);
            }
        });

        updateStat("statRequests", data.length);
    } catch (err) {
        handleApiError(err);
    }
}

function openYardSearchModal() {
    openModal("yardSearchModal");
    searchYards();
}

function closeYardSearchModal() {
    closeModal("yardSearchModal");
}

async function searchYards() {
    const resultsDiv = document.getElementById("yardResults");
    if (!resultsDiv) return;

    const rawFilters = {
        name: getValue("yardName").trim(),
        city: getValue("yardCity").trim(),
        state: getValue("yardState").trim(),
        pincode: getValue("yardPincode").trim()
    };

    const filters = Object.fromEntries(
        Object.entries(rawFilters).filter(([, value]) => value !== "")
    );

    try {
        resultsDiv.innerHTML = `<div class="yard-card">Loading yards...</div>`;

        const data = Object.keys(filters).length === 0
            ? await safeFetch(`${API.YARD}/search/all`)
            : await safeFetch(`${API.YARD}/search`, {
                method: "POST",
                body: JSON.stringify(filters)
            });

        resultsDiv.innerHTML = "";

        if (!data.length) {
            resultsDiv.innerHTML = `<div class="yard-card">No yards found</div>`;
            return;
        }

        data.forEach(y => {
            const card = document.createElement("div");
            card.className = "yard-card";
            card.innerHTML = `
                <h4>${y.name || "Scrap Yard"}</h4>
                <p>${y.city || "N/A"}, ${y.state || "N/A"} - ${y.pincode || "N/A"}</p>
                <p>${y.contactNo || "Contact not available"}</p>
                <button onclick="bookFromYard(${y.yardId})">Select</button>
            `;
            resultsDiv.appendChild(card);
        });
    } catch (err) {
        resultsDiv.innerHTML = `<div class="yard-card">${getErrorMessage(err)}</div>`;
        handleApiError(err);
    }
}

function initYardFilters() {
    document.querySelectorAll("#yardName, #yardCity, #yardState, #yardPincode")
        .forEach(input => input.addEventListener("input", debounce(searchYards, 400)));
}

function debounce(fn, delay) {
    let timeout;
    return () => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
    };
}

async function loadYardOptions() {
    const select = document.getElementById("appointmentYard");
    if (!select || select.options.length > 0) return;

    try {
        const data = await safeFetch(`${API.YARD}/search/all`);
        select.innerHTML = "";

        data.forEach(y => {
            const option = document.createElement("option");
            option.value = y.yardId;
            option.textContent = `${y.name || "Scrap Yard"} - ${y.city || "N/A"}`;
            select.appendChild(option);
        });
    } catch (err) {
        handleApiError(err);
    }
}

async function bookAppointment() {
    if (isBooking) return;

    const btn = document.getElementById("bookBtn");
    const payload = {
        carDetailId: getValue("appointmentRequest"),
        yardId: getValue("appointmentYard"),
        dateOfAppointment: getValue("appointmentDate"),
        mobileNo: getValue("appointmentMobile")
    };

    if (!payload.carDetailId || !payload.yardId || !payload.dateOfAppointment || !payload.mobileNo) {
        showToast("Please complete all appointment fields", "error");
        return;
    }

    isBooking = true;
    if (btn) {
        btn.disabled = true;
        btn.innerText = "Booking...";
    }

    try {
        await safeFetch(`${API.BOOKING}/appointment/booking`, {
            method: "POST",
            body: JSON.stringify(payload)
        });

        showToast("Appointment booked", "success");
        closeAppointmentModal();
        loadAppointments();
    } catch (err) {
        handleApiError(err);
    } finally {
        isBooking = false;
        if (btn) {
            btn.disabled = false;
            btn.innerText = "Book Appointment";
        }
    }
}

function bookFromRequest(requestId) {
    const select = document.getElementById("appointmentRequest");
    if (select) select.value = requestId;
    openAppointmentModal();
}

async function bookFromYard(yardId) {
    const select = document.getElementById("appointmentYard");
    if (!select) return;

    await loadYardOptions();
    select.value = yardId;

    const selectedOption = select.options[select.selectedIndex];
    const selected = selectedOption ? selectedOption.textContent : "Selected";
    const display = document.getElementById("selectedYardDisplay");
    if (display) display.innerText = selected;

    closeYardSearchModal();
    openAppointmentModal();
}

async function loadAppointments() {
    const container = document.getElementById("appointmentList");

    try {
        if (container) container.innerHTML = "Loading...";

        const data = await safeFetch(`${API.BOOKING}/appointment/all`);

        if (container) container.innerHTML = "";

        data.forEach(a => {
            const statusClass = a.status === "CANCEL" ? "CANCELLED" : a.status;

            if (container) {
                container.insertAdjacentHTML("beforeend", `
                    <div class="appointment-card">
                        <div>
                            <strong>${a.dateOfAppointment || "Date unavailable"}</strong><br>
                            <span class="status ${statusClass}">${a.status || "N/A"}</span>
                        </div>
                        <button onclick="openAppointmentDetailModal(${a.id})">View</button>
                    </div>
                `);
            }
        });

        updateStat("statAppointments", data.length);
    } catch (err) {
        if (container) container.innerHTML = getErrorMessage(err);
        handleApiError(err);
    }
}

async function openAppointmentDetailModal(id) {
    currentAppointmentId = id;

    const modal = document.getElementById("appointmentDetailModal");
    const container = document.getElementById("appointmentDetails");

    if (!currentAppointmentId) {
        showToast("Invalid appointment ID", "error");
        return;
    }

    if (!modal || !container) return;

    try {
        modal.classList.add("active");
        container.innerHTML = `<div class="detail-row">Loading details...</div>`;

        const data = await safeFetch(`${API.BOOKING}/appointment/get/appointment/details`, {
            method: "POST",
            body: JSON.stringify({ id })
        });

        container.innerHTML = `
            <div class="detail-row">
                <div class="detail-label">Car Name</div>
                <div class="detail-value">${data.carname || "N/A"}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Expire Year</div>
                <div class="detail-value">${data.expireYear || "N/A"}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Yard</div>
                <div class="detail-value">${data.yardName || "N/A"}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">City</div>
                <div class="detail-value">${data.city || "N/A"}</div>
            </div>
            <div class="detail-row">
                <div class="detail-label">Status</div>
                <div class="detail-value"><span class="status ${data.status}">${data.status || "N/A"}</span></div>
            </div>
        `;

        const cancelBtn = document.querySelector("#appointmentDetailModal .btn-danger");
        const postponeBtn = document.querySelector("#appointmentDetailModal .btn-success");
        const isCancelled = data.status === "CANCELLED" || data.status === "CANCEL";

        if (cancelBtn) {
            cancelBtn.innerText = isCancelled ? "Already Cancelled" : "Cancel Appointment";
            cancelBtn.disabled = isCancelled;
        }

        if (postponeBtn) {
            postponeBtn.innerText = isCancelled ? "Cannot Postpone" : "Postpone Appointment";
            postponeBtn.disabled = isCancelled;
        }
    } catch (err) {
        container.innerHTML = `<div class="detail-row">${getErrorMessage(err)}</div>`;
        handleApiError(err);
    }
}

function openCancelModal() {
    closeModal("appointmentDetailModal");
    openModal("cancelModal");
}

function closeCancelModal() {
    closeModal("cancelModal");
}

function openPostponeModal() {
    closeModal("appointmentDetailModal");
    openModal("postponeModal");
}

function closePostponeModal() {
    closeModal("postponeModal");
}

async function confirmCancel() {
    const reason = getValue("cancelReason");

    if (!reason) {
        showToast("Reason is required", "error");
        return;
    }

    if (!currentAppointmentId) {
        showToast("Appointment ID missing", "error");
        return;
    }

    try {
        await safeFetch(`${API.BOOKING}/appointment/booking/cancel`, {
            method: "POST",
            body: JSON.stringify({
                id: currentAppointmentId,
                reason
            })
        });

        showToast("Appointment cancelled", "success");
        closeCancelModal();
        loadAppointments();
    } catch (err) {
        handleApiError(err, "Cancel failed");
    }
}

async function confirmPostpone() {
    const date = getValue("postponeDate");

    if (!date) {
        showToast("Please select a date", "error");
        return;
    }

    if (!currentAppointmentId) {
        showToast("Appointment ID missing", "error");
        return;
    }

    try {
        await safeFetch(`${API.BOOKING}/appointment/postpone`, {
            method: "POST",
            body: JSON.stringify({
                appointmentId: currentAppointmentId,
                date
            })
        });

        showToast("Appointment postponed", "success");
        closePostponeModal();
        loadAppointments();
    } catch (err) {
        handleApiError(err);
    }
}
