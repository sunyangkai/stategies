import type { ReactNode } from 'react'

type HeroBadge = {
  key: string
  icon?: ReactNode
  label: string
}

type HeroChip = {
  key: string
  label: string
  background?: string
}

type HeroProps = {
  badges: HeroBadge[]
  title: string
  description: string
  actions?: ReactNode
  preview?: ReactNode
  chips?: HeroChip[]
}

type PanelProps = {
  title: string
  subtitle?: string
  extra?: ReactNode
  children: ReactNode
}

type KpiCardProps = {
  label: string
  value: ReactNode
  extra: string
}

export function CartoonPageShell({ children }: { children: ReactNode }) {
  return <div className="cartoon-page-shell">{children}</div>
}

export function CartoonHero({
  badges,
  title,
  description,
  actions,
  preview,
  chips = [],
}: HeroProps) {
  return (
    <section className="cartoon-hero">
      <div className="cartoon-hero-grid">
        <div>
          <div className="cartoon-badge-row">
            {badges.map((badge) => (
              <span className="cartoon-badge" key={badge.key}>
                {badge.icon}
                <span>{badge.label}</span>
              </span>
            ))}
          </div>
          <h1 className="cartoon-hero-title">{title}</h1>
          <p className="cartoon-hero-desc">{description}</p>
          {actions}
        </div>

        {preview ? (
          <div className="cartoon-preview-card">
            {chips.length > 0 ? (
              <div className="cartoon-chip-row" style={{ marginBottom: 14 }}>
                {chips.map((chip) => (
                  <span
                    className="cartoon-chip"
                    key={chip.key}
                    style={chip.background ? { background: chip.background } : undefined}
                  >
                    {chip.label}
                  </span>
                ))}
              </div>
            ) : null}
            {preview}
          </div>
        ) : null}
      </div>
    </section>
  )
}

export function CartoonPanel({ title, subtitle, extra, children }: PanelProps) {
  return (
    <section className="cartoon-panel">
      <div className="cartoon-panel-head">
        <div>
          <h2 className="cartoon-panel-title">{title}</h2>
          {subtitle ? <p className="cartoon-panel-subtitle">{subtitle}</p> : null}
        </div>
        {extra}
      </div>
      <div className="cartoon-panel-content">{children}</div>
    </section>
  )
}

export function CartoonWindowDots() {
  return (
    <div className="cartoon-dot-group" aria-hidden="true">
      <span className="cartoon-dot cartoon-dot-red" />
      <span className="cartoon-dot cartoon-dot-yellow" />
      <span className="cartoon-dot cartoon-dot-green" />
    </div>
  )
}

export function CartoonKpiRow({ items }: { items: KpiCardProps[] }) {
  return (
    <div className="cartoon-kpi-row">
      {items.map((item) => (
        <div className="cartoon-kpi-card" key={item.label}>
          <div className="cartoon-kpi-label">{item.label}</div>
          <div className="cartoon-kpi-value">{item.value}</div>
          <div className="cartoon-kpi-extra">{item.extra}</div>
        </div>
      ))}
    </div>
  )
}
