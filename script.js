// 1. GEMINI SOZLAMASI (Kalitni shu yerga qo'ying)
// Diqqat: API kalitni qo'shtirnoq ichiga yozing!
const GEMINI_API_KEY = "AIzaSyCkAu0MHo9WB20drSMwkojgfFEGcDmk0WY"; 

// 2. Sidebar (Yon menyu) ochilib-yopilish mantiqi
function toggleSidebar() {
    const sidebar = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

// 3. Sahifa yuklanganda foydalanuvchini tekshirish
window.onload = () => {
    const savedName = localStorage.getItem('userName');
    const chatBox = document.getElementById('chat-messages');
    
    // Ism kiritilmagan bo'lsa, login modalini ko'rsatish
    if (!savedName) {
        document.getElementById('login-modal').style.display = 'flex';
    } else {
        document.getElementById('login-modal').style.display = 'none';
        document.getElementById('welcome-text').innerText = `Salom, ${savedName}!`;
    }
    
    // Chat oynasini oxirgi xabarga tushirish
    chatBox.scrollTop = chatBox.scrollHeight;
};

// 4. Foydalanuvchi ismini saqlash
function loginUser() {
    const nameInput = document.getElementById('name-input');
    const name = nameInput.value.trim();
    
    if (name) {
        localStorage.setItem('userName', name);
        location.reload(); // Sahifani yangilab, ismni dashboardga chiqarish
    } else {
        alert("Iltimos, ismingizni kiriting!");
    }
}

// 5. Admin Panel mantiqi (Sherzod / Prince230367)
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
        showLogs(); // Xabarlar ro'yxatini chiqarish
    } else {
        alert("Login yoki Parol xato!");
    }
}

// 6. Admin uchun barcha foydalanuvchilar xabarlarini ko'rsatish
function showLogs() {
    const container = document.getElementById('admin-logs-container');
    const logs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
    
    document.getElementById('admin-panel-section').style.display = 'flex';
    container.innerHTML = ""; 

    if (logs.length === 0) {
        container.innerHTML = "<p style='color:gray; text-align:center;'>Xabarlar mavjud emas.</p>";
    } else {
        logs.reverse().forEach(item => {
            container.innerHTML += `
                <div class="log-item" style="border-bottom: 1px solid #222; padding: 10px;">
                    <b style="color:#3b82f6;">${item.ism}:</b> ${item.xabar}
                    <small style="display:block; color:#555; font-size:0.7rem;">${item.vaqt}</small>
                </div>`;
        });
    }
}

// 7. XABAR YUBORISH (HAQIQIY GEMINI AI BILAN)
async function sendMessage() {
    const input = document.getElementById('user-input');
    const chatBox = document.getElementById('chat-messages');
    const msgText = input.value.trim();
    const userName = localStorage.getItem('userName') || "Mehmon";

    if (msgText) {
        // Foydalanuvchi xabarini ekranga chiqarish
        const userDiv = document.createElement('div');
        userDiv.className = 'msg user-msg';
        userDiv.innerText = msgText;
        chatBox.appendChild(userDiv);

        // Xabarni localStorage-ga log sifatida saqlash
        let logs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
        logs.push({
            ism: userName,
            xabar: msgText,
            vaqt: new Date().toLocaleString('uz-UZ')
        });
        localStorage.setItem('chatLogs', JSON.stringify(logs));

        // Inputni tozalash
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // Botdan "Fikrlayapman..." holati
        const botDiv = document.createElement('div');
        botDiv.className = 'msg bot-msg';
        botDiv.innerText = "Fikrlayapman...";
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight;

        try {
            // Gemini API-ga so'rov yuborish
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
            console.error("Xato:", error);
        }
        
        chatBox.scrollTop = chatBox.scrollHeight;
    }
}

// 8. Yordamchi mantiqlar
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// "Enter" tugmasi orqali xabar yuborish
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});