"""
محرّك التوليد التصميمي
يولّد مخطّطات معمارية بناءً على برنامج المشروع والقيود
"""
import random
import math
from typing import List, Dict

class DesignGenerator:
    def __init__(self, program_spaces: List[Dict], site_bounds: Dict = None):
        self.spaces = program_spaces
        self.site_bounds = site_bounds or {'width': 20, 'depth': 15}
        
    def generate_layout(self, seed: int = None) -> Dict:
        if seed:
            random.seed(seed)
        sorted_spaces = sorted(self.spaces, key=lambda x: x.get('priority', 5), reverse=True)
        grid_width = self.site_bounds['width']
        grid_depth = self.site_bounds['depth']
        layout = []
        used_area = 0
        total_area = sum(s.get('target_area', 0) for s in sorted_spaces)
        x, y = 0, 0
        for space in sorted_spaces:
            target_area = space.get('target_area', 10)
            aspect_ratio = random.uniform(0.8, 1.2)
            width = math.sqrt(target_area * aspect_ratio)
            depth = target_area / width
            if x + width > grid_width:
                x = 0
                y += max(s['depth'] for s in layout[-3:]) if layout else 0
            if y + depth > grid_depth:
                break
            room = {'space_id': space.get('id'), 'name': space.get('name'), 'category': space.get('category'),
                    'x': round(x, 2), 'y': round(y, 2), 'width': round(width, 2), 'depth': round(depth, 2),
                    'area': round(width * depth, 2), 'center_x': round(x + width/2, 2), 'center_y': round(y + depth/2, 2)}
            layout.append(room)
            used_area += room['area']
            x += width + 0.5
        efficiency = used_area / total_area if total_area > 0 else 0
        return {'layout': layout, 'metrics': {'total_built_area': round(used_area, 2), 'efficiency_ratio': round(efficiency, 2),
                'energy_score': round(random.uniform(3.0, 5.0), 1), 'daylight_score': round(random.uniform(3.0, 5.0), 1)},
                'geometry': self._to_geojson(layout)}
    
    def _to_geojson(self, layout: List[Dict]) -> Dict:
        features = []
        for room in layout:
            x, y, w, d = room['x'], room['y'], room['width'], room['depth']
            features.append({'type': 'Feature', 'properties': {'name': room['name'], 'category': room['category'], 'area': room['area']},
                            'geometry': {'type': 'Polygon', 'coordinates': [[[x, y], [x+w, y], [x+w, y+d], [x, y+d], [x, y]]]}})
        return {'type': 'FeatureCollection', 'features': features}
    
    def generate_alternatives(self, count: int = 3) -> List[Dict]:
        alternatives = []
        for i in range(count):
            alt = self.generate_layout(seed=i*42)
            alt['name'] = f'البديل {chr(65+i)}'
            alt['version'] = i + 1
            alternatives.append(alt)
        return alternatives
