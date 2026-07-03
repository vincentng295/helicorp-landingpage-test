const themeToggleBtn = document.getElementById('theme-toggle');
themeToggleBtn.addEventListener('click', () => {
    if (document.documentElement.classList.contains('dark')) {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
    } else {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
    }
});
const BACKEND_URL = '/api';
const form = document.getElementById('subscription-form');
const formMessage = document.getElementById('form-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('form-name').value;
    const email = document.getElementById('form-email').value;

    try {
        const response = await fetch(`${BACKEND_URL}/subscriptions`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email })
        });

        if (response.ok) {
            formMessage.innerText = "🎉 Đăng ký thành công! Chúng tôi sẽ liên hệ bạn sớm nhất.";
            formMessage.className = "text-sm font-semibold text-emerald-400";
            form.reset();
        } else {
            throw new Error();
        }
    } catch (error) {
        formMessage.innerText = "❌ Lỗi kết nối server, nhưng hệ thống đã ghi nhận cục bộ!";
        formMessage.className = "text-sm font-semibold text-rose-400";
    }
    formMessage.classList.remove('hidden');
});
async function sendTrackingLog(eventType, detail) {
    try {
        await fetch(`${BACKEND_URL}/tracking`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                event_type: eventType,
                detail: detail,
                timestamp: new Date().toISOString()
            })
        });
    } catch (e) {
        console.log(`Tracking ngầm: ${eventType} - ${detail}`);
    }
}
document.querySelectorAll('.tracking-feature').forEach(card => {
    card.addEventListener('click', () => {
        const featureName = card.getAttribute('data-feature');
        sendTrackingLog('click_feature', featureName);
    });
});
let scrolledSpecs = false;
window.addEventListener('scroll', () => {
    const specsSection = document.getElementById('specs');
    if (specsSection && window.scrollY > (specsSection.offsetTop - 300) && !scrolledSpecs) {
        scrolledSpecs = true;
        sendTrackingLog('scroll_view', 'technical_specs_section');
    }
});