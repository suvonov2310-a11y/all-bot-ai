// 0. GEMINI SOZLAMASI (Kalitni shu yerga qo'ying)
const GEMINI_API_KEY = "AIzaSyCkAu0MHo9WB20drSMwkojgfFEGcDmk0WY"; 

// 1. Sidebar mantiqi
function toggleSidebar() {
    const sidebar = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

// 2. Sahifa yuklanganda ismni tekshirish
window.onload = () => {
    const savedName = localStorage.getItem('userName');
    if (!savedName) {
        document.getElementById('login-modal').style.display = 'flex';
    } else {
        document.getElementById('welcome-text').innerText = `Salom, ${savedName}!`;
    }
    const chatBox = document.getElementById('chat-messages');
    chatBox.scrollTop = chatBox.scrollHeight;
};

// 3. Foydalanuvchi ismini saqlash
function loginUser() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();
    if (name) {
        localStorage.setItem('userName', name);
        location.reload();
    } else {
        alert("Iltimos, ismingizni kiriting!");
    }
}

// 4. Admin Panel (Sherzod / Prince230367)
function openAdmin() {
    const sidebar = document.getElementById('side-menu');
    if (sidebar.classList.contains('open')) toggleSidebar();
    document.getElementById('admin-login-input').value = "";
    document.getElementById('admin-pass-input').value = "";
    document.getElementById('admin-auth-modal').style.display = 'flex';
}

function checkAdminAuth() {
    const login = document.getElementById('admin-login-input').value.trim();
    const pass = document.getElementById('admin-pass-input').value.trim();
    if (login === 'Sherzod' && pass === 'Prince230367') {
        document.getElementById('admin-auth-modal').style.display = 'none';
        showLogs();
    } else {
        alert("Login yoki Parol xato!");
    }
}

// 5. Loglarni ko'rsatish
function showLogs() {
    const container = document.getElementById('admin-logs-container');
    const logs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
    document.getElementById('admin-panel-section').style.display = 'flex';
    container.innerHTML = logs.length === 0 ? "<p>Xabarlar yo'q.</p>" : 
        logs.reverse().map(item => `
            <div class="log-item">
                <b>${item.ism}:</b> ${item.xabar}
                <small style="display:block; color:#555;">${item.vaqt}</small>
            </div>`).join('');
}

// 6. XABAR YUBORISH (Haqiqiy Gemini AI bilan)
async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-messages');
    const msgText = input.value.trim();
    const userName = localStorage.getItem('userName') || "Mehmon";

    if (msgText) {
        // Foydalanuvchi xabarini chiqarish
        const userDiv = document.createElement('div');
        userDiv.className = 'msg user-msg';
        userDiv.innerText = msgText;
        chatBox.appendChild(userDiv);

        // Logga saqlash
        let logs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
        logs.push({ ism: userName, xabar: msgText, vaqt: new Date().toLocaleString('uz-UZ') });
        localStorage.setItem('chatLogs', JSON.stringify(logs));

        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // Bot o'ylayotgan holati
        const botDiv = document.createElement('div');
        botDiv.className = 'msg bot-msg';
        botDiv.innerText = "Fikrlayapman...";
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            // Haqiqiy Gemini API so'rovi
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: msgText }] }]
                })
            });

            const data = await response.json();
            const botResponse = data.candidates[0].content.parts[0].text;

            // Bot javobini ekranda yangilash
            botDiv.innerText = botResponse;
        } catch (error) {
            botDiv.innerText = "Xatolik: API kalit xato yoki internet ulanmagan.";
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

function closeModal(id) { document.getElementById(id).style.display = 'none'; }

document.getElementById('user-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});