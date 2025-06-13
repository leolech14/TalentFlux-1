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
    alreadyMember: "Already a member?",
    loginHere: "Log in here",
    
    // Landing Page
    heroTitle: "AI-native HR made human.",
    heroSubtitle: "Streamline your hiring process with intelligent automation while keeping the human touch. Connect talent with opportunity through AI-powered insights.",
    candidateButton: "I'm a Candidate",
    employerButton: "I'm an Employer",
    
    // Features
    aiMatching: "AI-Powered Matching",
    aiMatchingDesc: "Smart algorithms connect the right talent with the right opportunities.",
    conversationalInterface: "Conversational Interface", 
    conversationalDesc: "Interact naturally with your AI assistant for all HR tasks.",
    analyticsInsights: "Analytics & Insights",
    analyticsDesc: "Data-driven insights to optimize your hiring process.",
    
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
    alreadyMember: "Já é membro?",
    loginHere: "Entre aqui",
    
    // Landing Page
    heroTitle: "RH nativo de IA feito humano.",
    heroSubtitle: "Simplifique seu processo de contratação com automação inteligente mantendo o toque humano. Conecte talentos com oportunidades através de insights alimentados por IA.",
    candidateButton: "Sou Candidato",
    employerButton: "Sou Empregador",
    
    // Features
    aiMatching: "Correspondência Alimentada por IA",
    aiMatchingDesc: "Algoritmos inteligentes conectam o talento certo com as oportunidades certas.",
    conversationalInterface: "Interface Conversacional",
    conversationalDesc: "Interaja naturalmente com seu assistente de IA para todas as tarefas de RH.",
    analyticsInsights: "Análises e Insights",
    analyticsDesc: "Insights baseados em dados para otimizar seu processo de contratação.",
    
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