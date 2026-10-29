import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { BASE_REVENUE, PRODUCTS, SEED_CUSTOMERS, SEED_NOTES, SEED_ORDERS } from './data'
import { phoneDigits } from './lib'
import { applyTheme } from './config'

const Ctx = createContext(null)
export const useStore = () => useContext(Ctx)

const load = (k, d) => {
  try {
    const v = localStorage.getItem(k)
    return v ? JSON.parse(v) : d
  } catch {
    return d
  }
}
const save = (k, v) => {
  try {
    localStorage.setItem(k, JSON.stringify(v))
  } catch {}
}
const emptyCart = { name: '', phone: '', lines: [] }
const two = (n) => String(n).padStart(2, '0')

export function StoreProvider({ children }) {
  const [user, setUser] = useState(() => load('pos.user', null))
  const [theme, setTheme] = useState(() => load('pos.theme', 'dark'))
  const [cart, setCart] = useState(emptyCart)
  const [draft, setDraft] = useState(() => load('pos.draft', null))
  const [orders, setOrders] = useState(() => load('pos.orders', SEED_ORDERS))
  const [customers, setCustomers] = useState(() => load('pos.customers', SEED_CUSTOMERS))
  const [notes, setNotes] = useState(() => load('pos.notes', SEED_NOTES))
  const [toast, setToast] = useState(null)
  const timer = useRef()

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    applyTheme(theme)
    save('pos.theme', theme)
  }, [theme])
  useEffect(() => save('pos.user', user), [user])
  useEffect(() => save('pos.draft', draft), [draft])
  useEffect(() => save('pos.orders', orders), [orders])
  useEffect(() => save('pos.customers', customers), [customers])
  useEffect(() => save('pos.notes', notes), [notes])

  const notify = useCallback((msg) => {
    setToast(msg)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setToast(null), 2600)
  }, [])

  const lines = useMemo(
    () =>
      cart.lines
        .filter((l) => l.qty > 0)
        .map((l) => {
          const product = PRODUCTS.find((p) => p.id === l.pid)
          const variant = product.variants.find((x) => x.id === l.vid)
          return { ...l, product, variant, subtotal: variant.price * l.qty }
        }),
    [cart.lines],
  )
  const total = lines.reduce((s, l) => s + l.subtotal, 0)
  const units = lines.reduce((s, l) => s + l.qty, 0)

  const setQty = (pid, vid, qty) =>
    setCart((c) => {
      const rest = c.lines.filter((l) => !(l.pid === pid && l.vid === vid))
      return { ...c, lines: qty > 0 ? [...rest, { pid, vid, qty }] : rest }
    })
  const qtyOf = (pid, vid) => cart.lines.find((l) => l.pid === pid && l.vid === vid)?.qty || 0
  const unitsOfProduct = (pid) => cart.lines.filter((l) => l.pid === pid).reduce((s, l) => s + l.qty, 0)

  const value = {
    user, theme, cart, lines, total, units, draft, orders, customers, notes, toast,
    notify, setTheme, qtyOf, setQty, unitsOfProduct,
    login: (name) => setUser({ name: name || 'kai cenat' }),
    logout: () => {
      setUser(null)
      setCart(emptyCart)
    },
    setCustomer: (patch) => setCart((c) => ({ ...c, ...patch })),
    startOrder: () => setCart(emptyCart),
    saveDraft: () => {
      if (!lines.length && !cart.name) return notify('Belum ada isi pesanan untuk disimpan.')
      setDraft(cart)
      notify('Pesanan disimpan sebagai draft.')
    },
    loadDraft: () => {
      if (!draft) return false
      setCart(draft)
      return true
    },
    confirmOrder: () => {
      const now = new Date()
      const id = `ODR-${String(now.getFullYear()).slice(2)}${two(now.getMonth() + 1)}${two(now.getDate())}${two(orders.length + 1)}`
      const order = {
        id, customer: cart.name.trim(), phone: cart.phone ? `+62 ${cart.phone}` : '-',
        status: 'sukses', units, total, at: now.toISOString(),
        items: lines.map((l) => ({ pid: l.pid, vid: l.vid, qty: l.qty, name: l.variant.name, price: l.variant.price })),
      }
      setOrders((o) => [order, ...o])
      setCustomers((list) => {
        const key = phoneDigits(cart.phone)
        const i = list.findIndex((c) => (key && phoneDigits(c.phone).endsWith(key)) || c.name.toLowerCase() === order.customer.toLowerCase())
        if (i < 0) return [{ id: `c${Date.now()}`, name: order.customer, phone: order.phone, total, units, count: 1, last: order.at }, ...list]
        const c = list[i]
        return list.map((x, j) => (j === i ? { ...c, total: c.total + total, units: c.units + units, count: c.count + 1, last: order.at } : x))
      })
      setDraft(null)
      setCart(emptyCart)
      return order
    },
    upsertNote: (n) =>
      setNotes((list) =>
        n.id ? list.map((x) => (x.id === n.id ? { ...x, ...n, at: new Date().toISOString() } : x))
          : [{ ...n, id: `n${Date.now()}`, at: new Date().toISOString() }, ...list]),
    deleteNote: (id) => setNotes((list) => list.filter((x) => x.id !== id)),
    revenue: BASE_REVENUE + orders.filter((o) => o.status === 'sukses').reduce((s, o) => s + o.total, 0),
  }
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}
