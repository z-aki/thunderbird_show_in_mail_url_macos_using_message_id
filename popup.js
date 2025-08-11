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

async function copyToClipboard(text) {
  await navigator.clipboard.writeText(text);
}

(async () => {
  console.log("Generating message URL");
  try {
    const msgId = await getMessageId();
    // Load custom URL format from storage
    const data = await browser.storage.sync.get("customUrlFormat");
    let urlFormat = data.customUrlFormat || "message:$$$";
    const url = urlFormat.replace(/\$\$\$/g, msgId);
    await copyToClipboard(url);
    outcome.textContent = `${url}`;
    outcome.href = url;
    messenger.messageDisplayAction.setBadgeText({ text: "✓" });
    messenger.messageDisplayAction.setBadgeBackgroundColor({ color: "#00ff00" });
  } catch (e) {
    console.error("Failed to convert or copy to clipboard:", e);
    messenger.messageDisplayAction.setBadgeText({ text: "!!" });
    messenger.messageDisplayAction.setBadgeBackgroundColor({ color: "#ff0000" });
  } finally {
    setTimeout(() => {
      messenger.messageDisplayAction.setBadgeText({ text: "" });
      messenger.messageDisplayAction.setBadgeBackgroundColor({ color: null });
    }, 200);
  }
})();
