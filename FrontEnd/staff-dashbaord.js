// ===============================
// INIT
// ===============================
console.log("🔥 NEW JS LOADED - VERSION 2");

// ===============================
// API CONFIG (UNCHANGED)
// ===============================
const API = {
     Auth: "/api",
    CAR: "/api",
    YARD: "/api",
    BOOKING: "/api"
};

// ===============================
// GLOBAL FETCH (UNCHANGED)
// ===============================

const token = localStorage.getItem("token");
async function safeFetch(url, options = {}) {
    const token = localStorage.getItem("token");

    const res = await fetch(url, {
        ...options,
        headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: "Bearer " + token }),
        }
    });

    const text = await res.text();

    console.log("🌐 API:", url);
    console.log("📡 STATUS:", res.status);
    console.log("📦 RESPONSE:", text);

    if (!res.ok) {
        throw new Error(`API failed: ${res.status}`);
    }

    return JSON.parse(text);
}

// ===============================
// INIT PAGE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    initModalClose();
    initSidebarRouting(); // 🔥 important
    loadModule("dashboard");

      setTimeout(loadQuickStatus, 100);
});
// ===============================
// TOAST
// ===============================
function showToast(message, type = "info") {
    const container = document.getElementById("toastContainer");

    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.innerText = message;

    container.appendChild(toast);

    setTimeout(() => toast.remove(), 3000);
}

// ===============================
// MODALS
// ===============================
function initModalClose() {
    document.querySelectorAll(".modal").forEach(modal => {
        modal.addEventListener("click", (e) => {
            const content = modal.querySelector(".modal-content");
            if (content && !content.contains(e.target)) {
                modal.style.display = "none";
            }
        });
    });
}

function initSidebarRouting() {
    document.querySelectorAll(".nav-item").forEach(item => {
        item.addEventListener("click", () => {
            const module = item.dataset.module;
            loadModule(module);
        });
    });
}


function loadModule(module) {
    switch (module) {
        case "dashboard":
            loadDashboard();
            break;
        case "manageYard":
            loadManageYard();
            break;
         case "appointments":
           loadAppointments();
           break;    

            
          
    }
}

let STAFF_LIST = [];


async function updateStatusOnly() {
    const status = document.getElementById("statusSelect").value;

    try {
        await safeFetch(`${API.YARD}/management/yard/change/status-by-admin`, {
            method: "PATCH",
            body: JSON.stringify({
                status
            })
        });

        showToast("Status updated", "success");
    

    } catch {
        showToast("Failed to update status", "error");
    }
}


function openStatusEdit() {
    const modal = document.getElementById("statusEditModal");

    if (!modal) {
        console.error("statusEditModal not found");
        return;
    }

    modal.style.display = "block";
}

function loadManageYard() {
    document.querySelector(".content").innerHTML = `
        <div class="card">
            <h2>Manage My Yard</h2>
            <button onclick="openStatusEdit()">Change Status</button>
        </div>
    `;
}

function updateQuickButton(status) {
    const btn = document.getElementById("yardToggleBtn");

    
    if (!btn) return;

    if (status === "ACTIVE") {
        btn.innerText = "🔴 Close Yard";
    } else if (status === "INACTIVE") {
        btn.innerText = "🟢 Open Yard";
    } else {
        btn.innerText = "⚠ Maintenance";
        btn.style.pointerEvents = "none"; // disable
        btn.style.opacity = "0.6";
    }
}

async function loadQuickStatus() {
    try {
        const data = await safeFetch(`/api/management/yard/change/status-by-management`);
        updateQuickButton(data.status);
    } catch (e) {
        console.error("Failed to load status", e);
    }
}

async function toggleYardStatusQuick() {
    try {
        const data = await safeFetch(`/api/management/yard/change/status-by-management`, {
            method: "PATCH"
        });

        console.log("Response:", data); 
        showToast(`Now: ${data.status}`, "success");

        updateQuickButton(data.status); // 🔥 instant update

    } catch {
        showToast("Failed to change status", "error");
    }
}




async function loadAppointments() {
    document.querySelector(".content").innerHTML = `
        <div class="card">
            <h2>Appointments</h2>

            <input type="date" id="startDate" class="input"/>
            <input type="date" id="endDate" class="input"/>

            <button onclick="fetchAppointments()">Search</button>

            <div id="appointmentList">No data</div>
        </div>
    `;

    await loadStaffList(); // 🔥 important
}
async function fetchAppointments() {
    const start = document.getElementById("startDate").value;
    const ends = document.getElementById("endDate").value;

    if (!start || !ends) {
        showToast("Select dates", "error");
        return;
    }

    try {
        const data = await safeFetch(
            `${API.BOOKING}/management/booking/get/appointment/by/date-for-staff`,
            {
                method: "POST",
                body: JSON.stringify({ start, ends })
            }
        );
        

        console.log("📦 APPOINTMENTS:", data);

        renderAppointments(data || []);

    } catch (e) {
        console.error("❌ Fetch error:", e);
        showToast("Failed to load appointments", "error");
    }
}
function renderAppointments(data) {
    const container = document.getElementById("appointmentList");

    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = "<p>No appointments found</p>";
        return;
    }

    let html = "";

    data.forEach(a => {
        const status = (a.status || "").trim().toUpperCase();

        // 🔥 CONDITION
        const isLocked = status === "SUCCESSFUL" || status === "CANCEL";

        // 🎨 color
        let color = "gray";
        if (status === "SUCCESSFUL") color = "green";
        else if (status === "CONFIRM") color = "orange";

        const staffOptions = (Array.isArray(STAFF_LIST) ? STAFF_LIST : [])
            .map(s => `<option value="${s.id}">${s.username}</option>`)
            .join("");

        html += `
        <div class="staff-card">

            <p><b>ID:</b> ${a.id}</p>
            <p><b>User:</b> ${a.userName || "-"}</p>
            <p><b>Staff:</b> ${a.staffUsername || "Not Assigned"}</p>
            <p><b>Date:</b> ${a.dateOfAppointment || "-"}</p>

            <p>
                <b>Status:</b> 
                <span style="color:${color};">${status}</span>
            </p>

            <p><b>Mobile:</b> ${a.userMobileNo || "-"}</p>

            <!-- STATUS UPDATE -->
            ${
                !isLocked
                ? `
                <div style="margin-top:10px;">
                    <select id="status-${a.id}" class="input">
                        <option value="">Change Status</option>
                        <option value="CONFIRM">CONFIRM</option>
                        <option value="SUCCESSFUL">SUCCESSFUL</option>
                    </select>

                    <button onclick="changeAppointmentStatus(${a.id})">
                        Update Status
                    </button>
                </div>
                `
                : `<p style="color:green;">✔ Completed</p>`
            }

            <!-- STAFF -->
            ${
                !isLocked
                ? (
                    a.staffUsername
                    ? `
                        <button onclick="removeStaff(${a.id})"
                            style="background:#ef4444;color:white;margin-top:8px;">
                            Remove Staff
                        </button>
                    `
                    : `
                        <select id="staff-${a.id}" class="input">
                            <option value="">Select Staff</option>
                            ${staffOptions}
                        </select>

                        <button onclick="assignStaff(${a.id})">
                            Assign
                        </button>
                    `
                )
                : ""
            }

            <!-- 🔥 MARK MISSED -->
            ${
                !isLocked
                ? `
                <div style="margin-top:15px;">
                    <button onclick="markMissed(${a.id})"
                        style="
                            background:#f59e0b;
                            color:white;
                            padding:8px 12px;
                            border:none;
                            border-radius:6px;
                            cursor:pointer;
                        ">
                        Mark Missed
                    </button>
                </div>
                `
                : ""
            }

            <!-- 🔥 CANCEL -->
${
    !isLocked
    ? `
        <div style="margin-top:15px;">
            <input 
                type="text" 
                id="cancel-reason-${a.id}" 
                class="input" 
                placeholder="Enter cancel reason"
            />

            <button onclick="cancelAppointment(${a.id})"
                style="
                    background:#dc2626;
                    color:white;
                    padding:8px 12px;
                    border:none;
                    border-radius:6px;
                    cursor:pointer;
                    margin-top:5px;
                ">
                Cancel Appointment
            </button>
        </div>
    `
    : ""
}

        </div>
        `;
    });

    container.innerHTML = html;
}

async function changeAppointmentStatus(appointmentId) {
    const status = document.getElementById(`status-${appointmentId}`).value;

    if (!status) {
        showToast("Select status", "error");
        return;
    }

    try {
        const res = await safeFetch(
            `${API.BOOKING}/management/booking/change/status`,
            {
                method: "POST",
                body: JSON.stringify({
                    appointmentId: Number(appointmentId),
                    status
                })
            }
        );

        showToast("Status updated", "success");

        fetchAppointments(); // 🔥 refresh

    } catch (e) {
        showToast("Failed to update status", "error");
    }
}

async function markMissed(appointmentId) {
    if (!confirm("Mark this appointment as missed?")) return;

    try {
        const res = await safeFetch(
            `${API.BOOKING}/management/booking/user/missed-appointment`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    appointmentId: Number(appointmentId)
                })
            }
        );

        showToast(res.message || "Marked as missed", "success");

        fetchAppointments(); // refresh

    } catch (e) {
        console.error("❌ Missed API error:", e);
        showToast("Failed to mark missed", "error");
    }
}

async function cancelAppointment(appointmentId) {

    const reason = document.getElementById(`cancel-reason-${appointmentId}`).value;

    if (!reason) {
        showToast("Enter cancel reason", "error");
        return;
    }

    if (!confirm("Are you sure you want to cancel this appointment?")) return;

    try {
        const res = await safeFetch(
            `${API.BOOKING}/management/booking/cancel`,
            {
                method: "POST",
                body: JSON.stringify({
                    id: Number(appointmentId),
                    reason: reason
                })
            }
        );

        showToast(res.message || "Cancelled", "success");

        fetchAppointments(); // 🔥 refresh

    } catch (e) {
        console.error("❌ Cancel Error:", e);
        showToast("Failed to cancel", "error");
    }
}