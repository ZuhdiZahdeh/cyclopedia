// scripts/generate-stable-diffusion-images.js

// تهيئة متغيرات البيئة من ملف .env
import 'dotenv/config';

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url'; // للحصول على __dirname في ES Modules
import fetch from 'node-fetch'; // تأكد من تثبيت node-fetch: npm install node-fetch

// *** حساب __dirname و __filename في بيئة ES Modules ***
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// *******************************************************************

// 1. إعدادات API Stability AI من متغيرات البيئة
const STABILITY_API_KEY = process.env.STABILITY_API_KEY;
const STABILITY_API_URL = process.env.STABILITY_API_URL;
const STABILITY_IMAGE_MODEL = process.env.STABILITY_IMAGE_MODEL || 'stable-diffusion-xl-1024-v1-0'; // النموذج الافتراضي

// 2. تحديد مجلد حفظ ملفات الصور
const IMAGE_OUTPUT_DIR = path.resolve(__dirname, '../public/images/animals');

// تأكد من وجود مجلد الإخراج
if (!fs.existsSync(IMAGE_OUTPUT_DIR)) {
  fs.mkdirSync(IMAGE_OUTPUT_DIR, { recursive: true });
}

// 3. قائمة الحيوانات مع اسمها الإنجليزي واسم ملف الصورة المتوقع
const animalsData = [
  { englishName: "Alligator", arabicName: "تمساح", fileName: "alligator.png" },
  { englishName: "Ant", arabicName: "نملة", fileName: "ant.png" },
  { englishName: "Ape", arabicName: "قرد", fileName: "ape.png" },
  { englishName: "Arctic Fox", arabicName: "ثعلب قطبي", fileName: "arctic_fox.png" },
  { englishName: "Armadillo", arabicName: "مدرع", fileName: "armadillo.png" },
  { englishName: "Bear", arabicName: "دب", fileName: "bear.png" },
  { englishName: "Bee", arabicName: "نحلة", fileName: "bee.png" },
  { englishName: "Bird", arabicName: "طائر", fileName: "bird.png" },
  { englishName: "Butterfly", arabicName: "فراشة", fileName: "butterfly.png" },
  { englishName: "Bat", arabicName: "خفاش", fileName: "bat.png" },
  { englishName: "Badger", arabicName: "غرير", fileName: "badger.png" },
  { englishName: "Beaver", arabicName: "قندس", fileName: "beaver.png" },
  { englishName: "Bison", arabicName: "بيسون", fileName: "bison.png" },
  { englishName: "Boar", arabicName: "خنزير بري", fileName: "boar.png" },
  { englishName: "Bobcat", arabicName: "وشق أحمر", fileName: "bobcat.png" },
  { englishName: "Camel", arabicName: "جمل", fileName: "camel.png" },
  { englishName: "Cat", arabicName: "قط", fileName: "cat.png" },
  { englishName: "Chicken", arabicName: "دجاجة", fileName: "chicken.png" },
  { englishName: "Chimpanzee", arabicName: "شمبانزي", fileName: "chimpanzee.png" },
  { englishName: "Cobra", arabicName: "كوبرا", fileName: "cobra.png" },
  { englishName: "Cow", arabicName: "بقرة", fileName: "cow.png" },
  { englishName: "Crab", arabicName: "سرطان", fileName: "crab.png" },
  { englishName: "Crocodile", arabicName: "تمساح", fileName: "crocodile.png" },
  { englishName: "Crow", arabicName: "غراب", fileName: "crow.png" },
  { englishName: "Cheetah", arabicName: "فهد", fileName: "cheetah.png" },
  { englishName: "Deer", arabicName: "غزال", fileName: "deer.png" },
  { englishName: "Dog", arabicName: "كلب", fileName: "dog.png" },
  { englishName: "Dolphin", arabicName: "دلفين", fileName: "dolphin.png" },
  { englishName: "Donkey", arabicName: "حمار", fileName: "donkey.png" },
  { englishName: "Duck", arabicName: "بطة", fileName: "duck.png" },
  { englishName: "Dove", arabicName: "حمامة", fileName: "dove.png" },
  { englishName: "Dragon", arabicName: "تنين", fileName: "dragon.png" },
  { englishName: "Eagle", arabicName: "نسر", fileName: "eagle.png" },
  { englishName: "Eel", arabicName: "أنقليس", fileName: "eel.png" },
  { englishName: "Elephant", arabicName: "فيل", fileName: "elephant.png" },
  { englishName: "Elk", arabicName: "أيل", fileName: "elk.png" },
  { englishName: "Emu", arabicName: "إيمو", fileName: "emu.png" },
  { englishName: "Falcon", arabicName: "صقر", fileName: "falcon.png" },
  { englishName: "Ferret", arabicName: "نمس", fileName: "ferret.png" },
  { englishName: "Fish", arabicName: "سمكة", fileName: "fish.png" },
  { englishName: "Flamingo", arabicName: "فلامنجو", fileName: "flamingo.png" },
  { englishName: "Fly", arabicName: "ذبابة", fileName: "fly.png" },
  { englishName: "Fox", arabicName: "ثعلب", fileName: "fox.png" },
  { englishName: "Frog", arabicName: "ضفدع", fileName: "frog.png" },
  { englishName: "Gecko", arabicName: "وزغة", fileName: "gecko.png" },
  { englishName: "Gazelle", arabicName: "غزال", fileName: "gazelle.png" },
  { englishName: "Giraffe", arabicName: "زرافة", fileName: "giraffe.png" },
  { englishName: "Goat", arabicName: "ماعز", fileName: "goat.png" },
  { englishName: "Goose", arabicName: "إوزة", fileName: "goose.png" },
  { englishName: "Gorilla", arabicName: "غوريلا", fileName: "gorilla.png" },
  { englishName: "Grasshopper", arabicName: "جرادة", fileName: "grasshopper.png" },
  { englishName: "Grizzly Bear", arabicName: "دب أشيب", fileName: "grizzly_bear.png" },
  { englishName: "Hamster", arabicName: "هامستر", fileName: "hamster.png" },
  { englishName: "Hare", arabicName: "أرنب بري", fileName: "hare.png" },
  { englishName: "Hawk", arabicName: "باز", fileName: "hawk.png" },
  { englishName: "Hedgehog", arabicName: "قنفذ", fileName: "hedgehog.png" },
  { englishName: "Hippopotamus", arabicName: "فرس النهر", fileName: "hippopotamus.png" },
  { englishName: "Horse", arabicName: "حصان", fileName: "horse.png" },
  { englishName: "Hummingbird", arabicName: "طائر الطنان", fileName: "hummingbird.png" },
  { englishName: "Hyena", arabicName: "ضبع", fileName: "hyena.png" },
  { englishName: "Ibis", arabicName: "أبو منجل", fileName: "ibis.png" },
  { englishName: "Ibex", arabicName: "وعل", fileName: "ibex.png" },
  { englishName: "Impala", arabicName: "إمبالا", fileName: "impala.png" },
  { englishName: "Jackal", arabicName: "ابن آوى", fileName: "jackal.png" },
  { englishName: "Jaguar", arabicName: "جاغوار", fileName: "jaguar.png" },
  { englishName: "Jellyfish", arabicName: "قنديل البحر", fileName: "jellyfish.png" },
  { englishName: "Jay", arabicName: "قيق", fileName: "jay.png" },
  { englishName: "Kangaroo", arabicName: "كنغر", fileName: "kangaroo.png" },
  { englishName: "Kingfisher", arabicName: "رفراف", fileName: "kingfisher.png" },
  { englishName: "Koala", arabicName: "كوالا", fileName: "koala.png" },
  { englishName: "Kookaburra", arabicName: "كوكابورا", fileName: "kookaburra.png" },
  { englishName: "Ladybug", arabicName: "دعسوقة", fileName: "ladybug.png" },
  { englishName: "Lamb", arabicName: "حمل", fileName: "lamb.png" },
  { englishName: "Leopard", arabicName: "فهد", fileName: "leopard.png" },
  { englishName: "Lion", arabicName: "أسد", fileName: "lion.png" },
  { englishName: "Lizard", arabicName: "سحلية", fileName: "lizard.png" },
  { englishName: "Llama", arabicName: "لاما", fileName: "llama.png" },
  { englishName: "Lobster", arabicName: "جراد البحر", fileName: "lobster.png" },
  { englishName: "Macaw", arabicName: "مكاو", fileName: "macaw.png" },
  { englishName: "Magpie", arabicName: "عقعق", fileName: "magpie.png" },
  { englishName: "Mallard", arabicName: "بط بري", fileName: "mallard.png" },
  { englishName: "Meerkat", arabicName: "ميركات", fileName: "meerkat.png" },
  { englishName: "Monkey", arabicName: "قرد", fileName: "monkey.png" },
  { englishName: "Moose", arabicName: "أيل أمريكي", fileName: "moose.png" },
  { englishName: "Mosquito", arabicName: "بعوضة", fileName: "mosquito.png" },
  { englishName: "Mouse", arabicName: "فأر", fileName: "mouse.png" },
  { englishName: "Mule", arabicName: "بغل", fileName: "mule.png" },
  { englishName: "Nightingale", arabicName: "عندليب", fileName: "nightingale.png" },
  { englishName: "Newt", arabicName: "سمندل", fileName: "newt.png" },
  { englishName: "Narwhal", arabicName: "حوت وحيد القرن", fileName: "narwhal.png" },
  { englishName: "Octopus", arabicName: "أخطبوط", fileName: "octopus.png" },
  { englishName: "Okapi", arabicName: "أوكابي", fileName: "okapi.png" },
  { englishName: "Opossum", arabicName: "أوبوسوم", fileName: "opossum.png" },
  { englishName: "Orangutan", arabicName: "إنسان الغاب", fileName: "orangutan.png" },
  { englishName: "Ostrich", arabicName: "نعامة", fileName: "ostrich.png" },
  { englishName: "Otter", arabicName: "قضاعة", fileName: "otter.png" },
  { englishName: "Owl", arabicName: "بومة", fileName: "owl.png" },
  { englishName: "Ox", arabicName: "ثور", fileName: "ox.png" },
  { englishName: "Panda", arabicName: "باندا", fileName: "panda.png" },
  { englishName: "Panther", arabicName: "فهد أسود", fileName: "panther.png" },
  { englishName: "Parrot", arabicName: "ببغاء", fileName: "parrot.png" },
  { englishName: "Peacock", arabicName: "طاووس", fileName: "peacock.png" },
  { englishName: "Pelican", arabicName: "بجع", fileName: "pelican.png" },
  { englishName: "Penguin", arabicName: "بطريق", fileName: "penguin.png" },
  { englishName: "Pig", arabicName: "خنزير", fileName: "pig.png" },
  { englishName: "Pigeon", arabicName: "حمامة", fileName: "pigeon.png" },
  { englishName: "Polar Bear", arabicName: "دب قطبي", fileName: "polar_bear.png" },
  { englishName: "Pony", arabicName: "مهر", fileName: "pony.png" },
  { englishName: "Porcupine", arabicName: "شيهم", fileName: "porcupine.png" },
  { englishName: "Quail", arabicName: "سمان", fileName: "quail.png" },
  { englishName: "Quokka", arabicName: "كوكا", fileName: "quokka.png" },
  { englishName: "Rabbit", arabicName: "أرنب", fileName: "rabbit.png" },
  { englishName: "Raccoon", arabicName: "راكون", fileName: "raccoon.png" },
  { englishName: "Ram", arabicName: "كبش", fileName: "ram.png" },
  { englishName: "Rat", arabicName: "جرذ", fileName: "rat.png" },
  { englishName: "Raven", arabicName: "غراب", fileName: "raven.png" },
  { englishName: "Reindeer", arabicName: "رنة", fileName: "reindeer.png" },
  { englishName: "Rhinoceros", arabicName: "وحيد القرن", fileName: "rhinoceros.png" },
  { englishName: "Robin", arabicName: "أبو الحناء", fileName: "robin.png" },
  { englishName: "Salmon", arabicName: "سلمون", fileName: "salmon.png" },
  { englishName: "Scorpion", arabicName: "عقرب", fileName: "scorpion.png" },
  { englishName: "Seal", arabicName: "فقمة", fileName: "seal.png" },
  { englishName: "Shark", arabicName: "قرش", fileName: "shark.png" },
  { englishName: "Sheep", arabicName: "خروف", fileName: "sheep.png" },
  { englishName: "Skunk", arabicName: "ظربان", fileName: "skunk.png" },
  { englishName: "Snail", arabicName: "حلزون", fileName: "snail.png" },
  { englishName: "Snake", arabicName: "أفعى", fileName: "snake.png" },
  { englishName: "Sparrow", arabicName: "عصفور", fileName: "sparrow.png" },
  { englishName: "Spider", arabicName: "عنكبوت", fileName: "spider.png" },
  { englishName: "Squirrel", arabicName: "سنجاب", fileName: "squirrel.png" },
  { englishName: "Starfish", arabicName: "نجم البحر", fileName: "starfish.png" },
  { englishName: "Swan", arabicName: "بجعة", fileName: "swan.png" },
  { englishName: "Tiger", arabicName: "نمر", fileName: "tiger.png" },
  { englishName: "Toad", arabicName: "علجوم", fileName: "toad.png" },
  { englishName: "Toucan", arabicName: "طوقان", fileName: "toucan.png" },
  { englishName: "Turkey", arabicName: "ديك رومي", fileName: "turkey.png" },
  { englishName: "Turtle", arabicName: "سلحفاة", fileName: "turtle.png" },
  { englishName: "Urial", arabicName: "أوريال", fileName: "urial.png" },
  { englishName: "Vulture", arabicName: "نسر", fileName: "vulture.png" },
  { englishName: "Walrus", arabicName: "فظ", fileName: "walrus.png" },
  { englishName: "Wasp", arabicName: "دبور", fileName: "wasp.png" },
  { englishName: "Weasel", arabicName: "ابن عرس", fileName: "weasel.png" },
  { englishName: "Whale", arabicName: "حوت", fileName: "whale.png" },
  { englishName: "Wolf", arabicName: "ذئب", fileName: "ذئب.png" },
  { englishName: "Wolverine", arabicName: "ولفرين", fileName: "ولفرين.png" },
  { englishName: "Wombat", arabicName: "ومبات", fileName: "ومبات.png" },
  { englishName: "Woodpecker", arabicName: "نقار الخشب", fileName: "نقار الخشب.png" },
  { englishName: "Xerus", arabicName: "سنجاب أرضي", fileName: "سنجاب أرضي.png" },
  { englishName: "Yak", arabicName: "ياك", fileName: "ياك.png" },
  { englishName: "Zebra", arabicName: "حمار وحشي", fileName: "حمار وحشي.png" }
];

async function generateImagesForAnimals() {
  if (!STABILITY_API_KEY || !STABILITY_API_URL) {
    console.error("⛔️ Stability AI API Key or URL is missing. Check your .env file.");
    return;
  }

  try {
    console.log("🚀 Starting image generation for animal list...");

    let generatedCount = 0;
    let skippedCount = 0;
    let failedCount = 0;

    for (const animal of animalsData) {
      const englishName = animal.englishName;
      const fileName = animal.fileName;

      if (!englishName || !fileName) {
        console.warn(`- Skipping entry (missing name or file name): ${JSON.stringify(animal)}`);
        skippedCount++;
        continue;
      }
      if (!fileName.endsWith('.png') && !fileName.endsWith('.jpg') && !fileName.endsWith('.jpeg')) {
        console.warn(`- Skipping '${englishName}': File name '${fileName}' does not end with .png/.jpg/.jpeg. Please correct.`);
        skippedCount++;
        continue;
      }

      const outputFilePath = path.join(IMAGE_OUTPUT_DIR, fileName);

      // إذا كان الملف موجودًا بالفعل، تخطاه لتجنب إعادة التوليد
      if (fs.existsSync(outputFilePath)) {
          console.log(`- Image for '${englishName}' (${fileName}) already exists. Skipping.`);
          skippedCount++;
          continue;
      }

      console.log(`- Generating image for: '${englishName}' into '${fileName}'`);

      // الوصف (prompt) لتوليد الصورة
      // استخدم الخصائص التي طلبتها: كرتوني، 800x800، جودة عالية، خلفية بيضاء، بدون نص/ظلال
      const prompt = `A centered, high-quality illustration of a ${englishName} on a clean white background. The image should be colorful, friendly, and suitable for children. No text, no shadows, flat vector style.`;
      
      try {
        const response = await fetch(STABILITY_API_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json', // Stability AI غالبًا ما يتطلب هذا
            'Authorization': `Bearer ${STABILITY_API_KEY}`
          },
          body: JSON.stringify({
            // بناء الطلب لـ Stability AI
            text_prompts: [
              { text: prompt, weight: 1 },
              { text: "blurry, bad art, low quality, pixelated, ugly, text, shadow", weight: -1 } // Negative prompt للمساعدة في الجودة
            ],
            cfg_scale: 7, // قابل للتعديل (يتحكم في مدى التزام الصورة بالـ prompt)
            clip_guidance_preset: 'FAST_BLUE', // قابل للتعديل
            height: 1024, // Stable Diffusion XL يعمل بشكل أفضل مع 1024x1024
            width: 1024,  // إذا كنت تريد 800x800 بالضبط، ستحتاج إلى تغيير الحجم بعد التوليد
            samples: 1,   // عدد الصور المراد توليدها
            steps: 30,    // عدد خطوات التوليد، قابل للتعديل
            seed: 0       // رقم عشوائي لضمان قابلية التكرار، يمكن إزالته
          }),
        });

        if (!response.ok) {
          const errorData = await response.json(); // Stability AI يرجع JSON
          console.error(`❌ Failed to generate image for '${englishName}' (Status: ${response.status}):`, errorData);
          failedCount++;
          continue;
        }

        const responseData = await response.json();
        
        // Stability AI يرجع عادةً images كـ base64_json
        if (responseData.artifacts && responseData.artifacts[0] && responseData.artifacts[0].base64) {
            const base64Image = responseData.artifacts[0].base64;
            const imageBuffer = Buffer.from(base64Image, 'base64');
            fs.writeFileSync(outputFilePath, imageBuffer);
            console.log(`  -> Successfully saved: ${fileName}`);
            generatedCount++;
        } else {
            console.error(`❌ Failed to get image data for '${englishName}': Unexpected API response format or no artifacts.`, responseData);
            failedCount++;
        }

      } catch (apiError) {
        console.error(`❌ Error calling image generation API for '${englishName}':`, apiError);
        failedCount++;
      }
    }

    console.log("\n✨ Image generation process complete!");
    console.log(`Summary: Generated: ${generatedCount}, Skipped: ${skippedCount}, Failed: ${failedCount}`);

  } catch (error) {
    console.error("⛔️ Fatal error during image generation process:", error);
  }
}

// تشغيل الدالة
generateImagesForAnimals();