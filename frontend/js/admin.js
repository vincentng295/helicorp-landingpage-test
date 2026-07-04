const API_URL = '/api';
const LOGIN_URL = '/api/analytics/login';
const TOKEN_KEY = 'helicorp_jwt_token';


document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {

        fetchAnalyticsData();
    } else {

        showLogin();
    }
});


document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const errorMsg = document.getElementById("login-error");

    try {
        const response = await fetch(LOGIN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username, password })
        });

        if (response.ok) {
            const data = await response.json();
            

            const token = data.token || data.accessToken;
            
            if (token) {
                localStorage.setItem(TOKEN_KEY, token);
                errorMsg.classList.add("hidden");
                showDashboard();
            } else {
                console.error("Backend không trả về token trong body response.");
                errorMsg.innerText = "❌ Lỗi hệ thống: Không nhận được mã xác thực.";
                errorMsg.classList.remove("hidden");
            }
        } else {
            errorMsg.innerText = "❌ Tài khoản hoặc mật khẩu không chính xác.";
            errorMsg.classList.remove("hidden");
        }
    } catch (error) {
        console.error("Lỗi kết nối hệ thống đăng nhập:", error);
        errorMsg.innerText = "❌ Không thể kết nối tới máy chủ Backend.";
        errorMsg.classList.remove("hidden");
    }
});


function showLogin() {
    document.getElementById("login-section").classList.remove("hidden");
    document.getElementById("dashboard-section").classList.add("hidden");
}

function showDashboard() {
    document.getElementById("login-section").classList.add("hidden");
    document.getElementById("dashboard-section").classList.remove("hidden");
    fetchAnalyticsData();
}


function handleLogout() {
    localStorage.removeItem(TOKEN_KEY);
    showLogin();
}


async function fetchAnalyticsData() {
    const token = localStorage.getItem(TOKEN_KEY);
    
    if (!token) {
        handleLogout();
        return;
    }

    try {
        const res = await fetch(`${API_URL}/analytics`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        

        if (res.status === 401 || res.status === 403) {
            handleLogout();
            return;
        }

        const data = await res.json();
        

        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("dashboard-section").classList.remove("hidden");


        document.getElementById('total-sessions').innerText = data.totalSessions || 0;
        document.getElementById('total-clicks').innerText = data.totalClicks || 0;
        document.getElementById('avg-scroll').innerText = `${data.avgScroll || 0}%`;
        document.getElementById('avg-time').innerText = `${data.avgTime || 0}s`;

        renderDeviceChart(data.devices);
        renderClickChart(data.clicksData);
        await fetchSubscriptions(token);

        const tbody = document.getElementById('logs-table-body');
        tbody.innerHTML = (data.recentLogs || []).map(log => `
            <tr class="hover:bg-slate-800/30 transition">
                <td class="px-6 py-4 font-mono text-xs text-slate-500">${log.sessionId ? log.sessionId.substring(0,8) : 'N/A'}...</td>
                <td class="px-6 py-4 text-xs">${log.device || 'Unknown'}</td>
                <td class="px-6 py-4 text-emerald-400 font-medium text-xs">${log.lastClickedElement || 'None'}</td>
                <td class="px-6 py-4 text-xs">${log.maxScrollPercent || 0}%</td>
                <td class="px-6 py-4 font-mono text-xs">${log.durationSeconds || 0}s</td>
            </tr>
        `).join('');
    } catch (err) {
        console.error("Error loading admin stats:", err);


    }
}


let deviceChart, clickChart;
function renderDeviceChart(devices = { desktop: 0, mobile: 0 }) {
    const ctx = document.getElementById('deviceChart').getContext('2d');
    if(deviceChart) deviceChart.destroy();
    deviceChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Desktop', 'Mobile'],
            datasets: [{
                data: [devices.desktop || 0, devices.mobile || 0],
                backgroundColor: ['#10b981', '#06b6d4'],
                borderWidth: 0
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            plugins: { legend: { labels: { color: '#94a3b8' } } }
        }
    });
}

function renderClickChart(clicksData = {}) {
    const ctx = document.getElementById('clickChart').getContext('2d');
    if(clickChart) clickChart.destroy();
    clickChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(clicksData),
            datasets: [{
                label: 'Clicks',
                data: Object.values(clicksData),
                backgroundColor: '#6366f1',
                borderRadius: 6
            }]
        },
        options: { 
            responsive: true, 
            maintainAspectRatio: false,
            scales: {
                x: { ticks: { color: '#94a3b8' }, grid: { display: false } },
                y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
            },
            plugins: { legend: { display: false } }
        }
    });
}

async function fetchSubscriptions(token) {
    try {
        const res = await fetch(`${API_URL}/subscriptions`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            const subs = await res.json();
            const tbody = document.getElementById('subscriptions-table-body');
            if (tbody) {
                tbody.innerHTML = subs.map(sub => `
                    <tr class="hover:bg-slate-800/30 transition">
                        <td class="px-6 py-4 text-sm font-medium text-slate-100">${sub.name}</td>
                        <td class="px-6 py-4 text-sm text-emerald-400">${sub.email}</td>
                    </tr>
                `).join('');
            }
        }
    } catch (err) {
        console.error("Error fetching subscriptions:", err);
    }
}