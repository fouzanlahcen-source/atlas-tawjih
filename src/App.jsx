import { Routes, Route } from 'react-router-dom'
import Accueil from './pages/Accueil'
import CodeAcces from './pages/CodeAcces'
import Formulaire from './pages/Formulaire'
import Test from './pages/Test'
import Resultats from './pages/Resultats'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Accueil />} />
      <Route path="/code" element={<CodeAcces />} />
      <Route path="/formulaire" element={<Formulaire />} />
      <Route path="/test" element={<Test />} />
      <Route path="/resultats" element={<Resultats />} />
    </Routes>
  )
}
