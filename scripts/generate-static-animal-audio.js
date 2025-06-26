// scripts/generate-static-animal-audio.js

// تهيئة متغيرات البيئة من ملف .env في بيئة ES Modules
import 'dotenv/config';

// استيراد وحدات Node.js المدمجة (built-in) باستخدام import
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // للحصول على __dirname في ES Modules

// استيراد node-fetch (مطلوب إذا كان Node.js < v18، أو إذا كنت تفضل استخدامه)
import fetch from 'node-fetch';

// *** حساب __dirname و __filename في بيئة ES Modules ***
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// *******************************************************************

// 1. إعدادات Eleven Labs - يتم جلبها من ملف .env
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
// استخدم ELEVENLABS_VOICE_ID ليكون متغير الصوت النشط (سواء كان ولد أو بنت)
const ELEVENLABS_VOICE_ID = process.env.ELEVENLABS_VOICE_ID;

// 2. تحديد مجلد حفظ ملفات الصوت. يجب أن يكون ضمن public/audio/ar/animals/
const AUDIO_OUTPUT_DIR = path.resolve(__dirname, '../public/audio/ar/animals');

// تأكد من وجود مجلد الإخراج
if (!fs.existsSync(AUDIO_OUTPUT_DIR)) {
  fs.mkdirSync(AUDIO_OUTPUT_DIR, { recursive: true });
}

// 3. قائمة الحيوانات مع اسمها العربي واسم ملف الصوت المطلوب.
// *** ملاحظة هامة: يجب تحديث حقل 'fileName' هنا ليعكس نوع الصوت الذي تولده (girl/girl) ***
const animalsData = [
    { englishName: "Alligator", arabicName: "تمساح", fileName: "alligator_girl_ar.mp3" },
    { englishName: "Ant", arabicName: "نملة", fileName: "ant_girl_ar.mp3" },
    { englishName: "Ape", arabicName: "قرد", fileName: "ape_girl_ar.mp3" },
    { englishName: "Arctic Fox", arabicName: "ثعلب قطبي", fileName: "arctic_fox_girl_ar.mp3" },
    { englishName: "Armadillo", arabicName: "مدرع", fileName: "armadillo_girl_ar.mp3" },
    { englishName: "Bear", arabicName: "دب", fileName: "bear_girl_ar.mp3" },
    { englishName: "Bee", arabicName: "نحلة", fileName: "bee_girl_ar.mp3" },
    { englishName: "Bird", arabicName: "طائر", fileName: "bird_girl_ar.mp3" },
    { englishName: "Butterfly", arabicName: "فراشة", fileName: "butterfly_girl_ar.mp3" },
    { englishName: "Bat", arabicName: "خفاش", fileName: "bat_girl_ar.mp3" },
    { englishName: "Badger", arabicName: "غرير", fileName: "badger_girl_ar.mp3" },
    { englishName: "Beaver", arabicName: "قندس", fileName: "beaver_girl_ar.mp3" },
    { englishName: "Bison", arabicName: "بيسون", fileName: "bison_girl_ar.mp3" },
    { englishName: "Boar", arabicName: "خنزير بري", fileName: "boar_girl_ar.mp3" },
    { englishName: "Bobcat", arabicName: "وشق أحمر", fileName: "bobcat_girl_ar.mp3" },
    { englishName: "Camel", arabicName: "جمل", fileName: "camel_girl_ar.mp3" },
    { englishName: "Cat", arabicName: "قط", fileName: "cat_girl_ar.mp3" },
    { englishName: "Chicken", arabicName: "دجاجة", fileName: "chicken_girl_ar.mp3" },
    { englishName: "Chimpanzee", arabicName: "شمبانزي", fileName: "chimpanzee_girl_ar.mp3" },
    { englishName: "Cobra", arabicName: "كوبرا", fileName: "cobra_girl_ar.mp3" },
    { englishName: "Cow", arabicName: "بقرة", fileName: "cow_girl_ar.mp3" },
    { englishName: "Crab", arabicName: "سرطان", fileName: "crab_girl_ar.mp3" },
    { englishName: "Crocodile", arabicName: "تمساح", fileName: "crocodile_girl_ar.mp3" },
    { englishName: "Crow", arabicName: "غراب", fileName: "crow_girl_ar.mp3" },
    { englishName: "Cheetah", arabicName: "فهد", fileName: "cheetah_girl_ar.mp3" },
    { englishName: "Deer", arabicName: "غزال", fileName: "deer_girl_ar.mp3" },
    { englishName: "Dog", arabicName: "كلب", fileName: "dog_girl_ar.mp3" },
    { englishName: "Dolphin", arabicName: "دلفين", fileName: "dolphin_girl_ar.mp3" },
    { englishName: "Donkey", arabicName: "حمار", fileName: "donkey_girl_ar.mp3" },
    { englishName: "Duck", arabicName: "بطة", fileName: "duck_girl_ar.mp3" },
    { englishName: "Dove", arabicName: "حمامة", fileName: "dove_girl_ar.mp3" },
    { englishName: "Dragon", arabicName: "تنين", fileName: "dragon_girl_ar.mp3" },
    { englishName: "Eagle", arabicName: "نسر", fileName: "eagle_girl_ar.mp3" },
    { englishName: "Eel", arabicName: "أنقليس", fileName: "eel_girl_ar.mp3" },
    { englishName: "Elephant", arabicName: "فيل", fileName: "elephant_girl_ar.mp3" },
    { englishName: "Elk", arabicName: "أيل", fileName: "elk_girl_ar.mp3" },
    { englishName: "Emu", arabicName: "إيمو", fileName: "emu_girl_ar.mp3" },
    { englishName: "Falcon", arabicName: "صقر", fileName: "falcon_girl_ar.mp3" },
    { englishName: "Ferret", arabicName: "نمس", fileName: "ferret_girl_ar.mp3" },
    { englishName: "Fish", arabicName: "سمكة", fileName: "fish_girl_ar.mp3" },
    { englishName: "Flamingo", arabicName: "فلامنجو", fileName: "flamingo_girl_ar.mp3" },
    { englishName: "Fly", arabicName: "ذبابة", fileName: "fly_girl_ar.mp3" },
    { englishName: "Fox", arabicName: "ثعلب", fileName: "fox_girl_ar.mp3" },
    { englishName: "Frog", arabicName: "ضفدع", fileName: "frog_girl_ar.mp3" },
    { englishName: "Gecko", arabicName: "وزغة", fileName: "gecko_girl_ar.mp3" },
    { englishName: "Gazelle", arabicName: "غزال", fileName: "gazelle_girl_ar.mp3" },
    { englishName: "Giraffe", arabicName: "زرافة", fileName: "giraffe_girl_ar.mp3" },
    { englishName: "Goat", arabicName: "ماعز", fileName: "goat_girl_ar.mp3" },
    { englishName: "Goose", arabicName: "إوزة", fileName: "goose_girl_ar.mp3" },
    { englishName: "Gorilla", arabicName: "غوريلا", fileName: "gorilla_girl_ar.mp3" },
    { englishName: "Grasshopper", arabicName: "جرادة", fileName: "grasshopper_girl_ar.mp3" },
    { englishName: "Grizzly Bear", arabicName: "دب أشيب", fileName: "grizzly_bear_girl_ar.mp3" },
    { englishName: "Hamster", arabicName: "هامستر", fileName: "hamster_girl_ar.mp3" },
    { englishName: "Hare", arabicName: "أرنب بري", fileName: "hare_girl_ar.mp3" },
    { englishName: "Hawk", arabicName: "باز", fileName: "hawk_girl_ar.mp3" },
    { englishName: "Hedgehog", arabicName: "قنفذ", fileName: "hedgehog_girl_ar.mp3" },
    { englishName: "Hippopotamus", arabicName: "فرس النهر", fileName: "hippopotamus_girl_ar.mp3" },
    { englishName: "Horse", arabicName: "حصان", fileName: "horse_girl_ar.mp3" },
    { englishName: "Hummingbird", arabicName: "طائر الطنان", fileName: "hummingbird_girl_ar.mp3" },
    { englishName: "Hyena", arabicName: "ضبع", fileName: "hyena_girl_ar.mp3" },
    { englishName: "Ibis", arabicName: "أبو منجل", fileName: "ibis_girl_ar.mp3" },
    { englishName: "Ibex", arabicName: "وعل", fileName: "ibex_girl_ar.mp3" },
    { englishName: "Impala", arabicName: "إمبالا", fileName: "impala_girl_ar.mp3" },
    { englishName: "Jackal", arabicName: "ابن آوى", fileName: "jackal_girl_ar.mp3" },
    { englishName: "Jaguar", arabicName: "جاغوار", fileName: "jaguar_girl_ar.mp3" },
    { englishName: "Jellyfish", arabicName: "قنديل البحر", fileName: "jellyfish_girl_ar.mp3" },
   
];

async function generateAudioForStaticAnimals() {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID) { // تم تغيير ELEVENLABS_VOICE_ID_girl إلى ELEVENLABS_VOICE_ID
    console.error("⛔️ Eleven Labs API Key or Voice ID is missing. Check your .env file.");
    return;
  }

  try {
    console.log("🚀 Starting audio generation for static animal list...");

    let generatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const animal of animalsData) {
      const arabicName = animal.arabicName;
      const fileName = animal.fileName;

      if (!arabicName || !fileName) {
        console.warn(`- Skipping entry (missing name or file name): ${JSON.stringify(animal)}`);
        skippedCount++;
        continue;
      }
      if (!fileName.endsWith('.mp3')) {
        console.warn(`- Skipping '${arabicName}': File name '${fileName}' does not end with .mp3. Please correct.`);
        skippedCount++;
        continue;
      }

      const outputFilePath = path.join(AUDIO_OUTPUT_DIR, fileName);

      // إذا كان الملف موجودًا بالفعل، تخطاه لتجنب إعادة التوليد
      if (fs.existsSync(outputFilePath)) {
          console.log(`- Audio for '${arabicName}' (${fileName}) already exists. Skipping.`);
          skippedCount++;
          continue;
      }

      console.log(`- Generating audio for: '${arabicName}' into '${fileName}'`);

      // طلب تحويل النص إلى كلام من Eleven Labs API
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID}`, { // تم تغيير ELEVENLABS_VOICE_ID_girl إلى ELEVENLABS_VOICE_ID
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'xi-api-key': ELEVENLABS_API_KEY
        },
        body: JSON.stringify({
          text: arabicName,
          model_id: 'eleven_multilingual_v2', // يُوصى بهذا النموذج للغة العربية
          voice_settings: {
            stability: 0.75, // قابل للتعديل
            similarity_boost: 0.75, // قابل للتعديل
          },
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Failed to generate audio for '${arabicName}' (Status: ${response.status}): ${errorText}`);
        failedCount++;
        continue;
      }

      // حفظ ملف الصوت
      const audioBuffer = Buffer.from(await response.arrayBuffer());
      fs.writeFileSync(outputFilePath, audioBuffer);
      console.log(`  -> Successfully saved: ${fileName}`);
      generatedCount++;
    }

    console.log("\n✨ Audio generation process complete!");
    console.log(`Summary: Generated: ${generatedCount}, Skipped: ${skippedCount}, Failed: ${failedCount}`);

  } catch (error) {
    console.error("⛔️ Fatal error during audio generation process:", error);
  }
}

// تشغيل الدالة
generateAudioForStaticAnimals();