import getItem from "./storage";

function applyStyles(style) {
  const customStyles = style !== undefined ? style : getItem("customCss", "");
  let styleElement = document.getElementById("dynamic-style");
  if (!styleElement) {
    styleElement = document.createElement("style");
    styleElement.id = "dynamic-style";
    document.head.appendChild(styleElement);
  }
  styleElement.textContent = customStyles;
}

function changeChatPosition(position) {
  localStorage.setItem("chatPosition", position);
  const root = document.documentElement;

  if (position == "left") {
    root.style.setProperty("--chatLeft", "24px");
    root.style.setProperty("--chatRight", "auto");
  } else {
    root.style.setProperty("--chatLeft", "auto");
    root.style.setProperty("--chatRight", "24px");
  }
}

export { applyStyles, changeChatPosition };
