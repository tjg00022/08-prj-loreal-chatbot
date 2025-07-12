/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Initialize messages array with system prompt
let messages = [
  {
    role: "system",
    content:
      "You are L'Oréal's Smart Product Advisor, an expert in beauty and skincare. Your purpose is to help customers find the right L'Oréal products and create personalized beauty routines. Only provide advice about L'Oréal products and beauty routines.",
  },
];

// Function to create and append a message bubble
function createMessageBubble(content, isUser) {
  const bubbleWrapper = document.createElement("div");
  bubbleWrapper.className = `message-wrapper ${isUser ? "user" : "assistant"}`;

  if (!isUser) {
    // Add L'Oréal logo for assistant messages
    const avatar = document.createElement("div");
    avatar.className = "avatar";
    avatar.innerHTML =
      '<img src="img/loreal-logo.png" alt="L\'Oréal Assistant">';
    bubbleWrapper.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.className = "message-bubble";
  bubble.textContent = content;

  bubbleWrapper.appendChild(bubble);
  chatWindow.appendChild(bubbleWrapper);

  // Scroll to the latest message
  chatWindow.scrollTop = chatWindow.scrollHeight;
}

// Set initial message
createMessageBubble("👋 Hello! How can I help you today?", false);

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  // Clear input
  userInput.value = "";

  // Display user message
  createMessageBubble(userMessage, true);

  // Add to messages array
  messages.push({ role: "user", content: userMessage });

  // Create loading message
  const loadingWrapper = document.createElement("div");
  loadingWrapper.className = "message-wrapper assistant";

  const loadingAvatar = document.createElement("div");
  loadingAvatar.className = "avatar";
  loadingAvatar.innerHTML =
    '<img src="img/loreal-logo.png" alt="L\'Oréal Assistant">';

  const loadingBubble = document.createElement("div");
  loadingBubble.className = "message-bubble loading";
  loadingBubble.textContent = "Typing";

  loadingWrapper.appendChild(loadingAvatar);
  loadingWrapper.appendChild(loadingBubble);
  chatWindow.appendChild(loadingWrapper);

  // Get response from OpenAI
  try {
    const response = await fetch(
      "https://wanderbot-worker.tjg00022.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages }),
      }
    );

    const data = await response.json();
    const reply = data.choices[0].message.content;

    // Remove loading message
    chatWindow.removeChild(loadingWrapper);

    // Add response to messages array and display it
    messages.push({ role: "assistant", content: reply });
    createMessageBubble(reply, false);
  } catch (error) {
    console.error("Error:", error);
    // Remove loading message
    chatWindow.removeChild(loadingWrapper);
    createMessageBubble("Sorry, there was an error. Please try again.", false);
  }
});
