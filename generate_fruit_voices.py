import os
from elevenlabs import ElevenLabs

# 1. إعداد مفتاح API لـ ElevenLabs
ELEVENLABS_API_KEY = "sk_f168d48dd858021f0f2271f3192d244867a49875a9c3894c"
client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# 2. معرف الصوت (Voice ID) لصوت الفتاة من ElevenLabs
VOICE_ID = "qi4PkV9c01kb869Vh7Su" # تم تحديثه إلى معرف صوت الفتاة

# 3. مسار حفظ ملفات الصوت
OUTPUT_DIR = r"E:\cyclopedia\public\audio\ar\fruits"

# إنشاء مجلد الإخراج إذا لم يكن موجودًا
os.makedirs(OUTPUT_DIR, exist_ok=True)

# 4. قائمة الفواكه المراد توليد أصوات لها (نفس القائمة السابقة)
fruits_data = {
    "apple": "تفاح",
    "banana": "موز",
    "orange": "برتقال",
    "strawberry": "فراولة",
    "grape": "عنب",
    "watermelon": "بطيخ",
    "melon": "شمام",
    "mango": "مانجو",
    "kiwi": "كيوي",
    "pineapple": "أناناس",
    "cherry": "كرز",
    "peach": "خوخ",
    "apricot": "مشمش",
    "berry": "توت",
    "lemon": "ليمون",
    "date": "تمر",
    "fig": "تين",
    "pomegranate": "رمان",
    "pear": "كمثرى",
    "papaya": "بابايا",
    "avocado": "أفوكادو",
    "blackberry": "توت أسود",
    "blueberry": "توت أزرق",
    "cantaloupe": "شمام كنتالوب",
    "coconut": "جوز الهند",
    "cranberry": "توت بري",
    "dragon_fruit": "فاكهة التنين",
    "durian": "دوريان",
    "grapefruit": "جريب فروت",
    "guava": "جوافة",
    "honeydew_melon": "شمام عسلي",
    "jackfruit": "جاك فروت",
    "kumquat": "كمكوات",
    "lime": "ليم أخضر",
    "lychee": "ليتشي",
    "mandarin": "يوسفي",
    "nectarine": "نكتارين",
    "olive": "زيتون",
    "passion_fruit": "باشن فروت",
    "plum": "برقوق",
    "pomelo": "بوميلو",
    "quince": "سفرجل",
    "raspberry": "توت أحمر",
    "star_fruit": "فاكهة النجمة",
    "tangerine": "يوسفي"
}

print("بدء توليد أصوات الفواكه بصوت الفتاة...")

# 5. حلقة لتوليد وحفظ الأصوات
for fruit_en_name, fruit_ar_text in fruits_data.items():
    try:
        audio_stream = client.text_to_speech.convert(
            voice_id=VOICE_ID,
            text=fruit_ar_text,
            model_id="eleven_multilingual_v2"
        )

        # بناء اسم الملف ومساره
        formatted_fruit_name = fruit_en_name.replace(" ", "_").lower()
        file_name = f"{formatted_fruit_name}_girl_ar.mp3" # تم تغيير _boy_ إلى _girl_
        file_path = os.path.join(OUTPUT_DIR, file_name)

        # حفظ ملف الصوت
        with open(file_path, "wb") as f:
            for chunk in audio_stream:
                if chunk:
                    f.write(chunk)
        print(f"✅ تم توليد وحفظ الصوت لـ '{fruit_ar_text}' بصوت الفتاة في: {file_path}")
    except Exception as e:
        print(f"❌ حدث خطأ أثناء توليد أو حفظ الصوت لـ '{fruit_ar_text}' بصوت الفتاة: {e}")

print("\n🎉 تم الانتهاء من توليد جميع الأصوات المطلوبة بصوت الفتاة!")