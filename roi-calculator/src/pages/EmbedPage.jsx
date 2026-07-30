import CalculatorCore from '../components/CalculatorCore'
import { EmbedThemeProvider } from '../context/ThemeContext'

export default function EmbedPage() {
  return (
    <EmbedThemeProvider>
      <div className="bg-gray-50 dark:bg-gray-950 text-gray-900 dark:text-white">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <CalculatorCore />
        </div>
      </div>
    </EmbedThemeProvider>
  )
}
