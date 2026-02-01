// 1. Sidebar (Yon menyu) ochilib-yopilish mantiqi
function toggleSidebar() {
    const sidebar = document.getElementById('side-menu');
    const overlay = document.getElementById('overlay');
    
    sidebar.classList.toggle('open');
    overlay.classList.toggle('show');
}

// 2. Sahifa yuklanganda foydalanuvchini tekshirish
window.onload = () => {
    const savedName = localStorage.getItem('userName');
    
    // Ism kiritilmagan bo'lsa, login modalini ko'rsatish
    if (!savedName) {
        document.getElementById('login-modal').style.display = 'flex';
    } else {
        document.getElementById('welcome-text').innerText = `Salom, ${savedName}!`;
    }
    
    // Chat oynasini oxirgi xabarga tushirish
    const chatBox = document.getElementById('chat-messages');
    chatBox.scrollTop = chatBox.scrollHeight;
};

// 3. Foydalanuvchi ismini saqlash
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

// 4. Admin Panel mantiqi (Sherzod / Prince230367)
function openAdmin() {
    // Sidebar ochiq bo'lsa yopamiz va login oynasini ochamiz
    const sidebar = document.getElementById('side-menu');
    if (sidebar.classList.contains('open')) toggleSidebar();
    
    document.getElementById('admin-login-input').value = "";
    document.getElementById('admin-pass-input').value = "";
    document.getElementById('admin-auth-modal').style.display = 'flex';
}

function checkAdminAuth() {
    const login = document.getElementById('admin-login-input').value.trim();
    const pass = document.getElementById('admin-pass-input').value.trim();

    // Login va Parol tekshiruvi
    if (login === 'Sherzod' && pass === 'Prince230367') {
        document.getElementById('admin-auth-modal').style.display = 'none';
        showLogs(); // Xabarlar ro'yxatini chiqarish
    } else {
        alert("Login yoki Parol xato!");
    }
}

// 5. Admin uchun barcha foydalanuvchilar xabarlarini ko'rsatish
function showLogs() {
    const container = document.getElementById('admin-logs-container');
    const logs = JSON.parse(localStorage.getItem('chatLogs') || '[]');
    
    document.getElementById('admin-panel-section').style.display = 'flex';
    container.innerHTML = ""; // Oldingi ma'lumotlarni tozalash

    if (logs.length === 0) {
        container.innerHTML = "<p style='color:gray; text-align:center;'>Xabarlar mavjud emas.</p>";
    } else {
        // Eng yangi xabarlarni tepada ko'rsatish
        logs.reverse().forEach(item => {
            container.innerHTML += `
                <div class="log-item">
                    <b>${item.ism}:</b> ${item.xabar}
                    <small style="display:block; color:#555; font-size:0.7rem;">${item.vaqt}</small>
                </div>`;
        });
    }
}

// 6. Xabar yuborish mantiqi
function sendMessage() {
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

        // Inputni tozalash va pastga tushirish
        input.value = '';
        chatBox.scrollTop = chatBox.scrollHeight;

        // Botdan "Yuklanmoqda" effekti
        setTimeout(() => {
            const botDiv = document.createElement('div');
            botDiv.className = 'msg bot-msg';
            botDiv.innerText = "Xabaringiz qabul qilindi. Tez orada Gemini ulanadi!";
            chatBox.appendChild(botDiv);
            chatBox.scrollTop = chatBox.scrollHeight;
        }, 800);
    }
}

// 7. Yordamchi mantiqlar
function closeModal(id) {
    document.getElementById(id).style.display = 'none';
}

// "Enter" tugmasi orqali xabar yuborish
document.getElementById('user-input').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});