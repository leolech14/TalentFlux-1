import { useState, useRef, useEffect } from 'react';
import { Search, Globe, Check } from 'lucide-react';
import { motion, useDragControls, PanInfo } from 'framer-motion';
import { useLanguageContext } from './LanguageContext';
import { SUPPORTED_LANGUAGES } from '@/services/translationService';
import { cn } from '@/lib/utils';

export function LanguageSearch() {
  const { currentLanguage, changeLanguage } = useLanguageContext();
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const constraintsRef = useRef<HTMLDivElement>(null);
  const dragControls = useDragControls();

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

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Load saved position on component mount
  useEffect(() => {
    const savedPosition = localStorage.getItem('languageButtonPosition');
    if (savedPosition) {
      setPosition(JSON.parse(savedPosition));
    }
  }, []);

  const handleLanguageSelect = (languageCode: string) => {
    if (!isDragging) {
      changeLanguage(languageCode);
      setIsOpen(false);
      setSearchQuery('');
    }
  };

  const handleDragEnd = (event: any, info: PanInfo) => {
    setIsDragging(false);
    setPosition({ x: info.offset.x, y: info.offset.y });
    
    // Store position in localStorage to persist across page reloads
    localStorage.setItem('languageButtonPosition', JSON.stringify({ x: info.offset.x, y: info.offset.y }));
  };

  const handleDragStart = () => {
    setIsDragging(true);
    setIsOpen(false); // Close dropdown when dragging starts
  };

  const handleButtonClick = () => {
    if (!isDragging) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    }
  };

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-40">
      <motion.div
        ref={dropdownRef}
        className="relative pointer-events-auto"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ 
          scale: 1, 
          opacity: 1,
          x: position.x,
          y: position.y
        }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        drag
        dragControls={dragControls}
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        whileDrag={{ scale: 1.05, zIndex: 1000 }}
        style={{ 
          position: 'absolute',
          top: '1rem',
          right: '1rem'
        }}
      >
        <motion.button
          onClick={handleButtonClick}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-lg transition-colors cursor-grab active:cursor-grabbing",
            "bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-white/30 dark:border-gray-700/30",
            "hover:bg-white/95 dark:hover:bg-gray-700/95 shadow-lg",
            "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1",
            isOpen && "ring-2 ring-blue-500 ring-offset-1"
          )}
          aria-label="Select language"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Globe className="w-4 h-4 text-gray-600 dark:text-gray-300" />
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            {currentLang?.nativeName || 'English'}
          </span>
          <span className="text-xs text-gray-500 dark:text-gray-400 uppercase">
            {currentLanguage}
          </span>
        </motion.button>

        {isOpen && (
          <div className={cn(
            "absolute top-12 right-0 w-80",
            "bg-white/10 dark:bg-gray-900/10 backdrop-blur-2xl rounded-2xl shadow-2xl",
            "border border-white/20 dark:border-gray-700/20 z-50",
            "max-h-96 overflow-hidden flex flex-col"
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
                      "w-full pl-10 pr-4 py-3 rounded-lg border border-white/20 dark:border-gray-600/30",
                      "bg-white/50 dark:bg-gray-700/50 backdrop-blur-sm text-gray-900 dark:text-gray-100",
                      "placeholder-gray-500 dark:placeholder-gray-400",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                      "text-sm"
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
                  {filteredLanguages.length} of {SUPPORTED_LANGUAGES.length} languages
                </p>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}