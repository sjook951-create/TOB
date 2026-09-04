export type PortalType = 'B2C' | 'PLANNER' | 'OSM' | 'SCM' | 'PMS' | 'BIS' | 'BUILDING';

export interface ProcessStep {
  id: string; // e.g., 'U1', 'U2'
  name: string;
  actor: '공급상' | '운영상' | '판매상' | '판매자' | '소비자' | '이모' | '건물주';
  systemModule: 'BIS' | 'PMS' | 'SCM' | 'SMS' | 'OSM' | 'B2C';
  description: string;
  relatedPrograms: string[];
  inputData: string[];
  outputData: string[];
}

export interface UIComponent {
  name: string;
  type: 'Header' | 'Form' | 'Table' | 'CardGrid' | 'FilterBar' | 'Modal' | 'Chart' | 'Timeline' | 'BadgeGroup' | 'ActionToolbar';
  description: string;
  fields?: string[];
}

export interface ScreenSpec {
  id: string; // e.g., 'SCR-B2C-001'
  title: string;
  portal: PortalType;
  portalName: string;
  role: string;
  path: string;
  summary: string;
  gapType: 'CBO' | 'NVR' | 'INT' | 'BPM' | 'PRO'; // From document page 2
  processCodes: string[]; // ['U1', 'U2']
  systemModule: 'B2C' | 'OSM' | 'SCM' | 'SMS' | 'PMS' | 'BIS';
  keyFeatures: string[];
  uiComponents: UIComponent[];
  dataItems: {
    inputs: string[];
    outputs: string[];
  };
  layoutDescription: string;
  wireframeData: {
    badge: string;
    sectionTitle: string;
    stats?: { label: string; value: string; sub?: string }[];
    sections: {
      title: string;
      description?: string;
      items: any[];
      type: 'hero' | 'grid' | 'table' | 'form' | 'steps' | 'kanban' | 'detail';
    }[];
  };
}
