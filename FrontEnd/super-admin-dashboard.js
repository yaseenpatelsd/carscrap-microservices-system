// ===============================
// INIT
// ===============================
console.log("✅ Super Admin Dashboard Ready");

// ===============================
// API CONFIG (UNCHANGED)
// ===============================
const API = {
     GATEWAY: "/api"
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

    return data;
}

// ===============================
// INIT PAGE
// ===============================
document.addEventListener("DOMContentLoaded", () => {
    initModalClose();
    loadModule("dashboard");
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

// ===============================
// MODULE LOADER
// ===============================
function loadModule(module) {
    switch (module) {
        case "dashboard":
            loadDashboard();
            break;
        case "addAdmin":
            loadAddAdmin();
            break;
        case "addStaff":
            loadAddStaff();
            break;
        case "addYard":
            loadAddYard();
            break;
        case "yards":
            loadYards();
            break;
            case "metalPrice":
    loadMetalPrice();
    break;
        default:
            document.querySelector(".content").innerHTML = "Not Found";
    }
}


// ===============================
// MODAL OPEN / CLOSE (FIX)
// ===============================
function openAdminModal() {
    document.getElementById("adminModal").style.display = "block";
}

function closeAdminModal() {
    document.getElementById("adminModal").style.display = "none";
}

function openStaffModal() {
    document.getElementById("staffModal").style.display = "block";
}

function closeStaffModal() {
    document.getElementById("staffModal").style.display = "none";
}

function openYardModal() {
    document.getElementById("yardModal").style.display = "block";
}

function closeYardModal() {
    document.getElementById("yardModal").style.display = "none";
}

// ===============================
// DASHBOARD
// ===============================
function loadDashboard() {
    document.querySelector(".content").innerHTML = `
        <section class="card admin-hero">
            <div class="admin-hero-copy">
                <p class="eyebrow">Super admin control center</p>
                <h2>Manage admins, yards, staff, and metal prices from one dashboard.</h2>
                <p>Use this workspace to create new users, register yards, assign teams, and keep platform pricing up to date.</p>
            </div>

            <div class="admin-hero-panel">
                <strong>Platform overview</strong>
                <small>Use the cards above or sidebar to open each management module.</small>
            </div>
        </section>
    `;
}

// ===============================
// ADD ADMIN
// ===============================
function loadAddAdmin() {
    document.querySelector(".content").innerHTML = `
        <div class="card">
            <h2>Add New Admin</h2>

            <input type="text" id="adminUsername" placeholder="Username" class="input"/>
            <input type="email" id="adminEmail" placeholder="Email" class="input"/>
            <input type="password" id="adminPassword" placeholder="Password" class="input"/>

            <button class="btn" onclick="submitAdmin()">Create Admin</button>

            <div id="adminResult"></div>
        </div>
    `;
}

async function submitAdmin() {
    const username = document.getElementById("adminUsername").value;
    const email = document.getElementById("adminEmail").value;
    const password = document.getElementById("adminPassword").value;

    const resultDiv = document.getElementById("adminResult");

    if (!username || !email || !password) {
        showToast("All fields are required", "error");
        return;
    }

    try {
        resultDiv.innerHTML = "Creating admin...";

        const data = await safeFetch(`${API.GATEWAY}/admin/register`, {
            method: "POST",
            body: JSON.stringify({ username, email, password })
        });

        resultDiv.innerHTML = `
            <div class="success-box">
                <h3>✅ Admin Created</h3>
                <p>${data.username}</p>
            </div>
        `;

        showToast("Admin created successfully", "success");

    } catch (error) {
        showToast("Failed to create admin", "error");
    }
}

// ===============================
// ADD STAFF
// ===============================
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

        const data = await safeFetch(`${API.GATEWAY}/staff/register`, {
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
// ADD YARD
// ===============================
function loadAddYard() {
    document.querySelector(".content").innerHTML = `
        <div class="card">
            <h2>Add Yard</h2>

            <input id="yardName" class="input" placeholder="Name"/>

            <select id="yardCity" class="input"></select>
            <select id="yardState" class="input"></select>

            <input id="yardCountry" value="INDIA" hidden/>

            <input id="yardPincode" class="input" placeholder="Pincode"/>
            <input id="yardContact" class="input" placeholder="Contact"/>
            <input id="yardEmail" class="input" placeholder="Email"/>

            <select id="yardStatus" class="input">
                <option value="">Select Status</option>
                <option value="ACTIVE">ACTIVE</option>
                <option value="INACTIVE">INACTIVE</option>
                <option value="UNDERMAINTENANCE">UNDERMAINTENANCE</option>
            </select>

            <button id="yardBtn" onclick="submitYard()">Create Yard</button>

            <div id="yardResult"></div>
        </div>
    `;

    populateCities();
    populateStates();
}

// ===============================
// CITY / STATE
// ===============================
const cities = [
  // Maharashtra
  "MUMBAI",
  "PUNE",
  "NAGPUR",
  "NASHIK",
  "AURANGABAD",

  // Delhi
  "NEW_DELHI",
  "DELHI",

  // Karnataka
  "BANGALORE",
  "MYSORE",
  "MANGALORE",

  // Tamil Nadu
  "CHENNAI",
  "COIMBATORE",
  "MADURAI",

  // Telangana
  "HYDERABAD",
  "WARANGAL",

  // West Bengal
  "KOLKATA",
  "HOWRAH",

  // Gujarat
  "AHMEDABAD",
  "SURAT",
  "VADODARA",
  "RAJKOT",

  // Rajasthan
  "JAIPUR",
  "UDAIPUR",
  "JODHPUR",

  // Uttar Pradesh
  "LUCKNOW",
  "KANPUR",
  "AGRA",
  "VARANASI",
  "NOIDA",

  // Madhya Pradesh
  "INDORE",
  "BHOPAL",
  "GWALIOR",

  // Punjab
  "AMRITSAR",
  "LUDHIANA",

  // Bihar
  "PATNA",
  "GAYA",

  // Kerala
  "KOCHI",
  "THIRUVANANTHAPURAM",
  "KOZHIKODE",

  // Odisha
  "BHUBANESWAR",
  "CUTTACK",

  // Assam
  "GUWAHATI"
];
const states = [
  "MAHARASHTRA",
  "DELHI",
  "KARNATAKA",
  "TAMIL_NADU",
  "TELANGANA",
  "WEST_BENGAL",
  "GUJARAT",
  "RAJASTHAN",
  "UTTAR_PRADESH",
  "MADHYA_PRADESH",
  "PUNJAB",
  "BIHAR",
  "KERALA",
  "ODISHA",
  "ASSAM"
];

function populateCities() {
    const select = document.getElementById("yardCity");
    cities.forEach(c => {
        select.innerHTML += `<option value="${c}">${c}</option>`;
    });
}

function populateStates() {
    const select = document.getElementById("yardState");
    states.forEach(s => {
        select.innerHTML += `<option value="${s}">${s}</option>`;
    });
}

// ===============================
// SUBMIT YARD
// ===============================
async function submitYard() {
    try {
        await safeFetch(`${API.GATEWAY}/yard/add`, {
            method: "POST",     
            body: JSON.stringify({
                name: document.getElementById("yardName").value,
                city: document.getElementById("yardCity").value,
                state: document.getElementById("yardState").value,
                country: "INDIA",
                pincode: document.getElementById("yardPincode").value,
                contactNo: document.getElementById("yardContact").value,
                email: document.getElementById("yardEmail").value,
                status: document.getElementById("yardStatus").value
            })
        });

        showToast("Yard created", "success");

    } catch {
        showToast("Failed", "error");
    }
}

// ===============================
// LOAD YARDS
// ===============================
function loadYards() {
    document.querySelector(".content").innerHTML = `
        <div class="card">
            <h2>Scrap Yards</h2>
            <div id="yardResults">Loading...</div>
        </div>
    `;

    searchYards();
}

async function searchYards() {
    const resultsDiv = document.getElementById("yardResults");

    try {
        const data = await safeFetch(`${API.GATEWAY}/yard/get/all`);

        resultsDiv.innerHTML = "";

        data.forEach(y => {
    const card = document.createElement("div");
    card.className = "yard-card";

    card.innerHTML = `
    <h4>${y.name}</h4>
    <p>${y.city}, ${y.state} - ${y.pincode}</p>
    <p>📞 ${y.contactNo}</p>
    <p>${y.status}</p>

    <button class="edit-btn">Edit</button>
    <button onclick="openAssignAdminModal(${y.yardId})">Assign Admin</button>
    <button onclick="openRemoveAdminModal(${y.yardId}, this)">Remove Admin</button>
    <button onclick="openAssignStaffModal(${y.yardId})">Assign Staff</button>
    <button onclick="viewYardStaff(${y.yardId})">View Staff</button>
    <button onclick="openAppointments(${y.yardId})">Appointments</button>
    <button onclick="openContactEdit(${y.yardId})">Edit Contact</button>
<button onclick="openStatusEdit(${y.yardId})">Change Status</button>
`;

card.querySelector(".edit-btn").addEventListener("click", () => {
    openEditYardModal(y);
});

    resultsDiv.appendChild(card);
});
    } catch {
        resultsDiv.innerHTML = "Error";
    }
}



function openEditYardModal(yard) {
    document.getElementById("editYardModal").style.display = "block";

    document.getElementById("editYardId").value = yard.yardId;
    document.getElementById("editYardName").value = yard.name || "";
    document.getElementById("editYardContact").value = yard.contactNo || "";
    document.getElementById("editYardEmail").value = yard.email || "";
    document.getElementById("editYardStatus").value = yard.status || "";
}


async function submitEditYard() {
    const btn = document.getElementById("editYardBtn");
    const resultDiv = document.getElementById("editYardResult");

    const payload = {
        yardId: document.getElementById("editYardId").value,
        name: document.getElementById("editYardName").value,
        contactNo: document.getElementById("editYardContact").value,
        email: document.getElementById("editYardEmail").value,
        status: document.getElementById("editYardStatus").value
    };

    // 🔥 remove empty fields
    Object.keys(payload).forEach(key => {
        if (payload[key] === "") {
            delete payload[key];
        }
    });

    try {
        btn.disabled = true;
        btn.innerText = "Updating...";

        const data = await safeFetch(`${API.GATEWAY}/yard/edit`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" }, // ✅ important
            body: JSON.stringify(payload)
        });

        resultDiv.innerHTML = `
            <div style="margin-top:15px; padding:15px; background:#ecfdf5; border-radius:8px;">
                <h3>✅ Yard Updated</h3>
                <p><b>Name:</b> ${data.name}</p>
                <p><b>City:</b> ${data.city}</p>
                <p><b>Email:</b> ${data.email}</p>
                <p><b>Status:</b> ${data.status}</p>
            </div>
        `;

        showToast("Yard updated successfully", "success");

        setTimeout(() => {
            closeEditYardModal();

            // ✅ call correct function based on context
            if (document.getElementById("yardSearchModal")?.style.display === "block") {
                searchYardsWithFilters(); // modal version
            } else {
                loadAllYards(); // main page version
            }

        }, 1500);

    } catch (error) {
        showToast("Update failed", "error");

        resultDiv.innerHTML = `
            <p style="color:red;">❌ ${error.message}</p>
        `;
    } finally {
        btn.disabled = false;
        btn.innerText = "Update Yard";
    }
}

function closeEditYardModal() {
    document.getElementById("editYardModal").style.display = "none";
    document.getElementById("editYardResult").innerHTML = "";
}


//=====================================================================
//Admin assign 
//=====================================================================

async function loadAdmins() {
    const select = document.getElementById("assignAdminId");

    try {
        const admins = await safeFetch(`${API.GATEWAY}/admin/getAll`);

        select.innerHTML = `<option value="">Select Admin</option>`;

        admins.forEach(a => {
            const option = document.createElement("option");
            option.value = a.id;
            option.textContent = `${a.username} (${a.email})`;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("Failed to load admins:", err);
        showToast("Failed to load admins", "error");
    }
}

function openAssignAdminModal(yardId) {
    const modal = document.getElementById("assignAdminModal");

    if (!modal) {
        console.error("assignAdminModal not found in DOM");
        return;
    }

    modal.style.display = "block";
    document.getElementById("assignYardId").value = yardId;

    loadAdmins();
}

async function submitAssignAdmin() {
    const yardId = document.getElementById("assignYardId").value;
    const adminId = document.getElementById("assignAdminId").value;

    const btn = document.getElementById("assignBtn");
    const resultDiv = document.getElementById("assignResult");

    if (!yardId || !adminId) {
        showToast("Yard and Admin ID required", "error");
        return;
    }

    try {
        btn.disabled = true;
        btn.innerText = "Assigning...";

        const data =await safeFetch(`${API.GATEWAY}/yard/assign/admin`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                yardId: Number(yardId),
                adminId: Number(adminId)
            })
        });

        resultDiv.innerHTML = `
    <div class="success-box">
        <h3>✅ Success</h3>
        <p>${data.message}</p>
        <small>${data.stamp}</small>
    </div>
`;
        showToast("Admin assigned successfully", "success");

        setTimeout(() => {
            closeAssignAdminModal();
            searchYards(); // refresh
        }, 1500);

    } catch (error) {
        showToast("Assignment failed", "error");

        resultDiv.innerHTML = `
            <p style="color:red;">❌ ${error.message}</p>
        `;
    } finally {
        btn.disabled = false;
        btn.innerText = "Assign";
    }
}



//=====================================================================
//Admin Remove 
//=====================================================================


function openRemoveAdminModal(yardId) {
    document.getElementById("removeYardId").value = yardId;
    document.getElementById("removeAdminModal").classList.add("active");
}

function closeRemoveAdminModal() {
    document.getElementById("removeAdminModal").classList.remove("active");
}

async function submitRemoveAdmin() {
    try {
        const yardId = document.getElementById("removeYardId").value;

        

        if (!yardId) {
            showToast("Yard ID required", "error");
            return;
        }

        const response = await safeFetch(`${API.GATEWAY}/yard/remove/admin`, {
        method: "POST", 
        body: JSON.stringify({
            yardId: Number(yardId)
        })
    });

        

        showToast("Admin removed successfully", "success");

        closeRemoveAdminModal();

        loadYards(); // 🔥 refresh UI

    } catch (error) {
        console.error("❌ Remove Admin Error:", error);
        showToast("Failed to remove admin", "error");
    }
}

//==================================================
//STAFF ADD
//==================================================

async function loadStaffs() {
    const select = document.getElementById("assignStaffId");

    try {
        const staffs = await safeFetch(`${API.GATEWAY}/staff/getAll`);

        select.innerHTML = `<option value="">Select Staff</option>`;

        staffs.forEach(s => {
            const option = document.createElement("option");
            option.value = s.id;
            option.textContent = `${s.username} (${s.email})`;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("Failed to load staffs:", err);
        showToast("Failed to load staff", "error");
    }
}


async function addStaffToYard(yardId, staffId) {
    try {
        const response = await fetch(`${API.GATEWAY}/management/yard/add/staff`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                yardId: yardId,
                staffId: staffId
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || "Failed to add staff");
        }

        return data;

    } catch (error) {
        console.error("Add Staff Error:", error);
        throw error;
    }
}

const addStaffBtn = document.getElementById("addStaffBtn");
if (addStaffBtn) {
    addStaffBtn.addEventListener("click", () => {
        const yardId = document.getElementById("yardIdInput").value;
        const staffId = document.getElementById("staffIdInput").value;

        if (!yardId || !staffId) {
            showPopup("Please fill all fields");
            return;
        }

        addStaff(yardId, staffId);
    });
}

async function loadStaffs() {
    const select = document.getElementById("assignStaffId");

    try {
        const staffs = await safeFetch(`${API.GATEWAY}/staff/getAll`);

        select.innerHTML = `<option value="">Select Staff</option>`;

        staffs.forEach(s => {
            const option = document.createElement("option");
            option.value = s.id;
            option.textContent = `${s.username} (${s.email})`;
            select.appendChild(option);
        });

    } catch (err) {
        console.error("Failed to load staffs:", err);
        showToast("Failed to load staff", "error");
    }
}

function openAssignStaffModal(yardId) {
    document.getElementById("assignStaffModal").style.display = "block";
    document.getElementById("assignStaffYardId").value = yardId;

    loadStaffs();
}

async function submitAssignStaff() {
    const yardId = document.getElementById("assignStaffYardId").value;
    const staffId = document.getElementById("assignStaffId").value;

    const btn = document.getElementById("assignStaffBtn");
    const resultDiv = document.getElementById("assignStaffResult");

    if (!yardId || !staffId) {
        showToast("Yard and Staff required", "error");
        return;
    }

    try {
    btn.disabled = true;
    btn.innerText = "Assigning...";

    const data = await safeFetch(`${API.GATEWAY}/management/yard/add/staff`, {
        method: "POST",
        body: JSON.stringify({
            yardId: Number(yardId),
            staffId: Number(staffId)
        })
    });

    // 🔥 detect logical failure
    if (data.message?.toLowerCase().includes("exist")) {
        throw new Error(data.message);
    }

    resultDiv.innerHTML = `
        <div class="success-box">
            <h3>✅ Success</h3>
            <p>${data.message}</p>
            <small>${data.stamp || ""}</small>
        </div>
    `;

    showToast("Staff assigned successfully", "success");

    setTimeout(() => {
        document.getElementById("assignStaffModal").style.display = "none";
        searchYards();
    }, 1500);

} catch (error) {
    showToast(error.message || "Assignment failed", "error");

    resultDiv.innerHTML = `
        <p style="color:red;">❌ ${error.message}</p>
    `;
}
}


//========================================
//Remove Staff 
//========================================

function openRemoveStaffModal(yardId) {
    document.getElementById("removeStaffYardId").value = yardId;
    document.getElementById("removeStaffModal").style.display = "block";
}

function closeRemoveStaffModal() {
    document.getElementById("removeStaffModal").style.display = "none";
}

async function submitRemoveStaff() {
    try {
        const yardId = document.getElementById("removeStaffYardId").value;
        const staffId = document.getElementById("removeStaffId").value;

        

        if (!yardId || !staffId) {
            showToast("Yard ID and Staff ID required", "error");
            return;
        }

        const response = await safeFetch(`${API.GATEWAY}/management/yard/remove/staff`, {
            method: "POST",
            body: JSON.stringify({
                yardId: Number(yardId),
                staffId: Number(staffId)
            })
        });

        

        showToast(response.message || "Staff removed successfully", "success");

        closeRemoveStaffModal();

        searchYards(); // 🔥 refresh UI

    } catch (error) {
        console.error("❌ Remove Staff Error:", error);
        showToast("Failed to remove staff", "error");
    }
}


//Staff details Of Yard

async function loadYardStaffDropdown(yardId) {
    const select = document.getElementById("yourSelectId");

    const staffs = await getYardStaffs(yardId);

    select.innerHTML = `<option value="">Select Staff</option>`;

    staffs.forEach(s => {
        const option = document.createElement("option");
        option.value = s.id;
        option.textContent = `${s.username} (${s.email})`;
        select.appendChild(option);
    });
}


async function getYardStaffs(yardId) {
    try {
        if (!yardId) {
            throw new Error("Yard ID required");
        }

        const data = await safeFetch(`${API.GATEWAY}/staff/get/yard/staffs`, {
            method: "POST",
            body: JSON.stringify({
                yardId: Number(yardId)
            })
        });

        return Array.isArray(data) ? data : [];
    } catch (error) {
        console.error("❌ Fetch Yard Staff Error:", error);
        showToast("Failed to load staff", "error");
        return [];
    }
}



async function viewYardStaff(yardId) {
    const staffs = await getYardStaffs(yardId);

    const modal = document.getElementById("yardStaffModal");
    const container = document.getElementById("yardStaffContainer");

    if (!modal || !container) {
        console.error("Modal or container not found");
        return;
    }

    modal.style.display = "block";

    if (!staffs || !staffs.length) {
        container.innerHTML = "<p>No staff assigned</p>";
        return;
    }

    container.innerHTML = staffs.map(s => `
        <div class="staff-card">
            <p><b>${s.username}</b></p>
            <p>${s.email}</p>

            <button onclick="removeStaffDirect(${yardId}, ${s.id})">
                Remove
            </button>
        </div>
    `).join("");
}
function closeYardStaffModal() {
    document.getElementById("yardStaffModal").style.display = "none";
}



async function removeStaffDirect(yardId, staffId) {
    try {
        if (!confirm("Remove this staff?")) return;

        await safeFetch(`${API.GATEWAY}/management/yard/remove/staff`, {
            method: "POST",
            body: JSON.stringify({
                yardId: Number(yardId),
                staffId: Number(staffId)
            })
        });

        showToast("Staff removed", "success");

        viewYardStaff(yardId); // refresh list

    } catch (error) {
        console.error("❌ Remove Error:", error);
        showToast("Failed to remove", "error");
    }
}


//================================================
//check appointments 
//================================================

async function getAppointments(yardId, start, ends) {
    try {
        if (!yardId || !start || !ends) {
            throw new Error("All fields required");
        }

        const data = await safeFetch(`${API.GATEWAY}/management/booking/get/list/appointment`, {
            method: "POST",
            body: JSON.stringify({
                 yardId: Number(yardId),
                start,
                ends
            })
        });

       

        return Array.isArray(data) ? data : [];

    } catch (error) {
        console.error("❌ Fetch Appointment Error:", error);
        showToast(error.message || "Failed to load appointments", "error");
        return [];
    }
}

function loadAppointmentsUI() {
    document.querySelector(".content").innerHTML = `
        <div class="card">
            <h2>Appointments</h2>

        
            <input id="apptStart" type="date" class="input"/>
            <input id="apptEnd" type="date" class="input"/>

            <button onclick="searchAppointments()">Search</button>

            <div id="appointmentResults"></div>
        </div>
    `;
}

async function searchAppointments() {
    const yardId = window.selectedYardId;

    const startInput = document.getElementById("apptStart");
    const endInput = document.getElementById("apptEnd");

    if (!startInput || !endInput) {
        console.error("Inputs not loaded yet");
        return;
    }

    const start = startInput.value;
    const ends = endInput.value;

    const container = document.getElementById("appointmentResults");

    container.innerHTML = "Loading...";

    const appointments = await getAppointments(yardId, start, ends);

    if (!appointments.length) {
        container.innerHTML = "<p>No appointments found</p>";
        return;
    }

    container.innerHTML = appointments.map(a => `
        <div class="appointment-card">
            <p><b>User:</b> ${a.userName}</p>
            <p><b>Mobile:</b> ${a.userMobileNo}</p>
            <p><b>Date:</b> ${a.dateOfAppointment}</p>
            <p><b>Status:</b> ${a.status}</p>
            <p><b>Staff:</b> ${a.staffUsername || "Not Assigned"}</p>
        </div>
    `).join("");
}
function openAppointments(yardId) {
    loadAppointmentsUI();

    // store yardId globally (simple way)
    window.selectedYardId = yardId;
}



function loadMetalPrice() {
    document.querySelector(".content").innerHTML = `
        <div class="card">
            <h2>Update Metal Prices</h2>

            <input id="steel" class="input" placeholder="Steel"/>
            <input id="aluminum" class="input" placeholder="Aluminum"/>
            <input id="copper" class="input" placeholder="Copper"/>
            <input id="iron" class="input" placeholder="Iron"/>
            <input id="plastic" class="input" placeholder="Plastic"/>
            <input id="rubber" class="input" placeholder="Rubber"/>
            <input id="electronics" class="input" placeholder="Electronics"/>
            <input id="lead" class="input" placeholder="Lead"/>

            <button onclick="updateMetalPrice()">Update Prices</button>

            <div id="metalResult"></div>
        </div>
    `;
}


async function updateMetalPrice() {
    const resultDiv = document.getElementById("metalResult");

    // collect values
    const payload = {
        steel: parseFloat(document.getElementById("steel").value),
        aluminum: parseFloat(document.getElementById("aluminum").value),
        copper: parseFloat(document.getElementById("copper").value),
        iron: parseFloat(document.getElementById("iron").value),
        plastic: parseFloat(document.getElementById("plastic").value),
        rubber: parseFloat(document.getElementById("rubber").value),
        electronics: parseFloat(document.getElementById("electronics").value),
        lead: parseFloat(document.getElementById("lead").value),
    };

    // 🔥 REMOVE empty / NaN values
    Object.keys(payload).forEach(key => {
        if (isNaN(payload[key])) {
            delete payload[key];
        }
    });

    if (Object.keys(payload).length === 0) {
        showToast("Enter at least one value", "error");
        return;
    }

    try {
        resultDiv.innerHTML = "Updating...";

       

        const data = await safeFetch(`${API.GATEWAY}/metal/change-metal-price`, {
            method: "PATCH",
            body: JSON.stringify(payload)
        });

        resultDiv.innerHTML = `
            <div class="success-box">
                <h3>✅ Updated Successfully</h3>
                <p>Steel: ${data.steel ?? "-"}</p>
                <p>Aluminum: ${data.aluminum ?? "-"}</p>
                <p>Copper: ${data.copper ?? "-"}</p>
                <p>Iron: ${data.iron ?? "-"}</p>
                <p>Plastic: ${data.plastic ?? "-"}</p>
                <p>Rubber: ${data.rubber ?? "-"}</p>
                <p>Electronics: ${data.electronics ?? "-"}</p>
                <p>Lead: ${data.lead ?? "-"}</p>
            </div>
        `;

        showToast("Metal prices updated", "success");

    } catch (error) {
        console.error(error);
        showToast("Update failed", "error");
        resultDiv.innerHTML = `<p style="color:red;">❌ Failed</p>`;
    }
}

async function updateContactOnly() {
    const yardId = document.getElementById("contactYardId").value;
    const email = document.getElementById("contactEmail").value;
    const contact = document.getElementById("contactNumber").value;

    try {
        await safeFetch(`${API.GATEWAY}/management/yard/edit/contact`, {
            method: "PATCH",
            body: JSON.stringify({
                yardId: Number(yardId),
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
    const yardId = document.getElementById("statusYardId").value;
    const status = document.getElementById("statusSelect").value;
    
        console.log("Before API call:", status); 

    try {
        await safeFetch("/api/management/yard/change/status", {
            method: "PATCH",
            body: JSON.stringify({
                yardId: Number(yardId),
                status:status
            })
        });
    
        console.log(status);
       
        showToast("Status updated", "success");
        searchYards();

         console.log("Sending:", {
    yardId: Number(yardId),
    status: status
});
    }   catch {
        showToast("Failed to update status", "error");
    }
}
function openContactEdit(yardId) {
    const modal = document.getElementById("contactEditModal");

    if (!modal) {
        console.error("contactEditModal not found");
        return;
    }

    modal.style.display = "block";
    document.getElementById("contactYardId").value = yardId;
}
function openStatusEdit(yardId) {
    const modal = document.getElementById("statusEditModal");

    if (!modal) {
        console.error("statusEditModal not found");
        return;
    }

    modal.style.display = "block";
    document.getElementById("statusYardId").value = yardId;
}
