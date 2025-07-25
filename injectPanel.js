if (!document.getElementById('dragfill-shadow-host')) {
  const host = document.createElement('div');
  host.id = 'dragfill-shadow-host';
  document.body.appendChild(host);

  const shadow = host.attachShadow({ mode: 'open' });

  shadow.innerHTML = `
    <style>
      .dragfill-panel {
        position: fixed;
        top: 60px;
        right: 10px;
        z-index: 999999;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 10px;
        box-shadow: 0 0 10px rgba(0,0,0,0.3);
        padding: 10px;
        max-width: 260px;
        font-family: sans-serif;
      }
      .dragfill-header {
        cursor: grab;
        font-size: 16px;
        margin-bottom: 10px;
        font-weight: bold;
      }
      .dragfill-data-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
        max-height: 300px;
        overflow-y: auto;
        margin-bottom: 10px;
      }
      .dragfill-form {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }
      .dragfill-form input {
        padding: 4px;
        font-size: 14px;
        border: 1px solid #ccc;
        border-radius: 4px;
      }
      .dragfill-form button {
        padding: 5px;
        background: #4caf50;
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
      }
      .dragfill-form button:hover {
        background: #388e3c;
      }
      .dragfill-data-item {
        display: flex;
        justify-content: space-between;
        align-items: center;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 5px;
        padding: 6px;
        cursor: grab;
      }
      .dragfill-delete-btn {
        background: none;
        border: none;
        cursor: pointer;
        font-size: 14px;
      }
    </style>
    <div class="dragfill-panel">
      <div class="dragfill-header" id="dragfill-header">Drag your info</div>
      <div class="dragfill-data-list" id="dragfill-data-list"></div>
      <form class="dragfill-form" id="dragfill-form">
        <input type="text" id="dragfill-label" placeholder="Label" required />
        <input type="text" id="dragfill-value" placeholder="Value" required />
        <button type="submit">Add</button>
      </form>
    </div>
  `;

  const panel = shadow.querySelector('.dragfill-panel');

  const renderData = () => {
    const list = shadow.getElementById('dragfill-data-list');
    list.innerHTML = '';
    chrome.storage.local.get("dragData", (res) => {
      const data = res.dragData || [];

      data.forEach(({ label, value }, index) => {
        const container = document.createElement('div');
        container.className = 'dragfill-data-item';

        const item = document.createElement('div');
        item.draggable = true;
        item.dataset.value = value;
        item.textContent = `${label}: ${value}`;
        item.style.flex = '1';
        item.style.marginRight = '6px';

        item.addEventListener('dragstart', (e) => {
          e.dataTransfer.setData('text/plain', value);
        });

        const delBtn = document.createElement('button');
        delBtn.textContent = '❌';
        delBtn.className = 'dragfill-delete-btn';
        delBtn.title = "Remove";

        delBtn.addEventListener('click', () => {
          const updated = [...data.slice(0, index), ...data.slice(index + 1)];
          chrome.storage.local.set({ dragData: updated }, renderData);
        });

        container.appendChild(item);
        container.appendChild(delBtn);
        list.appendChild(container);
      });
    });
  };

  const form = shadow.getElementById('dragfill-form');
  const labelInput = shadow.getElementById('dragfill-label');
  const valueInput = shadow.getElementById('dragfill-value');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const label = labelInput.value.trim();
    const value = valueInput.value.trim();
    if (!label || !value) return;

    chrome.storage.local.get("dragData", (res) => {
      const data = res.dragData || [];
      data.push({ label, value });
      chrome.storage.local.set({ dragData: data }, () => {
        labelInput.value = '';
        valueInput.value = '';
        renderData();
      });
    });
  });

  renderData();

  // Drag panel logic
  const header = shadow.getElementById('dragfill-header');
  let isDragging = false, offsetX = 0, offsetY = 0;

  header.addEventListener('mousedown', (e) => {
    isDragging = true;
    const rect = panel.getBoundingClientRect();
    offsetX = e.clientX - rect.left;
    offsetY = e.clientY - rect.top;
    panel.style.transition = 'none';
  });

  document.addEventListener('mousemove', (e) => {
    if (isDragging) {
      panel.style.left = (e.clientX - offsetX) + 'px';
      panel.style.top = (e.clientY - offsetY) + 'px';
      panel.style.right = 'auto';
    }
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
  });
}
