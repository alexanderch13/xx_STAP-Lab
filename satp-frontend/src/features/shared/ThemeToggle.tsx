import { useEffect } from 'react'
import { Moon, Sun } from 'lucide-react'
import { useUiStore } from '@/stores/uiStore'

export default function ThemeToggle({ variant = 'light' }: { variant?: 'light' | 'dark' }) {
  const { theme, toggleTheme } = useUiStore()

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark')
  }, [theme])

  return (
    <button
      onClick={toggleTheme}
      aria-label="Cambiar tema"
      className={
        variant === 'dark'
          ? 'rounded-md p-1.5 transition hover:bg-emerald-500/30'
          : 'rounded-md p-2 transition hover:bg-[var(--bg-elevated)]'
      }
    >
      {theme === 'dark'
        ? <Sun className="h-4 w-4" />
        : <Moon className="h-4 w-4" />}
    </button>
  )
}
