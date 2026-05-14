// ===============================
// INIT
// ===============================
console.log("✅ Admin Dashboard Ready");

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
            ...(options.headers || {})
        }
    });

  
    const text = await res.text();

    let data;
    try {
        data = JSON.parse(text);
    } catch {
        data = text;
    }

    if (!res.ok) {
        console.error("❌ API ERROR:", { url, status: res.status, response: data });
        throw new Error("API failed");
    }

console.error("❌ API ERROR:", {
    url,
    status: res.status,
    response: data
});
    return data;
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


function loadModule(module) {
    switch (module) {
        case "dashboard":
            loadDashboard();
            break;
        case "addStaff":
            loadAddStaff();
            break;
        case "manageStaff":
            loadManageStaff();
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

//==================================================
//STAFF ADD
//==================================================
function loadAddStaff() {
    document.querySelector(".content").innerHTML = `
        <div class="card">
            <h2>Add Staff</h2>

            <input id="staffUsername" class="input" placeholder="Username"/>
            <input id="staffEmail" class="input" placeholder="Email"/>
            <input id="staffPassword" class="input" placeholder="Password"/>

<button id="staffBtn" onclick="submitStaff()">Create Staff</button>
            <div id="staffResult"></div>
        </div>
    `;
}

async function submitStaff() {
    const btn = document.getElementById("staffBtn");



    try {
        btn.disabled = true;
        

const data = await safeFetch(`${API.Auth}/staff/register/by/admin`, {     
            method: "POST", 
            body: JSON.stringify({
                username: document.getElementById("staffUsername").value,
                email: document.getElementById("staffEmail").value,
                password: document.getElementById("staffPassword").value
            })
        });

        document.getElementById("staffResult").innerHTML = `
            <div class="success-box">✅ ${data.username}</div>
        `;

        showToast("Staff created", "success");

    } catch {
        showToast("Failed", "error");
    } finally {
        btn.disabled = false;
    }
}



// ===============================
// ROUTER (SaaS STYLE)
// ===============================
function initSidebarRouting() {
    const items = document.querySelectorAll(".nav-item");


    items.forEach(item => {
        item.addEventListener("click", () => {
            const module = item.dataset.module;

            // active state
            items.forEach(i => i.classList.remove("active"));
            item.classList.add("active");

            // change title
            document.getElementById("pageTitle").innerText = item.innerText.replace(/^[A-Z]{2}\s+/, "");

            // load module
            loadModule(module);
        });
    });
}


function loadDashboard() {
    document.querySelector(".content").innerHTML = `
        <section class="card admin-hero">
            <div class="admin-hero-copy">
                <p class="eyebrow">Admin control center</p>
                <h2>Manage yard operations with one clean workspace.</h2>
                <p>Use this dashboard to add staff, manage your yard profile, assign team members, and handle customer appointments.</p>
            </div>

            <div class="admin-hero-panel">
                <strong>Quick yard status</strong>
                <small>Use the status button in the top bar to open or close your yard quickly.</small>
            </div>
        </section>

        <section class="admin-actions-grid">
            <button class="module-card" onclick="loadModule('addStaff')">
                <span class="module-icon">ST</span>
                <strong>Add Staff</strong>
                <small>Create a new staff account for yard operations.</small>
            </button>

            <button class="module-card" onclick="loadModule('manageStaff')">
                <span class="module-icon">MS</span>
                <strong>Manage Staff</strong>
                <small>View and remove staff members assigned to your yard.</small>
            </button>

            <button class="module-card" onclick="loadModule('manageYard')">
                <span class="module-icon">YD</span>
                <strong>Manage Yard</strong>
                <small>Edit contact details and yard availability.</small>
            </button>

            <button class="module-card" onclick="loadModule('appointments')">
                <span class="module-icon">AP</span>
                <strong>Appointments</strong>
                <small>Search bookings and update appointment progress.</small>
            </button>
        </section>
    `;
}

function loadManageStaff() {
    document.querySelector(".content").innerHTML = `
        <div class="card">
            <h2>Manage Staff</h2>
            <div id="staffList">Loading...</div>
        </div>
    `;

    fetchStaffList();
}
async function fetchStaffList() {
    try {
       const data = await safeFetch(`${API.Auth}/staff/staff/List`, {
    method: "POST"
});
        const container = document.getElementById("staffList");

        if (!data.length) {
            container.innerHTML = "<p>No staff found</p>";
            return;
        }

        container.innerHTML = data.map(staff => `
            <div class="staff-card">
                <p><b>ID:</b> ${staff.id}</p>
                <p><b>Username:</b> ${staff.username}</p>
                <p><b>Email:</b> ${staff.email}</p>
                <button class="btn-danger" onclick="openRemoveStaffModal(${staff.id})">
                    Remove
                </button>
            </div>
        `).join("");

    } catch (e) {
        showToast("Failed to load staff", "error");
    }
}


//========================================
//Remove Staff 
//========================================

function openRemoveStaffModal(staffId) {
    document.getElementById("removeStaffId").value = staffId;
    document.getElementById("removeStaffModal").style.display = "block";
}
function closeRemoveStaffModal() {
    document.getElementById("removeStaffModal").style.display = "none";
}
function openRemoveStaffModal(staffId) {
    document.getElementById("removeStaffId").value = staffId;
    document.getElementById("removeStaffModal").style.display = "block";
}

function closeRemoveStaffModal() {
    document.getElementById("removeStaffModal").style.display = "none";
}

async function submitRemoveStaff() {
    try {
        const staffId = document.getElementById("removeStaffId").value;

        if (!staffId) {
            showToast("Staff ID required", "error");
            return;
        }

        const response = await safeFetch(`${API.YARD}/management/yard/staff/remove`, {
            method: "DELETE",
            body: JSON.stringify({
                staffId: Number(staffId)
            })
        });

        showToast(response.message || "Staff removed successfully", "success");

        closeRemoveStaffModal();

        fetchStaffList(); // ✅ refresh

    } catch (error) {
        console.error("❌ Remove Staff Error:", error);
        showToast("Failed to remove staff", "error");
    }
}




async function updateContactOnly() {
    const email = document.getElementById("contactEmail").value;
    const contact = document.getElementById("contactNumber").value;

    try {
        await safeFetch(`${API.YARD}/management/yard/change/contact-by-admin`, {
            method: "PATCH",
            body: JSON.stringify({
                email,
                contact
            })
        });

        showToast("Contact updated", "success");
        searchYards();

    } catch {
        showToast("Failed to update contact", "error");
    }
}


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
        searchYards();

    } catch {
        showToast("Failed to update status", "error");
    }
}

function openContactEdit() {
    const modal = document.getElementById("contactEditModal");

    if (!modal) {
        console.error("contactEditModal not found");
        return;
    }

    modal.style.display = "block";
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
            <p class="muted-text">Keep yard contact information and operating status up to date.</p>

            <div class="admin-actions-grid compact-grid">
                <button class="module-card" onclick="openContactEdit()">
                    <span class="module-icon">CT</span>
                    <strong>Edit Contact</strong>
                    <small>Update email and phone number.</small>
                </button>

                <button class="module-card" onclick="openStatusEdit()">
                    <span class="module-icon">ST</span>
                    <strong>Change Status</strong>
                    <small>Set active, inactive, or maintenance mode.</small>
                </button>
            </div>
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
        const data = await safeFetch(`${API.YARD}/management/yard/change/status-by-management`, {
            method: "PATCH"
        });
        updateQuickButton(data.status);
    } catch (e) {
        console.error("Failed to load status", e);
    }
}

async function toggleYardStatusQuick() {
    try {
        const data = await safeFetch(`${API.YARD}/management/yard/change/status-by-management`, {
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
            `${API.BOOKING}/management/booking/get/appointment/by/date-for-admin`,
            {
                method: "POST",
                body: JSON.stringify({ start, ends })
            }
        );

        renderAppointments(data);

    } catch (e) {
        showToast("Failed to load appointments", "error");
    }
}
function renderAppointments(data) {
    const container = document.getElementById("appointmentList");

    if (!Array.isArray(data) || data.length === 0) {
        container.innerHTML = "<p>No appointments found</p>";
        return;
    }

    container.innerHTML = data.map(a => {

        // 🔥 normalize status (VERY IMPORTANT)
        const status = (a.status || "").trim().toUpperCase();

        // 🔥 correct condition
        const isLocked = status === "SUCCESSFUL" || status === "CANCEL";

        // 🎨 color
        let color = "gray";
        if (status === "SUCCESSFUL") color = "green";
        else if (status === "CONFIRM") color = "orange";

        return `
        <div class="staff-card">

            <p><b>ID:</b> ${a.id}</p>
            <p><b>User:</b> ${a.userName || "-"}</p>
            <p><b>Staff:</b> ${a.staffUsername || "Not Assigned"}</p>
            <p><b>Date:</b> ${a.dateOfAppointment || "-"}</p>

            <p>
                <b>Status:</b> 
                <span style="color:${color};">
                    ${status}
                </span>
            </p>

            <p><b>Mobile:</b> ${a.userMobileNo || "-"}</p>

            <!-- 🔥 STATUS -->
            ${
                isLocked
                ? `<p style="color:green;">✔ Completed</p>`
                : `
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
            }

            <!-- 🔥 STAFF -->
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
                            ${(Array.isArray(STAFF_LIST) ? STAFF_LIST : [])
                                .map(s => `<option value="${s.id}">${s.username}</option>`)
                                .join("")}
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

            <!-- 🔥 POSTPONE -->
${
    !isLocked
    ? `
        <div style="margin-top:15px;">
            <input type="date" id="postpone-${a.id}" class="input"/>

            <button onclick="postponeAppointment(${a.id})"
                style="
                    background:#3b82f6;
                    color:white;
                    padding:8px 12px;
                    border:none;
                    border-radius:6px;
                    cursor:pointer;
                ">
                Postpone
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
    }).join("");
}
async function loadStaffList() {
    try {
        const data = await safeFetch(`${API.Auth}/staff/staff/List`, {
            method: "POST"
        });

        STAFF_LIST = data;

    } catch {
        showToast("Failed to load staff list", "error");
    }
}

async function assignStaff(appointmentId) {
    const staffId = document.getElementById(`staff-${appointmentId}`).value;

    if (!staffId) {
        showToast("Select staff first", "error");
        return;
    }

    try {
        const res = await safeFetch(
            `${API.BOOKING}/management/booking/staff/assign`,
            {
                method: "POST",
                body: JSON.stringify({
                    appointmentId: Number(appointmentId),
                    staffId: Number(staffId)
                })
            }
        );

        showToast(res.message, "success");

        fetchAppointments(); // refresh

    } catch {
        showToast("Assignment failed", "error");
    }
}

async function removeStaff(appointmentId) {
    if (!confirm("Remove assigned staff?")) return;

    try {
        const res = await safeFetch(
            `${API.BOOKING}/management/booking/remove/staff`,
            {
                method: "DELETE",
                body: JSON.stringify({
                    appointmentId: Number(appointmentId) // ✅ FIXED
                })
            }
        );

        showToast("Staff removed", "success");

        fetchAppointments();

    } catch (e) {
        showToast("Failed to remove staff", "error");
    }
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
                method: "PATCH",
                body: JSON.stringify({
                    appointmentId: Number(appointmentId),
                    status
                })
            }
        );

        showToast("Status updated", "success");

        fetchAppointments(); // 🔥 refresh UI

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

async function postponeAppointment(appointmentId) {
    const date = document.getElementById(`postpone-${appointmentId}`).value;

    if (!date) {
        showToast("Select new date", "error");
        return;
    }

    try {
        const res = await safeFetch(
            `${API.BOOKING}/management/booking/post-pone/appointment-by-management`,
            {
                method: "PATCH",
                body: JSON.stringify({
                    appointmentId: Number(appointmentId),
                    date: date
                })
            }
        );

        showToast("Appointment postponed", "success");

        fetchAppointments(); // 🔥 refresh UI

    } catch (e) {
        console.error("❌ Postpone Error:", e);
        showToast("Failed to postpone", "error");
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
