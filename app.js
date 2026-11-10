(() => {
  'use strict';
  const cfg = window.HAYDER_CONFIG;
  if (!cfg || !Array.isArray(cfg.products)) {
    document.body.insertAdjacentHTML('afterbegin', '<p style="background:#301c1c;color:white;padding:20px">Store configuration missing. Please load config.js before app.js.</p>');
    return;
  }

  const $ = (id) => document.getElementById(id);
  const currency = (n) => 'Rs. ' + Math.max(0, Number(n) || 0).toLocaleString('en-PK');
  const safe = (v) => String(v ?? '').replace(/[&<>"']/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const productsById = new Map(cfg.products.map((p) => [p.id, p]));
  const whatsapp = String(cfg.whatsapp || '').replace(/\D/g, '');
  const waLink = (message) => 'https://wa.me/' + whatsapp + '?text=' + encodeURIComponent(message);
  let cart = {};
  let lastFocused = null;
  let toastTimer;

  try {
    const stored = JSON.parse(localStorage.getItem('hayder_v2_bag') || '{}');
    if (stored && typeof stored === 'object' && !Array.isArray(stored)) {
      for (const [id, n] of Object.entries(stored)) {
        if (productsById.has(id) && Number.isInteger(n) && n > 0 && n <= 99) cart[id] = n;
      }
    }
  } catch (_) { /* Continue with an empty bag on blocked or invalid storage. */ }

  function persist() {
    try { localStorage.setItem('hayder_v2_bag', JSON.stringify(cart)); } catch (_) { /* Local storage may be disabled. */ }
    renderCart();
  }

  function toast(text) {
    const el = $('toast');
    el.textContent = text;
    el.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove('show'), 2600);
  }

  function orderMessage(items) {
    let total = 0;
    const lines = items.map(({p, quantity}) => {
      total += p.price * quantity;
      return '• ' + p.name + ' — ' + p.volume + ' — ' + currency(p.price) + ' × ' + quantity + ' = ' + currency(p.price * quantity);
    });
    return [
      'Assalamualaikum HAYDER Perfumes!',
      'I would like to place an order:',
      '',
      ...lines,
      '',
      'Items subtotal: ' + currency(total) + ' PKR',
      'Delivery offer: Free delivery (please confirm eligibility)',
      '',
      'Please confirm stock, final price, expected delivery date, and payment option. Thank you!'
    ].join('\n');
  }

  function openWhatsapp(message) {
    if (!whatsapp) { toast('WhatsApp number is not configured.'); return; }
    const url = waLink(message);
    const link = document.createElement('a');
    link.href = url; link.target = '_blank'; link.rel = 'noopener noreferrer';
    document.body.appendChild(link); link.click(); link.remove();
  }

  function countItems() { return Object.values(cart).reduce((sum, q) => sum + q, 0); }
  function subtotal() { return Object.entries(cart).reduce((sum, [id, q]) => sum + (productsById.get(id)?.price || 0) * q, 0); }

  function ratingHTML() {
    if (cfg.showVerifiedRatings) {
      return `<div class="product-rating" aria-label="${safe(cfg.rating)} out of 5 stars from ${safe(cfg.reviewCount)} reviews"><span class="stars">★★★★★</span><span>${safe(cfg.rating)} · ${safe(cfg.reviewCount)}+ Reviews</span></div>`;
    }
    return `<div class="product-rating"><span class="stars" aria-hidden="true">★★★★★</span><span>${safe(cfg.rating)} · ${safe(cfg.reviewCount)}+ Reviews</span><span class="rating-demo">DEMO</span></div>`;
  }

  function renderProducts(filter = '') {
    const needle = filter.trim().toLocaleLowerCase();
    const matches = cfg.products.filter((p) => (p.name + ' ' + p.tagline + ' ' + p.description + ' ' + p.category).toLocaleLowerCase().includes(needle));
    $('empty-results').hidden = matches.length > 0;
    $('product-grid').innerHTML = matches.map((p) => {
      const off = p.oldPrice > p.price ? Math.round((p.oldPrice - p.price) / p.oldPrice * 100) : 0;
      return `
        <article class="product-card" aria-label="${safe(p.name)} 50 ML Eau de Parfum">
          <div class="product-photo">
            ${p.bestseller ? '<span class="bestseller-flag">BEST SELLER</span>' : ''}
            <img src="${safe(p.image)}" loading="lazy" width="377" height="600" alt="${safe(p.name)} perfume bottle and matching cylindrical HAYDER gift box">
          </div>
          <div class="product-content">
            <div class="product-category">${safe(p.category)} / EAU DE PARFUM / ${safe(p.volume)}</div>
            <h3>${safe(p.name)}</h3>
            <p class="product-tagline">${safe(p.tagline)}</p>
            <p class="product-desc">${safe(p.description)}</p>
            ${ratingHTML()}
            <div class="product-pricing">
              <strong class="current-price">${currency(p.price)}</strong>
              ${off ? `<span class="old-price">${currency(p.oldPrice)}</span><span class="discount">${off}% OFF</span>` : ''}
            </div>
            <div class="product-actions">
              <button type="button" class="btn btn-outline" data-add="${safe(p.id)}">ADD TO BAG +</button>
              <button type="button" class="btn btn-gold" data-buy="${safe(p.id)}">BUY NOW <svg class="icon" aria-hidden="true"><use href="#icon-arrow"/></svg></button>
            </div>
          </div>
        </article>`;
    }).join('');
  }

  function renderCart() {
    const quantity = countItems();
    $('bag-count').textContent = quantity;
    $('header-bag-total').textContent = currency(subtotal());
    $('cart-item-count').textContent = '(' + quantity + ')';
    $('cart-total').textContent = currency(subtotal());
    $('cart-checkout').disabled = quantity === 0;
    $('cart-checkout').style.opacity = quantity === 0 ? '.5' : '1';
    const rows = Object.entries(cart);
    $('cart-items').innerHTML = rows.length ? rows.map(([id, q]) => {
      const p = productsById.get(id);
      if (!p) return '';
      return `<article class="cart-item">
        <img src="${safe(p.image)}" alt="${safe(p.name)}" width="84" height="113">
        <div class="cart-item-main"><h3>${safe(p.name)}</h3><p>${safe(p.volume)} EAU DE PARFUM</p><strong>${currency(p.price * q)}</strong>
          <div class="cart-item-ctrl"><button class="qty-btn" data-quantity="-1" data-item="${safe(id)}" aria-label="Decrease ${safe(p.name)} quantity"><svg class="icon"><use href="#icon-minus"/></svg></button>
          <span class="qty-num">${q}</span><button class="qty-btn" data-quantity="1" data-item="${safe(id)}" aria-label="Increase ${safe(p.name)} quantity"><svg class="icon"><use href="#icon-plus"/></svg></button>
          <button class="remove-btn" type="button" data-remove="${safe(id)}">REMOVE</button></div>
        </div>
      </article>`;
    }).join('') : '<div class="cart-empty">Your shopping bag is empty.<br>Find a fragrance that feels like you.</div>';
  }

  function addToCart(id) {
    const p = productsById.get(id);
    if (!p) return;
    cart[id] = Math.min(99, (cart[id] || 0) + 1);
    persist();
    toast(p.name + ' added to your bag');
    openCart();
  }

  function buyNow(id) {
    const p = productsById.get(id);
    if (!p) return;
    openWhatsapp(orderMessage([{p, quantity:1}]));
  }

  function openCart() {
    lastFocused = document.activeElement;
    $('cart-overlay').hidden = false;
    requestAnimationFrame(() => $('cart-overlay').classList.add('active'));
    $('cart-drawer').classList.add('active');
    $('cart-drawer').setAttribute('aria-hidden','false');
    document.body.classList.add('cart-lock');
    $('close-cart').focus();
  }

  function closeCart() {
    $('cart-overlay').classList.remove('active');
    $('cart-drawer').classList.remove('active');
    $('cart-drawer').setAttribute('aria-hidden','true');
    document.body.classList.remove('cart-lock');
    setTimeout(() => { if (!$('cart-drawer').classList.contains('active')) $('cart-overlay').hidden = true; }, 255);
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
  }

  function setSearch(open) {
    $('search-panel').hidden = !open;
    $('search-toggle').setAttribute('aria-expanded', String(open));
    if (open) $('site-search').focus();
    else { $('site-search').value = ''; renderProducts(); $('search-toggle').focus(); }
  }

  function setMobileMenu(open) {
    $('mobile-menu').hidden = !open;
    $('menu-toggle').setAttribute('aria-expanded', String(open));
    $('menu-toggle').setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  }

  function initLinks() {
    const message = 'Assalamualaikum HAYDER Perfumes! I would like information about your 50 ML Eau de Parfum collection.';
    for (const id of ['header-whatsapp','contact-whatsapp','footer-whatsapp','floating-whatsapp']) $(id).href = waLink(message);
    const international = whatsapp.startsWith('92') && whatsapp.length === 12 ? '+' + whatsapp.slice(0,2) + ' ' + whatsapp.slice(2,5) + ' ' + whatsapp.slice(5) : '+' + whatsapp;
    $('footer-phone').textContent = international;
    for (const [id, url, text] of [['footer-instagram',cfg.instagram,'Instagram'],['footer-tiktok',cfg.tiktok,'TikTok']]) {
      if (/^https:\/\//i.test(url || '')) {
        const a = document.createElement('a'); a.href=url; a.target='_blank'; a.rel='noopener noreferrer'; a.textContent=text;
        $(id).replaceWith(a);
      }
    }
  }

  function renderReviews() {
    if (cfg.reviewsAreVerified) $('review-disclosure').hidden = true;
    $('reviews-grid').innerHTML = cfg.reviews.map((r) => {
      const avatar = r.photo && /^(assets\/|https:\/\/)/.test(r.photo)
        ? `<img src="${safe(r.photo)}" alt="${safe(r.name)} customer-approved portrait" loading="lazy">`
        : '<svg aria-hidden="true" viewBox="0 0 24 24"><use href="#icon-person"/></svg>';
      return `<article class="review-card">
        <span class="review-mark" aria-hidden="true">“</span><div class="review-stars" aria-label="five star layout">★★★★★</div>
        <blockquote>${safe(r.text)}</blockquote>
        <div class="review-author"><span class="review-avatar">${avatar}</span>
          <span><strong>${safe(r.name)}</strong><small>${safe(r.city)}</small></span>
          ${!cfg.reviewsAreVerified ? '<span class="review-label">SAMPLE</span>' : ''}
        </div>
      </article>`;
    }).join('');
  }

  function bindEvents() {
    $('product-grid').addEventListener('click', (e) => {
      const add = e.target.closest('[data-add]');
      const buy = e.target.closest('[data-buy]');
      if (add) addToCart(add.dataset.add);
      if (buy) buyNow(buy.dataset.buy);
    });
    $('open-cart').addEventListener('click', openCart);
    $('close-cart').addEventListener('click', closeCart);
    $('cart-overlay').addEventListener('click', closeCart);
    $('cart-items').addEventListener('click', (e) => {
      const quantity = e.target.closest('[data-quantity]');
      const remove = e.target.closest('[data-remove]');
      if (quantity) {
        const id = quantity.dataset.item;
        const next = (cart[id] || 0) + Number(quantity.dataset.quantity);
        if (next <= 0) delete cart[id]; else cart[id] = Math.min(next,99);
        persist();
      } else if (remove) { delete cart[remove.dataset.remove]; persist(); }
    });
    $('cart-checkout').addEventListener('click', () => {
      const items = Object.entries(cart).map(([id,quantity]) => ({p:productsById.get(id),quantity})).filter(({p}) => p);
      if (!items.length) { toast('Please add a fragrance to your bag.'); return; }
      openWhatsapp(orderMessage(items));
    });
    $('best-buy-now').addEventListener('click', () => buyNow('bad-habit'));
    $('search-toggle').addEventListener('click', () => setSearch($('search-panel').hidden));
    $('search-close').addEventListener('click', () => setSearch(false));
    $('site-search').addEventListener('input', (e) => { renderProducts(e.target.value); if (e.target.value) $('shop').scrollIntoView({behavior:'smooth',block:'start'}); });
    $('menu-toggle').addEventListener('click', () => setMobileMenu($('mobile-menu').hidden));
    $('mobile-menu').addEventListener('click', (e) => { if (e.target.closest('a')) setMobileMenu(false); });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        if ($('cart-drawer').classList.contains('active')) closeCart();
        else if (!$('search-panel').hidden) setSearch(false);
        else if (!$('mobile-menu').hidden) setMobileMenu(false);
      }
      // Keep keyboard focus inside modal until it closes.
      if (e.key === 'Tab' && $('cart-drawer').classList.contains('active')) {
        const controls = [...$('cart-drawer').querySelectorAll('button:not([disabled]),a[href]')];
        const first = controls[0], last = controls[controls.length-1];
        if (e.shiftKey && document.activeElement === first) {e.preventDefault();last.focus();}
        else if (!e.shiftKey && document.activeElement === last) {e.preventDefault();first.focus();}
      }
    });
  }

  function init() {
    $('footer-year').textContent = new Date().getFullYear();
    initLinks();
    renderProducts();
    renderReviews();
    renderCart();
    const badHabit = productsById.get('bad-habit');
    if (badHabit) {
      $('bestseller-price').innerHTML = currency(badHabit.price) + (badHabit.oldPrice > badHabit.price ? `<small>${currency(badHabit.oldPrice)}</small>` : '');
    }
    bindEvents();
  }
  init();
})();
