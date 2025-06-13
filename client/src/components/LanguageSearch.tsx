import { useState, useRef, useEffect } from 'react';
import { Search, Globe, Check } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { cn } from '@/lib/utils';

export function LanguageSearch() {
  const { currentLanguage, changeLanguage, supportedLanguages, getCurrentLanguageInfo } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLang = getCurrentLanguageInfo();
  
  const filteredLanguages = supportedLanguages.filter(lang => 
    lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lang.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
          "bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700",
          "hover:bg-gray-50 dark:hover:bg-gray-700",
          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
          isOpen && "ring-2 ring-blue-500 ring-offset-1"
        )}
        aria-label="Select language"
      >
        <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
        <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
          {currentLang?.nativeName || 'English'}
        </span>
        <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
          {currentLanguage}
        </span>
      </button>

      {isOpen && (
        <div className={cn(
          "fixed inset-x-4 mt-2 sm:absolute sm:right-0 sm:left-auto sm:w-80",
          "bg-white/90 dark:bg-gray-800/90 backdrop-blur-md rounded-lg shadow-xl",
          "border border-white/20 dark:border-gray-700/30 z-50",
          "max-h-96 overflow-hidden flex flex-col",
          "sm:max-h-96"
        )}>
          {/* Search Input */}
          <div className="p-4 border-b border-white/10 dark:border-gray-700/30">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search languages..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  "w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 dark:border-gray-600/30",
                  "bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-gray-100",
                  "placeholder-gray-500 dark:placeholder-gray-400",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                  "text-base sm:text-sm"
                )}
              />
            </div>
          </div>

          {/* Language List */}
          <div className="overflow-y-auto flex-1 max-h-72">
            {filteredLanguages.length > 0 ? (
              <div className="py-2">
                {filteredLanguages.map((language) => (
                  <button
                    key={language.code}
                    onClick={() => handleLanguageSelect(language.code)}
                    className={cn(
                      "w-full px-4 py-4 text-left hover:bg-white/30 dark:hover:bg-gray-700/30",
                      "flex items-center justify-between transition-all duration-200",
                      "backdrop-blur-sm",
                      currentLanguage === language.code && "bg-blue-50/30 dark:bg-blue-900/20"
                    )}
                  >
                    <div className="flex flex-col min-w-0 flex-1">
                      <span className="text-base sm:text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                        {language.nativeName}
                      </span>
                      <span className="text-sm sm:text-xs text-gray-500 dark:text-gray-400 truncate">
                        {language.name}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                      <span className="text-xs text-gray-400 uppercase font-mono">
                        {language.code}
                      </span>
                      {currentLanguage === language.code && (
                        <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                      )}
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-8 text-center text-gray-500 dark:text-gray-400">
                <Globe className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No languages found</p>
                <p className="text-xs">Try a different search term</p>
              </div>
            )}
          </div>

          {/* Footer Info */}
          <div className="px-4 py-3 border-t border-white/10 dark:border-gray-700/30 bg-white/20 dark:bg-gray-800/20 backdrop-blur-sm">
            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
              {filteredLanguages.length} of {supportedLanguages.length} languages
            </p>
          </div>
        </div>
      )}
    </div>
  );
}