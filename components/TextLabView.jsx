"use client";

// 文字实验室页。这一节多了一件事：把历史记录显示出来。
// 历史放在弹窗里（而不是再加一张卡），点结果卡右上角的按钮才打开——
// 也是打开的那一刻才去请求 /api/history，没必要每次进页面都拉一遍。
import { useState } from "react";
import Nav from "./Nav.jsx";
import PageHeading from "./PageHeading.jsx";
import AnimatedCardGrid from "./AnimatedCardGrid.jsx";
import InputCard from "./InputCard.jsx";
import ResultCard from "./ResultCard.jsx";
import HistoryModal from "./HistoryModal.jsx";
import { textLab } from "../data/site.js";

// 用 ?? 而不是 ||：线上构建时这个变量是空字符串（同源相对路径），
// 若用 || 兜底会把空串替换成 localhost:8000，线上就会去请求用户自己的电脑。
const API = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function TextLabView() {
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [historyError, setHistoryError] = useState("");

  async function openHistory() {
    setHistoryOpen(true);
    setHistoryError("");
    try {
      const res = await fetch(`${API}/api/history`, { credentials: "include" });
      if (!res.ok) {
        throw new Error(`请求失败：HTTP ${res.status}`);
      }
      setHistory(await res.json());
    } catch (error) {
      // 不让页面崩掉，但要把原因显示出来——否则"后端没开"和"真没记录"看起来一模一样
      setHistory([]);
      setHistoryError(
        `加载历史失败（${error.message}）。检查：后端是否在 ${API} 运行、地址栏 host 是否与 API 一致。`
      );
    }
  }

  return (
    <AnimatedCardGrid className="dashboard-grid">
      <article className="hero-stage panel-full">
        <Nav />
        <PageHeading title={textLab.heroTitle} subtitle={textLab.heroSubtitle} />
      </article>

      <InputCard onResult={setResult} />
      <ResultCard result={result} onOpenHistory={openHistory} />

      <HistoryModal
        open={historyOpen}
        items={history}
        error={historyError}
        onClose={() => setHistoryOpen(false)}
      />
    </AnimatedCardGrid>
  );
}
