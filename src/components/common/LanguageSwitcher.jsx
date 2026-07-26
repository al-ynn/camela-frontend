import { useTranslation } from 'react-i18next'
import { Flag, FlagIcon, Globe } from 'lucide-react'

const LANGUAGES = [
  { code: 'en', name: 'English'},
  { code: 'zh', name: '中文' },
  { code: 'ms', name: 'Bahasa Melayu'},
]

const LanguageSwitcher = () => {
  const { i18n } = useTranslation()

  const currentLang = LANGUAGES.find((lang) => lang.code === i18n.language) || LANGUAGES[0]

  const handleLanguageChange = (langCode) => {
    i18n.changeLanguage(langCode)
  }

  return (
    <div className="relative group">
      <button className="flex items-center gap-1.5 px-2 py-2 sm:px-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
        <Globe size={16} className="text-gray-500" />
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="hidden sm:inline text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
          {currentLang.name}
        </span>
      </button>

      <div className="absolute right-0 top-full mt-1 w-48 bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-100 dark:border-gray-800 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
        {LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            onClick={() => handleLanguageChange(lang.code)}
            className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
              lang.code === i18n.language
                ? 'bg-brand-50 dark:bg-brand-900/20 text-brand-600 dark:text-brand-400'
                : 'text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800'
            }`}
          >
            <span className="text-lg">{lang.flag}</span>
            <span>{lang.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default LanguageSwitcher
