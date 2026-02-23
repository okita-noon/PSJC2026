// ===========================
// PSJC2026 - Main Script
// ===========================

// ナビゲーション: ハンバーガーメニュー
const navToggle = document.querySelector('.nav-toggle');
const navLinks = document.querySelector('.nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('open');
    const isOpen = navLinks.classList.contains('open');
    navToggle.setAttribute('aria-label', isOpen ? 'メニューを閉じる' : 'メニューを開く');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => navLinks.classList.remove('open'));
  });
}

// スクロール時にナビにクラスを付与
const siteHeader = document.querySelector('.site-header');
window.addEventListener('scroll', () => {
  siteHeader?.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// スクロールアニメーション (Intersection Observer)
const style = document.createElement('style');
style.textContent = `.visible { opacity: 1 !important; transform: none !important; }`;
document.head.appendChild(style);

function observeAnims() {
  const targets = document.querySelectorAll(
    '.about-card, .timeline-item, .rule-block, .judge-card, .link-card, .entry-info, .entry-deadline, .vg-card'
  );
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  targets.forEach((el, i) => {
    if (!el.classList.contains('visible')) {
      el.style.opacity = '0';
      el.style.transform = 'translateY(20px)';
      el.style.transition = `opacity 0.5s ease ${i * 0.03}s, transform 0.5s ease ${i * 0.03}s`;
      obs.observe(el);
    }
  });
}
observeAnims();


// ===========================
// スケジュール: アコーディオン
// (JST の現在日付でアクティブフェーズを自動展開)
// ===========================
(function initScheduleAccordion() {
  // JST の今日の日付 (YYYY-MM-DD)
  const nowJST = new Date(
    new Date().toLocaleString('en-US', { timeZone: 'Asia/Tokyo' })
  );
  const todayStr = nowJST.toISOString().slice(0, 10);

  const panels = document.querySelectorAll('.sc-panel');

  panels.forEach(panel => {
    const header = panel.querySelector('.sc-header');
    const body   = panel.querySelector('.sc-body');
    const badge  = panel.querySelector('.sc-phase-badge');
    const start  = panel.dataset.start;
    const end    = panel.dataset.end;

    // 現在進行中かどうか判定
    const isActive = todayStr >= start && todayStr <= end;
    if (isActive) {
      badge.textContent = '進行中';
      badge.classList.add('active');
      panel.classList.add('is-active');
      header.setAttribute('aria-expanded', 'true');
      body.style.maxHeight = body.scrollHeight + 'px';
    } else if (todayStr > end) {
      badge.textContent = '終了';
      badge.classList.add('done');
    } else {
      badge.textContent = '予定';
    }

    // クリックでアコーディオン開閉
    header.addEventListener('click', () => {
      const expanded = header.getAttribute('aria-expanded') === 'true';
      header.setAttribute('aria-expanded', String(!expanded));
      body.style.maxHeight = expanded ? '0' : body.scrollHeight + 'px';
    });
  });
})();


// ===========================
// 動画ギャラリー
// ===========================
(function initVideoGallery() {
  const grid        = document.getElementById('videoGrid');
  const emptyMsg    = document.getElementById('videoEmpty');
  const roundTabs   = document.getElementById('roundTabs');
  const teamFilters = document.getElementById('teamFilters');

  if (!grid || typeof VIDEOS === 'undefined') return;

  let activeRound = 'all';
  let activeTeam  = 'all';

  // チーム一覧を抽出（重複なし、順序保持）
  const teams = [...new Set(VIDEOS.map(v => v.team))];

  // チームフィルターボタンを生成
  const allBtn = document.createElement('button');
  allBtn.className = 'vg-team-btn active';
  allBtn.dataset.team = 'all';
  allBtn.textContent = '全チーム';
  teamFilters.appendChild(allBtn);

  teams.forEach(team => {
    const btn = document.createElement('button');
    btn.className = 'vg-team-btn';
    btn.dataset.team = team;
    btn.textContent = team;
    teamFilters.appendChild(btn);
  });

  // フィルタリングして動画カードを描画
  function render() {
    grid.innerHTML = '';

    const filtered = VIDEOS.filter(v => {
      const matchRound = activeRound === 'all' || v.round === activeRound;
      const matchTeam  = activeTeam  === 'all' || v.team  === activeTeam;
      return matchRound && matchTeam;
    });

    if (filtered.length === 0) {
      emptyMsg.style.display = 'block';
      return;
    }
    emptyMsg.style.display = 'none';

    filtered.forEach(v => {
      const card = document.createElement('div');
      card.className = 'vg-card';

      if (v.videoId) {
        // サムネイル + クリックで再生
        card.innerHTML = `
          <div class="vg-thumb" data-vid="${v.videoId}">
            <img src="https://img.youtube.com/vi/${v.videoId}/mqdefault.jpg"
                 alt="${v.player} - ${v.round} 動画${v.num}"
                 loading="lazy">
            <div class="vg-play-overlay"><span class="vg-play-icon">▶</span></div>
          </div>
          <div class="vg-info">
            <span class="vg-round-badge vg-round-${v.round.replace(/\s/g,'')}">${v.round}</span>
            <p class="vg-player">${v.player}</p>
            <p class="vg-team">${v.team}</p>
            <p class="vg-num">動画 ${v.num}</p>
          </div>
        `;

        // クリックでiframe（自動再生）に差し替え
        card.querySelector('.vg-thumb').addEventListener('click', function () {
          this.innerHTML = `
            <iframe
              src="https://www.youtube.com/embed/${v.videoId}?autoplay=1&rel=0"
              title="${v.player} - PSJC2026 ${v.round} 動画${v.num}"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowfullscreen>
            </iframe>
          `;
        });
      } else {
        // 未公開プレースホルダー
        card.innerHTML = `
          <div class="vg-thumb vg-thumb-pending">
            <div class="vg-pending-inner">
              <span class="vg-pending-icon">▶</span>
              <span class="vg-pending-label">公開準備中</span>
            </div>
          </div>
          <div class="vg-info">
            <span class="vg-round-badge vg-round-${v.round.replace(/\s/g,'')}">${v.round}</span>
            <p class="vg-player">${v.player}</p>
            <p class="vg-team">${v.team}</p>
            <p class="vg-num">動画 ${v.num}</p>
          </div>
        `;
      }

      grid.appendChild(card);
    });

    // 新しく追加したカードにアニメ適用
    observeAnims();
  }

  // ラウンドタブ
  roundTabs?.addEventListener('click', e => {
    const tab = e.target.closest('.vg-tab');
    if (!tab) return;
    roundTabs.querySelectorAll('.vg-tab').forEach(t => t.classList.remove('active'));
    tab.classList.add('active');
    activeRound = tab.dataset.round;
    render();
  });

  // チームフィルター
  teamFilters.addEventListener('click', e => {
    const btn = e.target.closest('.vg-team-btn');
    if (!btn) return;
    teamFilters.querySelectorAll('.vg-team-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    activeTeam = btn.dataset.team;
    render();
  });

  render();
})();
