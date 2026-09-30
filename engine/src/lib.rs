//! su-ephem — camada fina do Seu Universo sobre o XALEN Ephemeris.
//!
//! Não reimplementa astronomia: toda posição e toda geometria de casas vem do
//! XALEN. O que este crate acrescenta é a escolha do referencial das casas:
//! `xalen_houses::compute_houses` usa tempo sideral MÉDIO (GMST) e a obliquidade
//! que o chamador passar; os bindings oficiais passam a obliquidade MÉDIA. Os
//! planetas do XALEN são aparentes (equinócio verdadeiro de data, com nutação).
//! Para casas e planetas no mesmo referencial, seguimos a recomendação do próprio
//! XALEN (doc de `compute_houses`): RAMC a partir do tempo sideral APARENTE
//! (GAST) e obliquidade VERDADEIRA, via `compute_houses_from_ramc`.
//! Medição (docs/DECISIONS.md, Fase 2): sem isso o ASC diverge até ~0,019° em
//! |lat| ≤ 60° e ~0,135° em 60°–66°.

use serde::Serialize;
use std::f64::consts::TAU;
use xalen_coords::{gast_rad, mean_obliquity, nutation_2000b};
use xalen_ephem::{Almanac, Body};
use xalen_houses::{GeoLocation, HouseSystem, compute_houses_from_ramc};
use xalen_time::{DeltaTModel, JdUT1, delta_t};

#[cfg(target_arch = "wasm32")]
use wasm_bindgen::prelude::*;

pub const XALEN_COMMIT: &str = "cc6edbec1f748ebdc4950ae6198f575c5ada73fa";
const DELTA_T_MODEL: DeltaTModel = DeltaTModel::StephensonMorrisonHohenkerk2016;

/// Corpos calculados, com as chaves usadas no JSON do mapa.
pub const BODIES: &[(&str, Body)] = &[
    ("sun", Body::Sun),
    ("moon", Body::Moon),
    ("mercury", Body::Mercury),
    ("venus", Body::Venus),
    ("mars", Body::Mars),
    ("jupiter", Body::Jupiter),
    ("saturn", Body::Saturn),
    ("uranus", Body::Uranus),
    ("neptune", Body::Neptune),
    ("pluto", Body::Pluto),
    ("mean_node", Body::MeanNode),
    ("true_node", Body::TrueNode),
    ("chiron", Body::Chiron),
    ("mean_lilith", Body::MeanApogee),
];

#[derive(Serialize)]
pub struct BodyPosition {
    /// Longitude eclíptica aparente geocêntrica, graus [0, 360), equinócio de data.
    pub longitude: f64,
    pub latitude: f64,
    /// Distância em UA.
    pub distance: f64,
    /// Velocidade em longitude, graus/dia.
    pub speed: f64,
    pub retrograde: bool,
}

#[derive(Serialize)]
pub struct Houses {
    pub requested_system: &'static str,
    /// Sistema efetivamente usado (difere do pedido no fallback polar do XALEN).
    pub effective_system: &'static str,
    pub fallback_used: bool,
    /// Cúspides 1..12 em graus.
    pub cusps: Vec<f64>,
    pub ascendant: f64,
    pub mc: f64,
    pub descendant: f64,
    pub ic: f64,
    pub vertex: f64,
}

#[derive(Serialize)]
pub struct TimeInfo {
    pub jd_ut: f64,
    pub jd_tt: f64,
    pub delta_t_seconds: f64,
    pub obliquity_true_deg: f64,
    pub gast_deg: f64,
}

#[derive(Serialize)]
pub struct Chart {
    pub engine: EngineInfo,
    pub time: TimeInfo,
    pub bodies: Vec<(&'static str, BodyPosition)>,
    pub houses: Option<Houses>,
    pub ramc_deg: Option<f64>,
}

#[derive(Serialize)]
pub struct EngineInfo {
    pub name: &'static str,
    pub xalen_commit: &'static str,
    pub wrapper: &'static str,
    pub method: &'static str,
    pub house_frame: &'static str,
}

fn engine_info() -> EngineInfo {
    EngineInfo {
        name: "xalen",
        xalen_commit: XALEN_COMMIT,
        wrapper: concat!("su-ephem ", env!("CARGO_PKG_VERSION")),
        method: "analytical",
        house_frame: "gast+true_obliquity",
    }
}

fn check(jd: f64, lat: f64, lon: f64) -> Result<(), String> {
    if !jd.is_finite() {
        return Err(format!("jd inválido: {jd}"));
    }
    if !lat.is_finite() || !(-90.0..=90.0).contains(&lat) {
        return Err(format!("latitude inválida: {lat}"));
    }
    if !lon.is_finite() || !(-180.0..=180.0).contains(&lon) {
        return Err(format!("longitude inválida: {lon}"));
    }
    Ok(())
}

fn parse_system(s: &str) -> Result<(HouseSystem, &'static str), String> {
    match s {
        "placidus" => Ok((HouseSystem::Placidus, "placidus")),
        "whole_sign" => Ok((HouseSystem::WholeSign, "whole_sign")),
        "equal" => Ok((HouseSystem::Equal, "equal")),
        "porphyry" => Ok((HouseSystem::Porphyry, "porphyry")),
        other => Err(format!("sistema de casas não suportado: {other}")),
    }
}

pub fn time_info(jd_ut: f64) -> TimeInfo {
    let dt = delta_t(jd_ut, &DELTA_T_MODEL);
    let jd_tt = jd_ut + dt / 86_400.0;
    let t = (jd_tt - 2_451_545.0) / 36_525.0;
    let eps = mean_obliquity(t) + nutation_2000b(t).delta_epsilon;
    TimeInfo {
        jd_ut,
        jd_tt,
        delta_t_seconds: dt,
        obliquity_true_deg: eps.to_degrees(),
        gast_deg: gast_rad(jd_ut, t).to_degrees().rem_euclid(360.0),
    }
}

pub fn body_position(almanac: &Almanac, body: Body, jd_ut: f64) -> Result<BodyPosition, String> {
    let jd = JdUT1(jd_ut);
    let pos = almanac.geocentric_ecliptic(body, jd).map_err(|e| e.to_string())?;
    let speed = almanac.geocentric_speed(body, jd).map_err(|e| e.to_string())?;
    Ok(BodyPosition {
        longitude: pos.longitude.to_degrees().rem_euclid(360.0),
        latitude: pos.latitude.to_degrees(),
        distance: pos.distance,
        speed: speed.longitude_deg_per_day(),
        retrograde: speed.longitude < 0.0,
    })
}

pub fn houses(jd_ut: f64, lat: f64, lon: f64, system: &str) -> Result<(Houses, f64), String> {
    check(jd_ut, lat, lon)?;
    let (sys, name) = parse_system(system)?;
    let ti = time_info(jd_ut);
    let ramc = (ti.gast_deg.to_radians() + lon.to_radians()).rem_euclid(TAU);
    let h = compute_houses_from_ramc(
        ramc,
        &GeoLocation::new(lat, lon),
        ti.obliquity_true_deg.to_radians(),
        sys,
    );
    let deg = |r: f64| r.to_degrees().rem_euclid(360.0);
    Ok((
        Houses {
            requested_system: name,
            effective_system: if h.fallback_used { "porphyry" } else { name },
            fallback_used: h.fallback_used,
            cusps: h.cusps.iter().map(|&c| deg(c)).collect(),
            ascendant: deg(h.ascendant),
            mc: deg(h.mc),
            descendant: deg(h.descendant),
            ic: deg(h.ic),
            vertex: deg(h.vertex),
        },
        ramc.to_degrees(),
    ))
}

pub fn chart(jd_ut: f64, lat: f64, lon: f64, system: &str, with_houses: bool) -> Result<Chart, String> {
    check(jd_ut, lat, lon)?;
    let almanac = Almanac::default_vedic(); // provedor analítico VSOP87/ELP2000 (nome é do XALEN)
    let mut bodies = Vec::with_capacity(BODIES.len());
    for &(key, body) in BODIES {
        bodies.push((key, body_position(&almanac, body, jd_ut)?));
    }
    let (houses, ramc_deg) = if with_houses {
        let (h, r) = houses(jd_ut, lat, lon, system)?;
        (Some(h), Some(r))
    } else {
        (None, None)
    };
    Ok(Chart { engine: engine_info(), time: time_info(jd_ut), bodies, houses, ramc_deg })
}

// ---------------------------------------------------------------------------
// API WASM
// ---------------------------------------------------------------------------

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "chartJson")]
pub fn chart_json(jd_ut: f64, lat: f64, lon: f64, system: &str, with_houses: bool) -> Result<String, String> {
    serde_json::to_string(&chart(jd_ut, lat, lon, system, with_houses)?).map_err(|e| e.to_string())
}

/// Posição de um corpo pela chave (`sun`, `moon`, …). Usado para Lua/trânsitos.
#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "bodyJson")]
pub fn body_json(jd_ut: f64, key: &str) -> Result<String, String> {
    if !jd_ut.is_finite() {
        return Err(format!("jd inválido: {jd_ut}"));
    }
    let body = BODIES
        .iter()
        .find(|(k, _)| *k == key)
        .map(|(_, b)| *b)
        .ok_or_else(|| format!("corpo desconhecido: {key}"))?;
    let p = body_position(&Almanac::default_vedic(), body, jd_ut)?;
    serde_json::to_string(&p).map_err(|e| e.to_string())
}

#[cfg(target_arch = "wasm32")]
#[wasm_bindgen(js_name = "engineInfoJson")]
pub fn engine_info_json() -> String {
    serde_json::to_string(&engine_info()).unwrap_or_default()
}

#[cfg(test)]
mod tests {
    use super::*;
    use xalen_houses::compute_houses;

    #[test]
    fn mc_e_asc_proximos_do_caminho_gmst_do_xalen() {
        // Mesmo local/época: a diferença deve ser só o ajuste de referencial.
        let jd = 2_451_545.0;
        let (h, _) = houses(jd, -23.5505, -46.6333, "placidus").unwrap();
        let t = (jd - 2_451_545.0) / 36_525.0;
        let x = compute_houses(jd, &GeoLocation::new(-23.5505, -46.6333), mean_obliquity(t), HouseSystem::Placidus);
        let d = (h.mc - x.mc.to_degrees()).abs();
        assert!(d < 0.01, "MC difere {d}°");
    }

    #[test]
    fn fallback_polar_reporta_sistema_efetivo() {
        let (h, _) = houses(2_451_545.0, 69.65, 18.96, "placidus").unwrap();
        assert!(h.fallback_used);
        assert_eq!(h.effective_system, "porphyry");
    }

    #[test]
    fn deterministico() {
        let a = serde_json::to_string(&chart(2_460_000.3, 10.0, 20.0, "placidus", true).unwrap()).unwrap();
        let b = serde_json::to_string(&chart(2_460_000.3, 10.0, 20.0, "placidus", true).unwrap()).unwrap();
        assert_eq!(a, b);
    }

    #[test]
    fn rejeita_entradas_invalidas() {
        assert!(houses(f64::NAN, 0.0, 0.0, "placidus").is_err());
        assert!(houses(2_451_545.0, 91.0, 0.0, "placidus").is_err());
        assert!(houses(2_451_545.0, 0.0, 181.0, "placidus").is_err());
        assert!(houses(2_451_545.0, 0.0, 0.0, "koch").is_err());
    }
}
