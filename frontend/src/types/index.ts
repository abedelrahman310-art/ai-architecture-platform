export interface Project {
  id: number;
  name: string;
  description: string;
  location: string;
  client_name: string;
  total_area: number;
  building_type: 'residential' | 'commercial' | 'educational' | 'healthcare' | 'mixed';
  spaces_count: number;
  alternatives_count: number;
  created_at: string;
  updated_at: string;
}

export interface ProgramSpace {
  id: number;
  name: string;
  category: 'living' | 'sleeping' | 'kitchen' | 'bathroom' | 'circulation' | 'service' | 'other';
  min_area: number;
  target_area: number;
  max_area: number;
  capacity: number;
  adjacencies: string[];
  priority: number;
  notes: string;
  created_at: string;
}

export interface DesignAlternative {
  id: number;
  name: string;
  version: number;
  total_built_area: number | null;
  efficiency_ratio: number | null;
  energy_score: number | null;
  daylight_score: number | null;
  compliance_status: 'compliant' | 'warnings' | 'violations';
  is_selected: boolean;
  spaces_count: number;
  created_at: string;
}

export interface SpaceAllocation {
  id: number;
  alternative: number;
  program_space: number;
  program_space_name: string;
  program_space_category: string;
  allocated_area: number;
  center_x: number | null;
  center_y: number | null;
  center_z: number;
  width: number | null;
  depth: number | null;
  meets_requirements: boolean;
  created_at: string;
}

export interface RegulationRule {
  id: number;
  name: string;
  category: 'setbacks' | 'height' | 'coverage' | 'floor_area_ratio' | 'parking' | 'lighting' | 'ventilation';
  rule_expression: string;
  severity: 'critical' | 'warning' | 'info';
  applies_to: string[];
  description: string;
}
