export interface WidgetModule {
  id: string;
  label: string;
  userTypes: Array<'candidate' | 'employer'>;
  component: React.ComponentType<any>;
  intent?: string;
  size: 'small' | 'medium' | 'large';
  category: string;
}

export interface WidgetProps {
  className?: string;
}