import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "pt";

interface LanguageStore {
  language: Language;
  setLanguage: (language: Language) => void;
}

export const useLanguage = create<LanguageStore>()(
  persist(
    (set, get) => ({
      language: "en",
      setLanguage: (language) => {
        const current = get().language;
        if (current !== language) {
          set({ language });
        }
      },
    }),
    {
      name: "language-preference",
    }
  )
);

// Translation helper
export const translations = {
  en: {
    // Navigation
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    
    // Auth
    login: "Login",
    signup: "Sign Up",
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    
    // CV Assistant
    cvAssistant: "CV Assistant",
    createCV: "Create Your CV with AI Magic",
    startRecording: "Click the microphone to start recording",
    listening: "Listening...",
    nextQuestion: "Next Question",
    skipQuestion: "Skip this question",
    
    // Dashboard
    widgets: "Widgets",
    addWidget: "Add Widget",
    removeWidget: "Remove Widget",
    
    // Common
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    loading: "Loading...",
    error: "Error",
    success: "Success",
  },
  pt: {
    // Navigation
    dashboard: "Painel",
    profile: "Perfil",
    settings: "Configurações",
    logout: "Sair",
    
    // Auth
    login: "Entrar",
    signup: "Cadastrar",
    welcomeBack: "Bem-vindo de Volta",
    createAccount: "Criar Conta",
    
    // CV Assistant
    cvAssistant: "Assistente de CV",
    createCV: "Crie seu CV com Magia de IA",
    startRecording: "Clique no microfone para começar a gravar",
    listening: "Ouvindo...",
    nextQuestion: "Próxima Pergunta",
    skipQuestion: "Pular esta pergunta",
    
    // Dashboard
    widgets: "Widgets",
    addWidget: "Adicionar Widget",
    removeWidget: "Remover Widget",
    
    // Common
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
  },
};

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: keyof typeof translations.en): string => {
    return translations[language][key] || translations.en[key] || key;
  };
  
  return { t, language };
} 