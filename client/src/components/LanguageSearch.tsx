import { useState, useRef, useEffect } from 'react';
import { Search, Globe, Check } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { SUPPORTED_LANGUAGES } from '@/services/translationService';
import { cn } from '@/lib/utils';

export function LanguageSearch() {
  const { currentLanguage, changeLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [dropdownPosition, setDropdownPosition] = useState<'right' | 'left'>('right');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const currentLang = SUPPORTED_LANGUAGES.find(lang => lang.code === currentLanguage);
  
  const filteredLanguages = SUPPORTED_LANGUAGES.filter(lang => 
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

    const handleResize = () => {
      if (isOpen) {
        calculateDropdownPosition();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('resize', handleResize);
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  const handleLanguageSelect = (languageCode: string) => {
    changeLanguage(languageCode);
    setIsOpen(false);
    setSearchQuery('');
  };

  // Calculate optimal dropdown position based on available space
  const calculateDropdownPosition = () => {
    if (!buttonRef.current) return;
    
    const buttonRect = buttonRef.current.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const dropdownWidth = 320; // 320px = w-80
    
    // Check if dropdown would overflow on the right
    const spaceOnRight = viewportWidth - buttonRect.right;
    const spaceOnLeft = buttonRect.left;
    
    if (spaceOnRight < dropdownWidth && spaceOnLeft > spaceOnRight) {
      setDropdownPosition('left');
    } else {
      setDropdownPosition('right');
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    if (!isOpen) {
      calculateDropdownPosition();
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        ref={buttonRef}
        onClick={toggleDropdown}
        className={cn(
          "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors",
          "bg-white dark:bg-gray-800 border-[0.5px] border-gray-200 dark:border-gray-700",
          "hover:bg-gray-50 dark:hover:bg-gray-700",
          "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:ring-offset-1",
          isOpen && "ring-1 ring-blue-500 ring-offset-1"
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
          "absolute top-12 z-50",
          "w-80 max-w-[calc(100vw-1rem)]",
          "max-h-[70vh] sm:max-h-96",
          "bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl rounded-2xl shadow-2xl",
          "border border-white/20 dark:border-gray-700/20",
          "overflow-hidden flex flex-col",
          // Smart positioning based on available space
          dropdownPosition === 'right' ? "right-0" : "left-0",
          // Mobile specific adjustments
          "max-sm:left-1/2 max-sm:transform max-sm:-translate-x-1/2 max-sm:w-[calc(100vw-2rem)]"
        )}>
          {/* Glass frame effect with gradient */}
          <div className="absolute inset-0 rounded-2xl border border-white/30 dark:border-gray-400/30 pointer-events-none" />
          <div className="absolute inset-[1px] rounded-2xl border border-white/10 dark:border-gray-500/10 pointer-events-none" />
          
          {/* Inner glass background */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 via-white/5 to-transparent dark:from-gray-100/20 dark:via-gray-100/5 dark:to-transparent pointer-events-none" />

          <div className="relative">
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
                    "w-full pl-10 pr-4 py-3 rounded-lg border-[0.5px] border-white/20 dark:border-gray-600/30",
                    "bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-gray-100",
                    "placeholder-gray-500 dark:placeholder-gray-400",
                    "focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-transparent",
                    "text-sm"
                  )}
                />
              </div>
            </div>

            {/* Language List */}
            <div className="overflow-y-auto flex-1 max-h-72 overscroll-contain">
              {filteredLanguages.length > 0 ? (
                <div className="py-2">
                  {filteredLanguages.map((language) => (
                    <button
                      key={language.code}
                      onClick={() => handleLanguageSelect(language.code)}
                      className={cn(
                        "w-full px-4 py-3 text-left hover:bg-white/20 dark:hover:bg-gray-700/20 transition-colors",
                        "flex items-center justify-between border-none bg-transparent",
                        currentLanguage === language.code && "bg-blue-50/20 dark:bg-blue-900/20"
                      )}
                    >
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {language.nativeName}
                        </span>
                        <span className="text-xs text-gray-500 dark:text-gray-400 truncate">
                          {language.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                        <span className="text-xs text-gray-400 uppercase font-medium">
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
                {filteredLanguages.length} of {SUPPORTED_LANGUAGES.length} languages
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}