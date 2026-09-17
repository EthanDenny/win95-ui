import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import TestPages from './TestPages'
import './index.css'
import './cursors.css'

createRoot(document.getElementById('root')!).render(<StrictMode><TestPages /></StrictMode>)
