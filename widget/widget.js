(function () {

  const scriptTag = document.currentScript;
  const clientId = scriptTag.getAttribute("data-client-id");

  // Create container
  const container = document.createElement("div");

  container.innerHTML = `
    <div style="
      position: fixed;
      bottom: 20px;
      right: 20px;
      width: 300px;
      background: white;
      border: 1px solid #ccc;
      border-radius: 8px;
      padding: 10px;
      font-family: Arial;
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
    ">
      <div style="font-weight: bold; margin-bottom: 8px;">
        Chat with us
      </div>
      <div id="ai-messages" style="height: 150px; overflow-y: auto; margin-bottom: 8px;"></div>
      <input id="ai-input" style="width: 70%;" placeholder="Type message..." />
      <button id="ai-send">Send</button>
    </div>
  `;

  // Add widget to page
  document.body.appendChild(container);

  // Get elements AFTER appending
 const messagesDiv = container.querySelector("#ai-messages");
const input = container.querySelector("#ai-input");
const sendBtn = container.querySelector("#ai-send");

  // Send function
  async function sendMessage() {

    const message = input.value.trim();
    if (!message) return;

    // Show user message
    messagesDiv.innerHTML += `<div><strong>You:</strong> ${message}</div>`;
    input.value = "";

    // Create bot container
    const botDiv = document.createElement("div");
    botDiv.innerHTML = "<strong>Bot:</strong> ";
    messagesDiv.appendChild(botDiv);

    try {
      const response = await fetch("https://ai-bot-template.onrender.com/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message, clientId })
      });

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        botDiv.innerHTML += chunk;
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
      }

    } catch (error) {
      botDiv.innerHTML += "Error connecting to server.";
      console.error(error);
    }
  }

  // Button click
  sendBtn.onclick = sendMessage;

  // Enter key support
  input.addEventListener("keydown", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

})();