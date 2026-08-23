import React, { useState, useRef, useEffect } from "react";


// ---------------------------------------------------------------------------
// Pop Quiz — a scantron-bubble-sheet themed quiz generator
// ---------------------------------------------------------------------------

const FONT_IMPORT = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500;700&display=swap');
`;

const COLORS = {
  paper: "#EDE6D3",
  paperLine: "#D8CCAE",
  ink: "#232323",
  inkLight: "#6b6656",
  red: "#C0392B",
  green: "#3F6B4C",
  yellow: "#E8C468",
};

function cx(...a) {
  return a.filter(Boolean).join(" ");
}

// --- Bubble (scantron-style option) ----------------------------------------
function Bubble({ letter, filled, correct, incorrect, disabled, onClick }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      style={{
        width: 34,
        height: 34,
        borderRadius: "50%",
        border: `2px solid ${
          incorrect ? COLORS.red : correct ? COLORS.green : COLORS.ink
        }`,
        background: filled
          ? incorrect
            ? COLORS.red
            : correct
            ? COLORS.green
            : COLORS.ink
          : "transparent",
        color: filled ? COLORS.paper : COLORS.ink,
        fontFamily: "'JetBrains Mono', monospace",
        fontWeight: 700,
        fontSize: 14,
        flexShrink: 0,
        cursor: disabled ? "default" : "pointer",
        transition: "all 0.15s ease",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {letter}
    </button>
  );
}

// --- Progress bubbles at top -------------------------------------------------
function ProgressBubbles({ total, current, answers }) {
  return (
    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
      {Array.from({ length: total }).map((_, i) => {
        const answered = answers[i] !== undefined && answers[i] !== null;
        const isCurrent = i === current;
        return (
          <div
            key={i}
            title={`Question ${i + 1}`}
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              border: `1.5px solid ${COLORS.ink}`,
              background: answered
                ? COLORS.ink
                : isCurrent
                ? COLORS.yellow
                : "transparent",
              opacity: isCurrent ? 1 : 0.7,
              transition: "all 0.15s ease",
            }}
          />
        );
      })}
    </div>
  );
}

// --- Torn paper top edge -----------------------------------------------------
function PerforatedEdge() {
  const dots = Array.from({ length: 40 });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "0 8px",
        marginBottom: -1,
      }}
    >
      {dots.map((_, i) => (
        <div
          key={i}
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "#00000012",
            marginTop: -2.5,
          }}
        />
      ))}
    </div>
  );
}

// --- Red pen score stamp ------------------------------------------------------
function ScoreStamp({ score, total }) {
  const pct = Math.round((score / total) * 100);
  const [drawn, setDrawn] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDrawn(true), 250);
    return () => clearTimeout(t);
  }, []);

  const grade =
    pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : pct >= 60 ? "D" : "F";

  return (
    <div
      style={{
        position: "relative",
        width: 180,
        height: 180,
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg width="180" height="180" viewBox="0 0 180 180">
        <circle
          cx="90"
          cy="90"
          r="78"
          fill="none"
          stroke={COLORS.red}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray="490"
          strokeDashoffset={drawn ? 20 : 490}
          transform="rotate(-95 90 90)"
          style={{
            transition: "stroke-dashoffset 1.1s cubic-bezier(.4,0,.2,1)",
          }}
        />
      </svg>
      <div
        style={{
          position: "absolute",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          color: COLORS.red,
          fontFamily: "'Fraunces', serif",
          transform: "rotate(-4deg)",
        }}
      >
        <div style={{ fontSize: 44, fontWeight: 700, lineHeight: 1 }}>
          {grade}
        </div>
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            marginTop: 4,
          }}
        >
          {score}/{total}
        </div>
      </div>
    </div>
  );
}

// --- Setup screen -------------------------------------------------------------
function SetupScreen({ subject, setSubject, numQ, setNumQ, onGenerate, error }) {
  const inputRef = useRef(null);
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 12,
          letterSpacing: 1.5,
          color: COLORS.inkLight,
          textTransform: "uppercase",
          marginBottom: 6,
        }}
      >
        No. 2 pencil required
      </div>
      <h1
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 42,
          fontWeight: 700,
          color: COLORS.ink,
          margin: "0 0 6px 0",
          lineHeight: 1.05,
        }}
      >
        Pop Quiz
      </h1>
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          color: COLORS.inkLight,
          fontSize: 15,
          margin: "0 0 28px 0",
        }}
      >
        Name a subject. We'll write the test.
      </p>

      <label
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 1,
          color: COLORS.inkLight,
          textTransform: "uppercase",
        }}
      >
        Subject
      </label>
      <input
        ref={inputRef}
        value={subject}
        onChange={(e) => setSubject(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && onGenerate()}
        placeholder="e.g. Python, Ancient Rome, Jazz theory..."
        style={{
          width: "100%",
          boxSizing: "border-box",
          fontFamily: "'Fraunces', serif",
          fontSize: 22,
          padding: "10px 4px",
          border: "none",
          borderBottom: `2px solid ${COLORS.ink}`,
          background: "transparent",
          color: COLORS.ink,
          outline: "none",
          marginTop: 6,
          marginBottom: 26,
        }}
      />

      <label
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 1,
          color: COLORS.inkLight,
          textTransform: "uppercase",
        }}
      >
        Number of questions — {numQ}
      </label>
      <div style={{ display: "flex", gap: 8, marginTop: 10, marginBottom: 32 }}>
        {[3, 5, 8].map((n) => (
          <button
            key={n}
            onClick={() => setNumQ(n)}
            style={{
              flex: 1,
              padding: "12px 0",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              border: `2px solid ${COLORS.ink}`,
              borderRadius: 8,
              background: numQ === n ? COLORS.ink : "transparent",
              color: numQ === n ? COLORS.paper : COLORS.ink,
              transition: "all 0.15s ease",
            }}
          >
            {n}
          </button>
        ))}
      </div>

      {error && (
        <div
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13,
            color: COLORS.red,
            marginBottom: 16,
            padding: "10px 12px",
            border: `1.5px dashed ${COLORS.red}`,
            borderRadius: 6,
          }}
        >
          {error}
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={!subject.trim()}
        style={{
          width: "100%",
          padding: "16px 0",
          fontFamily: "'Fraunces', serif",
          fontSize: 18,
          fontWeight: 600,
          border: "none",
          borderRadius: 8,
          background: subject.trim() ? COLORS.ink : COLORS.paperLine,
          color: subject.trim() ? COLORS.paper : COLORS.inkLight,
          cursor: subject.trim() ? "pointer" : "default",
          transition: "all 0.15s ease",
        }}
      >
        Generate Quiz →
      </button>
    </div>
  );
}

// --- Loading screen -------------------------------------------------------------
function LoadingScreen({ subject }) {
  const [dots, setDots] = useState("");
  useEffect(() => {
    const t = setInterval(() => {
      setDots((d) => (d.length >= 3 ? "" : d + "."));
    }, 400);
    return () => clearInterval(t);
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "60px 0",
        gap: 18,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          border: `3px solid ${COLORS.paperLine}`,
          borderTopColor: COLORS.ink,
          animation: "spin 0.9s linear infinite",
        }}
      />
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          color: COLORS.inkLight,
        }}
      >
        writing questions on "{subject}"{dots}
      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

// --- Quiz screen -------------------------------------------------------------
function QuizScreen({ quiz, subject, current, setCurrent, answers, setAnswers, onFinish }) {
  const q = quiz[current];
  const selected = answers[current];

  const selectAnswer = (idx) => {
    const next = [...answers];
    next[current] = idx;
    setAnswers(next);
  };

  const isLast = current === quiz.length - 1;

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 22,
        }}
      >
        <div
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            letterSpacing: 1,
            color: COLORS.inkLight,
            textTransform: "uppercase",
          }}
        >
          {subject}
        </div>
        <ProgressBubbles total={quiz.length} current={current} answers={answers} />
      </div>

      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 13,
          color: COLORS.red,
          marginBottom: 8,
        }}
      >
        Q{current + 1} / {quiz.length}
      </div>
      <h2
        style={{
          fontFamily: "'Fraunces', serif",
          fontSize: 26,
          fontWeight: 600,
          color: COLORS.ink,
          margin: "0 0 26px 0",
          lineHeight: 1.25,
        }}
      >
        {q.q}
      </h2>

      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {q.options.map((opt, i) => {
          const letter = String.fromCharCode(65 + i);
          return (
            <div
              key={i}
              onClick={() => selectAnswer(i)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                padding: "12px 14px",
                borderRadius: 8,
                border: `1.5px solid ${
                  selected === i ? COLORS.ink : COLORS.paperLine
                }`,
                background: selected === i ? "#00000008" : "transparent",
                cursor: "pointer",
                transition: "all 0.15s ease",
              }}
            >
              <Bubble letter={letter} filled={selected === i} onClick={() => selectAnswer(i)} />
              <span
                style={{
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 15.5,
                  color: COLORS.ink,
                }}
              >
                {opt}
              </span>
            </div>
          );
        })}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: 32,
        }}
      >
        <button
          onClick={() => setCurrent((c) => Math.max(0, c - 1))}
          disabled={current === 0}
          style={{
            padding: "12px 20px",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            border: `1.5px solid ${COLORS.ink}`,
            borderRadius: 8,
            background: "transparent",
            color: current === 0 ? COLORS.paperLine : COLORS.ink,
            borderColor: current === 0 ? COLORS.paperLine : COLORS.ink,
            cursor: current === 0 ? "default" : "pointer",
          }}
        >
          ← Back
        </button>
        {isLast ? (
          <button
            onClick={onFinish}
            disabled={selected === undefined}
            style={{
              padding: "12px 26px",
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 15,
              border: "none",
              borderRadius: 8,
              background: selected === undefined ? COLORS.paperLine : COLORS.red,
              color: COLORS.paper,
              cursor: selected === undefined ? "default" : "pointer",
            }}
          >
            Submit Quiz
          </button>
        ) : (
          <button
            onClick={() => setCurrent((c) => c + 1)}
            disabled={selected === undefined}
            style={{
              padding: "12px 26px",
              fontFamily: "'Fraunces', serif",
              fontWeight: 600,
              fontSize: 15,
              border: "none",
              borderRadius: 8,
              background: selected === undefined ? COLORS.paperLine : COLORS.ink,
              color: COLORS.paper,
              cursor: selected === undefined ? "default" : "pointer",
            }}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}

// --- Results screen -------------------------------------------------------------
function ResultsScreen({ quiz, subject, answers, onRestart }) {
  const score = quiz.reduce(
    (acc, q, i) => acc + (answers[i] === q.answer ? 1 : 0),
    0
  );

  return (
    <div>
      <div
        style={{
          fontFamily: "'JetBrains Mono', monospace",
          fontSize: 11,
          letterSpacing: 1,
          color: COLORS.inkLight,
          textTransform: "uppercase",
          textAlign: "center",
          marginBottom: 4,
        }}
      >
        {subject} — graded
      </div>
      <ScoreStamp score={score} total={quiz.length} />

      <div style={{ marginTop: 36, display: "flex", flexDirection: "column", gap: 18 }}>
        {quiz.map((q, i) => {
          const correct = answers[i] === q.answer;
          return (
            <div
              key={i}
              style={{
                paddingBottom: 16,
                borderBottom: `1px solid ${COLORS.paperLine}`,
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: 10,
                  alignItems: "flex-start",
                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 13,
                    fontWeight: 700,
                    color: correct ? COLORS.green : COLORS.red,
                    marginTop: 2,
                  }}
                >
                  {correct ? "✓" : "✕"}
                </span>
                <span
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 15,
                    color: COLORS.ink,
                    fontWeight: 500,
                  }}
                >
                  {q.q}
                </span>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6, paddingLeft: 22 }}>
                {q.options.map((opt, oi) => {
                  const isAnswer = oi === q.answer;
                  const isPicked = oi === answers[i];
                  if (!isAnswer && !isPicked) return null;
                  return (
                    <div
                      key={oi}
                      style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13.5,
                        color: isAnswer ? COLORS.green : COLORS.red,
                      }}
                    >
                      {String.fromCharCode(65 + oi)}. {opt}
                      {isAnswer ? "  (correct)" : "  (your answer)"}
                    </div>
                  );
                })}
              </div>
              {q.exp && (
                <div
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 13,
                    color: COLORS.inkLight,
                    marginTop: 8,
                    paddingLeft: 22,
                    fontStyle: "italic",
                  }}
                >
                  {q.exp}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <button
        onClick={onRestart}
        style={{
          width: "100%",
          marginTop: 8,
          padding: "16px 0",
          fontFamily: "'Fraunces', serif",
          fontSize: 17,
          fontWeight: 600,
          border: `2px solid ${COLORS.ink}`,
          borderRadius: 8,
          background: "transparent",
          color: COLORS.ink,
          cursor: "pointer",
        }}
      >
        New Quiz
      </button>
    </div>
  );
}

// --- Main app -------------------------------------------------------------
export default function App() {
  const [screen, setScreen] = useState("setup"); // setup | loading | quiz | results
  const [subject, setSubject] = useState("");
  const [numQ, setNumQ] = useState(5);
  const [quiz, setQuiz] = useState([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [error, setError] = useState("");

  const generateQuiz = async () => {
    if (!subject.trim()) return;
    setError("");
    setScreen("loading");
    try {
      const systemPrompt = `You write multiple-choice quiz questions. Respond with ONLY minified JSON, no markdown fences, no commentary, matching this exact shape:
{"questions":[{"q":"question text","options":["opt A","opt B","opt C","opt D"],"answer":0,"exp":"one short sentence explaining the correct answer"}]}
"answer" is the zero-based index of the correct option in "options". Generate exactly ${numQ} questions about the subject the user gives you. Keep question and option text concise. Vary difficulty and cover different aspects of the subject.`;

     const key = import.meta.env.VITE_GROQ_API_KEY;

console.log("KEY EXISTS:", !!key);
console.log("KEY START:", key?.slice(0, 8));
console.log("KEY LENGTH:", key?.length);console.log("KEY:", import.meta.env.VITE_GROQ_API_KEY);
const response = await fetch(
  "https://api.groq.com/openai/v1/chat/completions",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: "llama-3.1-8b-instant",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        {
          role: "user",
          content: `Subject: ${subject.trim()}`,
        },
      ],
      temperature: 0.7,
    }),
  }
);

const data = await response.json();

console.log("Groq response:", data);

if (!response.ok) {
  throw new Error(data.error?.message || "Groq API failed");
}

const text = data.choices[0].message.content;
let clean = text.trim();

clean = clean
.replace(/^```json\s*/i, "")
.replace(/^```\s*/i, "")
.replace(/```\s*$/i, "");

      let parsed;

try {
  parsed = JSON.parse(clean);
} catch (err) {
  console.log("Broken JSON from Groq:", clean);
  throw new Error("AI returned invalid JSON");
}
      if (!parsed.questions || !parsed.questions.length) {
        throw new Error("No questions came back. Try a different subject.");
      }

      setQuiz(parsed.questions);
      setAnswers(new Array(parsed.questions.length).fill(undefined));
      setCurrent(0);
      setScreen("quiz");
    } catch (e) {
      console.error(e);
      setError("Couldn't generate that quiz. Try again, or try a different subject.");
      setScreen("setup");
    }
  };

  const restart = () => {
    setScreen("setup");
    setQuiz([]);
    setAnswers([]);
    setCurrent(0);
    setSubject("");
    setError("");
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: COLORS.paper,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        padding: "40px 16px",
        boxSizing: "border-box",
      }}
    >
      <style>{FONT_IMPORT}</style>
      <div
        style={{
          width: "100%",
          maxWidth: 480,
          background: "#F7F3E8",
          borderRadius: 4,
          boxShadow: "0 1px 3px rgba(0,0,0,0.08), 0 12px 28px rgba(0,0,0,0.10)",
          overflow: "hidden",
        }}
      >
        <PerforatedEdge />
        <div style={{ padding: "36px 32px 40px 32px" }}>
          {screen === "setup" && (
            <SetupScreen
              subject={subject}
              setSubject={setSubject}
              numQ={numQ}
              setNumQ={setNumQ}
              onGenerate={generateQuiz}
              error={error}
            />
          )}
          {screen === "loading" && <LoadingScreen subject={subject} />}
          {screen === "quiz" && (
            <QuizScreen
              quiz={quiz}
              subject={subject}
              current={current}
              setCurrent={setCurrent}
              answers={answers}
              setAnswers={setAnswers}
              onFinish={() => setScreen("results")}
            />
          )}
          {screen === "results" && (
            <ResultsScreen
              quiz={quiz}
              subject={subject}
              answers={answers}
              onRestart={restart}
            />
          )}
        </div>
      </div>
    </div>
  );
}
