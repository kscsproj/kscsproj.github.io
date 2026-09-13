import { SITES } from "./sites.js";

// タイトル文字列から決定論的な擬似乱数を作る(事業者色のハッシュ関数と同じ考え方)
function seededRandom(seed) {
  let state = 0;
  for (let i = 0; i < seed.length; i++) state = (state * 31 + seed.charCodeAt(i)) | 0;
  return () => {
    state = (state * 1103515245 + 12345) | 0;
    return ((state >>> 0) % 1000) / 1000;
  };
}

// 実際の地図が用意できるまでの間、道路網っぽい抽象サムネイルをその場で生成する
function buildThumbnailSVG(site) {
  const rand = seededRandom(site.title);
  const colors = site.thumbnailColors ?? ["#2f6fed"];
  let paths = "";
  for (let i = 0; i < 10; i++) {
    const color = colors[i % colors.length];
    const y = 10 + rand() * 120;
    const wobble = 15 + rand() * 25;
    const width = rand() > 0.7 ? 3 : 1.5;
    paths += `<path d="M0 ${y.toFixed(1)} Q 50 ${(y - wobble).toFixed(1)}, 100 ${y.toFixed(1)} T 200 ${y.toFixed(1)}" stroke="${color}" stroke-width="${width}" fill="none" opacity="0.8"/>`;
  }
  return `<svg viewBox="0 0 200 140" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <rect width="200" height="140" fill="#eef1ea"/>
    ${paths}
  </svg>`;
}

function buildThumbnail(site) {
  if (site.thumbnail) {
    return `<img src="${site.thumbnail}" alt="${site.title}のサムネイル" loading="lazy">`;
  }
  return buildThumbnailSVG(site);
}

function renderGallery() {
  const gallery = document.getElementById("gallery");
  gallery.innerHTML = "";

  for (const site of SITES) {
    const card = document.createElement("a");
    card.className = "card";
    card.href = site.href;
    card.innerHTML = `
      <div class="card-thumb">${buildThumbnail(site)}</div>
      <div class="card-body">
        <div class="card-category">${site.category}</div>
        <div class="card-title">${site.title}</div>
      </div>`;
    gallery.appendChild(card);
  }
}

function setupAboutDialog() {
  const dialog = document.getElementById("about-dialog");
  const openBtn = document.getElementById("about-toggle");
  const closeBtn = document.getElementById("about-close");

  openBtn.addEventListener("click", () => (dialog.hidden = false));
  closeBtn.addEventListener("click", () => (dialog.hidden = true));
  dialog.addEventListener("click", (e) => {
    if (e.target === dialog) dialog.hidden = true;
  });
}

renderGallery();
setupAboutDialog();
