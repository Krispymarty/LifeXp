export default function ProgressBar({ value = 0, color = 'from-xp-purple to-xp-violet', label, height = 'h-3', showShine = false }) {
  const safeValue = Math.max(0, Math.min(100, value));

  return (
    <div>
      {label ? <div className="mb-2 text-sm font-semibold text-slate-600">{label}</div> : null}
      <div className={`${height} overflow-hidden rounded-full bg-purple-100 shadow-inner`}>
        <div
          className={`progress-fill relative h-full rounded-full bg-gradient-to-r ${color}`}
          style={{ width: `${safeValue}%` }}
        >
          {showShine ? <span className="progress-shine" /> : null}
        </div>
      </div>
    </div>
  );
}
