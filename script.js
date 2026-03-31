document.addEventListener("DOMContentLoaded", () => {
  const BASE_FILE = "base/base.png";

  const PARTS = [
    {
      key: "door",
      jp: "上台戸板",
      layerId: "layer-door",
      selId: "sel-door",
      options: [
        { id: "normal", label: "通常", file: "door/door_normal.png" },
        { id: "kokutan2", label: "黒丹調2枚内側", file: "door/door_kokutan2.png" },
        { id: "kokutan4", label: "黒丹調4枚", file: "door/door_kokutan4.png" },
        { id: "shitan2", label: "紫丹調2枚内側", file: "door/door_shitan2.png" },
        { id: "shitan4", label: "紫丹調4枚", file: "door/door_shitan4.png" },
        { id: "oborozakura", label: "おぼろ桜", file: "door/door_oborozakura.png" },
        { id: "uzunomichi", label: "渦の道", file: "door/door_uzunomichi.png" },
        { id: "w", label: "ウォールナット4枚", file: "door/door_w.png" },
        { id: "w2", label: "ウォールナット2枚外側", file: "door/door_w2.png" }
      ],
      defaultId: "normal"
    },
    {
      key: "center",
      jp: "背板中央",
      layerId: "layer-center",
      selId: "sel-center",
      options: [
        { id: "normal", label: "未選択", file: "center/center_normal.png" },
        { id: "luminous", label: "ルミナス", file: "center/center_luminous.png" },
        { id: "kokutan", label: "黒丹調", file: "center/center_kokutan.png" },
        { id: "shitan", label: "紫丹調", file: "center/center_shitan.png" },
        { id: "kinshi", label: "金紙", file: "center/center_kinshi.png" },
        { id: "donsu", label: "緞子", file: "center/center_donsu.png" },
        { id: "w", label: "ウォールナット", file: "center/center_w.png" },
        { id: "uzunomichi", label: "渦の道", file: "center/center_uzunomichi.png" },
        { id: "oborozakura", label: "おぼろ桜", file: "center/center_oborozakura.png" },
        { id: "sakuranamiki-kokutan", label: "桜並木（黒丹）", file: "center/center_sakuranamiki-kokutan.png" },
        { id: "sakuranamiki-shitan", label: "桜並木（紫丹）", file: "center/center_sakuranamiki-shitan.png" },
        { id: "sakuranamiki-w", label: "桜並木（ウォールナット）", file: "center/center_sakuranamiki-w.png" },
        { id: "towazakura-kokutan", label: "永遠桜（黒丹）", file: "center/center_towazakura-kokutan.png" },
        { id: "towazakura-shitan", label: "永遠桜（紫丹）", file: "center/center_towazakura-shitan.png" },
        { id: "towazakura-w", label: "永遠桜（ウォールナット）", file: "center/center_towazakura-w.png" }
      ],
      defaultId: "normal"
    },
    {
      key: "hashira",
      jp: "柱(背板中央未選択の場合のみ選択可能)",
      layerId: "layer-hashira",
      selId: "sel-hashira",
      options: [
        { id: "on", label: "ON", file: "hashira/hashira_on.png" },
        { id: "off", label: "OFF", file: "hashira/hashira_off.png" }
      ],
      defaultId: "on"
    },
    {
      key: "back",
      jp: "背板全面",
      layerId: "layer-back",
      selId: "sel-back",
      options: [
        { id: "normal", label: "通常", file: "back/back_normal.png" },
        { id: "luminous", label: "ルミナス", file: "back/back_luminous.png" },
        { id: "iris", label: "アイリス", file: "back/back_iris.png" },
        { id: "kinshi", label: "金紙", file: "back/back_kinshi.png" },
        { id: "lily", label: "リリー", file: "back/back_lily.png" },
        { id: "w", label: "ウォールナット", file: "back/back_w.png" },
        { id: "uzunomichi", label: "渦の道", file: "back/back_uzunomichi.png" }
      ],
      defaultId: "normal"
    },
    {
      key: "unit",
      jp: "下台戸板",
      layerId: "layer-unit",
      selId: "sel-unit",
      options: [
        { id: "normal", label: "通常", file: "unit/unit_normal.png" },
        { id: "senbondo2", label: "千本格子2枚内側", file: "unit/unit_senbondo2.png" },
        { id: "senbondo_zenmen", label: "千本格子4枚", file: "unit/unit_senbondo_zenmen.png" }
      ],
      defaultId: "normal"
    }
  ];

  const YARAIDO_DOOR_IDS = new Set(["yaraido2", "yaraido4", "yaraido_w"]);
  const YARAIDO_UNIT_IDS = new Set(["yaraido2", "yaraidozenmen"]);

  const state = {
    door: null,
    center: null,
    hashira: null,
    back: null,
    unit: null
  };

  let restrictionSource = null; // "door" | "unit" | null

  function $(id) {
    return document.getElementById(id);
  }

  function toast(msg) {
    const t = $("toast");
    if (!t) return;
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      t.classList.remove("show");
    }, 1300);
  }

  function setImg(id, src) {
    const el = $(id);
    if (!el) return;
    const bust = "v=" + Date.now();
    el.src = src + (src.includes("?") ? "&" + bust : "?" + bust);
  }

  function setSelText(selId, label) {
    const el = $(selId);
    if (el) el.textContent = label;
  }

  function setActive(partKey, optId) {
    const wrap = document.querySelector(`[data-part="${partKey}"]`);
    if (!wrap) return;
    wrap.querySelectorAll("button.opt").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.opt === optId ? "true" : "false");
    });
  }

  function getPart(partKey) {
    return PARTS.find((p) => p.key === partKey);
  }

  function getOpt(partKey, optId) {
    const part = getPart(partKey);
    return part ? part.options.find((o) => o.id === optId) : null;
  }

  function isRestrictedDoorSelected() {
    return YARAIDO_DOOR_IDS.has(state.door);
  }

  function isRestrictedUnitSelected() {
    return YARAIDO_UNIT_IDS.has(state.unit);
  }

  function buildCustomerFileName(ext = "pdf") {
    const customerName = $("customerName")?.value.trim();
    const baseName = customerName ? `${customerName}様仕様書` : "senbondo";
    const safeName = baseName
      .replace(/[\\/:*?"<>|]/g, "_")
      .replace(/\s+/g, "_");
    return `${safeName}.${ext}`;
  }

  async function saveBlobAsFile(blob, filename) {
    const file = new File([blob], filename, { type: blob.type });

    if (navigator.canShare && navigator.share) {
      try {
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            files: [file],
            title: filename
          });
          return true;
        }
      } catch (err) {
        console.warn("share failed:", err);
      }
    }

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    return true;
  }

  function normalizeState() {
    if (state.center && state.center !== "normal") {
      state.hashira = "on";
    }

    if (restrictionSource === "door") {
      if (isRestrictedDoorSelected()) {
        if (!YARAIDO_UNIT_IDS.has(state.unit)) {
          state.unit = "yaraido2";
        }
      } else {
        if (isRestrictedUnitSelected()) {
          state.unit = "normal";
        }
      }
    }

    if (restrictionSource === "unit") {
      if (isRestrictedUnitSelected()) {
        if (!YARAIDO_DOOR_IDS.has(state.door)) {
          state.door = "yaraido2";
        }
      } else {
        if (isRestrictedDoorSelected()) {
          state.door = "normal";
        }
      }
    }
  }

  function updateAvailability() {
    const mustHashiraOn = state.center && state.center !== "normal";

    const hashWrap = document.querySelector(`[data-part="hashira"]`);
    if (hashWrap) {
      const offBtn = hashWrap.querySelector(`button.opt[data-opt="off"]`);
      if (offBtn) {
        offBtn.disabled = mustHashiraOn;
        offBtn.title = mustHashiraOn ? "背板中央が未選択以外のときは柱OFFにできません" : "";
      }
    }

    const unitWrap = document.querySelector(`[data-part="unit"]`);
    if (unitWrap) {
      unitWrap.querySelectorAll("button.opt").forEach((btn) => {
        btn.disabled = false;
        btn.title = "";
      });

      if (restrictionSource === "door" && isRestrictedDoorSelected()) {
        unitWrap.querySelectorAll("button.opt").forEach((btn) => {
          const isAllowed = YARAIDO_UNIT_IDS.has(btn.dataset.opt);
          btn.disabled = !isAllowed;
          btn.title = !isAllowed ? "この上台戸板では選択できません" : "";
        });
      }
    }

    const doorWrap = document.querySelector(`[data-part="door"]`);
    if (doorWrap) {
      doorWrap.querySelectorAll("button.opt").forEach((btn) => {
        btn.disabled = false;
        btn.title = "";
      });

      if (restrictionSource === "unit" && isRestrictedUnitSelected()) {
        doorWrap.querySelectorAll("button.opt").forEach((btn) => {
          const isAllowed = YARAIDO_DOOR_IDS.has(btn.dataset.opt);
          btn.disabled = !isAllowed;
          btn.title = !isAllowed ? "この下台戸板では選択できません" : "";
        });
      }
    }
  }

  function syncUIFromState() {
    normalizeState();

    PARTS.forEach((part) => {
      const opt = getOpt(part.key, state[part.key]);
      if (!opt) return;
      setImg(part.layerId, opt.file);
      setSelText(part.selId, opt.label);
      setActive(part.key, opt.id);
    });

    updateAvailability();
  }

  function apply(partKey, optId, silent = false) {
    const part = getPart(partKey);
    const opt = getOpt(partKey, optId);
    if (!part || !opt) return;

    const prevDoor = state.door;
    const prevUnit = state.unit;

    state[partKey] = optId;

    if (partKey === "door" || partKey === "unit") {
      restrictionSource = partKey;
    }

    normalizeState();
    syncUIFromState();

    if (!silent) {
      let msg = `${part.jp}：${opt.label}`;

      if (partKey === "door") {
        if (restrictionSource === "door" && isRestrictedDoorSelected()) {
          if (prevUnit !== state.unit) {
            const unitOpt = getOpt("unit", state.unit);
            msg += `（下台戸板を${unitOpt.label}に変更）`;
          } else {
            msg += "（下台戸板は矢来堂のみ選択可能）";
          }
        } else if (restrictionSource === "door" && prevUnit !== state.unit) {
          const unitOpt = getOpt("unit", state.unit);
          msg += `（下台戸板を${unitOpt.label}に変更）`;
        }
      }

      if (partKey === "unit") {
        if (restrictionSource === "unit" && isRestrictedUnitSelected()) {
          if (prevDoor !== state.door) {
            const doorOpt = getOpt("door", state.door);
            msg += `（上台戸板を${doorOpt.label}に変更）`;
          } else {
            msg += "（上台戸板は矢来堂のみ選択可能）";
          }
        } else if (restrictionSource === "unit" && prevDoor !== state.door) {
          const doorOpt = getOpt("door", state.door);
          msg += `（上台戸板を${doorOpt.label}に変更）`;
        }
      }

      if (partKey === "center" && state.center !== "normal") {
        msg += "（柱はON固定）";
      }

      toast(msg);
    }
  }

  function renderControls() {
    const root = $("controls");
    if (!root) return;
    root.innerHTML = "";

    PARTS.forEach((part) => {
      const box = document.createElement("section");
      box.className = "group";

      const head = document.createElement("div");
      head.className = "groupTitle";
      head.innerHTML = `<h3>${part.jp}</h3><div class="note">${part.options.length}項目</div>`;
      box.appendChild(head);

      const grid = document.createElement("div");
      grid.className = "btnGrid";
      grid.dataset.part = part.key;

      part.options.forEach((opt) => {
        const btn = document.createElement("button");
        btn.className = "opt";
        btn.type = "button";
        btn.textContent = opt.label;
        btn.dataset.opt = opt.id;
        btn.setAttribute("aria-pressed", "false");
        btn.addEventListener("click", () => apply(part.key, opt.id));
        grid.appendChild(btn);
      });

      box.appendChild(grid);
      root.appendChild(box);
    });
  }

  function resetAll() {
    setImg("layer-base", BASE_FILE);

    PARTS.forEach((part) => {
      state[part.key] = part.defaultId;
    });

    restrictionSource = null;

    normalizeState();
    syncUIFromState();

    toast("初期状態に戻しました");
  }

  function fillExportSheet() {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    const hh = String(now.getHours()).padStart(2, "0");
    const mi = String(now.getMinutes()).padStart(2, "0");
    const dateText = `${yyyy}/${mm}/${dd} ${hh}:${mi}`;

    const staffName = $("staffName")?.value.trim() || "未入力";
    const customerName = $("customerName")?.value.trim() || "未入力";
    const memo = $("memo")?.value.trim() || "なし";

    if ($("exportTitle")) {
      $("exportTitle").textContent = `${dateText}　担当：${staffName}　お客様名：${customerName}様`;
    }
    if ($("exportMeta")) {
      $("exportMeta").textContent = "千本堂カスタマイズ仕様書";
    }

    if ($("exp-base")) $("exp-base").src = $("layer-base")?.src || "";
    if ($("exp-unit")) $("exp-unit").src = $("layer-unit")?.src || "";
    if ($("exp-back")) $("exp-back").src = $("layer-back")?.src || "";
    if ($("exp-center")) $("exp-center").src = $("layer-center")?.src || "";
    if ($("exp-hashira")) $("exp-hashira").src = $("layer-hashira")?.src || "";
    if ($("exp-door")) $("exp-door").src = $("layer-door")?.src || "";

    if ($("exp-sel-door")) $("exp-sel-door").textContent = $("sel-door")?.textContent || "";
    if ($("exp-sel-center")) $("exp-sel-center").textContent = $("sel-center")?.textContent || "";
    if ($("exp-sel-hashira")) {
      const hashiraText = $("sel-hashira")?.textContent || "";
      $("exp-sel-hashira").textContent = hashiraText === "ON" ? "有り" : "無し";
    }
    if ($("exp-sel-back")) $("exp-sel-back").textContent = $("sel-back")?.textContent || "";
    if ($("exp-sel-unit")) $("exp-sel-unit").textContent = $("sel-unit")?.textContent || "";
    if ($("exp-memo")) $("exp-memo").textContent = memo;
  }

  async function exportPdf() {
    try {
      if (typeof html2canvas === "undefined") {
        toast("PDFライブラリが読み込めていません");
        return;
      }
      if (!window.jspdf || !window.jspdf.jsPDF) {
        toast("PDFライブラリが読み込めていません");
        return;
      }

      fillExportSheet();

      const sheet = $("exportSheet");
      if (!sheet) {
        toast("PDF出力エリアが見つかりません");
        return;
      }

      const canvas = await html2canvas(sheet, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.98);
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF("p", "mm", "a4");

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();
      const margin = 6;
      const usableW = pageW - margin * 2;
      const usableH = pageH - margin * 2;

      pdf.addImage(imgData, "JPEG", margin, margin, usableW, usableH);

      const filename = buildCustomerFileName("pdf");
      pdf.save(filename);
      toast("PDFを書き出しました");
    } catch (err) {
      console.error(err);
      toast("PDF出力に失敗しました");
    }
  }

  async function exportImage() {
    try {
      if (typeof html2canvas === "undefined") {
        toast("画像出力ライブラリが読み込めていません");
        return;
      }

      fillExportSheet();

      const sheet = $("exportSheet");
      if (!sheet) {
        toast("出力エリアが見つかりません");
        return;
      }

      const canvas = await html2canvas(sheet, {
        backgroundColor: "#ffffff",
        scale: 2,
        useCORS: true
      });

      const blob = await new Promise((resolve) => {
        canvas.toBlob(resolve, "image/jpeg", 0.95);
      });

      if (!blob) {
        toast("画像出力に失敗しました");
        return;
      }

      const filename = buildCustomerFileName("jpg");
      await saveBlobAsFile(blob, filename);
      toast("画像を書き出しました");
    } catch (err) {
      console.error(err);
      toast("画像出力に失敗しました");
    }
  }

  const resetBtn = $("resetBtn");
  const pdfBtn = $("pdfBtn");
  const imageBtn = $("imageBtn");

  if (resetBtn) {
    resetBtn.addEventListener("click", () => {
      if (confirm("カスタマイズを初期状態に戻しますか？")) resetAll();
    });
  }

  if (pdfBtn) {
    pdfBtn.addEventListener("click", exportPdf);
  }

  if (imageBtn) {
    imageBtn.addEventListener("click", exportImage);
  }

  renderControls();
  resetAll();
});
