document.addEventListener("DOMContentLoaded", () => {
  const customUrlInput = document.getElementById("customUrlFormat");
  const settingsForm = document.getElementById("settingsForm");

  // Load saved custom URL format on page load
  browser.storage.sync.get("customUrlFormat").then((data) => {
    customUrlInput.value = data.customUrlFormat || "message:$$$";
  });

  // Load copy to clipboard setting on page load
  browser.storage.sync.get("copyToClipboard").then((data) => {
    const copyToClipboardCheckbox = document.getElementById("copyToClipboard");
    copyToClipboardCheckbox.checked = data.copyToClipboard || false;
  });

  // Save custom URL format on form submit
  settingsForm.addEventListener("submit", async (event) => {
    const urlFormat = customUrlInput.value.trim();
    await browser.storage.sync.set({ customUrlFormat: urlFormat });
    const copyToClipboard = document.getElementById("copyToClipboard").checked;
    await browser.storage.sync.set({ copyToClipboard: copyToClipboard });
  });
});
