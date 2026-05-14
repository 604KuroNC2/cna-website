/* CNA Catalog — AJAX filtering, sidebar, search, load more */
(function () {
  'use strict';

  var ajaxUrl  = (typeof cnaCatalog !== 'undefined') ? cnaCatalog.ajaxUrl : '/wp-admin/admin-ajax.php';
  var nonce    = (typeof cnaCatalog !== 'undefined') ? cnaCatalog.nonce  : '';
  var perPage  = (typeof cnaCatalog !== 'undefined') ? cnaCatalog.perPage : 24;

  var state = {
    mainCat:  '',
    subCat:   '',
    search:   '',
    page:     1,
    loading:  false,
    total:    0,
    shown:    0,
  };

  // DOM refs
  var grid         = document.getElementById('cna-grid');
  var loadingEl    = document.getElementById('cna-loading');
  var loadMoreWrap = document.getElementById('load-more-wrap');
  var loadMoreBtn  = document.getElementById('btn-load-more');
  var showingEl    = document.getElementById('showing-count');
  var filteredEl   = document.getElementById('filtered-count');
  var breadcrumb   = document.getElementById('cna-breadcrumb');
  var clearAllBtn  = document.getElementById('btn-clear-all');
  var searchInput  = document.getElementById('cna-search');
  var searchClear  = document.getElementById('cna-search-clear');
  var allBtn       = document.getElementById('btn-all');

  var searchTimer;

  // ── Fetch products ──────────────────────────────────────────
  function fetchProducts(append) {
    if (state.loading) return;
    state.loading = true;

    if (!append) {
      grid.style.opacity = '0.4';
      if (loadingEl) loadingEl.classList.remove('hidden');
    }

    var body = new URLSearchParams({
      action:   'cna_filter_products',
      nonce:    nonce,
      main_cat: state.mainCat,
      sub_cat:  state.subCat,
      search:   state.search,
      paged:    state.page,
    });

    fetch(ajaxUrl, { method: 'POST', body: body, headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
      .then(function (r) { return r.json(); })
      .then(function (data) {
        if (!data.success) return;
        var d = data.data;

        if (append) {
          grid.insertAdjacentHTML('beforeend', d.html || '<div class="col-span-full text-center py-10 text-gray-400">No more products.</div>');
        } else {
          grid.innerHTML = d.html || '<div class="col-span-full text-center py-20 text-gray-400"><div class="text-5xl mb-4">💡</div><h3 class="font-display font-bold text-2xl text-[#000080] mb-2">No products found</h3><p>Try adjusting your search or filters.</p></div>';
          state.shown = 0;
        }

        state.total  = d.total;
        state.shown += parseInt(d.html ? (d.html.match(/product-card-wrap/g) || []).length : 0);

        // Update count
        if (filteredEl) filteredEl.textContent = d.total;
        if (showingEl)  showingEl.textContent  = 'Showing ' + Math.min(state.page * perPage, d.total) + ' of ' + d.total + ' products';

        // Load more button
        if (loadMoreBtn) {
          if (d.has_more) {
            loadMoreWrap.classList.remove('hidden');
            var rem = d.total - state.page * perPage;
            var countEl = document.getElementById('load-more-count');
            if (countEl) countEl.textContent = '(' + rem + ' remaining)';
            loadMoreBtn.dataset.hasMore = '1';
          } else {
            loadMoreWrap.classList.add('hidden');
            loadMoreBtn.dataset.hasMore = '0';
          }
        }

        // Breadcrumb
        updateBreadcrumb();
        updateClearBtn();

        // GSAP card entrance
        if (typeof gsap !== 'undefined') {
          var cards = grid.querySelectorAll('.product-card-wrap');
          var newCards = append ? Array.from(cards).slice(-d.html.match(/product-card-wrap/g)?.length || 0) : Array.from(cards);
          gsap.fromTo(newCards,
            { opacity: 0, y: 30 },
            { opacity: 1, y: 0, stagger: 0.04, duration: 0.5, ease: 'power3.out', clearProps: 'all' }
          );
        }
      })
      .finally(function () {
        state.loading = false;
        grid.style.opacity = '1';
        if (loadingEl) loadingEl.classList.add('hidden');
      });
  }

  function updateBreadcrumb() {
    if (!breadcrumb) return;
    var mainNameEl = document.getElementById('breadcrumb-main');
    var subNameEl  = document.getElementById('breadcrumb-sub');

    if (!state.mainCat && !state.subCat) {
      breadcrumb.classList.add('hidden');
    } else {
      breadcrumb.classList.remove('hidden');
      if (mainNameEl) mainNameEl.textContent = state.mainName || state.mainCat;
      if (subNameEl) {
        if (state.subCat) { subNameEl.textContent = state.subName || state.subCat; subNameEl.parentElement.classList.remove('hidden'); }
        else { if (subNameEl.parentElement) subNameEl.parentElement.classList.add('hidden'); }
      }
    }
  }

  function updateClearBtn() {
    if (!clearAllBtn) return;
    if (state.mainCat || state.subCat || state.search) clearAllBtn.classList.remove('hidden');
    else clearAllBtn.classList.add('hidden');
  }

  function clearAll() {
    state.mainCat = ''; state.subCat = ''; state.search = '';
    state.mainName = ''; state.subName = '';
    state.page = 1;
    if (searchInput) { searchInput.value = ''; searchClear?.classList.add('hidden'); }
    // Reset sidebar active states
    document.querySelectorAll('.cat-main-btn').forEach(function (b) { b.classList.remove('text-[#000080]', 'bg-[#000080]/08'); b.classList.add('text-gray-700', 'hover:bg-gray-100'); b.querySelector('.cat-chevron')?.classList.remove('rotate-90'); });
    document.querySelectorAll('.cat-children').forEach(function (c) { c.classList.add('hidden'); });
    document.querySelectorAll('.cat-sub-btn').forEach(function (b) { b.classList.remove('text-[#000080]', 'bg-[#000080]/08'); b.classList.add('text-gray-600', 'hover:bg-gray-100'); });
    if (allBtn) { allBtn.classList.add('bg-[#000080]', 'text-white'); allBtn.classList.remove('text-gray-600', 'hover:bg-gray-100'); }
    fetchProducts(false);
  }

  // ── Sidebar: main category click ───────────────────────────
  document.querySelectorAll('.cat-main-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var slug = btn.dataset.slug;
      var name = btn.dataset.name;
      var children = btn.parentElement.querySelector('.cat-children');
      var chevron  = btn.querySelector('.cat-chevron');

      var isExpanding = state.mainCat !== slug;

      // Reset all mains
      document.querySelectorAll('.cat-main-btn').forEach(function (b) {
        b.classList.remove('text-[#000080]', 'bg-[#000080]/08'); b.classList.add('text-gray-700');
        b.querySelector('.cat-chevron')?.classList.remove('rotate-90');
      });
      document.querySelectorAll('.cat-children').forEach(function (c) { c.classList.add('hidden'); });
      document.querySelectorAll('.cat-sub-btn').forEach(function (b) { b.classList.remove('text-[#000080]', 'bg-[#000080]/08'); b.classList.add('text-gray-600'); });
      if (allBtn) { allBtn.classList.remove('bg-[#000080]', 'text-white'); allBtn.classList.add('text-gray-600'); }

      if (isExpanding) {
        btn.classList.add('text-[#000080]', 'bg-[#000080]/08'); btn.classList.remove('text-gray-700');
        if (chevron)   chevron.classList.add('rotate-90');
        if (children)  children.classList.remove('hidden');
        state.mainCat  = slug; state.mainName = name;
        state.subCat   = ''; state.subName = '';
        state.page     = 1;
      } else {
        state.mainCat = ''; state.mainName = '';
        state.subCat  = ''; state.subName  = '';
        state.page    = 1;
        if (allBtn) { allBtn.classList.add('bg-[#000080]', 'text-white'); allBtn.classList.remove('text-gray-600'); }
      }
      fetchProducts(false);
    });
  });

  // ── Sidebar: sub category click ────────────────────────────
  document.querySelectorAll('.cat-sub-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var slug   = btn.dataset.slug;
      var name   = btn.dataset.name;
      var parent = btn.dataset.parent;

      var isSelecting = !(state.subCat === slug && state.mainCat === parent);

      document.querySelectorAll('.cat-sub-btn').forEach(function (b) { b.classList.remove('text-[#000080]', 'bg-[#000080]/08'); b.classList.add('text-gray-600'); });

      if (isSelecting) {
        btn.classList.add('text-[#000080]', 'bg-[#000080]/08'); btn.classList.remove('text-gray-600');
        state.mainCat = parent; state.subCat  = slug; state.subName = name;
      } else {
        state.subCat = ''; state.subName = '';
      }
      state.page = 1;
      fetchProducts(false);
    });
  });

  // ── All products button ─────────────────────────────────────
  if (allBtn) {
    allBtn.addEventListener('click', clearAll);
  }

  // ── Clear all button ────────────────────────────────────────
  if (clearAllBtn) {
    clearAllBtn.addEventListener('click', clearAll);
  }

  // ── Breadcrumb clear ────────────────────────────────────────
  document.querySelectorAll('[data-action="clear-all"]').forEach(function (el) {
    el.addEventListener('click', clearAll);
  });

  // ── Search ──────────────────────────────────────────────────
  if (searchInput) {
    searchInput.addEventListener('input', function () {
      state.search = searchInput.value.trim();
      if (state.search) {
        searchClear?.classList.remove('hidden');
        state.mainCat = ''; state.subCat = '';
      } else {
        searchClear?.classList.add('hidden');
      }
      clearTimeout(searchTimer);
      searchTimer = setTimeout(function () {
        state.page = 1;
        fetchProducts(false);
      }, 350);
    });
  }

  if (searchClear) {
    searchClear.addEventListener('click', function () {
      searchInput.value = ''; state.search = '';
      searchClear.classList.add('hidden');
      state.page = 1;
      fetchProducts(false);
    });
  }

  // ── Load more ───────────────────────────────────────────────
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener('click', function () {
      if (loadMoreBtn.dataset.hasMore !== '1') return;
      state.page++;
      fetchProducts(true);
    });
  }

  // ── Init from URL params ────────────────────────────────────
  var urlParams = new URLSearchParams(window.location.search);
  state.mainCat = urlParams.get('main_cat') || '';
  state.subCat  = urlParams.get('sub_cat')  || '';
  state.search  = urlParams.get('search')   || '';

})();
