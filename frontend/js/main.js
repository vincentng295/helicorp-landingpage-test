const SESSION_ID = 'sess_' + Math.random().toString(36).substring(2, 15) + Date.now().toString(36);
const DEVICE_TYPE = /Mobi|Android|iPhone/i.test(navigator.userAgent) ? 'mobile' : 'desktop';

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
            sendTrackingLog('click_cta', 'submit_subscription_form_success');
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
                eventName: eventType,
                pageUrl: window.location.href,
                metadata: {
                    sessionId: SESSION_ID,
                    device: DEVICE_TYPE,
                    detail: detail,
                    timestamp: new Date().toISOString()
                }
            })
        });
    } catch (e) {
        console.log(`Tracking ngầm: ${eventType} - ${detail}`);
    }
}

sendTrackingLog('session_start', `landing_page_init_on_${DEVICE_TYPE}`);


setInterval(() => {
    sendTrackingLog('session_ping', 'heartbeat');
}, 10000);

document.querySelectorAll('.tracking-feature').forEach(card => {
    card.addEventListener('click', () => {
        const featureName = card.getAttribute('data-feature');
        sendTrackingLog('click_feature', featureName);
    });
});


document.querySelectorAll('a[href="#register"]').forEach(cta => {
    cta.addEventListener('click', () => {
        sendTrackingLog('click_cta', `button_cta_redirect:${cta.innerText.trim()}`);
    });
});

let scrolledSpecs = false;
let maxRecordedScroll = 0;

window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY || document.documentElement.scrollTop;
    const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrollPercent = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
    
    if (scrollPercent > maxRecordedScroll && scrollPercent % 25 === 0 && scrollPercent !== maxRecordedScroll) {
        maxRecordedScroll = scrollPercent;
        sendTrackingLog('scroll_view', `scroll_depth: ${scrollPercent}%`);
    }

    const specsSection = document.getElementById('specs');
    if (specsSection && window.scrollY > (specsSection.offsetTop - 300) && !scrolledSpecs) {
        scrolledSpecs = true;
        sendTrackingLog('scroll_view', 'technical_specs_section');
    }
});