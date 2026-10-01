/* Céu ao vivo da landing.
   As posições vêm de window.SU_SKY (assets.js), calculadas com o XALEN — o mesmo motor do app —
   em amostras regulares. Aqui só se interpola entre essas amostras (Lagrange de 6 pontos) para o
   instante atual. A exatidão da interpolação é verificada em tests/landing/generate-assets.test.ts. */
(function (root) {
  var DAY = 86400000;
  var SIGNS = ["aries", "taurus", "gemini", "cancer", "leo", "virgo", "libra", "scorpio", "sagittarius", "capricorn", "aquarius", "pisces"];
  var ORDER = 6, HALF = 2; // usa as amostras i-2 … i+3 em volta do instante

  function norm(x) { x %= 360; return x < 0 ? x + 360 : x; }

  /* Séries guardadas como diferenças em segundos de arco (longitudes "desenroladas"). */
  function decode(series) {
    if (series._v) return series._v;
    var d = series.d, v = new Array(d.length), acc = 0;
    for (var i = 0; i < d.length; i++) { acc += d[i]; v[i] = acc / 3600; }
    series._v = v;
    return v;
  }

  /* Valor e derivada (por dia) do polinômio de Lagrange na posição fracionária s (em passos). */
  function lagrange(v, s, stepDays) {
    var i0 = Math.floor(s) - HALF;
    if (i0 < 0 || i0 + ORDER > v.length) return null;
    var x = s - i0, val = 0, der = 0;
    for (var j = 0; j < ORDER; j++) {
      var num = 1, den = 1, dsum = 0;
      for (var k = 0; k < ORDER; k++) {
        if (k === j) continue;
        num *= x - k; den *= j - k;
      }
      for (var m = 0; m < ORDER; m++) {
        if (m === j) continue;
        var p = 1;
        for (var k2 = 0; k2 < ORDER; k2++) if (k2 !== j && k2 !== m) p *= x - k2;
        dsum += p;
      }
      val += v[i0 + j] * num / den;
      der += v[i0 + j] * dsum / den;
    }
    return { value: val, speed: der / stepDays };
  }

  /* Céu no instante `ms` (Date.now()). Devolve null fora do período da tabela. */
  function at(sky, ms) {
    if (!sky || !sky.series) return null;
    var out = { bodies: {} };
    for (var id in sky.series) {
      var s = sky.series[id];
      var pos = (ms - sky.t0) / (s.step * DAY);
      var r = lagrange(decode(s), pos, s.step);
      if (!r) return null;
      if (id === "moonLat") { out.moonLat = r.value; continue; }
      var lon = norm(r.value);
      out.bodies[id] = { lon: lon, speed: r.speed, retrograde: r.speed < 0, sign: SIGNS[Math.floor(lon / 30)], deg: lon % 30 };
    }
    var sun = out.bodies.sun, moon = out.bodies.moon;
    if (sun && moon) {
      /* Mesmas regras de src/lib/astro/moon.ts: elongação λ☾−λ☉, setores de 45°,
         iluminação k = (1 − cos β☾·cos e)/2. */
      var e = norm(moon.lon - sun.lon), rad = Math.PI / 180;
      out.elongation = e;
      out.phaseIndex = Math.floor(norm(e + 22.5) / 45) % 8;
      out.illumination = (1 - Math.cos((out.moonLat || 0) * rad) * Math.cos(e * rad)) / 2;
      out.waxing = e < 180;
    }
    return out;
  }

  /* Próxima mudança de signo de um corpo, a partir de `ms` (busca por hora + bissecção). */
  function nextIngress(sky, id, ms, maxDays) {
    var start = at(sky, ms);
    if (!start) return null;
    var sign = start.bodies[id].sign, t = ms, lim = ms + (maxDays || 40) * DAY, H = 3600000;
    while (t < lim) {
      var c = at(sky, t + H);
      if (!c) return null;
      if (c.bodies[id].sign !== sign) {
        var lo = t, hi = t + H;
        while (hi - lo > 1000) { var mid = (lo + hi) / 2; if (at(sky, mid).bodies[id].sign === sign) lo = mid; else hi = mid; }
        return { ms: hi, sign: c.bodies[id].sign };
      }
      t += H;
    }
    return null;
  }

  root.SU_SKY_LIB = { at: at, nextIngress: nextIngress, SIGNS: SIGNS };
})(typeof window !== "undefined" ? window : globalThis);
