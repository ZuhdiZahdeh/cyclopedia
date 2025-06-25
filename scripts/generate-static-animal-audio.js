// scripts/generate-static-animal-audio.js

import 'dotenv/config'; // طريقة أسهل لتهيئة dotenv في ES modules

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';

// *** إضافة: استيراد وحساب __dirname و __filename في ES Modules ***
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// *******************************************************************

// 1. إعدادات Eleven Labs
const ELEVENLABS_API_KEY = process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID_BOY = process.env.ELEVENLABS_VOICE_ID_BOY;

// 2. تحديد مجلد حفظ ملفات الصوت. بناءً على هيكل مشروعك، هذا هو المسار المتوقع.
const AUDIO_OUTPUT_DIR = path.resolve(__dirname, '../public/audio/ar/animals');

// تأكد من وجود مجلد الإخراج
if (!fs.existsSync(AUDIO_OUTPUT_DIR)) {
  fs.mkdirSync(AUDIO_OUTPUT_DIR, { recursive: true });
}

// 3. قائمة الحيوانات مع اسمها العربي واسم ملف الصوت المطلوب
const animalsData = [
  { englishName: "Dolphin", arabicName: "دلفين", fileName: "dolphin_boy_ar.mp3" },
  { englishName: "Donkey", arabicName: "حمار", fileName: "donkey_boy_ar.mp3" },
  { englishName: "Duck", arabicName: "بطة", fileName: "duck_boy_ar.mp3" },
  { englishName: "Dove", arabicName: "حمامة", fileName: "dove_boy_ar.mp3" },
  { englishName: "Dragon", arabicName: "تنين", fileName: "dragon_boy_ar.mp3" },
  { englishName: "Eagle", arabicName: "نسر", fileName: "eagle_boy_ar.mp3" },
  { englishName: "Eel", arabicName: "أنقليس", fileName: "eel_boy_ar.mp3" },
  { englishName: "Elephant", arabicName: "فيل", fileName: "elephant_boy_ar.mp3" },
  { englishName: "Elk", arabicName: "أيل", fileName: "elk_boy_ar.mp3" },
  { englishName: "Emu", arabicName: "إيمو", fileName: "emu_boy_ar.mp3" },
  { englishName: "Falcon", arabicName: "صقر", fileName: "falcon_boy_ar.mp3" },
  { englishName: "Ferret", arabicName: "نمس", fileName: "ferret_boy_ar.mp3" },
  { englishName: "Fish", arabicName: "سمكة", fileName: "fish_boy_ar.mp3" },
  { englishName: "Flamingo", arabicName: "فلامنجو", fileName: "flamingo_boy_ar.mp3" },
  { englishName: "Fly", arabicName: "ذبابة", fileName: "fly_boy_ar.mp3" },
  { englishName: "Fox", arabicName: "ثعلب", fileName: "fox_boy_ar.mp3" },
  { englishName: "Frog", arabicName: "ضفدع", fileName: "frog_boy_ar.mp3" },
  { englishName: "Gecko", arabicName: "وزغة", fileName: "gecko_boy_ar.mp3" },
  { englishName: "Gazelle", arabicName: "غزال", fileName: "gazelle_boy_ar.mp3" },
  { englishName: "Giraffe", arabicName: "زرافة", fileName: "giraffe_boy_ar.mp3" },
  { englishName: "Goat", arabicName: "ماعز", fileName: "goat_boy_ar.mp3" },
  { englishName: "Goose", arabicName: "إوزة", fileName: "goose_boy_ar.mp3" },
  { englishName: "Gorilla", arabicName: "غوريلا", fileName: "gorilla_boy_ar.mp3" },
  { englishName: "Grasshopper", arabicName: "جرادة", fileName: "grasshopper_boy_ar.mp3" },
  { englishName: "Grizzly Bear", arabicName: "دب أشيب", fileName: "grizzly_bear_boy_ar.mp3" },
  { englishName: "Hamster", arabicName: "هامستر", fileName: "hamster_boy_ar.mp3" },
  { englishName: "Hare", arabicName: "أرنب بري", fileName: "hare_boy_ar.mp3" },
  { englishName: "Hawk", arabicName: "باز", fileName: "hawk_boy_ar.mp3" },
  { englishName: "Hedgehog", arabicName: "قنفذ", fileName: "hedgehog_boy_ar.mp3" },
  { englishName: "Hippopotamus", arabicName: "فرس النهر", fileName: "hippopotamus_boy_ar.mp3" },
  { englishName: "Horse", arabicName: "حصان", fileName: "horse_boy_ar.mp3" },
  { englishName: "Hummingbird", arabicName: "طائر الطنان", fileName: "hummingbird_boy_ar.mp3" },
  { englishName: "Hyena", arabicName: "ضبع", fileName: "hyena_boy_ar.mp3" },
  { englishName: "Ibis", arabicName: "أبو منجل", fileName: "ibis_boy_ar.mp3" },
  { englishName: "Ibex", arabicName: "وعل", fileName: "ibex_boy_ar.mp3" },
  { englishName: "Impala", arabicName: "إمبالا", fileName: "impala_boy_ar.mp3" },
  { englishName: "Jackal", arabicName: "ابن آوى", fileName: "jackal_boy_ar.mp3" },
  { englishName: "Jaguar", arabicName: "جاغوار", fileName: "jaguar_boy_ar.mp3" },
  { englishName: "Jellyfish", arabicName: "قنديل البحر", fileName: "jellyfish_boy_ar.mp3" },
  { englishName: "Jay", arabicName: "قيق", fileName: "jay_boy_ar.mp3" },
  { englishName: "Kangaroo", arabicName: "كنغر", fileName: "kangaroo_boy_ar.mp3" },
  { englishName: "Kingfisher", arabicName: "رفراف", fileName: "kingfisher_boy_ar.mp3" },
  { englishName: "Koala", arabicName: "كوالا", fileName: "koala_boy_ar.mp3" },
  { englishName: "Kookaburra", arabicName: "كوكابورا", fileName: "kookaburra_boy_ar.mp3" },
  { englishName: "Ladybug", arabicName: "دعسوقة", fileName: "ladybug_boy_ar.mp3" },
  { englishName: "Lamb", arabicName: "حمل", fileName: "lamb_boy_ar.mp3" },
  { englishName: "Leopard", arabicName: "فهد", fileName: "leopard_boy_ar.mp3" },
  { englishName: "Lion", arabicName: "أسد", fileName: "lion_boy_ar.mp3" },
  { englishName: "Lizard", arabicName: "سحلية", fileName: "lizard_boy_ar.mp3" },
  { englishName: "Llama", arabicName: "لاما", fileName: "llama_boy_ar.mp3" },
  { englishName: "Lobster", arabicName: "جراد البحر", fileName: "lobster_boy_ar.mp3" },
  { englishName: "Macaw", arabicName: "مكاو", fileName: "macaw_boy_ar.mp3" },
  { englishName: "Magpie", arabicName: "عقعق", fileName: "magpie_boy_ar.mp3" },
  { englishName: "Mallard", arabicName: "بط بري", fileName: "mallard_boy_ar.mp3" },
  { englishName: "Meerkat", arabicName: "ميركات", fileName: "meerkat_boy_ar.mp3" },
  { englishName: "Monkey", arabicName: "قرد", fileName: "monkey_boy_ar.mp3" },
  { englishName: "Moose", arabicName: "أيل أمريكي", fileName: "moose_boy_ar.mp3" },
  { englishName: "Mosquito", arabicName: "بعوضة", fileName: "mosquito_boy_ar.mp3" },
  { englishName: "Mouse", arabicName: "فأر", fileName: "mouse_boy_ar.mp3" },
  { englishName: "Mule", arabicName: "بغل", fileName: "mule_boy_ar.mp3" },
  { englishName: "Nightingale", arabicName: "عندليب", fileName: "nightingale_boy_ar.mp3" },
  { englishName: "Newt", arabicName: "سمندل", fileName: "newt_boy_ar.mp3" },
  { englishName: "Narwhal", arabicName: "حوت وحيد القرن", fileName: "narwhal_boy_ar.mp3" },
  { englishName: "Octopus", arabicName: "أخطبوط", fileName: "octopus_boy_ar.mp3" },
  { englishName: "Okapi", arabicName: "أوكابي", fileName: "okapi_boy_ar.mp3" },
  { englishName: "Opossum", arabicName: "أوبوسوم", fileName: "opossum_boy_ar.mp3" },
  { englishName: "Orangutan", arabicName: "إنسان الغاب", fileName: "orangutan_boy_ar.mp3" },
  { englishName: "Ostrich", arabicName: "نعامة", fileName: "ostrich_boy_ar.mp3" },
  { englishName: "Otter", arabicName: "قضاعة", fileName: "otter_boy_ar.mp3" },
  { englishName: "Owl", arabicName: "بومة", fileName: "owl_boy_ar.mp3" },
  { englishName: "Ox", arabicName: "ثور", fileName: "ox_boy_ar.mp3" },
  { englishName: "Panda", arabicName: "باندا", fileName: "panda_boy_ar.mp3" },
  { englishName: "Panther", arabicName: "فهد أسود", fileName: "panther_boy_ar.mp3" },
  { englishName: "Parrot", arabicName: "ببغاء", fileName: "parrot_boy_ar.mp3" },
  { englishName: "Peacock", arabicName: "طاووس", fileName: "peacock_boy_ar.mp3" },
  { englishName: "Pelican", arabicName: "بجع", fileName: "pelican_boy_ar.mp3" },
  { englishName: "Penguin", arabicName: "بطريق", fileName: "penguin_boy_ar.mp3" },
  { englishName: "Pig", arabicName: "خنزير", fileName: "pig_boy_ar.mp3" },
  { englishName: "Pigeon", arabicName: "حمامة", fileName: "pigeon_boy_ar.mp3" },
  { englishName: "Polar Bear", arabicName: "دب قطبي", fileName: "polar_bear_boy_ar.mp3" },
  { englishName: "Pony", arabicName: "مهر", fileName: "pony_boy_ar.mp3" },
  { englishName: "Porcupine", arabicName: "شيهم", fileName: "porcupine_boy_ar.mp3" },
  { englishName: "Quail", arabicName: "سمان", fileName: "quail_boy_ar.mp3" },
  { englishName: "Quokka", arabicName: "كوكا", fileName: "quokka_boy_ar.mp3" },
  { englishName: "Rabbit", arabicName: "أرنب", fileName: "rabbit_boy_ar.mp3" },
  { englishName: "Raccoon", arabicName: "راكون", fileName: "raccoon_boy_ar.mp3" },
  { englishName: "Ram", arabicName: "كبش", fileName: "ram_boy_ar.mp3" },
  { englishName: "Rat", arabicName: "جرذ", fileName: "rat_boy_ar.mp3" },
  { englishName: "Raven", arabicName: "غراب", fileName: "raven_boy_ar.mp3" },
  { englishName: "Reindeer", arabicName: "رنة", fileName: "reindeer_boy_ar.mp3" },
  { englishName: "Rhinoceros", arabicName: "وحيد القرن", fileName: "rhinoceros_boy_ar.mp3" },
  { englishName: "Robin", arabicName: "أبو الحناء", fileName: "robin_boy_ar.mp3" },
  { englishName: "Salmon", arabicName: "سلمون", fileName: "salmon_boy_ar.mp3" },
  { englishName: "Scorpion", arabicName: "عقرب", fileName: "scorpion_boy_ar.mp3" },
  { englishName: "Seal", arabicName: "فقمة", fileName: "seal_boy_ar.mp3" },
  { englishName: "Shark", arabicName: "قرش", fileName: "shark_boy_ar.mp3" },
  { englishName: "Sheep", arabicName: "خروف", fileName: "sheep_boy_ar.mp3" },
  { englishName: "Skunk", arabicName: "ظربان", fileName: "skunk_boy_ar.mp3" },
  { englishName: "Snail", arabicName: "حلزون", fileName: "snail_boy_ar.mp3" },
  { englishName: "Snake", arabicName: "أفعى", fileName: "snake_boy_ar.mp3" },
  { englishName: "Sparrow", arabicName: "عصفور", fileName: "sparrow_boy_ar.mp3" },
  { englishName: "Spider", arabicName: "عنكبوت", fileName: "spider_boy_ar.mp3" },
  { englishName: "Squirrel", arabicName: "سنجاب", fileName: "squirrel_boy_ar.mp3" },
  { englishName: "Starfish", arabicName: "نجم البحر", fileName: "starfish_boy_ar.mp3" },
  { englishName: "Swan", arabicName: "بجعة", fileName: "swan_boy_ar.mp3" },
  { englishName: "Tiger", arabicName: "نمر", fileName: "tiger_boy_ar.mp3" },
  { englishName: "Toad", arabicName: "علجوم", fileName: "toad_boy_ar.mp3" },
  { englishName: "Toucan", arabicName: "طوقان", fileName: "toucan_boy_ar.mp3" },
  { englishName: "Turkey", arabicName: "ديك رومي", fileName: "turkey_boy_ar.mp3" },
  { englishName: "Turtle", arabicName: "سلحفاة", fileName: "turtle_boy_ar.mp3" },
  { englishName: "Urial", arabicName: "أوريال", fileName: "urial_boy_ar.mp3" },
  { englishName: "Vulture", arabicName: "نسر", fileName: "vulture_boy_ar.mp3" },
  { englishName: "Walrus", arabicName: "فظ", fileName: "walrus_boy_ar.mp3" },
  { englishName: "Wasp", arabicName: "دبور", fileName: "wasp_boy_ar.mp3" },
  { englishName: "Weasel", arabicName: "ابن عرس", fileName: "weasel_boy_ar.mp3" },
  { englishName: "Whale", arabicName: "حوت", fileName: "whale_boy_ar.mp3" },
  { englishName: "Wolf", arabicName: "ذئب", fileName: "wolf_boy_ar.mp3" },
  { englishName: "Wolverine", arabicName: "ولفرين", fileName: "wolverine_boy_ar.mp3" },
  { englishName: "Wombat", arabicName: "ومبات", fileName: "wombat_boy_ar.mp3" },
  { englishName: "Woodpecker", arabicName: "نقار الخشب", fileName: "woodpecker_boy_ar.mp3" },
  { englishName: "Xerus", arabicName: "سنجاب أرضي", fileName: "xerus_boy_ar.mp3" },
  { englishName: "Yak", arabicName: "ياك", fileName: "yak_boy_ar.mp3" },
  { englishName: "Zebra", arabicName: "حمار وحشي", fileName: "zebra_boy_ar.mp3" },
];

async function generateAudioForStaticAnimals() {
  if (!ELEVENLABS_API_KEY || !ELEVENLABS_VOICE_ID_BOY) {
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
      const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${ELEVENLABS_VOICE_ID_BOY}`, {
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