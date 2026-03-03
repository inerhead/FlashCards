import { useCallback, useEffect, useRef, useState } from "react";
import t from "../i18n";
import s from "./AudioButton.module.css";

let cachedVoice: SpeechSynthesisVoice | null = null;

function getEnglishVoice(): SpeechSynthesisVoice | null {
  if (cachedVoice) return cachedVoice;
  const voices = speechSynthesis.getVoices();
  const preferred = [
    "Google US English",
    "Google UK English Female",
    "Google UK English Male",
    "Samantha",
    "Daniel",
    "Karen",
    "Moira",
    "Alex",
  ];
  for (const name of preferred) {
    const v = voices.find((v) => v.name === name);
    if (v) { cachedVoice = v; return v; }
  }
  const native = voices.find(
    (v) => v.lang.startsWith("en") && !v.localService,
  );
  if (native) { cachedVoice = native; return native; }
  const any = voices.find((v) => v.lang.startsWith("en"));
  if (any) { cachedVoice = any; return any; }
  return null;
}

interface Props {
  text: string;
  rate?: number;
  size?: number;
  color?: string;
}

export default function AudioButton({
  text,
  rate = 0.85,
  size = 28,
  color = "#818CF8",
}: Props) {
  const [speaking, setSpeaking] = useState(false);
  const ready = useRef(false);

  useEffect(() => {
    const load = () => { ready.current = true; };
    speechSynthesis.addEventListener("voiceschanged", load);
    if (speechSynthesis.getVoices().length) ready.current = true;
    return () => speechSynthesis.removeEventListener("voiceschanged", load);
  }, []);

  const speak = useCallback(() => {
    speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    const voice = getEnglishVoice();
    if (voice) utt.voice = voice;
    utt.lang = "en-US";
    utt.rate = rate;
    utt.onstart = () => setSpeaking(true);
    utt.onend = () => setSpeaking(false);
    utt.onerror = () => setSpeaking(false);
    speechSynthesis.speak(utt);
  }, [text, rate]);

  return (
    <button
      onClick={(e) => { e.stopPropagation(); speak(); }}
      title={t.pronounceTitle(text)}
      className={`${s.btn} ${speaking ? s.speaking : ""}`}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 24 24"
        fill="none"
        stroke={speaking ? "#38BDF8" : color}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" fill={speaking ? "#38BDF820" : "none"} />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    </button>
  );
}
