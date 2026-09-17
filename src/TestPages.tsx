import { lazy, Suspense } from 'react'

const Desktop = lazy(() => import('./App'))
const Design = lazy(() => import('./DesignPage'))
const Components = lazy(() => import('./ComponentsPage'))
const routes = {
  '': { page: Components, title: 'Win95 UI · Components' },
  '/test/desktop': { page: Desktop, title: 'Windows 95 Desktop' },
  '/test/design': { page: Design, title: 'Windows 95 · Design' },
  '/test/components': { page: Components, title: 'Windows 95 · Components' },
}
const path = window.location.pathname.replace(/\/$/, '')
const route = routes[path as keyof typeof routes]
document.title = route?.title ?? 'Win95 UI'

export default function TestPages() {
  if (!route) return null
  const Page = route.page
  return <Suspense fallback={<p>Loading…</p>}><Page /></Suspense>
}
