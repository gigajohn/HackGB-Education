(() => {
  'use strict';

  const { STAGES, STAGE_TIPS, AVATAR_COLORS, ACCESSORIES, PETS } = window.SUSOR_DATA;
  const STORE_KEY = 'susorsafe.v2';
  const $ = (sel) => document.querySelector(sel);
  const $$ = (sel) => Array.from(document.querySelectorAll(sel));

  const ACCESSORY_EMOJI = {
    none: '—',
    cap: '🧢',
    glasses: '👓',
    headphones: '🎧',
    crown: '👑',
    scarf: '🧣',
    bow: '🎀',
    backpack: '🎒',
    headband: '🌟'
  };

  const defaultState = () => ({
    mode: 'kid',
    school: 'primary',
    stagesByMode: { kid: 'primary', teen: 'high', adult: 'working' },
    coins: 0,
    lessons: {},
    avatar: { color: 'mint', accessory: 'none', pet: 'pip' },
    owned: {
      colors: ['mint', 'lime'],
      accessories: ['none'],
      pets: ['none', 'pip']
    },
    name: '',
    petName: 'Pip',
    sound: false,
    unlockAll: false,
    arcade: {}
  });

  function loadState() {
    const base = defaultState();
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return base;
      const parsed = JSON.parse(raw);
      const stagesByMode = {
        ...base.stagesByMode,
        ...(parsed.stagesByMode && typeof parsed.stagesByMode === 'object' ? parsed.stagesByMode : {})
      };
      const state = {
        ...base,
        ...parsed,
        stagesByMode,
        avatar: { ...base.avatar, ...(parsed.avatar || {}) },
        owned: {
          colors: Array.isArray(parsed.owned?.colors) ? parsed.owned.colors : base.owned.colors.slice(),
          accessories: Array.isArray(parsed.owned?.accessories) ? parsed.owned.accessories : base.owned.accessories.slice(),
          pets: Array.isArray(parsed.owned?.pets) ? parsed.owned.pets : base.owned.pets.slice()
        },
        lessons: parsed.lessons && typeof parsed.lessons === 'object' ? parsed.lessons : {}
      };
      if (!STAGES[state.mode]) state.mode = 'kid';
      Object.keys(STAGES).forEach((mode) => {
        if (!STAGES[mode].some((stage) => stage.id === state.stagesByMode[mode])) {
          state.stagesByMode[mode] = base.stagesByMode[mode];
        }
      });
      state.school = state.stagesByMode[state.mode];
      if (!AVATAR_COLORS.some((c) => c.id === state.avatar.color)) state.avatar.color = 'mint';
      if (!ACCESSORIES.some((a) => a.id === state.avatar.accessory)) state.avatar.accessory = 'none';
      if (!PETS.some((p) => p.id === state.avatar.pet)) state.avatar.pet = 'pip';
      ['colors', 'accessories', 'pets'].forEach((type) => {
        if (!state.owned[type].includes(type === 'colors' ? 'mint' : type === 'accessories' ? 'none' : 'pip')) {
          state.owned[type].push(type === 'colors' ? 'mint' : type === 'accessories' ? 'none' : 'pip');
        }
      });
      if (typeof state.name !== 'string') state.name = '';
      if (typeof state.petName !== 'string') state.petName = 'Pip';
      return state;
    } catch (err) {
      return base;
    }
  }

  const state = loadState();
  let shopTab = 'looks';

  function save() {
    try {
      localStorage.setItem(STORE_KEY, JSON.stringify(state));
    } catch (err) {
      /* storage may be disabled */
    }
  }

  function colorFor(id) {
    return AVATAR_COLORS.find((c) => c.id === id) || AVATAR_COLORS[0];
  }
  function petFor(id) {
    return PETS.find((p) => p.id === id) || PETS[0];
  }
  function currentPet() {
    return petFor(state.avatar.pet);
  }
  function petDisplayName() {
    if (state.avatar.pet === 'none') return '';
    return (state.petName || '').trim() || currentPet().name;
  }
  function completedCount() {
    return Object.values(state.lessons || {}).filter(Boolean).length;
  }
  function rankFor(count) {
    if (state.mode === 'kid') {
      if (count >= 7) return 'Island Keeper';
      if (count >= 5) return 'Safety Keeper';
      if (count >= 3) return 'Sharp Spotter';
      if (count >= 1) return 'Curious Explorer';
      return 'New Islander';
    }
    if (state.mode === 'teen') {
      if (count >= 7) return 'Digital Navigator';
      if (count >= 5) return 'Account Defender';
      if (count >= 3) return 'Sharp Spotter';
      if (count >= 1) return 'Scam Aware';
      return 'Getting Started';
    }
    if (count >= 7) return 'Online Guardian';
    if (count >= 5) return 'Security Keeper';
    if (count >= 3) return 'Sharp Spotter';
    if (count >= 1) return 'Scam Aware';
    return 'Getting Started';
  }

  function accessorySVG(id) {
    if (id === 'cap') {
      return '<g class="av-gear"><path d="M28 36q32-28 64 0v6q-32-15-64 0Z" fill="#FF7FB6" stroke="#0B1026" stroke-width="4" stroke-linejoin="round"/><path d="M86 38q18 2 18 9l-24-3Z" fill="#FF7FB6" stroke="#0B1026" stroke-width="4" stroke-linejoin="round"/></g>';
    }
    if (id === 'glasses') {
      return '<g class="av-gear" fill="rgba(255,255,255,.16)" stroke="#0B1026" stroke-width="4"><circle cx="46" cy="66" r="12"/><circle cx="74" cy="66" r="12"/><path d="M58 66h4M34 64l-8-3M86 64l8-3"/></g>';
    }
    if (id === 'headphones') {
      return '<g class="av-gear"><path d="M28 62q2-40 32-40t32 40" fill="none" stroke="#0B1026" stroke-width="8" stroke-linecap="round"/><rect x="20" y="56" width="13" height="26" rx="6" fill="#FF7FB6" stroke="#0B1026" stroke-width="4"/><rect x="87" y="56" width="13" height="26" rx="6" fill="#FF7FB6" stroke="#0B1026" stroke-width="4"/></g>';
    }
    if (id === 'crown') {
      return '<path class="av-gear" d="M34 34 43 14 53 28 60 10 67 28 77 14 86 34Z" fill="#FFCB5C" stroke="#0B1026" stroke-width="4" stroke-linejoin="round"/>';
    }
    if (id === 'scarf') {
      return '<path class="av-gear" d="M31 96q29 13 58 0l-3 13q-25 12-52 0Z" fill="#FF7FB6" stroke="#0B1026" stroke-width="4"/><path d="m66 104 5 23 13-3-5-22Z" fill="#FF7FB6" stroke="#0B1026" stroke-width="4" stroke-linejoin="round"/>';
    }
    if (id === 'bow') {
      return '<g class="av-gear" fill="#FF7FB6" stroke="#0B1026" stroke-width="3"><path d="M32 25 13 17l3 20 17-5ZM35 26l18-10-1 21-18-3Z"/><circle cx="34" cy="27" r="5" fill="#FFCB5C"/></g>';
    }
    if (id === 'backpack') {
      return '<g class="av-gear"><path d="M16 56q-8 3-7 20l3 26q2 9 12 6l10-4-4-47Z" fill="#7DD3FC" stroke="#0B1026" stroke-width="4"/><path d="M12 78q8-7 18-3l2 14q-9 5-18 2Z" fill="#FFCB5C" stroke="#0B1026" stroke-width="3"/></g>';
    }
    if (id === 'headband') {
      return '<g class="av-gear" fill="none" stroke="#0B1026" stroke-width="5"><path d="M31 49q3-31 29-31t29 31" stroke="#FF7FB6"/><path d="m60 12 3 7 8 1-6 5 2 8-7-4-7 4 2-8-6-5 8-1Z" fill="#FFCB5C" stroke-width="2"/></g>';
    }
    return '';
  }

  function avatarSVG() {
    const color = colorFor(state.avatar.color);
    return `<svg viewBox="0 0 120 140" class="avatar-svg" aria-hidden="true" focusable="false">
      <ellipse cx="60" cy="132" rx="32" ry="5" fill="#050914" opacity=".4"/>
      <path d="M60 8 L100 24 V64 C100 96 83 116 60 130 C37 116 20 96 20 64 V24 Z" fill="${color.hex}" stroke="#0B1026" stroke-width="5" stroke-linejoin="round"/>
      <path d="M60 17 L92 30 V64 C92 90 78 107 60 119 C42 107 28 90 28 64 V30 Z" fill="#fff" opacity=".14"/>
      <g class="avatar-face">
        <ellipse cx="46" cy="66" rx="6" ry="7" fill="#0B1026"/>
        <ellipse cx="74" cy="66" rx="6" ry="7" fill="#0B1026"/>
        <circle cx="48" cy="63" r="2" fill="#fff"/>
        <circle cx="76" cy="63" r="2" fill="#fff"/>
        <ellipse cx="34" cy="79" rx="6" ry="3" fill="#FF8FB8" opacity=".65"/>
        <ellipse cx="86" cy="79" rx="6" ry="3" fill="#FF8FB8" opacity=".65"/>
        <path d="M50 82q10 9 20 0" fill="none" stroke="#0B1026" stroke-width="4" stroke-linecap="round"/>
      </g>
      ${accessorySVG(state.avatar.accessory)}
    </svg>`;
  }

  function petMarkup() {
    const pet = currentPet();
    return pet.id === 'none' ? '' : `<span class="avatar-pet" aria-hidden="true">${pet.emoji}</span>`;
  }

  function toast(message) {
    const el = $('#profileToast');
    if (!el) return;
    el.textContent = message;
    el.classList.add('show');
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => el.classList.remove('show'), 2400);
  }

  function render() {
    document.body.dataset.mode = state.mode;
    window.applySusOrSafeMode?.(state.mode);
    const headerAvatar = $('#headerAvatar');
    if (headerAvatar) headerAvatar.innerHTML = avatarSVG();
    const headerCoins = $('#coinValue');
    if (headerCoins) headerCoins.textContent = String(state.coins);
    const count = completedCount();
    const pet = currentPet();

    $('#crewAvatar').innerHTML = avatarSVG() + petMarkup();
    $('#crewPetEmoji').textContent = pet.id === 'none' ? '·' : pet.emoji;
    $('#crewPetName').textContent = pet.id === 'none' ? 'No pet yet' : petDisplayName();
    $('#crewRank').textContent = rankFor(count);
    $('#profileProgress').textContent = `${count} / 7 lessons complete`;
    $('#shopCoins').textContent = String(state.coins);

    const active = document.activeElement;
    if (active !== $('#explorerName')) $('#explorerName').value = state.name;
    if (active !== $('#petName')) $('#petName').value = state.avatar.pet === 'none' ? '' : (state.petName || '');

    const kid = state.mode === 'kid';
    $('#profileNameLabel').textContent = kid ? 'Explorer name' : state.mode === 'teen' ? 'Display name' : 'Name or nickname';
    $('#explorerName').placeholder = kid ? 'Name your explorer' : state.mode === 'teen' ? 'Choose a display name' : 'Enter a name or nickname';

    const stages = STAGES[state.mode];
    const activeStage = stages.find((stage) => stage.id === state.stagesByMode[state.mode]) || stages[0];
    const select = $('#schoolSelect');
    select.innerHTML = stages.map((stage) => `<option value="${stage.id}">${stage.label}</option>`).join('');
    select.value = activeStage.id;
    $('#schoolStageLabel').textContent = kid ? 'Age or school stage' : 'Life stage';
    $('#schoolStageNote').textContent = state.mode === 'adult'
      ? 'This stays on your device and only tailors your safety tips.'
      : 'We never ask for your school’s name. This only tailors your safety tips.';
    $('#schoolTip').textContent = STAGE_TIPS[activeStage.id];

    $$('.mode-pill[data-mode]').forEach((btn) => {
      const on = btn.dataset.mode === state.mode;
      btn.classList.toggle('is-active', on);
      btn.setAttribute('aria-pressed', String(on));
    });

    renderShop();
  }

  function renderShop() {
    const grid = $('#shopGrid');
    $$('.shop-tab').forEach((tab) => {
      const on = tab.dataset.shopTab === shopTab;
      tab.classList.toggle('is-active', on);
      tab.setAttribute('aria-selected', String(on));
    });

    if (shopTab === 'pets') {
      grid.innerHTML = PETS.map((pet) => {
        const owned = state.owned.pets.includes(pet.id);
        const equipped = state.avatar.pet === pet.id;
        const priceLabel = owned ? (equipped ? 'Equipped' : 'Owned') : (pet.price === 0 ? 'Free' : `${pet.price} coins`);
        return `<button class="shop-item pet-item ${equipped ? 'is-equipped' : ''}" type="button" data-buy-type="pets" data-buy-id="${pet.id}">
          <span class="pet-emoji">${pet.emoji || '·'}</span>
          <span class="shop-item-copy"><b>${pet.name}</b><small>${pet.blurb}</small></span>
          <span class="shop-price">${priceLabel}</span>
        </button>`;
      }).join('');
      return;
    }

    const colors = AVATAR_COLORS.map((color) => {
      const owned = state.owned.colors.includes(color.id);
      const equipped = state.avatar.color === color.id;
      const priceLabel = owned ? (equipped ? 'Equipped' : 'Owned') : (color.price === 0 ? 'Free' : `${color.price} coins`);
      return `<button class="shop-item color-item ${equipped ? 'is-equipped' : ''}" type="button" data-buy-type="colors" data-buy-id="${color.id}">
        <span class="color-swatch" style="--sw:${color.hex}"></span>
        <span class="shop-item-copy"><b>${color.name}</b><small>Body colour</small></span>
        <span class="shop-price">${priceLabel}</span>
      </button>`;
    }).join('');

    const gear = ACCESSORIES.map((accessory) => {
      const owned = state.owned.accessories.includes(accessory.id);
      const equipped = state.avatar.accessory === accessory.id;
      const priceLabel = owned ? (equipped ? 'Equipped' : 'Owned') : (accessory.price === 0 ? 'Free' : `${accessory.price} coins`);
      return `<button class="shop-item gear-item ${equipped ? 'is-equipped' : ''}" type="button" data-buy-type="accessories" data-buy-id="${accessory.id}">
        <span class="gear-emoji">${ACCESSORY_EMOJI[accessory.id] || '—'}</span>
        <span class="shop-item-copy"><b>${accessory.name}</b><small>Wearable gear</small></span>
        <span class="shop-price">${priceLabel}</span>
      </button>`;
    }).join('');

    grid.innerHTML = `<div class="shop-section"><p class="shop-section-title">Body colour</p><div class="shop-subgrid">${colors}</div></div>
      <div class="shop-section"><p class="shop-section-title">Gear</p><div class="shop-subgrid">${gear}</div></div>`;
  }

  function buyOrEquip(type, id) {
    const collections = { colors: AVATAR_COLORS, accessories: ACCESSORIES, pets: PETS };
    const list = collections[type];
    const item = list && list.find((entry) => entry.id === id);
    if (!item) return;

    if (!state.owned[type].includes(id)) {
      if (state.coins < item.price) {
        toast(`Need ${item.price - state.coins} more coins. Finish another lesson.`);
        return;
      }
      state.coins -= item.price;
      state.owned[type].push(id);
    }

    if (type === 'colors') state.avatar.color = id;
    if (type === 'accessories') state.avatar.accessory = id;
    if (type === 'pets') {
      state.avatar.pet = id;
      if (id !== 'none' && !state.petName.trim()) state.petName = item.name;
    }

    save();
    render();
  }

  $$('.mode-pill[data-mode]').forEach((btn) => {
    btn.addEventListener('click', () => {
      if (!STAGES[btn.dataset.mode]) return;
      state.mode = btn.dataset.mode;
      state.school = state.stagesByMode[state.mode];
      save();
      render();
    });
  });

  $('#explorerName').addEventListener('input', (event) => {
    state.name = event.target.value;
    save();
  });

  $('#petName').addEventListener('input', (event) => {
    state.petName = event.target.value;
    save();
    $('#crewPetName').textContent = currentPet().id === 'none' ? 'No pet yet' : petDisplayName();
  });

  $('#schoolSelect').addEventListener('change', (event) => {
    state.stagesByMode[state.mode] = event.target.value;
    state.school = event.target.value;
    save();
    $('#schoolTip').textContent = STAGE_TIPS[event.target.value];
  });

  $('#shopTabs').addEventListener('click', (event) => {
    const tab = event.target.closest('[data-shop-tab]');
    if (!tab) return;
    shopTab = tab.dataset.shopTab;
    renderShop();
  });

  $('#shopGrid').addEventListener('click', (event) => {
    const item = event.target.closest('[data-buy-type]');
    if (!item) return;
    buyOrEquip(item.dataset.buyType, item.dataset.buyId);
  });

  render();
})();
