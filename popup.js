function loadData() {
  chrome.storage.local.get("dragData", (res) => {
    const data = res.dragData || [];
    const container = document.getElementById("data-list");
    container.innerHTML = "";

    data.forEach(({ label, value }, index) => {
      const div = document.createElement("div");
      div.className = "data-item";
      div.draggable = true;
      div.dataset.value = value;
      div.textContent = `${label}: ${value}`;

      div.addEventListener("dragstart", (e) => {
        e.dataTransfer.setData("text/plain", value);
      });

      container.appendChild(div);
    });
  });
}

document.getElementById("add-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const label = document.getElementById("label").value.trim();
  const value = document.getElementById("value").value.trim();
  if (!label || !value) return;

  chrome.storage.local.get("dragData", (res) => {
    const data = res.dragData || [];
    data.push({ label, value });

    chrome.storage.local.set({ dragData: data }, () => {
      document.getElementById("label").value = "";
      document.getElementById("value").value = "";
      loadData();
    });
  });
});

loadData();
