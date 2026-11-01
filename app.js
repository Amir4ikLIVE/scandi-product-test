/* Тест страницы товара Scandi home «как у IKEA» (Амир, 31.10.2026): показать Шерзоду ака, как будут выглядеть
   фото. Страница набора и страница каждого предмета. Корзины нет, данные — здесь же, в ITEMS.
   Цены — из таблицы фото от октября; у салатника и чаши цены в таблице нет, поэтому «Цена уточняется». */
(function () {
  'use strict';

  var SERIES = 'Серый градиент';
  var STUDIO = [
    { src: 'studio-2', alt: 'Набор на деревянной столешнице, с круассаном на тарелке' },
    { src: 'studio-1', alt: 'Тарелки, салатник и чаша на деревянном подносе' }
  ];
  var PACK = { src: 'pack', alt: 'Весь набор на белом фоне' };

  var ITEMS = {
    plate26: {
      name: 'Тарелка обеденная', group: 'Тарелки', sku: 'GPL09-0000344', size: 'Ø 26 см', price: 55000,
      photos: [
        { src: 'plate26-white', alt: 'Тарелка обеденная на белом фоне' },
        { src: 'plate26-size', alt: 'Тарелка обеденная, диаметр 26 см' },
        { src: 'plate26-close', alt: 'Глазурь тарелки крупным планом' }
      ].concat(STUDIO, PACK)
    },
    plate20: {
      name: 'Тарелка салатная', group: 'Тарелки', sku: 'GPM09-0002418', size: 'Ø 20 см', price: 45000,
      photos: [
        { src: 'plate20-white', alt: 'Тарелка салатная на белом фоне' },
        { src: 'plate20-size', alt: 'Тарелка салатная, диаметр 20 см' },
        { src: 'plate20-close', alt: 'Глазурь тарелки крупным планом' }
      ].concat(STUDIO, PACK)
    },
    salad: {
      name: 'Салатник', group: 'Салатники и чаши', sku: 'GW09-0001259', size: 'Ø 24 см', price: null,
      photos: [
        { src: 'salad-white', alt: 'Салатник на белом фоне' },
        { src: 'salad-size', alt: 'Салатник, диаметр 24 см' },
        { src: 'salad-close', alt: 'Салатник крупным планом' }
      ].concat(STUDIO, PACK)
    },
    bowl: {
      name: 'Чаша', group: 'Салатники и чаши', sku: 'GW09-0000360', size: null, price: null,
      photos: [
        { src: 'bowl-white', alt: 'Чаша на белом фоне' },
        { src: 'bowl-close', alt: 'Чаша крупным планом' }
      ].concat(STUDIO, PACK)
    },
    jug: {
      name: 'Графин', group: 'Графины', sku: 'GZ09-0004944', size: '2000 мл', price: 145000,
      photos: [
        { src: 'jug-white', alt: 'Графин на белом фоне' },
        { src: 'jug-size', alt: 'Графин, объём 2000 мл' },
        { src: 'jug-top', alt: 'Графин сверху' },
        STUDIO[0],
        PACK
      ]
    }
  };
  var ORDER = ['plate26', 'plate20', 'salad', 'bowl', 'jug'];
  // Крупные планы края — только на страницах предметов (Амир, 31.10.2026).
  var PACK_PHOTOS = [PACK, STUDIO[0], STUDIO[1]];

  var app = document.getElementById('app');
  var stopKeys = null;

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text !== undefined && text !== null) n.textContent = text;
    return n;
  }
  function add(parent) {
    for (var i = 1; i < arguments.length; i += 1) if (arguments[i]) parent.appendChild(arguments[i]);
    return parent;
  }
  function img(name, alt, small, eager) {
    var n = el('img');
    n.src = 'img/' + (small ? 't/' : '') + name + '.jpg';
    n.alt = alt || '';
    n.decoding = 'async';
    if (!eager) n.loading = 'lazy';
    return n;
  }
  function money(sum) {
    return String(sum).replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' сум';
  }
  function priceText(item) {
    return item.price ? money(item.price) : 'Цена уточняется';
  }
  var toastTimer = null;
  function toast(text) {
    var t = document.getElementById('toast');
    t.textContent = text;
    t.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, 2600);
  }

  /* ---------- галерея: миниатюры слева, большое фото листается, по нажатию — на весь экран ---------- */
  function gallery(photos) {
    var box = el('div', 'gallery');
    var thumbs = el('div', 'gallery__thumbs');
    var stage = el('div', 'gallery__stage');
    var track = el('div', 'gallery__track');
    track.tabIndex = 0;
    track.setAttribute('aria-label', 'Фото товара');
    var count = el('span', 'gallery__count');
    var current = 0;
    var buttons = [];

    function show(i, smooth) {
      current = Math.max(0, Math.min(photos.length - 1, i));
      track.scrollTo({ left: current * track.clientWidth, behavior: smooth ? 'smooth' : 'auto' });
      mark();
    }
    function mark() {
      buttons.forEach(function (b, k) {
        b.classList.toggle('is-on', k === current);
        if (k === current) b.setAttribute('aria-current', 'true'); else b.removeAttribute('aria-current');
      });
      count.textContent = (current + 1) + ' / ' + photos.length;
      prev.disabled = current === 0;
      next.disabled = current === photos.length - 1;
    }

    photos.forEach(function (p, i) {
      var b = add(el('button', 'gallery__thumb'), img(p.src, '', true, true));
      b.type = 'button';
      b.setAttribute('aria-label', 'Фото ' + (i + 1) + ': ' + p.alt);
      b.addEventListener('click', function () { show(i, true); });
      buttons.push(b);
      thumbs.appendChild(b);

      var slide = add(el('button', 'gallery__slide'), img(p.src, p.alt, false, i === 0));
      slide.type = 'button';
      slide.setAttribute('aria-label', 'Открыть на весь экран: ' + p.alt);
      slide.addEventListener('click', function () { lightbox(photos, i); });
      track.appendChild(slide);
    });

    var prev = el('button', 'gallery__nav gallery__nav--prev', '‹');
    var next = el('button', 'gallery__nav gallery__nav--next', '›');
    prev.type = next.type = 'button';
    prev.setAttribute('aria-label', 'Предыдущее фото');
    next.setAttribute('aria-label', 'Следующее фото');
    prev.addEventListener('click', function () { show(current - 1, true); });
    next.addEventListener('click', function () { show(current + 1, true); });

    var settle = null;
    track.addEventListener('scroll', function () {
      clearTimeout(settle);
      settle = setTimeout(function () {
        var i = Math.round(track.scrollLeft / Math.max(1, track.clientWidth));
        if (i !== current) { current = i; mark(); }
      }, 70);
    }, { passive: true });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') show(current - 1, true);
      if (e.key === 'ArrowRight') show(current + 1, true);
    });
    window.addEventListener('resize', function () { show(current, false); });

    add(stage, track, prev, next, count);
    mark();
    return add(box, thumbs, stage);
  }

  function lightbox(photos, start) {
    var i = start;
    var last = document.activeElement;
    var box = el('div', 'lightbox');
    box.setAttribute('role', 'dialog');
    box.setAttribute('aria-modal', 'true');
    box.setAttribute('aria-label', 'Фото на весь экран');
    var view = el('div', 'lightbox__view');
    var picture = el('img', 'lightbox__img');
    var note = el('span', 'lightbox__count');
    var close = el('button', 'lightbox__close', '×');
    var prev = el('button', 'lightbox__nav lightbox__nav--prev', '‹');
    var next = el('button', 'lightbox__nav lightbox__nav--next', '›');
    close.type = prev.type = next.type = 'button';
    close.setAttribute('aria-label', 'Закрыть');
    prev.setAttribute('aria-label', 'Предыдущее фото');
    next.setAttribute('aria-label', 'Следующее фото');

    function draw() {
      view.classList.remove('is-zoom');
      view.scrollTo(0, 0);
      picture.src = 'img/' + photos[i].src + '.jpg';
      picture.alt = photos[i].alt;
      note.textContent = (i + 1) + ' / ' + photos.length;
      prev.disabled = i === 0;
      next.disabled = i === photos.length - 1;
    }
    function done() {
      box.remove();
      document.documentElement.classList.remove('no-scroll');
      document.removeEventListener('keydown', keys);
      if (last && last.focus) last.focus();
    }
    function keys(e) {
      if (e.key === 'Escape') done();
      if (e.key === 'ArrowLeft' && i > 0) { i -= 1; draw(); }
      if (e.key === 'ArrowRight' && i < photos.length - 1) { i += 1; draw(); }
    }
    close.addEventListener('click', done);
    prev.addEventListener('click', function () { i -= 1; draw(); });
    next.addEventListener('click', function () { i += 1; draw(); });
    // Нажатие по фото — увеличить вдвое и двигать; по пустому месту — закрыть.
    picture.addEventListener('click', function () { view.classList.toggle('is-zoom'); });
    view.addEventListener('click', function (e) { if (e.target === view) done(); });
    document.addEventListener('keydown', keys);

    add(view, picture);
    add(box, view, close, prev, next, note);
    document.body.appendChild(box);
    document.documentElement.classList.add('no-scroll');
    draw();
    close.focus();
  }

  /* ---------- боковая панель «Дополните», как на IKEA ---------- */
  function drawer(exceptId) {
    var last = document.activeElement;
    var scrim = el('div', 'drawer');
    var panel = el('div', 'drawer__panel');
    panel.setAttribute('role', 'dialog');
    panel.setAttribute('aria-modal', 'true');
    panel.setAttribute('aria-label', 'Дополните набор');
    var close = el('button', 'drawer__close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Закрыть');
    add(panel, add(el('div', 'drawer__head'), el('h2', 'drawer__title', 'Дополните набор'), close));

    var groups = [];
    ORDER.forEach(function (id) { if (groups.indexOf(ITEMS[id].group) < 0) groups.push(ITEMS[id].group); });
    groups.forEach(function (group) {
      var ids = ORDER.filter(function (id) { return ITEMS[id].group === group && id !== exceptId; });
      if (!ids.length) return;
      panel.appendChild(el('h3', 'drawer__group', group));
      var list = el('div', 'drawer__list');
      ids.forEach(function (id) { list.appendChild(itemRow(id, done)); });
      panel.appendChild(list);
    });

    function done() {
      scrim.remove();
      document.documentElement.classList.remove('no-scroll');
      document.removeEventListener('keydown', keys);
      if (last && last.focus) last.focus();
    }
    function keys(e) { if (e.key === 'Escape') done(); }
    close.addEventListener('click', done);
    scrim.addEventListener('click', function (e) { if (e.target === scrim) done(); });
    document.addEventListener('keydown', keys);
    add(scrim, panel);
    document.body.appendChild(scrim);
    document.documentElement.classList.add('no-scroll');
    close.focus();
  }

  function addToCart(name) {
    toast('Это тестовая страница: корзины здесь нет. «' + name + '»');
  }

  // Строка предмета: миниатюра, название, размер, цена и круглая кнопка «в корзину».
  function itemRow(id, onOpen) {
    var item = ITEMS[id];
    var link = add(el('a', 'row__link'),
      add(el('span', 'row__pic'), img(item.photos[0].src, '', true)),
      add(el('span', 'row__text'),
        el('span', 'row__series', SERIES),
        el('span', 'row__name', item.name + (item.size ? ', ' + item.size : '')),
        el('span', 'row__price', priceText(item))));
    link.href = '#/' + id;
    if (onOpen) link.addEventListener('click', onOpen);
    var plus = el('button', 'row__add', '+');
    plus.type = 'button';
    plus.setAttribute('aria-label', 'В корзину: ' + item.name);
    plus.addEventListener('click', function () { addToCart(item.name); });
    return add(el('div', 'row'), link, plus);
  }

  function buyBox(name) {
    var qty = 1;
    var value = el('span', 'qty__value', '1');
    var minus = el('button', 'qty__btn', '−');
    var plus = el('button', 'qty__btn', '+');
    minus.type = plus.type = 'button';
    minus.setAttribute('aria-label', 'Меньше');
    plus.setAttribute('aria-label', 'Больше');
    function set(next) { qty = Math.max(1, Math.min(20, next)); value.textContent = qty; minus.disabled = qty === 1; }
    minus.addEventListener('click', function () { set(qty - 1); });
    plus.addEventListener('click', function () { set(qty + 1); });
    set(1);
    var buy = el('button', 'buy', 'Добавить в корзину');
    buy.type = 'button';
    buy.addEventListener('click', function () { addToCart(name); });
    return add(el('div', 'buybox'), add(el('div', 'qty'), minus, value, plus), buy);
  }

  function swatches() {
    return add(el('div', 'colour'),
      add(el('p', 'colour__label'), el('span', null, 'Цвет: '), el('b', null, 'серый градиент')),
      add(el('div', 'colour__list'), add(el('span', 'colour__item is-on'), img('pack', 'Серый градиент', true, true))));
  }

  // Плитки предметов: при наведении — второе фото, как в каталоге IKEA.
  function seriesGrid(title, exceptId) {
    var grid = el('div', 'grid');
    ORDER.forEach(function (id) {
      if (id === exceptId) return;
      var item = ITEMS[id];
      var pic = el('span', 'tile__pic');
      pic.appendChild(img(item.photos[0].src, item.name));
      var closeUp = item.photos.filter(function (ph) { return /-(close|top)$/.test(ph.src); })[0];
      if (closeUp) {
        var hover = img(closeUp.src, '');
        hover.className = 'tile__hover';
        pic.appendChild(hover);
      }
      var tile = add(el('a', 'tile'), pic,
        el('span', 'tile__series', SERIES),
        el('span', 'tile__name', item.name + (item.size ? ', ' + item.size : '')),
        el('span', 'tile__price', priceText(item)));
      tile.href = '#/' + id;
      grid.appendChild(tile);
    });
    return add(el('section', 'series'), el('h2', 'series__title', title), grid);
  }

  /* ---------- страницы ---------- */
  function packPage() {
    document.title = SERIES + ', набор · Scandi home';
    var side = el('div', 'info');
    add(side,
      el('p', 'crumb', 'Посуда · Наборы'),
      el('h1', 'info__title', SERIES),
      el('p', 'info__sub', 'Набор посуды, 5 предметов'),
      el('p', 'info__price', 'от ' + money(45000)),
      el('p', 'info__note', 'Предметы продаются по отдельности: соберите свой набор.'),
      swatches());
    var list = el('div', 'info__list');
    ORDER.forEach(function (id) { list.appendChild(itemRow(id)); });
    add(side, add(el('section', 'block'), el('h2', 'block__title', 'В наборе'), list));
    add(side, el('p', 'info__text', 'Тарелки, салатник, чаша и графин одной серии: тёмный край плавно переходит в светлую середину, поэтому предметы хорошо смотрятся вместе и по отдельности.'));
    add(app, add(el('div', 'product'), gallery(PACK_PHOTOS), side));
  }

  function itemPage(id) {
    var item = ITEMS[id];
    document.title = item.name + ', ' + SERIES.toLowerCase() + ' · Scandi home';

    var others = ORDER.filter(function (x) { return x !== id; });
    var first = others[0];
    var side = el('div', 'info');
    var back = el('a', 'crumb crumb--link', '‹ Весь набор «' + SERIES + '»');
    back.href = '#/';
    add(side,
      back,
      el('h1', 'info__title', SERIES),
      el('p', 'info__sub', item.name + (item.size ? ', ' + item.size : '')),
      el('p', 'info__price', priceText(item)),
      swatches(),
      buyBox(item.name));

    var more = el('button', 'more');
    more.type = 'button';
    var stack = el('span', 'more__stack');
    others.slice(1, 4).forEach(function (x) {
      var dot = el('span', 'more__dot');
      dot.appendChild(img(ITEMS[x].photos[0].src, '', true));
      stack.appendChild(dot);
    });
    add(more, stack, el('span', 'more__text', 'Показать ещё'));
    more.addEventListener('click', function () { drawer(id); });
    add(side, add(el('section', 'block'), el('h2', 'block__title', 'Дополните набор'),
      add(el('div', 'complete'), itemRow(first), more)));

    var facts = el('dl', 'facts');
    add(facts, el('dt', null, 'Артикул'), el('dd', null, item.sku));
    add(facts, el('dt', null, 'Цвет'), el('dd', null, 'Серый градиент'));
    if (item.size) add(facts, el('dt', null, item.name === 'Графин' ? 'Объём' : 'Диаметр'), el('dd', null, item.size.replace('Ø ', '')));
    add(side, facts);

    add(app, add(el('div', 'product'), gallery(item.photos), side), seriesGrid('Другие предметы серии', id));
  }

  function route() {
    if (stopKeys) { stopKeys(); stopKeys = null; }
    app.textContent = '';
    var id = (location.hash || '').replace(/^#\/?/, '');
    if (ITEMS[id]) itemPage(id); else packPage();
    window.scrollTo(0, 0);
  }
  window.addEventListener('hashchange', route);
  route();
}());
