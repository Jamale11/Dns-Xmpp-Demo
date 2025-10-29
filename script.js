async function lookup() {
  const domain = document.getElementById("domainInput").value.trim();
  const resultBox = document.getElementById("result");
  const btn = document.getElementById("lookupBtn");
  const chatBox = document.getElementById("chatBox");
  const chatInput = document.getElementById("chatInput");

  if (!domain) return;

  btn.disabled = true;
  resultBox.style.display = "none";
  chatBox.style.display = "none";
  chatInput.style.display = "none";
  resultBox.innerHTML = "<em>Looking up DNS records...</em>";

  try {
    const [txtRes, srvRes] = await Promise.all([
      fetch(`https://dns.google/resolve?name=${domain}&type=TXT`).then(r => r.json()),
      fetch(`https://dns.google/resolve?name=_xmpp._tcp.${domain}&type=SRV`).then(r => r.json())
    ]);

    const txtRecords = txtRes.Answer
      ? txtRes.Answer.map(a => a.data.replace(/^\"|\"$/g, "")).join("<br>")
      : "No TXT records found.";

    const srvRecords = srvRes.Answer
      ? srvRes.Answer.map(a => a.data).join("<br>")
      : "No SRV records found.";

    resultBox.innerHTML = `
      <strong>Connected to:</strong> ${domain}<br><br>
      <strong>TXT:</strong><br>${txtRecords}<br><br>
      <strong>SRV:</strong><br>${srvRecords}
    `;

    chatBox.style.display = "block";
    chatInput.style.display = "flex";
    chatBox.innerHTML = `<div class="msg domain">👋 Hi! This is ${domain} responding via XMPP rail.</div>`;
  } catch (e) {
    resultBox.innerHTML = "<span style='color: red;'>❌ Failed to fetch DNS data.</span>";
  } finally {
    resultBox.style.display = "block";
    btn.disabled = false;
  }
}

function sendMsg() {
  const msgInput = document.getElementById("msgInput");
  const chatBox = document.getElementById("chatBox");
  const text = msgInput.value.trim();
  if (!text) return;

  const userMsg = document.createElement("div");
  userMsg.className = "msg user";
  userMsg.textContent = text;
  chatBox.appendChild(userMsg);
  msgInput.value = "";

  // Simulated domain reply
  setTimeout(() => {
    const reply = document.createElement("div");
    reply.className = "msg domain";
    reply.textContent = "🤖 Domain: message received via XMPP prototype.";
    chatBox.appendChild(reply);
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 1000);

  chatBox.scrollTop = chatBox.scrollHeight;
}
