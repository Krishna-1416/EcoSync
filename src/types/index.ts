export interface CartItem {
  id: string;
  name: string;
  quantity: number;
  category: string;
  baseCo2: number; // base carbon emission per unit in kg
}

export interface EmissionResult {
  co2_kg: number;
  relatable_comparison: string;
  micro_nudge: string;
}

export interface Settings {
  reviewerApiKey: string;
}

export interface CartProps {
  items: CartItem[];
  onAddItem: (item: Omit<CartItem, 'id'>) => void;
  onRemoveItem: (id: string) => void;
  onUpdateQuantity: (id: string, quantity: number) => void;
  isCalculating: boolean;
  onCalculate: () => void;
  customPrompt: string;
  onUpdateCustomPrompt: (prompt: string) => void;
}

export interface NudgeDisplayProps {
  result: EmissionResult | null;
  error: string | null;
  isCalculating: boolean;
}

export interface SettingsProps {
  settings: Settings;
  onUpdateSettings: (settings: Settings) => void;
}
