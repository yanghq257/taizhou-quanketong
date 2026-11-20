import { Route, Routes } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { HomePage } from './pages/HomePage'
import { SymptomDetailPage } from './pages/SymptomDetailPage'
import { ConsultPage } from './pages/ConsultPage'
import { MedicationPage } from './pages/MedicationPage'
import { ScriptsPage } from './pages/ScriptsPage'
import { ChecklistPage } from './pages/ChecklistPage'
import { SettingsPage } from './pages/SettingsPage'
import { NotFoundPage } from './pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route element={<AppShell />}>
        <Route index element={<HomePage />} />
        <Route path="symptom/:id" element={<SymptomDetailPage />} />
        <Route path="consult" element={<ConsultPage />} />
        <Route path="medications" element={<MedicationPage />} />
        <Route path="scripts" element={<ScriptsPage />} />
        <Route path="checklist" element={<ChecklistPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
