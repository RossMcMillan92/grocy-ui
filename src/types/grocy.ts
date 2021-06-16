export type GrocySystemInfo = {
  grocy_version: {
    Version: string
    ReleaseDate: string
  }
  php_version: string
  sqlite_version: string
}

export type Chore = {
  chore_id: string
  chore_name: string
  last_tracked_time: string
  next_estimated_execution_time: string | null
  next_execution_assigned_to_user_id: string | null
  track_date_only: "0" | "1"
}

export type DetailedChore = {
  chore: {
    assignment_config: string
    assignment_type:
      | "no-assignment"
      | "who-least-did-first"
      | "random"
      | "in-alphabetical-order"
    consume_product_on_execution: "0" | "1"
    description: string
    id: string
    name: string
    next_execution_assigned_to_user_id: string
    period_config: string
    period_days: string
    period_interval: string
    period_type: "dynamic-regular" | "weekly" | "monthly"
    product_id: string
    product_amount: string | null
    rollover: "0" | "1"
    row_created_timestamp: string
    track_date_only: "0" | "1"
  }
  last_tracked: string
  tracked_count: number
  last_done_by?: {
    id: string
    username: string
    first_name: string
    last_name: string
    row_created_timestamp: string
    display_name: string
  }
  next_estimated_execution_time: string
  next_execution_assigned_user?: {
    id: string
    username: string
    first_name: string
    last_name: string
    row_created_timestamp: string
    display_name: string
  }
}

export type ChoreCreation = Omit<
  Omit<
    Omit<DetailedChore["chore"], "row_created_timestamp">,
    "next_execution_assigned_to_user_id"
  >,
  "id"
>

export type Settings = {
  night_mode_enabled: "0" | "1"
  auto_night_mode_enabled: "0" | "1"
  auto_night_mode_time_range_from: string
  auto_night_mode_time_range_to: string
  auto_night_mode_time_range_goes_over_midnight: boolean
  currently_inside_night_mode_range: boolean
  keep_screen_on: boolean
  keep_screen_on_when_fullscreen_card: boolean
  product_presets_location_id: number
  product_presets_product_group_id: number
  product_presets_qu_id: number
  stock_expring_soon_days: number
  stock_default_purchase_amount: number
  stock_default_consume_amount: number
  scan_mode_consume_enabled: boolean
  scan_mode_purchase_enabled: "0" | "1"
  show_icon_on_stock_overview_page_when_product_is_on_shopping_list: boolean
  shopping_list_to_stock_workflow_auto_submit_when_prefilled: boolean
  shopping_list_show_calendar: boolean
  shopping_list_disable_auto_compact_view_on_mobile: boolean
  recipe_ingredients_group_by_product_group: boolean
  chores_due_soon_days: number
  batteries_due_soon_days: number
  tasks_due_soon_days: number
  auto_reload_on_db_change: boolean
  show_clock_in_header: boolean
  quagga2_numofworkers: number
}

export type User = {
  id: string
  username: string
  first_name: string
  last_name: string
  row_created_timestamp: string
  display_name: string
}
