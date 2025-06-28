# scripts/generate_vegetable_voices.py
import os
from elevenlabs.client import ElevenLabs # استخدام هذا الاستيراد لكائن client
# from elevenlabs import save, generate # تم إزالة هذه الاستيرادات المباشرة
# from elevenlabs import save # تم إزالة هذا الاستيراد المباشر

import requests
import asyncio

# Set your API key directly for development, but use environment variables in production
# ELEVENLABS_API_KEY = os.getenv("ELEVENLABS_API_KEY")
ELEVENLABS_API_KEY = "sk_f168d48dd858021f0f2271f3192d244867a49875a9c3894c" # Replace with your actual API key

# إنشاء كائن client
client = ElevenLabs(api_key=ELEVENLABS_API_KEY)

# Define voice IDs for different speakers
VOICE_IDS = {
    "teacher": "R6nda3uM038xEEKi7GFl", # Example Teacher voice ID
    "boy": "g5jbuqCKrlENbXKVxm7G",   # Example Boy voice ID
    "girl": "qi4PkV9c01kb869Vh7Su",  # Example Girl Voice ID
    "child": "mRdG9GYEjJmIzqbYTidv"   # Example Child voice ID
}

OUTPUT_DIR_AR = "../public/audio/ar/vegetables"
OUTPUT_DIR_EN = "../public/audio/en/vegetables" # If you plan to generate English voices
OUTPUT_DIR_HE = "../public/audio/he/vegetables" # If you plan to generate Hebrew voices

os.makedirs(OUTPUT_DIR_AR, exist_ok=True)
os.makedirs(OUTPUT_DIR_EN, exist_ok=True)
os.makedirs(OUTPUT_DIR_HE, exist_ok=True)

# List of vegetables with their Arabic names for pronunciation
VEGETABLES_DATA = [
    {"en": "artichoke", "ar": "خرشوف"},
    {"en": "asparagus", "ar": "هليون"},
    {"en": "beet", "ar": "شمندر"},
    {"en": "broccoli", "ar": "بروكلي"},
    {"en": "brussels sprouts", "ar": "كرنب بروكسل"},
    {"en": "cabbage", "ar": "ملفوف"},
    {"en": "carrot", "ar": "جزر"},
    {"en": "cauliflower", "ar": "قرنبيط"},
    {"en": "celery", "ar": "كرفس"},
    {"en": "corn", "ar": "ذرة"},
    {"en": "cucumber", "ar": "خيار"},
    {"en": "eggplant", "ar": "باذنجان"},
    {"en": "garlic", "ar": "ثوم"},
    {"en": "green bean", "ar": "فاصوليا خضراء"},
    {"en": "kale", "ar": "لفت"},
    {"en": "leek", "ar": "كراث"},
    {"en": "lettuce", "ar": "خس"},
    {"en": "mushroom", "ar": "فطر"},
    {"en": "onion", "ar": "بصل"},
    {"en": "pea", "ar": "بازلاء"},
    {"en": "pepper", "ar": "فلفل"},
    {"en": "potato", "ar": "بطاطا"},
    {"en": "pumpkin", "ar": "يقطين"},
    {"en": "radish", "ar": "فجل"},
    {"en": "spinach", "ar": "سبانخ"},
    {"en": "sweet potato", "ar": "بطاطا حلوة"},
    {"en": "tomato", "ar": "طماطم"},
    {"en": "turnip", "ar": "لفت"},
    {"en": "zucchini", "ar": "كوسة"},
]

async def generate_voice(text, voice_id, output_path):
    print(f"Generating audio for: '{text}' with voice ID: {voice_id}")
    try:
        # استخدام client.text_to_speech.convert وهي طريقة كانت موجودة في إصدارات سابقة
        # وقد تكون أكثر استقرارًا عبر التغييرات الجذرية في المكتبة
        audio_response = await client.text_to_speech.convert(
            text=text,
            voice_id=voice_id,
            model_id="eleven_multilingual_v2" # تأكد من أن هذا النموذج متاح لحسابك
        )
        
        # بعض الإصدارات قد تُرجع بايتات مباشرة، وبعضها قد يُرجع كائن استجابة يجب قراءته
        # سنحاول التعامل مع كلتا الحالتين هنا
        
        if hasattr(audio_response, 'iter_bytes'): # إذا كانت استجابة يمكن تكرار البايتات منها
            with open(output_path, "wb") as f:
                for chunk in audio_response.iter_bytes():
                    f.write(chunk)
        elif isinstance(audio_response, bytes): # إذا كانت بايتات مباشرة
            with open(output_path, "wb") as f:
                f.write(audio_response)
        else:
            # إذا لم يكن أي من ما سبق، فهذا يعني أن هناك هيكل استجابة جديد
            # أو مشكلة أخرى، ونحن بحاجة إلى تسجيله لمعرفة المزيد
            print(f"Unexpected audio_response type for '{text}': {type(audio_response)}. Please check ElevenLabs SDK documentation.")
            raise TypeError(f"Unexpected audio_response type: {type(audio_response)}")
        
        print(f"Saved audio to: {output_path}")

    except Exception as e:
        print(f"Error generating audio for '{text}': {e}")
        if "Maximum amount of custom voices" in str(e):
            print("Consider deleting unused voices or upgrading your ElevenLabs plan.")
        else:
            print(f"An unexpected error occurred: {e}")

async def main():
    for vegetable in VEGETABLES_DATA:
        vegetable_name_en = vegetable["en"].replace(" ", "_")
        vegetable_name_ar_pronunciation = vegetable["ar"]

        # توليد الأصوات العربية لكل نوع صوت
        await generate_voice(
            vegetable_name_ar_pronunciation,
            VOICE_IDS["teacher"],
            os.path.join(OUTPUT_DIR_AR, f"{vegetable_name_en}_teacher_ar.mp3")
        )
        await generate_voice(
            vegetable_name_ar_pronunciation,
            VOICE_IDS["boy"],
            os.path.join(OUTPUT_DIR_AR, f"{vegetable_name_en}_boy_ar.mp3")
        )
        await generate_voice(
            vegetable_name_ar_pronunciation,
            VOICE_IDS["girl"],
            os.path.join(OUTPUT_DIR_AR, f"{vegetable_name_en}_girl_ar.mp3")
        )
        # Child voice (if available/desired)
        await generate_voice(
            vegetable_name_ar_pronunciation,
            VOICE_IDS["child"],
            os.path.join(OUTPUT_DIR_AR, f"{vegetable_name_en}_child_ar.mp3")
        )

        # يمكنك إضافة منطق هنا للأصوات الإنجليزية والعبرية إذا كان لديك نصوص ومعرفات صوت منفصلة
        # للتبسيط، هذا المثال يولد الأصوات العربية للنطق فقط.

if __name__ == "__main__":
    asyncio.run(main())