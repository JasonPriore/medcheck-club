// Tipi per il portale amministrativo MedCheck

export interface Admin {
  id: string
  email: string
  name: string
  role: 'super_admin' | 'admin' | 'support'
  created_at: string
  last_login: string
}

export interface Client {
  id: string
  email: string
  organization_name: string
  organization_logo?: string
  subscription_plan: 'base' | 'plus' | 'custom'
  subscription_version: string
  subscription_start_date: string
  subscription_end_date: string
  subscription_price: number
  custom_limits?: {
    teams: number
    players: number
    price: number
    notes?: string
  }
  status: 'active' | 'suspended' | 'cancelled' | 'pending'
  created_at: string
  last_login: string
  contact_person?: string
  phone?: string
  address?: string
  vat_number?: string
  notes?: string
}

export interface ClientStats {
  id: string
  organization_name: string
  subscription_plan: string
  subscription_price: number
  teams_count: number
  players_count: number
  last_activity: string
  revenue: number
}

export interface PlatformStats {
  total_clients: number
  total_revenue_gross: number
  total_revenue_net: number
  total_teams: number
  total_players: number
  active_subscriptions: number
  monthly_recurring_revenue: number
  average_revenue_per_client: number
}

export interface RevenueData {
  month: string
  gross_revenue: number
  net_revenue: number
  new_clients: number
  churn_rate: number
}

export interface ClientOnboarding {
  email: string
  organization_name: string
  subscription_plan: 'base' | 'plus' | 'custom'
  subscription_price: number
  custom_limits?: {
    teams: number
    players: number
    price: number
    notes?: string
  }
  contact_person?: string
  phone?: string
  address?: string
  vat_number?: string
  notes?: string
}

export interface SubscriptionPlan {
  id: string
  name: 'base' | 'plus' | 'custom'
  display_name: string
  description: string
  base_price: number
  teams_limit: number
  players_limit: number
  features: string[]
  is_active: boolean
  custom_pricing_enabled: boolean
}

export interface DashboardMetrics {
  clients: {
    total: number
    active: number
    new_this_month: number
    churned_this_month: number
  }
  revenue: {
    total: number
    this_month: number
    this_year: number
    growth_rate: number
  }
  usage: {
    total_teams: number
    total_players: number
    average_teams_per_client: number
    average_players_per_client: number
  }
}

// Nuovi tipi per la gestione dei piani abbonamento
export interface SubscriptionPlanVersion {
  id: string
  plan_id: string
  version: string
  display_name: string
  description: string
  base_price: number
  teams_limit: number
  players_limit: number
  features: string[]
  is_active: boolean
  custom_pricing_enabled: boolean
  created_at: string
  created_by: string
  notes?: string
  is_current: boolean
}

export interface SubscriptionPlanTemplate {
  id: string
  name: string
  display_name: string
  description: string
  base_price: number
  teams_limit: number
  players_limit: number
  features: string[]
  is_active: boolean
  custom_pricing_enabled: boolean
  versions: SubscriptionPlanVersion[]
  current_version: string
  total_clients: number
  monthly_revenue: number
  created_at: string
  updated_at: string
}

export interface PlanAnalytics {
  plan_id: string
  plan_name: string
  total_clients: number
  active_clients: number
  monthly_revenue: number
  churn_rate: number
  growth_rate: number
  average_contract_value: number
  client_distribution: {
    new: number
    active: number
    churned: number
  }
  revenue_trend: {
    month: string
    revenue: number
    clients: number
  }[]
}

export interface PlanCreationData {
  name: string
  display_name: string
  description: string
  base_price: number
  teams_limit: number
  players_limit: number
  features: string[]
  custom_pricing_enabled: boolean
  notes?: string
}
