import { useRoute, go } from './router'
import { useStore } from './store.jsx'
import Login from './screens/Login.jsx'
import Home from './screens/Home.jsx'
import NewOrder from './screens/NewOrder.jsx'
import Catalog from './screens/Catalog.jsx'
import Confirm from './screens/Confirm.jsx'
import History from './screens/History.jsx'
import Stock from './screens/Stock.jsx'
import Customers from './screens/Customers.jsx'
import Notebook from './screens/Notebook.jsx'
import Settings from './screens/Settings.jsx'

const ROUTES = {
  '/home': Home, '/order': NewOrder, '/catalog': Catalog, '/confirm': Confirm,
  '/history': History, '/stock': Stock, '/customers': Customers, '/notebook': Notebook, '/settings': Settings,
}

export default function App() {
  const route = useRoute()
  const { user, toast } = useStore()
  const Page = user ? ROUTES[route] : Login
  if (user && !Page) {
    go('/home')
    return null
  }
  return (
    <>
      <Page />
      {toast && (
        <div role="status" className="fixed bottom-6 left-1/2 z-30 max-w-[90vw] -translate-x-1/2 rounded-xl border border-line2 bg-card px-5 py-3 text-sm shadow-xl" style={{ animation: 'toast-in .2s ease-out both' }}>
          {toast}
        </div>
      )}
    </>
  )
}
