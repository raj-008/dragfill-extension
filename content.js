function enableDropOnInputs() {
  const inputs = document.querySelectorAll('input, textarea');

  inputs.forEach(input => {
    input.addEventListener('dragover', e => {
      e.preventDefault();
      input.style.border = "2px dashed #4caf50";
    });

    input.addEventListener('dragleave', () => {
      input.style.border = "";
    });

    input.addEventListener('drop', (e) => {
  e.preventDefault();
  const value = e.dataTransfer.getData('text/plain');
  if (!value) return;

  // Focus the input (simulate click)
  input.focus();

  // Clear previous value if needed
  input.value = ''; 

  // Simulate typing character-by-character
  for (const char of value) {
    const eventOptions = { key: char, char, keyCode: char.charCodeAt(0), which: char.charCodeAt(0), bubbles: true };

    input.dispatchEvent(new KeyboardEvent('keydown', eventOptions));
    input.dispatchEvent(new KeyboardEvent('keypress', eventOptions));

    // Append char and dispatch input event
    input.value += char;
    input.dispatchEvent(new InputEvent('input', { bubbles: true, data: char }));

    input.dispatchEvent(new KeyboardEvent('keyup', eventOptions));
  }

  // Simulate change event (like on blur or enter key)
  input.dispatchEvent(new Event('change', { bubbles: true }));

  // Optional: update DOM attribute if needed
  input.setAttribute('value', input.value);

  input.blur();
  input.dispatchEvent(new FocusEvent('blur', { bubbles: true }));

  input.style.border = '';
});


  });
}

enableDropOnInputs();

const observer = new MutationObserver(enableDropOnInputs);
observer.observe(document.body, { childList: true, subtree: true });
