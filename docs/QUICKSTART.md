# دليل البدء السريع (Quickstart Guide)

## الخطوة 1: استنساخ المستودع

```bash
git clone https://github.com/abedelrahman310-art/ai-architecture-platform.git
cd ai-architecture-platform
```

## الخطوة 2: تشغيل المنصة كاملة بـ Docker (موصى به)

```bash
# تشغيل جميع الخدمات (Backend, Frontend, Database, Redis)
docker-compose up -d

# التحقق من الحالة
docker-compose ps

# عرض السجلات
docker-compose logs -f
```

المنصة ستكون متاحة على:
- **الواجهة الأمامية**: http://localhost:3000
- **الواجهة الخلفية (API)**: http://localhost:8000/api
- **قاعدة البيانات**: localhost:5432
- **Redis**: localhost:6379

## الخطوة 3: التشغيل المحلي (بدون Docker)

### 3.1 إعداد قاعدة البيانات

```bash
# تثبيت PostgreSQL مع pgvector
# على Ubuntu/Debian:
sudo apt install postgresql postgresql-contrib

# إنشاء قاعدة البيانات
createdb ai_architecture

# تفعيل pgvector
psql -d ai_architecture -c "CREATE EXTENSION IF NOT EXISTS vector;"
```

### 3.2 تشغيل Backend

```bash
cd backend

# تثبيت المتطلبات
pip install -r requirements.txt

# نسخ ملف الإعدادات
cp .env.example .env

# تشغيل الترحيل
python manage.py migrate

# إنشاء مستخدم مسؤول
python manage.py createsuperuser

# تشغيل السيرفر
python manage.py runserver
```

الـ API ستكون متاحة على: http://localhost:8000/api

### 3.3 تشغيل Frontend

```bash
cd frontend

# تثبيت المتطلبات
npm install

# تشغيل التطوير
npm run dev
```

الواجهة ستكون متاحة على: http://localhost:3000

## الخطوة 4: اختبار المنصة

### 4.1 إنشاء مشروع تجريبي عبر API

```bash
curl -X POST http://localhost:8000/api/programs/projects/ \
  -H "Content-Type: application/json" \
  -d '{
    "name": "مشروع سكني تجريبي",
    "description": "فيلا عائلية",
    "location": "وهران، الجزائر",
    "client_name": "محمد أحمد",
    "total_area": 250.0,
    "building_type": "residential"
  }'
```

### 4.2 رفع برنامج المشروع (Excel)

استخدم الواجهة الأمامية لرفع ملف Excel يحتوي على:
- اسم الغرفة
- الفئة (معيشة، نوم، مطبخ...)
- المساحة المستهدفة
- العلاقات المكانية المطلوبة

## الخطوة 5: الوصول إلى لوحة الإدارة

```
http://localhost:8000/admin
```

استخدم بيانات المستخدم المسؤول الذي أنشأته في الخطوة 3.2.

## المشاكل الشائعة

### خطأ في الاتصال بقاعدة البيانات

```bash
# تأكد من تشغيل PostgreSQL
sudo service postgresql status

# تحقق من إعدادات .env
cat backend/.env
```

### خطأ في تثبيت المتطلبات

```bash
# تحديث pip
pip install --upgrade pip

# تثبيت المتطلبات واحدة تلو الأخرى
pip install Django==5.0.6
pip install djangorestframework==3.15.1
```

### الواجهة الأمامية لا تتصل بالـ API

```bash
# تحقق من ملف .env في frontend
cat frontend/.env

# يجب أن يحتوي على:
VITE_API_URL=http://localhost:8000/api
```

## الخطوة التالية

بعد التأكد من عمل المنصة، ابدأ بـ:

1. **إضافة لوائح البناء الجزائرية** في `data/regulations/`
2. **تطوير محرك التصميم التوليدي** في `backend/designs/`
3. **بناء وكلاء الذكاء الاصطناعي** في `ai_agents/`

راجع `README.md` للتفاصيل الكاملة عن البنية والخارطة الزمنية.
