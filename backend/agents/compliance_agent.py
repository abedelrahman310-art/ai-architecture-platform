"""
وكيل الامتثال (Compliance Agent)
يتحقق من امتثال التصميم للوائح البناء الجزائرية
"""
from datetime import datetime
from typing import List, Dict

class ComplianceAgent:
    REGULATIONS = {
        'front_setback': {'min': 3.0, 'description': 'الارتداد الأمامي'},
        'side_setback': {'min': 2.0, 'description': 'الارتداد الجانبي'},
        'rear_setback': {'min': 2.0, 'description': 'الارتداد الخلفي'},
        'max_height': {'value': 12.0, 'description': 'الارتفاع الأقصى (متر)'},
        'max_floors': {'value': 3, 'description': 'عدد الطوابق الأقصى'},
        'max_coverage': {'percentage': 0.45, 'description': 'نسبة التغطية القصوى'},
        'min_green_space': {'percentage': 0.15, 'description': 'الحد الأدنى للمساحات الخضراء'},
    }
    
    def check_compliance(self, design: Dict, site: Dict) -> Dict:
        violations = []
        site_area = site.get('area', 300)
        layout = design.get('layout', [])
        
        if layout:
            min_y = min(room.get('y', 0) for room in layout)
            if min_y < self.REGULATIONS['front_setback']['min']:
                violations.append({'type': 'setback_violation', 'severity': 'critical', 'rule': 'front_setback',
                    'required': self.REGULATIONS['front_setback']['min'], 'actual': min_y,
                    'description': f'الارتداد الأمامي {min_y}م < {self.REGULATIONS["front_setback"]["min"]}م المطلوب'})
        
        total_built = sum(room.get('area', 0) for room in layout)
        coverage_ratio = total_built / site_area if site_area > 0 else 0
        if coverage_ratio > self.REGULATIONS['max_coverage']['percentage']:
            violations.append({'type': 'coverage_violation', 'severity': 'critical', 'rule': 'max_coverage',
                'required': f'{self.REGULATIONS["max_coverage"]["percentage"]*100}%', 'actual': f'{coverage_ratio*100:.1f}%',
                'description': f'نسبة التغطية {coverage_ratio*100:.1f}% تتجاوز {self.REGULATIONS["max_coverage"]["percentage"]*100}%'})
        
        floors = design.get('floors', 2)
        if floors > self.REGULATIONS['max_floors']['value']:
            violations.append({'type': 'height_violation', 'severity': 'critical', 'rule': 'max_floors',
                'required': self.REGULATIONS['max_floors']['value'], 'actual': floors,
                'description': f'عدد الطوابق {floors} يتجاوز {self.REGULATIONS["max_floors"]["value"]}'})
        
        critical = sum(1 for v in violations if v['severity'] == 'critical')
        compliance_score = 100 - (critical * 25)
        
        return {'violations': violations, 'compliance_score': max(0, compliance_score),
                'status': 'compliant' if critical == 0 else 'non_compliant', 'checked_at': datetime.now().isoformat()}
