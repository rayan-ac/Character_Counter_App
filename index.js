const htmlEl = document.documentElement,
  themeToggle = document.getElementById("theme-toggle"),
  textarea = document.getElementById("text-input"),
  totalCharactersSpan = document.getElementById("total-characters"),
  wordCountSpan = document.getElementById("word-count"),
  sentenceCountSpan = document.getElementById("sentence-count"),
  readingTimeSpan = document.getElementById("reading-time"),
  excludeSpaces = document.getElementById("exclude-spaces"),
  setLimit = document.getElementById("set-limit"),
  densityContent = document.getElementById("letter-density-content"),
  seeMoreBtn = document.getElementById("see-more-btn");

const WPM = 220;
let showAll = false;

themeToggle.onclick = () => {
  let t = htmlEl.getAttribute("data-theme") === "dark" ? "light" : "dark";
  htmlEl.setAttribute("data-theme", t);
  localStorage.setItem("theme", t);
};

htmlEl.setAttribute("data-theme", localStorage.getItem("theme") || "dark");

function countChars(txt, exclude) {
  return exclude ? txt.replace(/\s/g, "").length : txt.length;
}

function countWords(txt) {
  let m = txt.trim().match(/\b\w+\b/g);
  return m ? m.length : 0;
}

function countSentences(txt) {
  let m = txt.trim().match(/[^.!?]+[.!?]+/g);
  return txt.trim() ? (m ? m.length : 1) : 0;
}

function readingTime(w) {
  if (!w) return 0;
  let m = w / WPM;
  return m < 1 ? "<1" : Math.ceil(m);
}

function density(txt) {
  let c = txt.toLowerCase().replace(/[^a-z]/g, ""),
    f = {};
  for (let ch of c) f[ch] = (f[ch] || 0) + 1;
  return Object.entries(f)
    .map(([ch, count]) => ({
      char: ch.toUpperCase(),
      count,
      perc: (count / c.length) * 100,
    }))
    .sort((a, b) => b.count - a.count);
}

function renderDensity(arr) {
  if (!arr.length) {
    densityContent.innerHTML = "<p>No characters yet.</p>";
    return;
  }
  let max = arr[0].count;
  let limited = showAll ? arr : arr.slice(0, 5);

  let html = "<div>";
  limited.forEach((it) => {
    html += `
      <div class="letter-item">
        <div class="letter-char">${it.char}</div>
        <div class="letter-bar-container">
          <div class="letter-bar" style="width:${(it.count / max) * 100}%"></div>
        </div>
        <div class="letter-count">${it.count}</div>
        <div class="letter-percentage">(${it.perc.toFixed(2)}%)</div>
      </div>`;
  });
  html += "</div>";
  densityContent.innerHTML = html;
}

function update() {
  let t = textarea.value,
    c = countChars(t, excludeSpaces.checked),
    w = countWords(t),
    s = countSentences(t);

  totalCharactersSpan.textContent = c;
  wordCountSpan.textContent = w;
  sentenceCountSpan.textContent = s;
  readingTimeSpan.textContent = readingTime(w);

  if (setLimit.checked && c > 200) {
    alert("Character limit exceeded!");
  }

  renderDensity(density(t));
}

textarea.addEventListener("input", update);
excludeSpaces.addEventListener("change", update);
setLimit.addEventListener("change", update);

seeMoreBtn.addEventListener("click", () => {
  showAll = !showAll;
  seeMoreBtn.textContent = showAll ? "See Less" : "See More";
  update();
});

update();
