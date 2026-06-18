const track = document.getElementById('track');
const line = document.getElementById('line');
const thumb = document.getElementById('thumb');
const cards = document.querySelectorAll('.card');

const cardW = 410;
const gap = 24;
const visible = 3;
const total = cards.length;
const maxScroll = (total - visible) * (cardW + gap);
const lineW = 370;
const thumbW = 40;
const maxThumb = lineW - thumbW;

let scroll = 0;
let dragging = false;
let startX = 0;
let startScroll = 0;

function render() {
    track.style.transform = `translateX(-${scroll}px)`;
    thumb.style.left = `${(scroll / maxScroll) * maxThumb}px`;
    updateVisibleCards();
}

function updateVisibleCards() {
    const startIdx = Math.floor(scroll / (cardW + gap));
    const endIdx = startIdx + visible;

    cards.forEach((card, i) => {
        if (i >= startIdx && i < endIdx) {
            if (!card.classList.contains('show')) {
                setTimeout(() => {
                    card.classList.add('show');
                }, (i - startIdx) * 100);
            }
        } else {
            card.classList.remove('show');
        }
    });
}

function showInitialCards() {
    cards.forEach((card, i) => {
        if (i < visible) {
            setTimeout(() => {
                card.classList.add('show');
            }, i * 100);
        }
    });
}

function moveFromMouse(e) {
    const rect = line.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const ratio = Math.max(0, Math.min(x / lineW, 1));
    scroll = Math.max(0, Math.min(ratio * maxScroll, maxScroll));
    render();
}

line.addEventListener('mousedown', (e) => {
    dragging = true;
    moveFromMouse(e);
});

document.addEventListener('mousemove', (e) => {
    if (!dragging) return;
    moveFromMouse(e);
});

document.addEventListener('mouseup', () => {
    dragging = false;
});

track.addEventListener('mousedown', (e) => {
    dragging = true;
    startX = e.clientX;
    startScroll = scroll;
    track.style.transition = 'none';
    thumb.style.transition = 'none';
});

document.addEventListener('mousemove', (e) => {
    if (!dragging || e.target.closest('.line')) return;
    scroll = Math.max(0, Math.min(startScroll + (startX - e.clientX), maxScroll));
    track.style.transform = `translateX(-${scroll}px)`;
    thumb.style.left = `${(scroll / maxScroll) * maxThumb}px`;
    updateVisibleCards();
});

document.addEventListener('mouseup', () => {
    if (!dragging) return;
    dragging = false;
    track.style.transition = 'transform 0.5s ease';
    thumb.style.transition = 'left 0.3s ease';
    const step = cardW + gap;
    scroll = Math.round(scroll / step) * step;
    scroll = Math.max(0, Math.min(scroll, maxScroll));
    render();
});

showInitialCards();