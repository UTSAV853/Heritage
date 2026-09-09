interface StatusBadgeProps {
  value: string
  className?: string
}

export function StatusBadge({ value, className = '' }: StatusBadgeProps) {
  return (
    <span className={`pressure-badge pressure-${value} ${className}`} aria-label={`Status: ${value}`}>
      {value}
    </span>
  )
}

interface ProgressBarProps {
  percent: number
  status: string
  label?: string
}

export function ProgressBar({ percent, status, label }: ProgressBarProps) {
  const capped = Math.min(percent, 100)
  return (
    <div>
      <div className="progress-bar-outer" role="progressbar" aria-valuenow={capped} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
        <div
          className={`progress-bar-inner progress-${status}`}
          style={{ width: `${capped}%` }}
        />
      </div>
      {label && <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
        <span>{label}</span>
        <span>{capped.toFixed(1)}%</span>
      </div>}
    </div>
  )
}

interface SpinnerProps { size?: number; label?: string }
export function Spinner({ size = 24, label = 'Loading...' }: SpinnerProps) {
  return (
    <span aria-label={label} role="status" style={{ display: 'inline-flex' }}>
      <span className="spinner" style={{ width: size, height: size }} aria-hidden="true" />
    </span>
  )
}

interface ErrorBarProps { message: string; onRetry?: () => void }
export function ErrorBar({ message, onRetry }: ErrorBarProps) {
  return (
    <div className="alert-bar alert-bar-error" role="alert">
      <span>⚠</span>
      <span style={{ flex: 1 }}>{message}</span>
      {onRetry && <button className="btn btn-sm btn-secondary" onClick={onRetry}>Retry</button>}
    </div>
  )
}

interface InfoBarProps { message: string; type?: 'warn' | 'info' | 'ok' }
export function InfoBar({ message, type = 'info' }: InfoBarProps) {
  const icons = { warn: '⚠', info: 'ℹ', ok: '✓' }
  return (
    <div className={`alert-bar alert-bar-${type}`} role="status">
      <span aria-hidden="true">{icons[type]}</span>
      <span>{message}</span>
    </div>
  )
}

export function DemoBanner() {
  return (
    <div className="alert-bar alert-bar-warn" role="note" aria-label="Demo data notice">
      <span aria-hidden="true">🔬</span>
      <span><strong>SIMULATED DEMO DATA</strong> — All visitor counts, structural observations, and conservation data are simulated for demonstration purposes. Do not use for real conservation decisions.</span>
    </div>
  )
}

export function HumanVerificationWarning() {
  return (
    <div className="alert-bar alert-bar-error" role="note" aria-label="Human verification required">
      <span aria-hidden="true">👤</span>
      <strong>Human Verification Required</strong>
      <span>— All AI recommendations require expert review before action. This is decision-support only.</span>
    </div>
  )
}
