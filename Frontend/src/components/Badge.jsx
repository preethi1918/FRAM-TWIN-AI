export default function Badge({ level }) {
  const cls = `badge badge-${(level || '').toLowerCase()}`
  return <span className={cls}>{level}</span>
}
