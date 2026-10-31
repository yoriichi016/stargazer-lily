import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { Volume2, VolumeX, Heart } from "lucide-react";
import "./style.css";

function PixelLily({ bloom = false }) {
  return (
    <svg className={`lily ${bloom ? "lily-bloom" : ""}`} viewBox="0 0 180 180" role="img" aria-label="Pixel art stargazer lily">
      <g shapeRendering="crispEdges">
        {/* stem and leaves */}
        <rect x="86" y="104" width="8" height="58" fill="#527b50" />
        <path d="M88 137 H60 V129 H43 V121 H35 V113 H52 V121 H69 V129 H88Z" fill="#65935b"/>
        <path d="M92 147 H116 V139 H132 V131 H142 V123 H126 V131 H110 V139 H92Z" fill="#507e4d"/>
        <path d="M88 158 H70 V150 H59 V142 H76 V150 H88Z" fill="#78a968"/>
        <g className="petals">
        {/* flower petals */}
        <path d="M87 78 H73 V64 H64 V48 H69 V34 H82 V43 H90 V60 H98 V43 H111 V34 H116 V48 H107 V64 H98 V78Z" fill="#f5a5b5"/>
        <path d="M78 70 H66 V59 H59 V45 H68 V54 H77 V62 H87 V78Z" fill="#ffd1d5"/>
        <path d="M102 70 H114 V59 H121 V45 H112 V54 H103 V62 H93 V78Z" fill="#f7bdc6"/>
        <path d="M88 78 H72 V87 H65 V99 H77 V106 H90 V95 H101 V106 H115 V99 H108 V87 H94 V78Z" fill="#e87891"/>
        <path d="M89 77 H78 V85 H72 V94 H82 V101 H91 V91 H100 V101 H109 V94 H103 V85 H96 V77Z" fill="#f6b3bf"/>
        {/* petal highlights */}
        <rect x="74" y="43" width="8" height="8" fill="#fff0e9"/>
        <rect x="106" y="43" width="8" height="8" fill="#fff0e9"/>
        <rect x="64" y="61" width="8" height="6" fill="#fff0e9"/>
        <rect x="109" y="61" width="8" height="6" fill="#fff0e9"/>
        {/* stamens */}
        <rect x="88" y="72" width="4" height="25" fill="#e9a63e"/>
        <rect x="79" y="76" width="4" height="19" fill="#e9a63e"/>
        <rect x="98" y="76" width="4" height="19" fill="#e9a63e"/>
        <rect x="85" y="69" width="8" height="6" fill="#7c354b"/>
        <rect x="76" y="73" width="8" height="6" fill="#7c354b"/>
        <rect x="96" y="73" width="8" height="6" fill="#7c354b"/>
        <rect x="85" y="95" width="8" height="5" fill="#e9a63e"/>
        {/* pixel speckles */}
        <rect x="67" y="77" width="4" height="4" fill="#a83d5c"/>
        <rect x="111" y="77" width="4" height="4" fill="#a83d5c"/>
        <rect x="77" y="89" width="4" height="4" fill="#a83d5c"/>
        <rect x="102" y="89" width="4" height="4" fill="#a83d5c"/>
        </g>
      </g>
    </svg>
  );
}

/* ---------- letters ---------- */
const EMPTY_LETTER = { to: "", msg: "", from: "" };

const encodeLetter = (l) => {
  try { return btoa(unescape(encodeURIComponent(JSON.stringify(l)))); } catch { return ""; }
};
const decodeLetter = (s) => {
  try {
    const o = JSON.parse(decodeURIComponent(escape(atob(s))));
    return {
      to: String(o.to || "").slice(0, 40),
      msg: String(o.msg || "").slice(0, 700),
      from: String(o.from || "").slice(0, 40),
    };
  } catch { return null; }
};
const readSharedLetter = () => {
  const m = window.location.hash.match(/^#letter=(.+)$/);
  return m ? decodeLetter(decodeURIComponent(m[1])) : null;
};
const sharedLetter = readSharedLetter();
const loadDraft = () => {
  try { return { ...EMPTY_LETTER, ...JSON.parse(localStorage.getItem("lily-letter-draft") || "{}") }; }
  catch { return EMPTY_LETTER; }
};

function MailView({ letter, received, onEdit, onWriteOwn, onBack }) {
  const [phase, setPhase] = useState("closed"); // closed -> opening -> reading
  const [shown, setShown] = useState(0);
  const [copied, setCopied] = useState(false);
  const msg = letter.msg.trim() ? letter.msg : "(an empty letter... how mysterious ♡)";

  const open = () => {
    if (phase !== "closed") return;
    setPhase("opening");
    setTimeout(() => setPhase("reading"), 1300);
  };

  useEffect(() => {
    if (phase !== "reading") return;
    setShown(0);
    const step = Math.max(1, Math.ceil(msg.length / 160));
    const id = setInterval(() => {
      setShown((n) => {
        if (n >= msg.length) { clearInterval(id); return n; }
        return Math.min(n + step, msg.length);
      });
    }, 28);
    return () => clearInterval(id);
  }, [phase, msg]);

  const copyLink = async () => {
    const url = `${window.location.origin}${window.location.pathname}#letter=${encodeURIComponent(encodeLetter(letter))}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link:", url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  if (phase !== "reading") {
    return (
      <div className={`mail ${phase}`}>
        <p className="mail-title">{received ? "You've got mail ♡" : "Your letter is sealed ♡"}</p>
        <button className={`mail-envelope ${phase === "opening" ? "open" : ""}`} onClick={open} aria-label="Open the letter">
          <span className="m-back" />
          <span className="m-paper"><i /><i /><i /><i /></span>
          <span className="m-front" />
          <span className="m-flap" />
          <Heart className="m-seal" fill="currentColor" />
        </button>
        <p className="hint">{phase === "closed" ? "tap the envelope to open" : "opening..."}</p>
      </div>
    );
  }

  const done = shown >= msg.length;
  return (
    <div className="mail-read">
      <div className="sheet">
        <p className="sheet-to">{letter.to ? `Dear ${letter.to},` : "Dear you,"}</p>
        <p className="sheet-msg">{msg.slice(0, shown)}{!done && <span className="caret">▌</span>}</p>
        {done && <p className="sheet-from">With love,<br />{letter.from || "someone who adores you"} ♥</p>}
      </div>
      {done && (
        <div className="mail-actions">
          {received ? (
            <button onClick={onWriteOwn}>WRITE YOUR OWN</button>
          ) : (
            <>
              <button onClick={onEdit}>EDIT</button>
              <button onClick={copyLink}>{copied ? "COPIED! ♡" : "COPY LINK"}</button>
              <button onClick={onBack}>HOME</button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function App() {
  const [stage, setStage] = useState(sharedLetter ? "mail" : "intro");
  const [noCount, setNoCount] = useState(0);
  const [sound, setSound] = useState(false);
  const [hearts, setHearts] = useState([]);
  const [opening, setOpening] = useState(false);
  const [burst, setBurst] = useState([]);
  const [letter, setLetter] = useState(sharedLetter || loadDraft);
  const [received, setReceived] = useState(!!sharedLetter);
  const [mailKey, setMailKey] = useState(0);

  useEffect(() => {
    if (received) return;
    try { localStorage.setItem("lily-letter-draft", JSON.stringify(letter)); } catch {}
  }, [letter, received]);

  const updateLetter = (patch) => setLetter((l) => ({ ...l, ...patch }));
  const sealLetter = () => { setMailKey((k) => k + 1); setStage("mail"); };
  const writeOwn = () => {
    window.history.replaceState(null, "", window.location.pathname + window.location.search);
    setReceived(false);
    setLetter(loadDraft());
    setStage("compose");
  };

  useEffect(() => {
    const bits = Array.from({ length: 28 }, (_, i) => ({
      id: i, left: `${(i * 37 + 9) % 97}%`,
      delay: `${(i % 9) * -1.7}s`, duration: `${9 + (i % 7)}s`,
      size: 8 + (i % 4) * 3
    }));
    setHearts(bits);
  }, []);

  const dodgeNo = () => setNoCount((n) => n + 1);
  const openLetter = () => {
    if (opening) return;
    setOpening(true);
    setTimeout(() => { setStage("letter"); setOpening(false); }, 750);
  };
  const accept = () => {
    setBurst(Array.from({ length: 26 }, (_, i) => {
      const angle = ((i / 26) * 360 + Math.random() * 12) * (Math.PI / 180);
      const dist = 120 + Math.random() * 140;
      return {
        id: i, dx: `${Math.cos(angle) * dist}px`, dy: `${Math.sin(angle) * dist - 40}px`,
        size: 14 + Math.random() * 16, delay: `${Math.random() * 0.2}s`
      };
    }));
    setStage("accepted");
  };

  return (
    <main className="page">
      <div className="browser-tab"><span className="tab-dot"/> A Little Lily Surprise <b>— HTML · CSS · JS</b></div>
      <section className="browser">
        <div className="browser-top">
          <div className="traffic"><i/><i/><i/></div>
          <span className="address">localhost / little-surprise</span>
        </div>
        <div className="scene">
          <div className="paper-grain"/>
          {hearts.map(h => <span key={h.id} className="floating-heart" style={{left:h.left, animationDelay:h.delay, animationDuration:h.duration, fontSize:h.size}}>♥</span>)}

          {stage === "intro" && (
            <div className={`intro-content ${opening ? "leaving" : ""}`}>
              <div className={`envelope ${opening ? "opening" : ""}`} aria-hidden="true"><div className="flap"/><Heart className="envelope-heart" fill="currentColor"/></div>
              <h1>A surprise something for you, my baby.</h1>
              <button className="launch" onClick={openLetter} aria-label="Open the surprise">
                <span className="arrow">➤</span>
                <span className="launch-label">tap to open</span>
              </button>
              <p className="hint">A tiny surprise is waiting...</p>
              <button className="write-link" onClick={() => setStage("compose")}>✉ write a letter</button>
            </div>
          )}

          {stage === "letter" && (
            <div className="letter-window">
              <header className="window-title"><span>LILY.EXE</span><div><b>−</b><b>□</b><b>×</b></div></header>
              <div className="window-hearts">♥ · ♥ · ♥</div>
              <div className="gingham">
                <p className="question">A lily flower for you ♡<br/>Do you accept my love?</p>
                <PixelLily />
                <div className="choices">
                  <button className="yes" style={{ scale: 1 + Math.min(noCount * 0.07, 0.5) }} onClick={accept}>YES!</button>
                  <button className="no" style={{ transform: `translate(${Math.min(noCount * 13, 65)}px, ${noCount % 2 ? -8 : 0}px)` }} onMouseEnter={dodgeNo} onClick={dodgeNo}>NO</button>
                </div>
              </div>
            </div>
          )}

          {stage === "compose" && (
            <div className="letter-window compose">
              <header className="window-title"><span>WRITE.EXE</span><div><b>−</b><b>□</b><b>×</b></div></header>
              <div className="gingham compose-body">
                <label>TO
                  <input value={letter.to} maxLength={40} placeholder="my baby" onChange={(e) => updateLetter({ to: e.target.value })} />
                </label>
                <label>MESSAGE
                  <textarea rows={6} maxLength={700} value={letter.msg} placeholder="Write something sweet..." onChange={(e) => updateLetter({ msg: e.target.value })} />
                </label>
                <small className="count">{letter.msg.length}/700</small>
                <label>FROM
                  <input value={letter.from} maxLength={40} placeholder="Arvy" onChange={(e) => updateLetter({ from: e.target.value })} />
                </label>
                <div className="choices">
                  <button onClick={sealLetter} disabled={!letter.msg.trim()}>SEAL IT ✉</button>
                  <button onClick={() => setStage("intro")}>BACK</button>
                </div>
              </div>
            </div>
          )}

          {stage === "mail" && (
            <MailView key={mailKey} letter={letter} received={received} onEdit={() => setStage("compose")} onWriteOwn={writeOwn} onBack={() => setStage("intro")} />
          )}

          {stage === "accepted" && (
            <div className="accepted">
              <div className="flower-card"><PixelLily bloom/><div className="sparkle">✦　♡　✦</div></div>
              <h2>YAY! ♡</h2>
              <p>Happy 6th Monthsary!<br/>And a whole lot more of happiness and love.</p>
              <div className="accepted-actions">
                <button className="again" onClick={() => {setStage("intro"); setNoCount(0);}}>REPLAY SURPRISE</button>
                <button className="again" onClick={() => setStage("compose")}>WRITE A LETTER</button>
              </div>
            </div>
          )}
          {stage === "accepted" && burst.map(b => (
            <span key={b.id} className="burst-heart" style={{ "--dx": b.dx, "--dy": b.dy, fontSize: b.size, animationDelay: b.delay }}>♥</span>
          ))}
          <button className="sound" onClick={() => setSound(!sound)} aria-label="Toggle sound">
            {sound ? <Volume2 size={20}/> : <VolumeX size={20}/>}
          </button>
        </div>
      </section>
      <div className="code-panels" aria-label="Project technology">
        <div className="code-panel"><h3>HTML</h3><code><span>&lt;section</span> class="surprise"&gt;<br/>　&lt;header&gt;LILY.EXE&lt;/header&gt;<br/>　&lt;PixelLily /&gt;<br/>　&lt;button&gt;YES!&lt;/button&gt;<br/>&lt;/section&gt;</code></div>
        <div className="code-panel"><h3>CSS</h3><code><span> .scene </span>{"{"}<br/>　background: warm-paper;<br/>　border-radius: 18px;<br/>　overflow: hidden;<br/>{"}"}<br/><br/><span>.floating-heart</span> {"{"}<br/>　animation: float 12s infinite;<br/>{"}"}</code></div>
        <div className="code-panel"><h3>JS</h3><code><span>function</span> accept() {"{"}<br/>　setStage("accepted");<br/>　rainHearts();<br/>{"}"}<br/><br/><span>button</span>.onClick = accept;</code></div>
      </div>
      <p className="footer">Made by your beloved Arvy! ♡</p>
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);