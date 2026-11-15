Warning: fs was declared with const; use let for reassignable variables.
(() => {
  const button = document.querySelector("[data-theme-toggle]");
  if (!button) return;
  const body = document.body;
  const preferenceKey = "aethersoft-studio-theme-" + (body.dataset.themeKey || body.dataset.themeMode || "custom");

  const applyTheme = (theme, persist = true) => {
    const light = theme === "light";
    body.dataset.appTheme = light ? "light" : "dark";
    const mode = body.dataset.themeMode || "custom";
    if (mode === "chat") {
      const lightSheet = document.querySelector("[data-theme-chat-light]");
      if (lightSheet) lightSheet.disabled = !light;
    } else if (mode === "sheets") {
      document.querySelectorAll("[data-theme-dark]").forEach((sheet) => { sheet.disabled = light; });
    } else if (mode === "base") {
      document.querySelectorAll("[data-theme-light]").forEach((sheet) => { sheet.disabled = !light; });
    }
    button.innerHTML = light ? "☾ <span>Dark</span>" : "☼ <span>Light</span>";
    button.setAttribute("aria-label", `Switch to ${light ? "dark" : "light"} theme`);
    button.setAttribute("aria-pressed", String(light));
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) themeMeta.setAttribute("content", light ? "#f5f7fb" : "#090d14");
    if (persist) {
      try { localStorage.setItem(preferenceKey, light ? "light" : "dark"); } catch { /* Theme choice is optional. */ }
    }
  };

  button.addEventListener("click", () => {
    applyTheme(body.dataset.appTheme === "light" ? "dark" : "light");
  });

  let initial = body.dataset.appTheme === "light" ? "light" : "dark";
  try { initial = localStorage.getItem(preferenceKey) || initial; } catch { /* Use the page default. */ }
  applyTheme(initial, false);
})();