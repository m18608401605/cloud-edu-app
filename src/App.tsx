import { useEffect, useState } from 'react'
import './App.css'
import { HomePage } from './components/HomePage'
import { JumpPage } from './components/JumpPage'
import { StarBackground } from './components/StarBackground'
import { useStore } from './store/useStore'

function App() {
  const [screen, setScreen] = useState<'home' | 'jump'>(() => {
    if (typeof window === 'undefined') return 'home'
    const params = new URLSearchParams(window.location.search)
    return params.get('jump') === '1' ? 'jump' : 'home'
  })
  const colorMode = useStore(state => state.appState.colorMode ?? 'dark')
  const starBrightness = useStore(state => state.appState.uiSettings?.starBrightness ?? 60)
  const effectiveStarBrightness = screen === 'home' ? Math.max(starBrightness, 84) : starBrightness

  useEffect(() => {
    void useStore.getState().init()
  }, [])

  return (
    <div className="relative isolate min-h-screen overflow-hidden">
      <StarBackground isLight={colorMode === 'light'} starBrightness={effectiveStarBrightness} />
      {screen === 'home' ? (
        <HomePage onEnterPoints={() => setScreen('jump')} />
      ) : (
        <JumpPage onBackHome={() => setScreen('home')} />
      )}
    </div>
  )
}

export default App
