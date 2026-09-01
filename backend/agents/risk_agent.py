"""
وكيل المخاطر (Risk Agent)
يتنبأ بالمخاطر المحتملة في المشروع
"""
from datetime import datetime, timedelta
import random

class RiskAgent:
    def analyze_project(self, project_data: dict) -> dict:
        risks = []
        building_type = project_data.get('building_type', 'residential')
        total_area = project_data.get('total_area', 0)
        
        if total_area > 500:
            risks.append({'type': 'cost_overrun', 'severity': 'high', 'description': 'المساحة الكبيرة (>500م2) تزيد خطر تجاوز الميزانية', 'probability': 0.7, 'impact': 'تجاوز الميزانية بنسبة 15-25%', 'mitigation': 'تقسيم المشروع إلى مراحل'})
        
        location = project_data.get('location', '')
        if 'وهران' in location or 'الجزائر' in location:
            risks.append({'type': 'permit_delay', 'severity': 'medium', 'description': 'تأخير محتمل في رخص البناء', 'probability': 0.5, 'impact': 'تأخير 2-4 أسابيع', 'mitigation': 'إعداد المستندات مبكراً'})
        
        risks.append({'type': 'schedule_delay', 'severity': 'medium', 'description': 'تأخير محتمل في الجدول', 'probability': 0.6, 'impact': 'تأخير 1-3 أسابيع', 'mitigation': 'إضافة Buffer 10%'})
        
        high_risks = sum(1 for r in risks if r['severity'] == 'high')
        medium_risks = sum(1 for r in risks if r['severity'] == 'medium')
        overall_risk = 'high' if high_risks > 0 else ('medium' if medium_risks > 1 else 'low')
        
        return {'risks': risks, 'overall_risk_level': overall_risk, 'risk_count': len(risks), 'analyzed_at': datetime.now().isoformat()}
    
    def predict_timeline(self, project_data: dict) -> dict:
        total_area = project_data.get('total_area', 100)
        base_duration = total_area * 2
        type_multipliers = {'residential': 1.0, 'commercial': 1.3, 'educational': 1.5, 'healthcare': 2.0, 'mixed': 1.4}
        duration = base_duration * type_multipliers.get(project_data.get('building_type', 'residential'), 1.0)
        buffer = duration * 0.15
        start_date = datetime.now()
        end_date = start_date + timedelta(days=duration+buffer)
        
        return {'estimated_duration_days': round(duration+buffer), 'start_date': start_date.strftime('%Y-%m-%d'), 'end_date': end_date.strftime('%Y-%m-%d'),
                'phases': [{'name': 'التصميم', 'duration': round(duration*0.15)}, {'name': 'الرخص', 'duration': round(duration*0.1)},
                           {'name': 'الأساسات', 'duration': round(duration*0.2)}, {'name': 'الهيكل', 'duration': round(duration*0.3)},
                           {'name': 'التشطيب', 'duration': round(duration*0.25)}]}
