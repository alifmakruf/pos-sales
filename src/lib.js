export const cn = (...a) => a.filter(Boolean).join(' ')
export const rp = (n) => 'Rp' + Math.round(n).toLocaleString('id-ID')
export const rpShort = (n) =>
  n >= 1e6 ? 'Rp' + String(+(n / 1e6).toFixed(1)).replace('.', ',') + 'jt' : rp(n)
export const jt = (n) => Math.round(n / 1e6) + 'jt'
const two = (n) => String(n).padStart(2, '0')
export const fmtDate = (iso) => {
  const d = new Date(iso)
  return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`
}
export const fmtTime = (iso) => {
  const d = new Date(iso)
  return `${two(d.getHours())}:${two(d.getMinutes())}`
}
export const dayKey = (iso) => {
  const d = new Date(iso)
  return `${d.getFullYear()}-${two(d.getMonth() + 1)}-${two(d.getDate())}`
}
export const phoneDigits = (s) => String(s).replace(/\D/g, '')
