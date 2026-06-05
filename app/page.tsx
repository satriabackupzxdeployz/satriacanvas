"use client";
import { useEffect, useRef, useState, useCallback } from "react";

type LobbyItem = { id: number; img: string };
type GenResult = { image: string; username: string; lobby: number };

const _0x = (s: string) => s.split("").reverse().join("");
const _shield = () => { if (typeof window === "undefined") return; };
_shield();

export default function Home() {
  const [lobbies, setLobbies] = useState<LobbyItem[]>([]);
  const [username, setUsername] = useState("");
  const [selectedLobby, setSelectedLobby] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<GenResult | null>(null);
  const [err, setErr] = useState("");
  const [page, setPage] = useState(1);
  const outputRef = useRef<HTMLDivElement>(null);
  const PER_PAGE = 10;

  useEffect(() => {
    fetch("/api/lobbies")
      .then((r) => r.json())
      .then((d) => setLobbies(d.lobbies ?? []));
  }, []);

  useEffect(() => {
    const block = (e: Event) => e.preventDefault();
    const blockKey = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && ["s","u","c","a"].includes(e.key.toLowerCase())) e.preventDefault();
      if (e.key === "F12" || (e.ctrlKey && e.shiftKey && ["i","j"].includes(e.key.toLowerCase()))) e.preventDefault();
    };
    document.addEventListener("contextmenu", block);
    document.addEventListener("keydown", blockKey);
    return () => { document.removeEventListener("contextmenu", block); document.removeEventListener("keydown", blockKey); };
  }, []);

  const handleGenerate = useCallback(async () => {
    if (!username.trim()) { setErr("Username wajib diisi!"); return; }
    setErr(""); setLoading(true); setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), lobby: selectedLobby }),
      });
      const data = await res.json();
      if (!res.ok) { setErr(data.error || "Gagal generate"); }
      else {
        setResult(data);
        setTimeout(() => outputRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
      }
    } catch { setErr("Koneksi error"); }
    finally { setLoading(false); }
  }, [username, selectedLobby]);

  const handleDownload = useCallback(() => {
    if (!result) return;
    const a = document.createElement("a");
    a.href = result.image;
    a.download = `${result.username}_lobby${result.lobby}_SatriaFF.jpg`;
    a.click();
  }, [result]);

  const totalPages = Math.ceil(lobbies.length / PER_PAGE);
  const visibleLobbies = lobbies.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <main style={{ minHeight: "100vh", background: "#000", padding: "0 0 60px 0", position: "relative", overflow: "hidden" }}>
      <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 0, background: "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(245,166,35,0.07) 0%, transparent 70%)" }} />
      <div style={{ position: "fixed", top: 0, left: 0, right: 0, height: "2px", background: "linear-gradient(90deg,transparent,#f5a623,#ffd700,#f5a623,transparent)", zIndex: 10 }} />

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 20px", position: "relative", zIndex: 1 }}>

        <header style={{ textAlign: "center", padding: "48px 0 36px" }}>
          <div style={{ display: "inline-block", position: "relative" }}>
            <h1 style={{
              fontFamily: "'Orbitron', sans-serif",
              fontSize: "clamp(32px, 6vw, 56px)",
              fontWeight: 900,
              letterSpacing: "0.12em",
              background: "linear-gradient(135deg, #fff9e6 0%, #ffd700 40%, #f5a623 70%, #ff6b00 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
              textTransform: "uppercase",
              animation: "flicker 4s infinite",
            }}>SatriaFF</h1>
            <div style={{ height: 2, background: "linear-gradient(90deg,transparent,#f5a623,transparent)", marginTop: 8 }} />
          </div>
          <p style={{ color: "#666", fontFamily: "'Rajdhani',sans-serif", fontSize: 14, letterSpacing: "0.25em", marginTop: 10, textTransform: "uppercase" }}>Free Fire Lobby Card Generator</p>
        </header>

        <section style={{
          background: "#0c0c0c",
          border: "1px solid #1e1e1e",
          borderRadius: 4,
          padding: "32px 28px",
          marginBottom: 28,
          position: "relative",
          animation: "fadeUp 0.5s ease both",
        }}>
          <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(245,166,35,0.5),transparent)" }} />

          <label style={{ display: "block", fontFamily: "'Orbitron',sans-serif", fontSize: 11, letterSpacing: "0.2em", color: "#f5a623", marginBottom: 10, textTransform: "uppercase" }}>Username</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value.slice(0, 20))}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="Masukkan username..."
            maxLength={20}
            style={{
              width: "100%",
              background: "#070707",
              border: "1px solid #252525",
              borderRadius: 3,
              padding: "13px 16px",
              color: "#e8e8e8",
              fontFamily: "'Rajdhani',sans-serif",
              fontSize: 18,
              fontWeight: 600,
              outline: "none",
              letterSpacing: "0.05em",
              transition: "border-color 0.2s",
            }}
            onFocus={(e) => (e.target.style.borderColor = "#f5a623")}
            onBlur={(e) => (e.target.style.borderColor = "#252525")}
          />
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
            <span style={{ fontSize: 12, color: "#333" }}>{_0x("retkarakak tes akituB")}</span>
            <span style={{ fontSize: 12, color: username.length >= 18 ? "#f5a623" : "#333" }}>{username.length}/20</span>
          </div>

          <label style={{ display: "block", fontFamily: "'Orbitron',sans-serif", fontSize: 11, letterSpacing: "0.2em", color: "#f5a623", marginBottom: 10, marginTop: 24, textTransform: "uppercase" }}>Pilih Nomor Lobby</label>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <button
              onClick={() => setSelectedLobby(null)}
              style={{
                padding: "8px 14px",
                background: selectedLobby === null ? "#f5a623" : "#0e0e0e",
                border: `1px solid ${selectedLobby === null ? "#f5a623" : "#252525"}`,
                borderRadius: 3,
                color: selectedLobby === null ? "#000" : "#666",
                fontFamily: "'Orbitron',sans-serif",
                fontSize: 10,
                fontWeight: 700,
                letterSpacing: "0.1em",
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >RANDOM</button>
            {Array.from({ length: 30 }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setSelectedLobby(n === selectedLobby ? null : n)}
                style={{
                  width: 38,
                  height: 38,
                  background: selectedLobby === n ? "#f5a623" : "#0e0e0e",
                  border: `1px solid ${selectedLobby === n ? "#f5a623" : "#252525"}`,
                  borderRadius: 3,
                  color: selectedLobby === n ? "#000" : "#888",
                  fontFamily: "'Orbitron',sans-serif",
                  fontSize: 11,
                  fontWeight: 700,
                  cursor: "pointer",
                  transition: "all 0.15s",
                }}
              >{n}</button>
            ))}
          </div>

          {err && (
            <div style={{ marginTop: 16, padding: "10px 14px", background: "rgba(255,59,59,0.08)", border: "1px solid rgba(255,59,59,0.3)", borderRadius: 3, color: "#ff6b6b", fontSize: 13, fontFamily: "'Rajdhani',sans-serif" }}>
              ⚠ {err}
            </div>
          )}

          <button
            onClick={handleGenerate}
            disabled={loading}
            style={{
              marginTop: 24,
              width: "100%",
              padding: "15px 0",
              background: loading ? "#1a1a1a" : "linear-gradient(135deg, #f5a623 0%, #ff6b00 100%)",
              border: "none",
              borderRadius: 3,
              color: loading ? "#555" : "#000",
              fontFamily: "'Orbitron',sans-serif",
              fontSize: 14,
              fontWeight: 900,
              letterSpacing: "0.2em",
              textTransform: "uppercase",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              animation: loading ? "none" : "glow-pulse 2s infinite",
            }}
          >
            {loading ? "MEMPROSES..." : "⚡ PROSES"}
          </button>
        </section>

        {result && (
          <section ref={outputRef} style={{
            background: "#0c0c0c",
            border: "1px solid #1e1e1e",
            borderRadius: 4,
            padding: "28px",
            marginBottom: 28,
            animation: "spin-in 0.4s cubic-bezier(.22,.68,0,1.2) both",
            position: "relative",
          }}>
            <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: "linear-gradient(90deg,transparent,rgba(245,166,35,0.6),transparent)" }} />
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, letterSpacing: "0.2em", color: "#f5a623", textTransform: "uppercase" }}>Output</span>
              <span style={{ fontSize: 12, color: "#444", fontFamily: "'Rajdhani',sans-serif" }}>Lobby #{result.lobby} · {result.username}</span>
            </div>
            <div style={{ position: "relative", borderRadius: 3, overflow: "hidden", border: "1px solid #1a1a1a" }}>
              <img
                src={result.image}
                alt="result"
                style={{ width: "100%", display: "block", borderRadius: 3 }}
                draggable={false}
              />
              <div style={{ position: "absolute", inset: 0, background: "transparent" }} />
            </div>
            <button
              onClick={handleDownload}
              style={{
                marginTop: 16,
                width: "100%",
                padding: "13px 0",
                background: "#0e0e0e",
                border: "1px solid #f5a623",
                borderRadius: 3,
                color: "#f5a623",
                fontFamily: "'Orbitron',sans-serif",
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { (e.target as HTMLButtonElement).style.background = "#f5a623"; (e.target as HTMLButtonElement).style.color = "#000"; }}
              onMouseLeave={(e) => { (e.target as HTMLButtonElement).style.background = "#0e0e0e"; (e.target as HTMLButtonElement).style.color = "#f5a623"; }}
            >↓ DOWNLOAD</button>
          </section>
        )}

        <section style={{
          background: "#0c0c0c",
          border: "1px solid #1e1e1e",
          borderRadius: 4,
          overflow: "hidden",
          animation: "fadeUp 0.6s ease 0.1s both",
        }}>
          <div style={{ position: "relative", padding: "18px 24px", borderBottom: "1px solid #1a1a1a", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 11, letterSpacing: "0.2em", color: "#f5a623", textTransform: "uppercase" }}>Daftar Lobby</span>
            <span style={{ fontSize: 12, color: "#444", fontFamily: "'Rajdhani',sans-serif" }}>{lobbies.length} lobby tersedia</span>
          </div>

          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#090909" }}>
                  {["No", "Preview", "Nama Lobby"].map((h) => (
                    <th key={h} style={{ padding: "12px 16px", textAlign: "left", fontFamily: "'Orbitron',sans-serif", fontSize: 10, letterSpacing: "0.15em", color: "#555", textTransform: "uppercase", borderBottom: "1px solid #141414", fontWeight: 600 }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleLobbies.map((lb, idx) => (
                  <tr
                    key={lb.id}
                    onClick={() => setSelectedLobby(lb.id === selectedLobby ? null : lb.id)}
                    style={{
                      background: selectedLobby === lb.id ? "rgba(245,166,35,0.06)" : idx % 2 === 0 ? "#0a0a0a" : "#080808",
                      cursor: "pointer",
                      borderBottom: "1px solid #111",
                      transition: "background 0.15s",
                    }}
                    onMouseEnter={(e) => { if (selectedLobby !== lb.id) (e.currentTarget as HTMLTableRowElement).style.background = "#0f0f0f"; }}
                    onMouseLeave={(e) => { (e.currentTarget as HTMLTableRowElement).style.background = selectedLobby === lb.id ? "rgba(245,166,35,0.06)" : idx % 2 === 0 ? "#0a0a0a" : "#080808"; }}
                  >
                    <td style={{ padding: "10px 16px", fontFamily: "'Orbitron',sans-serif", fontSize: 12, color: selectedLobby === lb.id ? "#f5a623" : "#555", fontWeight: 700, width: 50 }}>
                      {String(lb.id).padStart(2, "0")}
                    </td>
                    <td style={{ padding: "8px 16px", width: 100 }}>
                      <div style={{ width: 80, height: 50, borderRadius: 3, overflow: "hidden", border: `1px solid ${selectedLobby === lb.id ? "#f5a623" : "#1a1a1a"}`, transition: "border-color 0.15s", position: "relative" }}>
                        <img src={lb.img} alt={`Lobby ${lb.id}`} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} draggable={false} />
                        <div style={{ position: "absolute", inset: 0 }} />
                      </div>
                    </td>
                    <td style={{ padding: "10px 16px", fontFamily: "'Rajdhani',sans-serif", fontSize: 15, color: selectedLobby === lb.id ? "#f5a623" : "#777", fontWeight: 600, letterSpacing: "0.05em" }}>
                      Lobby {lb.id} {selectedLobby === lb.id && <span style={{ fontSize: 11, color: "#f5a623", marginLeft: 6, fontFamily: "'Orbitron',sans-serif" }}>✓ DIPILIH</span>}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div style={{ padding: "14px 20px", borderTop: "1px solid #111", display: "flex", justifyContent: "center", gap: 6, alignItems: "center" }}>
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "6px 12px", background: "#0e0e0e", border: "1px solid #1e1e1e", borderRadius: 3, color: page === 1 ? "#333" : "#888", fontFamily: "'Orbitron',sans-serif", fontSize: 10, cursor: page === 1 ? "not-allowed" : "pointer", letterSpacing: "0.1em" }}>‹ PREV</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)} style={{ width: 32, height: 32, background: p === page ? "#f5a623" : "#0e0e0e", border: `1px solid ${p === page ? "#f5a623" : "#1e1e1e"}`, borderRadius: 3, color: p === page ? "#000" : "#666", fontFamily: "'Orbitron',sans-serif", fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} style={{ padding: "6px 12px", background: "#0e0e0e", border: "1px solid #1e1e1e", borderRadius: 3, color: page === totalPages ? "#333" : "#888", fontFamily: "'Orbitron',sans-serif", fontSize: 10, cursor: page === totalPages ? "not-allowed" : "pointer", letterSpacing: "0.1em" }}>NEXT ›</button>
            </div>
          )}
        </section>

        <footer style={{ textAlign: "center", marginTop: 36, paddingBottom: 8 }}>
          <p style={{ fontFamily: "'Orbitron',sans-serif", fontSize: 10, color: "#282828", letterSpacing: "0.3em" }}>SATRIAFF · LOBBY GENERATOR</p>
        </footer>
      </div>
    </main>
  );
}
