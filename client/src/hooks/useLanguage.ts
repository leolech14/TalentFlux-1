import { create } from "zustand";
import { persist } from "zustand/middleware";

type Language = "en" | "pt" | "es" | "fr" | "de" | "it" | "zh" | "ja" | "ko" | "ar" | "hi" | "ru";

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
          // Trigger a global language change event
          window.dispatchEvent(new CustomEvent('languageChanged', {
            detail: { language }
          }));
        }
      },
    }),
    {
      name: "language-preference",
    }
  )
);

// Comprehensive translation dictionary
export const translations = {
  en: {
    // Navigation & Header
    dashboard: "Dashboard",
    profile: "Profile",
    settings: "Settings",
    logout: "Logout",
    home: "Home",
    about: "About",
    contact: "Contact",
    features: "Features",
    pricing: "Pricing",
    
    // Auth
    login: "Login",
    signup: "Sign Up",
    welcomeBack: "Welcome Back",
    createAccount: "Create Account",
    alreadyMember: "Already a member?",
    loginHere: "Log in here",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    forgotPassword: "Forgot Password?",
    rememberMe: "Remember me",
    
    // Landing Page
    heroTitle: "AI-native HR made human.",
    heroSubtitle: "Streamline your hiring process with intelligent automation while keeping the human touch. Connect talent with opportunity through AI-powered insights.",
    candidateButton: "I'm a Candidate",
    employerButton: "I'm an Employer",
    getStarted: "Get Started",
    learnMore: "Learn More",
    
    // Features
    aiMatching: "AI-Powered Matching",
    aiMatchingDesc: "Smart algorithms connect the right talent with the right opportunities.",
    conversationalInterface: "Conversational Interface", 
    conversationalDesc: "Interact naturally with your AI assistant for all HR tasks.",
    analyticsInsights: "Analytics & Insights",
    analyticsDesc: "Data-driven insights to optimize your hiring process.",
    voiceEnabled: "Voice-Enabled",
    voiceEnabledDesc: "Create CVs and interact using natural voice commands.",
    realTimeAnalytics: "Real-time Analytics",
    realTimeAnalyticsDesc: "Get instant insights into your hiring pipeline.",
    smartMatching: "Smart Matching",
    smartMatchingDesc: "AI matches candidates with perfect job opportunities.",
    
    // CV Assistant
    cvAssistant: "CV Assistant",
    createCV: "Create Your CV with AI Magic",
    startRecording: "Click the microphone to start recording",
    listening: "Listening...",
    nextQuestion: "Next Question",
    skipQuestion: "Skip this question",
    tellUsAboutYourself: "Tell us about yourself",
    personalInformation: "Personal Information",
    workExperience: "Work Experience",
    education: "Education",
    skills: "Skills",
    generateCV: "Generate CV",
    downloadCV: "Download CV",
    previewCV: "Preview CV",
    
    // Dashboard
    widgets: "Widgets",
    addWidget: "Add Widget",
    removeWidget: "Remove Widget",
    analytics: "Analytics",
    candidates: "Candidates",
    jobs: "Jobs",
    interviews: "Interviews",
    reports: "Reports",
    
    // AI Assistant
    aiAssistant: "AI Assistant",
    askQuestion: "Ask me anything...",
    howCanIHelp: "How can I help you today?",
    suggestions: "Suggestions",
    
    // Forms & Inputs
    firstName: "First Name",
    lastName: "Last Name",
    fullName: "Full Name",
    phoneNumber: "Phone Number",
    address: "Address",
    city: "City",
    country: "Country",
    zipCode: "ZIP Code",
    website: "Website",
    linkedin: "LinkedIn",
    github: "GitHub",
    
    // Job Related
    jobTitle: "Job Title",
    company: "Company",
    location: "Location",
    salary: "Salary",
    jobType: "Job Type",
    fullTime: "Full Time",
    partTime: "Part Time",
    contract: "Contract",
    freelance: "Freelance",
    remote: "Remote",
    onSite: "On-site",
    hybrid: "Hybrid",
    
    // Common Actions
    save: "Save",
    cancel: "Cancel",
    delete: "Delete",
    edit: "Edit",
    create: "Create",
    update: "Update",
    submit: "Submit",
    search: "Search",
    filter: "Filter",
    sort: "Sort",
    export: "Export",
    import: "Import",
    upload: "Upload",
    download: "Download",
    
    // Status & Messages
    loading: "Loading...",
    error: "Error",
    success: "Success",
    warning: "Warning",
    info: "Information",
    noData: "No data available",
    noResults: "No results found",
    tryAgain: "Try again",
    
    // Time & Dates
    today: "Today",
    yesterday: "Yesterday",
    tomorrow: "Tomorrow",
    thisWeek: "This week",
    thisMonth: "This month",
    thisYear: "This year",
    
    // Theme & Settings
    theme: "Theme",
    language: "Language",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    systemMode: "System",
    
    // Footer
    allRightsReserved: "All rights reserved",
    privacyPolicy: "Privacy Policy",
    termsOfService: "Terms of Service",
    
    // Notifications
    notifications: "Notifications",
    markAsRead: "Mark as read",
    markAllAsRead: "Mark all as read",
    noNotifications: "No notifications",
  },
  pt: {
    // Navigation & Header
    dashboard: "Painel",
    profile: "Perfil",
    settings: "Configurações",
    logout: "Sair",
    home: "Início",
    about: "Sobre",
    contact: "Contato",
    features: "Recursos",
    pricing: "Preços",
    
    // Auth
    login: "Entrar",
    signup: "Cadastrar",
    welcomeBack: "Bem-vindo de Volta",
    createAccount: "Criar Conta",
    alreadyMember: "Já é membro?",
    loginHere: "Entre aqui",
    email: "E-mail",
    password: "Senha",
    confirmPassword: "Confirmar Senha",
    forgotPassword: "Esqueceu a senha?",
    rememberMe: "Lembrar de mim",
    
    // Landing Page
    heroTitle: "RH nativo de IA feito humano.",
    heroSubtitle: "Simplifique seu processo de contratação com automação inteligente mantendo o toque humano. Conecte talentos com oportunidades através de insights alimentados por IA.",
    candidateButton: "Sou Candidato",
    employerButton: "Sou Empregador",
    getStarted: "Começar",
    learnMore: "Saiba Mais",
    
    // Features
    aiMatching: "Correspondência Alimentada por IA",
    aiMatchingDesc: "Algoritmos inteligentes conectam o talento certo com as oportunidades certas.",
    conversationalInterface: "Interface Conversacional",
    conversationalDesc: "Interaja naturalmente com seu assistente de IA para todas as tarefas de RH.",
    analyticsInsights: "Análises e Insights",
    analyticsDesc: "Insights baseados em dados para otimizar seu processo de contratação.",
    voiceEnabled: "Habilitado por Voz",
    voiceEnabledDesc: "Crie CVs e interaja usando comandos de voz naturais.",
    realTimeAnalytics: "Análises em Tempo Real",
    realTimeAnalyticsDesc: "Obtenha insights instantâneos sobre seu pipeline de contratação.",
    smartMatching: "Correspondência Inteligente",
    smartMatchingDesc: "IA combina candidatos com oportunidades de trabalho perfeitas.",
    
    // CV Assistant
    cvAssistant: "Assistente de CV",
    createCV: "Crie seu CV com Magia de IA",
    startRecording: "Clique no microfone para começar a gravar",
    listening: "Ouvindo...",
    nextQuestion: "Próxima Pergunta",
    skipQuestion: "Pular esta pergunta",
    tellUsAboutYourself: "Conte-nos sobre você",
    personalInformation: "Informações Pessoais",
    workExperience: "Experiência Profissional",
    education: "Educação",
    skills: "Habilidades",
    generateCV: "Gerar CV",
    downloadCV: "Baixar CV",
    previewCV: "Visualizar CV",
    
    // Dashboard
    widgets: "Widgets",
    addWidget: "Adicionar Widget",
    removeWidget: "Remover Widget",
    analytics: "Análises",
    candidates: "Candidatos",
    jobs: "Vagas",
    interviews: "Entrevistas",
    reports: "Relatórios",
    
    // AI Assistant
    aiAssistant: "Assistente de IA",
    askQuestion: "Pergunte-me qualquer coisa...",
    howCanIHelp: "Como posso ajudá-lo hoje?",
    suggestions: "Sugestões",
    
    // Forms & Inputs
    firstName: "Nome",
    lastName: "Sobrenome",
    fullName: "Nome Completo",
    phoneNumber: "Número de Telefone",
    address: "Endereço",
    city: "Cidade",
    country: "País",
    zipCode: "CEP",
    website: "Site",
    linkedin: "LinkedIn",
    github: "GitHub",
    
    // Job Related
    jobTitle: "Cargo",
    company: "Empresa",
    location: "Localização",
    salary: "Salário",
    jobType: "Tipo de Trabalho",
    fullTime: "Tempo Integral",
    partTime: "Meio Período",
    contract: "Contrato",
    freelance: "Freelancer",
    remote: "Remoto",
    onSite: "Presencial",
    hybrid: "Híbrido",
    
    // Common Actions
    save: "Salvar",
    cancel: "Cancelar",
    delete: "Excluir",
    edit: "Editar",
    create: "Criar",
    update: "Atualizar",
    submit: "Enviar",
    search: "Pesquisar",
    filter: "Filtrar",
    sort: "Ordenar",
    export: "Exportar",
    import: "Importar",
    upload: "Carregar",
    download: "Baixar",
    
    // Status & Messages
    loading: "Carregando...",
    error: "Erro",
    success: "Sucesso",
    warning: "Aviso",
    info: "Informação",
    noData: "Nenhum dado disponível",
    noResults: "Nenhum resultado encontrado",
    tryAgain: "Tente novamente",
    
    // Time & Dates
    today: "Hoje",
    yesterday: "Ontem",
    tomorrow: "Amanhã",
    thisWeek: "Esta semana",
    thisMonth: "Este mês",
    thisYear: "Este ano",
    
    // Theme & Settings
    theme: "Tema",
    language: "Idioma",
    lightMode: "Modo Claro",
    darkMode: "Modo Escuro",
    systemMode: "Sistema",
    
    // Footer
    allRightsReserved: "Todos os direitos reservados",
    privacyPolicy: "Política de Privacidade",
    termsOfService: "Termos de Serviço",
    
    // Notifications
    notifications: "Notificações",
    markAsRead: "Marcar como lida",
    markAllAsRead: "Marcar todas como lidas",
    noNotifications: "Sem notificações",
  },
  // Add more languages as needed
  es: {
    dashboard: "Panel de Control",
    profile: "Perfil",
    settings: "Configuración",
    logout: "Cerrar Sesión",
    // ... add more Spanish translations
  },
  fr: {
    dashboard: "Tableau de Bord",
    profile: "Profil",
    settings: "Paramètres",
    logout: "Déconnexion",
    // ... add more French translations
  },
  de: {
    dashboard: "Dashboard",
    profile: "Profil",
    settings: "Einstellungen",
    logout: "Abmelden",
    // ... add more German translations
  },
  it: {
    dashboard: "Cruscotto",
    profile: "Profilo",
    settings: "Impostazioni",
    logout: "Disconnetti",
    // ... add more Italian translations
  },
  zh: {
    dashboard: "仪表板",
    profile: "个人资料",
    settings: "设置",
    logout: "登出",
    // ... add more Chinese translations
  },
  ja: {
    dashboard: "ダッシュボード",
    profile: "プロフィール",
    settings: "設定",
    logout: "ログアウト",
    // ... add more Japanese translations
  },
  ko: {
    dashboard: "대시보드",
    profile: "프로필",
    settings: "설정",
    logout: "로그아웃",
    // ... add more Korean translations
  },
  ar: {
    dashboard: "لوحة التحكم",
    profile: "الملف الشخصي",
    settings: "الإعدادات",
    logout: "تسجيل الخروج",
    // ... add more Arabic translations
  },
  hi: {
    dashboard: "डैशबोर्ड",
    profile: "प्रोफ़ाइल",
    settings: "सेटिंग्स",
    logout: "लॉग आउट",
    // ... add more Hindi translations
  },
  ru: {
    dashboard: "Панель управления",
    profile: "Профиль",
    settings: "Настройки",
    logout: "Выйти",
    // ... add more Russian translations
  },
};

export function useTranslation() {
  const { language } = useLanguage();
  
  const t = (key: keyof typeof translations.en): string => {
    const currentTranslations = translations[language as keyof typeof translations] as typeof translations.en;
    const translation = currentTranslations?.[key] || translations.en[key] || key;
    return translation;
  };
  
  return { t, language, setLanguage: useLanguage.getState().setLanguage };
} 