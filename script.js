async function loadVideos() {
  const res = await fetch('data/videos.json?ts=' + Date.now(), { cache: 'no-store' });
  if (!res.ok) throw new Error('No s\'ha pogut carregar la llista de vídeos');
  return res.json();
}

function getYouTubeId(url) {
  try {
    const u = new URL(url);
    if (u.hostname === 'youtu.be') return u.pathname.slice(1);
    if (u.searchParams.has('v')) return u.searchParams.get('v');
    const m = u.pathname.match(/\/shorts\/([\w-]{6,})|\/embed\/([\w-]{6,})/);
    if (m) return m[1] || m[2];
  } catch {}
  return null;
}

function thumbFrom(url) {
  const id = getYouTubeId(url);
  return id ? `https://img.youtube.com/vi/${id}/hqdefault.jpg` : '';
}

function pickRandom(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

async function showRandomVideo() {
  try {
    const data = await loadVideos();
    const item = pickRandom(data);

    const link = document.getElementById('videoLink');
    const img = document.getElementById('thumb');
    const title = document.getElementById('title');
    const channel = document.getElementById('channel');
    const open = document.getElementById('open');

    link.href = item.url;
    link.textContent = item.url;

    img.src = item.image || thumbFrom(item.url);
    img.alt = `Miniatura: ${item.title}`;

    title.textContent = item.title;
    channel.textContent = item.channel;
    open.href = item.url;
  } catch (err) {
    const title = document.getElementById('title');
    const channel = document.getElementById('channel');
    const link = document.getElementById('videoLink');
    if (title) title.textContent = 'No s\'ha pogut carregar la llista de vídeos 😿';
    if (channel) channel.textContent = 'Comprova que existeix data/videos.json a main/root i que GitHub Pages està actiu.';
    if (link) { link.textContent = 'Torna a l\'inici'; link.href = 'index.html'; }
    console.error(err);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const again = document.getElementById('again');
  if (again) again.addEventListener('click', showRandomVideo);
  showRandomVideo();
});
