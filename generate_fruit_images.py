import os
import requests
import base64
from PIL import Image
from io import BytesIO

# 1. إعداد مفتاح API و URL الخاص بـ Stability AI
STABILITY_API_KEY = "sk-TAq3MdKJre8A0H1ECwsy6h0acCc8wr8OUb7iH5BR555MnQk5"
# تأكد أن هذا الـ URL صحيح تمامًا ويشير إلى النموذج الصحيح
STABILITY_API_URL = "https://api.stability.ai/v1/generation/stable-diffusion-xl-1024-v1-0/text-to-image"
STABILITY_IMAGE_MODEL = "stable-diffusion-xl-1024-v1-0"

# 2. مسار حفظ ملفات الصور
OUTPUT_DIR = r"E:\cyclopedia\public\images\ar\fruits"

# إنشاء مجلد الإخراج إذا لم يكن موجودًا
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 3. قائمة الفواكه المراد إنشاء صور لها
fruits_data = {
    "apple": "تفاح", "banana": "موز", "orange": "برتقال", "strawberry": "فراولة",
    "grape": "عنب", "watermelon": "بطيخ", "melon": "شمام", "mango": "مانجو",
    "kiwi": "كيوي", "pineapple": "أناناس", "cherry": "كرز", "peach": "خوخ",
    "apricot": "مشمش", "berry": "توت", "lemon": "ليمون", "date": "تمر",
    "fig": "تين", "pomegranate": "رمان", "pear": "كمثرى", "papaya": "بابايا",
    "avocado": "أفوكادو", "blackberry": "توت أسود", "blueberry": "توت أزرق",
    "cantaloupe": "شمام كنتالوب", "coconut": "جوز الهند", "cranberry": "توت بري",
    "dragon_fruit": "فاكهة التنين", "durian": "دوريان", "grapefruit": "جريب فروت",
    "guava": "جوافة", "honeydew_melon": "شمام عسلي", "jackfruit": "جاك فروت",
    "kumquat": "كمكوات", "lime": "ليم أخضر", "lychee": "ليتشي",
    "mandarin": "يوسفي", "nectarine": "نكتارين", "olive": "زيتون",
    "passion_fruit": "باشن فروت", "plum": "برقوق", "pomelo": "بوميلو",
    "quince": "سفرجل", "raspberry": "توت أحمر", "star_fruit": "فاكهة النجمة",
    "tangerine": "يوسفي"
}

# 4. إعدادات طلب الـ API
headers = {
    "Content-Type": "application/json",
    "Accept": "application/json",
    "Authorization": f"Bearer {STABILITY_API_KEY}"
}

# الأبعاد المطلوبة
IMAGE_WIDTH = 800
IMAGE_HEIGHT = 800

print("بدء إنشاء صور الفواكه...")

# 5. حلقة لإنشاء وحفظ الصور
for fruit_en_name, fruit_ar_text in fruits_data.items():
    prompt_text = (
        f"A vibrant, clear, and expressive illustration of a {fruit_en_name} on a clean white background. "
        f"Show one whole {fruit_en_name} next to a perfectly cut half of the same {fruit_en_name}, "
        f"revealing its internal structure, seeds, and colors clearly. "
        f"The style should be simple, friendly, and appealing for a children's educational encyclopedia, "
        f"with soft lighting and no shadows. Studio shot, high detail, bright colors."
    )

    payload = {
        "text_prompts": [
            {"text": prompt_text, "weight": 1.0},
            {"text": "blurry, ugly, deformed, text, watermark, bad anatomy, extra limbs, dark, realistic photo", "weight": -1.0}
        ],
        "cfg_scale": 7,
        # "clip_guidance_preset": "FAST_BLUE", # قد تكون هذه المعلمة تسبب المشكلة أو لا تدعمها كل النماذج/الإصدارات
        "height": IMAGE_HEIGHT,
        "width": IMAGE_WIDTH,
        "samples": 1,
        "steps": 30,
        "seed": 0
    }

    print(f"جاري إنشاء صورة لـ: {fruit_ar_text} ({fruit_en_name})...")

    try:
        # تأكد من أن الـ URL صحيح تمامًا
        # الاستدعاء يجب أن يكون بهذا الشكل مع نموذج معين في الـ URL
        response = requests.post(
            STABILITY_API_URL, # استخدم الثابت STABILITY_API_URL مباشرة
            headers=headers,
            json=payload
        )

        response.raise_for_status() # إطلاق استثناء إذا كان هناك خطأ في الرد (مثل 4xx أو 5xx)

        response_data = response.json()

        if "artifacts" in response_data and response_data["artifacts"]:
            for i, image_data in enumerate(response_data["artifacts"]):
                if image_data.get("base64"):
                    formatted_fruit_name = fruit_en_name.replace(" ", "_").lower()
                    file_name = f"{formatted_fruit_name}_image.png"
                    file_path = os.path.join(OUTPUT_DIR, file_name)

                    img_bytes = base64.b64decode(image_data["base64"])
                    with open(file_path, "wb") as f:
                        f.write(img_bytes)
                    print(f"✅ تم إنشاء وحفظ الصورة لـ '{fruit_ar_text}' في: {file_path}")
                else:
                    print(f"❌ لم يتم العثور على بيانات base64 للصورة لـ: {fruit_ar_text}")
        else:
            print(f"❌ لم يتم توليد أي صور لـ: {fruit_ar_text}. الرد: {response_data}")

    except requests.exceptions.RequestException as e:
        print(f"❌ حدث خطأ في الاتصال بـ Stability AI لـ '{fruit_ar_text}': {e}")
        if e.response:
            print(f"   رسالة الخطأ من السيرفر: {e.response.text}") # طباعة رسالة الخطأ الدقيقة
    except Exception as e:
        print(f"❌ حدث خطأ غير متوقع أثناء معالجة صورة '{fruit_ar_text}': {e}")

print("\n🎉 تم الانتهاء من محاولة إنشاء جميع صور الفواكه المطلوبة!")