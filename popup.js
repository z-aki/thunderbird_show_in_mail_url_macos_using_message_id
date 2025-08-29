async function getMessageId() {
  const messages = await browser.messageDisplay.getDisplayedMessages();
  if (!messages.messages?.length) throw new Error("No message displayed");
  const msg = await messenger.messages.getFull(messages.messages[0].id);
  const headers = msg.headers || {};
  let msgId = headers["message-id"] || [""];
  msgId = msgId[0].trim();
  // Encode angle brackets
  const encoded = `${encodeURIComponent(msgId)}`;
  return encoded;
}

async function copy(text) {
  await navigator.clipboard.writeText(text);
}

function setBadge(text, color, time) {
  setTimeout(() => {
    messenger.messageDisplayAction.setBadgeText({ text: text });
    messenger.messageDisplayAction.setBadgeBackgroundColor({ color: color });
  }, time);
}

(async () => {
  console.log("Generating message URL");
  try {
    const msgId = await getMessageId();

    const settings = await browser.storage.sync.get();
    let urlFormat = settings.customUrlFormat || "message:$$$";
    const url = urlFormat.replace(/\$\$\$/g, msgId);
    if (settings.copyToClipboard) {
      await copy(url);
    }
    const a = document.createElement("a");
    a.textContent = url;
    a.href = url;
    outcome.appendChild(a);

    setBadge("✓", "#009900", 1);
  } catch (e) {
    console.error(
      "Failed to convert or copy to clipboard. See console. Error:",
      e
    );
    outcome.appendChild(
      document.createTextNode(
        `Failed to convert or copy to clipboard. See console. Error: ${e}`
      )
    );
    outcome.appendChild(document.createElement("br"));

    setBadge("!!", "#990000", 1);
  } finally {
    setBadge("", null, 600);
  }
})();
