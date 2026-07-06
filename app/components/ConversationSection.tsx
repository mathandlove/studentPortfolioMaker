"use client";

import { useEffect, useRef, useState } from "react";
import type { Conversation, ConversationTurn } from "../lib/portfolio";

// Minimal typing for the Web Speech API (not in TS lib.dom by default).
interface SpeechRecognitionResultLike {
  0: { transcript: string };
  isFinal: boolean;
}
interface SpeechRecognitionEventLike {
  resultIndex: number;
  results: { length: number; [i: number]: SpeechRecognitionResultLike };
}
interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEventLike) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
}

function getRecognizer(): SpeechRecognitionLike | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  return Ctor ? new Ctor() : null;
}

interface Props {
  studentName: string;
  conversation: Conversation;
}

export function ConversationSection({ studentName, conversation }: Props) {
  const firstName = studentName.split(" ")[0];

  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const [liveText, setLiveText] = useState("");
  const [captured, setCaptured] = useState<string[]>([]); // finalized lines from this session
  const recognizerRef = useRef<SpeechRecognitionLike | null>(null);
  const startedAtRef = useRef<number>(0);

  useEffect(() => {
    setSupported(getRecognizer() !== null);
  }, []);

  const start = () => {
    const rec = getRecognizer();
    if (!rec) {
      setSupported(false);
      return;
    }
    rec.continuous = true;
    rec.interimResults = true;
    rec.lang = "en-US";
    rec.onresult = (e) => {
      let interim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        const r = e.results[i];
        if (r.isFinal) {
          setCaptured((prev) => [...prev, r[0].transcript.trim()]);
          interim = "";
        } else {
          interim += r[0].transcript;
        }
      }
      setLiveText(interim);
    };
    rec.onerror = () => {};
    rec.onend = () => {
      // Chrome stops after silence; restart while the user still wants to record.
      if (recognizerRef.current) rec.start();
    };
    recognizerRef.current = rec;
    startedAtRef.current = Date.now();
    setCaptured([]);
    setLiveText("");
    rec.start();
    setRecording(true);
  };

  const stop = () => {
    const rec = recognizerRef.current;
    recognizerRef.current = null; // signal onend not to restart
    if (rec) {
      rec.onend = null;
      rec.stop();
    }
    setRecording(false);
  };

  const elapsed = () => Math.round((Date.now() - startedAtRef.current) / 1000);

  return (
    <section className="convo">
      <div className="convo-head">
        <div>
          <h2>What we decided together</h2>
          <p className="convo-sub">
            The one-on-one is where the portfolio closes the loop — {firstName} and you talk
            through what the work surfaced, and set goals to carry into the next unit.
          </p>
        </div>
        {!recording ? (
          <button className="rec-btn" onClick={start} disabled={!supported}>
            <span className="rec-dot" /> Record conversation
          </button>
        ) : (
          <button className="rec-btn rec-live" onClick={stop}>
            <span className="rec-dot rec-dot-live" /> Stop recording
          </button>
        )}
      </div>

      {!supported && (
        <p className="rec-warn">
          Live transcription needs Chrome or Edge (Web Speech API). The saved conversation below
          still shows the full loop.
        </p>
      )}

      {recording && (
        <div className="rec-panel">
          <div className="rec-status">
            <span className="rec-pulse" /> Listening… speak naturally, it transcribes live
          </div>
          <div className="rec-transcript">
            {captured.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
            {liveText && <p className="rec-interim">{liveText}</p>}
            {captured.length === 0 && !liveText && (
              <p className="rec-hint">Your words will appear here as you talk…</p>
            )}
          </div>
        </div>
      )}

      {!recording && captured.length > 0 && (
        <div className="rec-panel rec-done">
          <div className="rec-status rec-status-done">
            ✓ Captured {captured.length} line{captured.length === 1 ? "" : "s"} ({elapsed()}s)
          </div>
          <div className="rec-transcript">
            {captured.map((line, i) => (
              <p key={i}>{line}</p>
            ))}
          </div>
          <p className="rec-hint">
            In the full tool, Claude would turn this into a summary and draft candidate goals for
            you to edit — the human writes, the AI just tidies.
          </p>
        </div>
      )}

      {/* Goals set together — the seed carried into the next unit */}
      <div className="goals">
        <div className="goals-lead">
          <span className="goals-badge">🎯 Goals for Unit 2 · set {conversation.date}</span>
        </div>
        {conversation.goals.map((g, i) => (
          <div className="goal" key={i}>
            <span className="goal-num">{i + 1}</span>
            <div>
              <p className="goal-text">{g.text}</p>
              <p className="goal-connect">
                <span className="goal-connect-label">Grows from:</span> {g.connectsTo}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* The saved conversation */}
      <details className="convo-details">
        <summary>
          <span className="cd-label">The conversation</span>
          <span className="cd-meta">
            {conversation.transcript.length} exchanges · {conversation.date}
          </span>
        </summary>
        <p className="convo-summary">{conversation.summary}</p>
        <div className="turns">
          {conversation.transcript.map((t: ConversationTurn, i: number) => (
            <div className={`turn turn-${t.speaker}`} key={i}>
              <span className="turn-who">
                {t.speaker === "teacher" ? "Prof. Reed" : firstName}
              </span>
              <p className="turn-text">{t.text}</p>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}
