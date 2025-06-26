// scripts/seed-animals-firestore.js

// استيراد المكتبات باستخدام import بدلاً من require
import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs'; // تأكد من استيراد fs

// *** إضافة: استيراد وحساب __dirname و __filename في ES Modules ***
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// *******************************************************************

// 1. تهيئة Firebase Admin SDK
// في ES Modules، نقرأ ملف JSON بشكل متزامن
const serviceAccountPath = path.resolve(__dirname, '../serviceAccountKey.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// 2. قائمة بيانات الحيوانات (يجب أن تكون هذه القائمة كاملة ودقيقة كما ناقشناها سابقًا)
// *** تأكد أن جميع حقول fileName و voices.* تنتهي بـ .mp3/ أو .png وأنها لا تحتوي على أخطاء نحوية ***
const animalsData = [
    {
        englishName: "Alligator",
        arabicName: "تمساح",
        imageFileName: "alligator.png",
        voices: {
            boy: "alligator_boy_ar.mp3",
            girl: "alligator_girl_ar.mp3",
            teacher: "alligator_teacher_ar.mp3",
            child: "alligator_child_ar.mp3"
        },
        description: {
            ar: "التمساح زاحف كبير وقوي يعيش في الماء وعلى اليابسة، يتميز بفمه الكبير المليء بالأسنان الحادة.",
            en: "The alligator is a large, powerful reptile that lives in water and on land, characterized by its large mouth full of sharp teeth."
        },
        baby: { ar: "صغير التمساح", en: "Hatchling" },
        female: { ar: "أنثى التمساح", en: "Alligatoress" },
        category: { ar: ["زاحف", "مفترس"], en: ["Reptile", "Carnivore"] },
        letter: { ar: "ت", en: "A", he: "א" } // مثال إذا كان لديك حقل letter
    },
    {
        englishName: "Ant",
        arabicName: "نملة",
        imageFileName: "ant.png",
        voices: {
            boy: "ant_boy_ar.mp3",
            girl: "ant_girl_ar.mp3",
            teacher: "ant_teacher_ar.mp3",
            child: "ant_child_ar.mp3"
        },
        description: {
            ar: "النملة حشرة صغيرة مجتهدة تعيش في مستعمرات كبيرة ومنظمة، وهي معروفة بحمل الأشياء التي تفوق حجمها.",
            en: "An ant is a small, industrious insect that lives in large, organized colonies, known for carrying objects larger than itself."
        },
        baby: { ar: "صغيرة النملة", en: "Larva" },
        female: { ar: "ملكة النمل", en: "Queen Ant" },
        category: { ar: ["حشرة", "اجتماعي"], en: ["Insect", "Social"] },
        letter: { ar: "ن", en: "A", he: "א" }
    },
    {
        englishName: "Ape",
        arabicName: "قرد",
        imageFileName: "ape.png",
        voices: {
            boy: "ape_boy_ar.mp3",
            girl: "ape_girl_ar.mp3",
            teacher: "ape_teacher_ar.mp3",
            child: "ape_child_ar.mp3"
        },
        description: {
            ar: "القرد حيوان ذكي يعيش في الغابات، معروف بمهارته في التسلق والتأرجح بين الأشجار.",
            en: "An ape is an intelligent animal that lives in forests, known for its skill in climbing and swinging among trees."
        },
        baby: { ar: "صغير القرد", en: "Infant Ape" },
        female: { ar: "أنثى القرد", en: "Female Ape" },
        category: { ar: ["ثديي", "آكل نباتات"], en: ["Mammal", "Herbivore"] },
        letter: { ar: "ق", en: "A", he: "א" }
    },
    {
        englishName: "Arctic Fox",
        arabicName: "ثعلب قطبي",
        imageFileName: "arctic_fox.png",
        voices: {
            boy: "arctic_fox_boy_ar.mp3",
            girl: "arctic_fox_girl_ar.mp3",
            teacher: "arctic_fox_teacher_ar.mp3",
            child: "arctic_fox_child_ar.mp3"
        },
        description: {
            ar: "الثعلب القطبي حيوان فروه أبيض سميك في الشتاء ليحميه من البرد، ويصبح بنيًا في الصيف.",
            en: "The Arctic Fox is an animal with thick white fur in winter to protect it from the cold, turning brown in summer."
        },
        baby: { ar: "صغير الثعلب", en: "Pup" },
        female: { ar: "أنثى الثعلب", en: "Vixen" },
        category: { ar: ["ثديي", "آكل لحوم"], en: ["Mammal", "Carnivore"] },
        letter: { ar: "ث", en: "A", he: "א" }
    },
    {
        englishName: "Armadillo",
        arabicName: "مدرع",
        imageFileName: "armadillo.png",
        voices: {
            boy: "armadillo_boy_ar.mp3",
            girl: "armadillo_girl_ar.mp3",
            teacher: "armadillo_teacher_ar.mp3",
            child: "armadillo_child_ar.mp3"
        },
        description: {
            ar: "المدرع حيوان يتميز بدرع صلب يغطي جسمه لحمايته، ويمكنه الالتفاف على شكل كرة عند الخطر.",
            en: "The armadillo is an animal characterized by a hard shell covering its body for protection, and it can curl into a ball when in danger."
        },
        baby: { ar: "صغير المدرع", en: "Pup" },
        female: { ar: "أنثى المدرع", en: "Female Armadillo" },
        category: { ar: ["ثديي", "آكل حشرات"], en: ["Mammal", "Insectivore"] },
        letter: { ar: "م", en: "A", he: "א" }
    },
    {
        englishName: "Bear",
        arabicName: "دب",
        imageFileName: "bear.png",
        voices: {
            boy: "bear_boy_ar.mp3",
            girl: "bear_girl_ar.mp3",
            teacher: "bear_teacher_ar.mp3",
            child: "bear_child_ar.mp3"
        },
        description: {
            ar: "الدب حيوان كبير وقوي، فروه سميك، يعيش في الغابات والمناطق الباردة، ويحب العسل.",
            en: "A bear is a large, strong animal with thick fur, living in forests and cold regions, and loves honey."
        },
        baby: { ar: "دغفل", en: "Cub" },
        female: { ar: "أنثى الدب", en: "She-bear" },
        category: { ar: ["ثديي", "آكل كل شيء"], en: ["Mammal", "Omnivore"] },
        letter: { ar: "د", en: "B", he: "ב" }
    },
    {
        englishName: "Bee",
        arabicName: "نحلة",
        imageFileName: "bee.png",
        voices: {
            boy: "bee_boy_ar.mp3",
            girl: "bee_girl_ar.mp3",
            teacher: "bee_teacher_ar.mp3",
            child: "bee_child_ar.mp3"
        },
        description: {
            ar: "النحلة حشرة مجتهدة تنتج العسل، وتساعد الزهور على التكاثر عن طريق نقل حبوب اللقاح.",
            en: "A bee is an industrious insect that produces honey and helps flowers reproduce by transferring pollen."
        },
        baby: { ar: "صغيرة النحلة", en: "Larva" },
        female: { ar: "ملكة النحل", en: "Queen Bee" },
        category: { ar: ["حشرة", "ملقح"], en: ["Insect", "Pollinator"] },
        letter: { ar: "ن", en: "B", he: "ב" }
    },
    {
        englishName: "Bird",
        arabicName: "طائر",
        imageFileName: "bird.png",
        voices: {
            boy: "bird_boy_ar.mp3",
            girl: "bird_girl_ar.mp3",
            teacher: "bird_teacher_ar.mp3",
            child: "bird_child_ar.mp3"
        },
        description: {
            ar: "الطائر حيوان لديه ريش وأجنحة، يمكنه الطيران وبناء أعشاش ليضع فيها بيضه.",
            en: "A bird is an animal with feathers and wings that can fly and build nests to lay its eggs."
        },
        baby: { ar: "فرخ", en: "Chick" },
        female: { ar: "أنثى الطائر", en: "Hen" },
        category: { ar: ["طائر", "فقاري"], en: ["Bird", "Vertebrate"] },
        letter: { ar: "ط", en: "B", he: "ב" }
    },
    {
        englishName: "Butterfly",
        arabicName: "فراشة",
        imageFileName: "butterfly.png",
        voices: {
            boy: "butterfly_boy_ar.mp3",
            girl: "butterfly_girl_ar.mp3",
            teacher: "butterfly_teacher_ar.mp3",
            child: "butterfly_child_ar.mp3"
        },
        description: {
            ar: "الفراشة حشرة جميلة ذات أجنحة ملونة ورقيقة، تتحول من يرقة إلى فراشة مكتملة.",
            en: "A butterfly is a beautiful insect with colorful, delicate wings that transforms from a caterpillar into a complete butterfly."
        },
        baby: { ar: "يرقة", en: "Caterpillar" },
        female: { ar: "أنثى الفراشة", en: "Female Butterfly" },
        category: { ar: ["حشرة", "جميلة"], en: ["Insect", "Beautiful"] },
        letter: { ar: "ف", en: "B", he: "ב" }
    },
    {
        englishName: "Bat",
        arabicName: "خفاش",
        imageFileName: "bat.png",
        voices: {
            boy: "bat_boy_ar.mp3",
            girl: "bat_girl_ar.mp3",
            teacher: "bat_teacher_ar.mp3",
            child: "bat_child_ar.mp3"
        },
        description: {
            ar: "الخفاش هو الثديي الوحيد الذي يستطيع الطيران، ينشط ليلاً ويستخدم الصدى ليجد طريقه.",
            en: "The bat is the only mammal capable of flight, active at night and uses echolocation to find its way."
        },
        baby: { ar: "صغير الخفاش", en: "Pup" },
        female: { ar: "أنثى الخفاش", en: "Female Bat" },
        category: { ar: ["ثديي", "ليلي"], en: ["Mammal", "Nocturnal"] },
        letter: { ar: "خ", en: "B", he: "ב" }
    },
    {
        englishName: "Badger",
        arabicName: "غرير",
        imageFileName: "badger.png",
        voices: {
            boy: "badger_boy_ar.mp3",
            girl: "badger_girl_ar.mp3",
            teacher: "badger_teacher_ar.mp3",
            child: "badger_child_ar.mp3"
        },
        description: {
            ar: "الغرير حيوان فروه رمادي ووجهه مخطط بالأبيض والأسود، معروف بحفر الجحور تحت الأرض.",
            en: "A badger is an animal with grey fur and a black and white striped face, known for digging burrows underground."
        },
        baby: { ar: "صغير الغرير", en: "Cub" },
        female: { ar: "أنثى الغرير", en: "Sow" },
        category: { ar: ["ثديي", "حفار"], en: ["Mammal", "Burrowing"] },
        letter: { ar: "غ", en: "B", he: "ב" }
    },
    {
        englishName: "Beaver",
        arabicName: "قندس",
        imageFileName: "beaver.png",
        voices: {
            boy: "beaver_boy_ar.mp3",
            girl: "beaver_girl_ar.mp3",
            teacher: "beaver_teacher_ar.mp3",
            child: "beaver_child_ar.mp3"
        },
        description: {
            ar: "القندس حيوان مائي يبني السدود والأكواخ من الخشب في الأنهار، ويتميز بذيله المسطح.",
            en: "A beaver is an aquatic animal that builds dams and lodges from wood in rivers, characterized by its flat tail."
        },
        baby: { ar: "صغير القندس", en: "Kit" },
        female: { ar: "أنثى القندس", en: "Female Beaver" },
        category: { ar: ["ثديي", "مهندس"], en: ["Mammal", "Engineer"] },
        letter: { ar: "ق", en: "B", he: "ב" }
    },
    {
        englishName: "Bison",
        arabicName: "بيسون",
        imageFileName: "bison.png",
        voices: {
            boy: "bison_boy_ar.mp3",
            girl: "bison_girl_ar.mp3",
            teacher: "bison_teacher_ar.mp3",
            child: "bison_child_ar.mp3"
        },
        description: {
            ar: "البيسون حيوان ضخم يعيش في السهول، له فرو كثيف وقرون قوية وحذمة على ظهره.",
            en: "The bison is a large animal living on plains, with thick fur, strong horns, and a hump on its back."
        },
        baby: { ar: "عجل", en: "Calf" },
        female: { ar: "أنثى البيسون", en: "Cow" },
        category: { ar: ["ثديي", "آكل عشب"], en: ["Mammal", "Herbivore"] },
        letter: { ar: "ب", en: "B", he: "ב" }
    },
    {
        englishName: "Boar",
        arabicName: "خنزير بري",
        imageFileName: "boar.png",
        voices: {
            boy: "boar_boy_ar.mp3",
            girl: "boar_girl_ar.mp3",
            teacher: "boar_teacher_ar.mp3",
            child: "boar_child_ar.mp3"
        },
        description: {
            ar: "الخنزير البري حيوان قوي ومغطى بشعر خشن، يمتلك أنيابًا بارزة ويحب البحث عن الطعام في الغابات.",
            en: "A wild boar is a strong animal covered in coarse hair, with prominent tusks, and loves foraging in forests."
        },
        baby: { ar: "خنزير صغير", en: "Piglet" },
        female: { ar: "أنثى الخنزير البري", en: "Sow" },
        category: { ar: ["ثديي", "بري"], en: ["Mammal", "Wild"] },
        letter: { ar: "خ", en: "B", he: "ב" }
    },
    {
        englishName: "Bobcat",
        arabicName: "وشق أحمر",
        imageFileName: "bobcat.png",
        voices: {
            boy: "bobcat_boy_ar.mp3",
            girl: "bobcat_girl_ar.mp3",
            teacher: "bobcat_teacher_ar.mp3",
            child: "bobcat_child_ar.mp3"
        },
        description: {
            ar: "الوشق الأحمر قط بري صغير، فروه مرقط وذيله قصير مميز، يعيش في أمريكا الشمالية.",
            en: "The bobcat is a small wild cat with a spotted coat and a distinctive short tail, living in North America."
        },
        baby: { ar: "هريرة الوشق", en: "Kitten" },
        female: { ar: "أنثى الوشق", en: "Female Bobcat" },
        category: { ar: ["ثديي", "قط بري"], en: ["Mammal", "Wild Cat"] },
        letter: { ar: "و", en: "B", he: "ב" }
    },
    {
        englishName: "Camel",
        arabicName: "جمل",
        imageFileName: "camel.png",
        voices: {
            boy: "camel_boy_ar.mp3",
            girl: "camel_girl_ar.mp3",
            teacher: "camel_teacher_ar.mp3",
            child: "camel_child_ar.mp3"
        },
        description: {
            ar: "الجمل حيوان الصحراء، لديه سنام يخزن فيه الطعام والماء، ويتحمل العطش والجوع.",
            en: "The camel is a desert animal with a hump for storing food and water, enduring thirst and hunger."
        },
        baby: { ar: "قعود", en: "Calf" },
        female: { ar: "ناقة", en: "She-camel" },
        category: { ar: ["ثديي", "صحراوي"], en: ["Mammal", "Desert"] },
        letter: { ar: "ج", en: "C", he: "ג" }
    },
    {
        englishName: "Cat",
        arabicName: "قط",
        imageFileName: "cat.png",
        voices: {
            boy: "cat_boy_ar.mp3",
            girl: "cat_girl_ar.mp3",
            teacher: "cat_teacher_ar.mp3",
            child: "cat_child_ar.mp3"
        },
        description: {
            ar: "القط حيوان أليف لطيف، فروه ناعم، يحب اللعب والنوم، وهو صديق للإنسان في المنزل.",
            en: "A cat is a cute domestic animal with soft fur, loves playing and sleeping, and is a friend to humans at home."
        },
        baby: { ar: "هر", en: "Kitten" },
        female: { ar: "قطة", en: "Queen" },
        category: { ar: ["ثديي", "أليف"], en: ["Mammal", "Domestic"] },
        letter: { ar: "ق", en: "C", he: "ג" }
    },
    {
        englishName: "Chicken",
        arabicName: "دجاجة",
        imageFileName: "chicken.png",
        voices: {
            boy: "chicken_boy_ar.mp3",
            girl: "chicken_girl_ar.mp3",
            teacher: "chicken_teacher_ar.mp3",
            child: "chicken_child_ar.mp3"
        },
        description: {
            ar: "الدجاجة طائر تربى في المزرعة، تعطينا البيض واللحم، وتصدر صوت قوقأة.",
            en: "A chicken is a bird raised on a farm, providing eggs and meat, and makes a clucking sound."
        },
        baby: { ar: "صوص", en: "Chick" },
        female: { ar: "دجاجة", en: "Hen" },
        category: { ar: ["طائر", "داجن"], en: ["Bird", "Poultry"] },
        letter: { ar: "د", en: "C", he: "ג" }
    },
    {
        englishName: "Chimpanzee",
        arabicName: "شمبانزي",
        imageFileName: "chimpanzee.png",
        voices: {
            boy: "chimpanzee_boy_ar.mp3",
            girl: "chimpanzee_girl_ar.mp3",
            teacher: "chimpanzee_teacher_ar.mp3",
            child: "chimpanzee_child_ar.mp3"
        },
        description: {
            ar: "الشمبانزي قرد ذكي جدًا، يعيش في الغابات الإفريقية، ويستخدم الأدوات.",
            en: "The chimpanzee is a very intelligent ape, living in African forests, and uses tools."
        },
        baby: { ar: "صغير الشمبانزي", en: "Infant Chimpanzee" },
        female: { ar: "أنثى الشمبانزي", en: "Female Chimpanzee" },
        category: { ar: ["ثديي", "ذكي"], en: ["Mammal", "Intelligent"] },
        letter: { ar: "ش", en: "C", he: "ג" }
    },
    {
        englishName: "Cobra",
        arabicName: "كوبرا",
        imageFileName: "cobra.png",
        voices: {
            boy: "cobra_boy_ar.mp3",
            girl: "cobra_girl_ar.mp3",
            teacher: "cobra_teacher_ar.mp3",
            child: "cobra_child_ar.mp3"
        },
        description: {
            ar: "الكوبرا نوع من الأفاعي السامة المشهورة بغطاء رأسها الذي تنشره عند الشعور بالخطر.",
            en: "The cobra is a type of venomous snake known for its hood that it flares when threatened."
        },
        baby: { ar: "صغير الكوبرا", en: "Hatchling" },
        female: { ar: "أنثى الكوبرا", en: "Female Cobra" },
        category: { ar: ["زاحف", "سام"], en: ["Reptile", "Venomous"] },
        letter: { ar: "ك", en: "C", he: "ג" }
    },
    {
        englishName: "Cow",
        arabicName: "بقرة",
        imageFileName: "cow.png",
        voices: {
            boy: "cow_boy_ar.mp3",
            girl: "cow_girl_ar.mp3",
            teacher: "cow_teacher_ar.mp3",
            child: "cow_child_ar.mp3"
        },
        description: {
            ar: "البقرة حيوان مزرعة كبير، تعطينا الحليب واللحم، وتصدر صوت الخوار.",
            en: "A cow is a large farm animal that gives us milk and meat, and makes a mooing sound."
        },
        baby: { ar: "عجل", en: "Calf" },
        female: { ar: "بقرة", en: "Cow" },
        category: { ar: ["ثديي", "مزرعة"], en: ["Mammal", "Farm Animal"] },
        letter: { ar: "ب", en: "C", he: "ג" }
    },
    {
        englishName: "Crab",
        arabicName: "سرطان",
        imageFileName: "crab.png",
        voices: {
            boy: "crab_boy_ar.mp3",
            girl: "crab_girl_ar.mp3",
            teacher: "crab_teacher_ar.mp3",
            child: "crab_child_ar.mp3"
        },
        description: {
            ar: "السرطان حيوان بحري له درع صلب وزوجان من المخالب الكبيرة، ويتحرك جانبياً.",
            en: "A crab is a marine animal with a hard shell and two large claws, moving sideways."
        },
        baby: { ar: "صغير السرطان", en: "Zoea" },
        female: { ar: "أنثى السرطان", en: "Female Crab" },
        category: { ar: ["لافقاري", "بحري"], en: ["Invertebrate", "Marine"] },
        letter: { ar: "س", en: "C", he: "ג" }
    },
    {
        englishName: "Crocodile",
        arabicName: "تمساح",
        imageFileName: "crocodile.png",
        voices: {
            boy: "crocodile_boy_ar.mp3",
            girl: "crocodile_girl_ar.mp3",
            teacher: "crocodile_teacher_ar.mp3",
            child: "crocodile_child_ar.mp3"
        },
        description: {
            ar: "التمساح زاحف مائي كبير، له فم طويل وأسنان حادة، ويعيش في الأنهار والبحيرات.",
            en: "A crocodile is a large aquatic reptile with a long snout and sharp teeth, living in rivers and lakes."
        },
        baby: { ar: "صغير التمساح", en: "Hatchling" },
        female: { ar: "أنثى التمساح", en: "Female Crocodile" },
        category: { ar: ["زاحف", "مفترس"], en: ["Reptile", "Predator"] },
        letter: { ar: "ت", en: "C", he: "ג" }
    },
    {
        englishName: "Crow",
        arabicName: "غراب",
        imageFileName: "crow.png",
        voices: {
            boy: "crow_boy_ar.mp3",
            girl: "crow_girl_ar.mp3",
            teacher: "crow_teacher_ar.mp3",
            child: "crow_child_ar.mp3"
        },
        description: {
            ar: "الغراب طائر ذكي أسود اللون، معروف بصوته المميز وقدرته على تقليد الأصوات.",
            en: "A crow is an intelligent black bird, known for its distinctive caw and ability to mimic sounds."
        },
        baby: { ar: "فرخ الغراب", en: "Fledgling" },
        female: { ar: "أنثى الغراب", en: "Female Crow" },
        category: { ar: ["طائر", "ذكي"], en: ["Bird", "Intelligent"] },
        letter: { ar: "غ", en: "C", he: "ג" }
    },
    {
        englishName: "Cheetah",
        arabicName: "فهد",
        imageFileName: "cheetah.png",
        voices: {
            boy: "cheetah_boy_ar.mp3",
            girl: "cheetah_girl_ar.mp3",
            teacher: "cheetah_teacher_ar.mp3",
            child: "cheetah_child_ar.mp3"
        },
        description: {
            ar: "الفهد أسرع حيوان على اليابسة، له جسم رشيق وفرو مرقط بالأسود، ويعيش في السافانا.",
            en: "The cheetah is the fastest land animal, with a slender body and black-spotted fur, living in the savannah."
        },
        baby: { ar: "جرو الفهد", en: "Cub" },
        female: { ar: "أنثى الفهد", en: "Female Cheetah" },
        category: { ar: ["ثديي", "مفترس"], en: ["Mammal", "Predator"] },
        letter: { ar: "ف", en: "C", he: "ג" }
    },
    {
        englishName: "Deer",
        arabicName: "غزال",
        imageFileName: "deer.png",
        voices: {
            boy: "deer_boy_ar.mp3",
            girl: "deer_girl_ar.mp3",
            teacher: "deer_teacher_ar.mp3",
            child: "deer_child_ar.mp3"
        },
        description: {
            ar: "الغزال حيوان رشيق وجميل، يتميز بالقرون المتفرعة (للذكور) وعيونه الكبيرة اللطيفة.",
            en: "The deer is a graceful and beautiful animal, characterized by branched antlers (for males) and large, gentle eyes."
        },
        baby: { ar: "غزال صغير", en: "Fawn" },
        female: { ar: "ظبية", en: "Doe" },
        category: { ar: ["ثديي", "آكل عشب"], en: ["Mammal", "Herbivore"] },
        letter: { ar: "غ", en: "D", he: "ד" }
    },
    {
        englishName: "Dog",
        arabicName: "كلب",
        imageFileName: "dog.png",
        voices: {
            boy: "dog_boy_ar.mp3",
            girl: "dog_girl_ar.mp3",
            teacher: "dog_teacher_ar.mp3",
            child: "dog_child_ar.mp3"
        },
        description: {
            ar: "الكلب حيوان أليف ووفي، وهو صديق للإنسان، يحب اللعب والحماية.",
            en: "A dog is a loyal domestic animal, a friend to humans, loves playing and protecting."
        },
        baby: { ar: "جرو", en: "Puppy" },
        female: { ar: "كلبة", en: "Bitch" },
        category: { ar: ["ثديي", "أليف"], en: ["Mammal", "Domestic"] },
        letter: { ar: "ك", en: "D", he: "ד" }
    },
    {
        englishName: "Dolphin",
        arabicName: "دلفين",
        imageFileName: "dolphin.png",
        voices: {
            boy: "dolphin_boy_ar.mp3",
            girl: "dolphin_girl_ar.mp3",
            teacher: "dolphin_teacher_ar.mp3",
            child: "dolphin_child_ar.mp3"
        },
        description: {
            ar: "الدلفين حيوان بحري ذكي وودود، يعيش في مجموعات ويحب القفز فوق الماء.",
            en: "The dolphin is an intelligent and friendly marine animal, living in groups and loves jumping above water."
        },
        baby: { ar: "صغير الدلفين", en: "Calf" },
        female: { ar: "أنثى الدلفين", en: "Female Dolphin" },
        category: { ar: ["ثديي", "بحري"], en: ["Mammal", "Marine"] },
        letter: { ar: "د", en: "D", he: "ד" }
    },
    {
        englishName: "Donkey",
        arabicName: "حمار",
        imageFileName: "donkey.png",
        voices: {
            boy: "donkey_boy_ar.mp3",
            girl: "donkey_girl_ar.mp3",
            teacher: "donkey_teacher_ar.mp3",
            child: "donkey_child_ar.mp3"
        },
        description: {
            ar: "الحمار حيوان أليف يستخدم لحمل الأثقال، يتميز بأذنيه الطويلتين وصوته المتميز.",
            en: "A donkey is a domestic animal used for carrying loads, characterized by its long ears and distinctive bray."
        },
        baby: { ar: "جحش", en: "Foal" },
        female: { ar: "أتّان", en: "Jenny" },
        category: { ar: ["ثديي", "أليف"], en: ["Mammal", "Domestic"] },
        letter: { ar: "ح", en: "D", he: "ד" }
    },
    {
        englishName: "Duck",
        arabicName: "بطة",
        imageFileName: "duck.png",
        voices: {
            boy: "duck_boy_ar.mp3",
            girl: "duck_girl_ar.mp3",
            teacher: "duck_teacher_ar.mp3",
            child: "duck_child_ar.mp3"
        },
        description: {
            ar: "البطة طائر مائي له أقدام مكففة تساعده على السباحة، ومعروفة بصوتها المميز.",
            en: "A duck is an aquatic bird with webbed feet that help it swim, known for its distinctive quack."
        },
        baby: { ar: "بطوط", en: "Duckling" },
        female: { ar: "بطة", en: "Duck" },
        category: { ar: ["طائر", "مائي"], en: ["Bird", "Aquatic"] },
        letter: { ar: "ب", en: "D", he: "ד" }
    },
    {
        englishName: "Eagle",
        arabicName: "نسر",
        imageFileName: "eagle.png",
        voices: {
            boy: "eagle_boy_ar.mp3",
            girl: "eagle_girl_ar.mp3",
            teacher: "eagle_teacher_ar.mp3",
            child: "eagle_child_ar.mp3"
        },
        description: {
            ar: "النسر طائر جارح كبير وقوي، يطير عالياً في السماء ويبحث عن فريسته بعينيه الحادتين.",
            en: "An eagle is a large, powerful bird of prey that flies high in the sky and searches for its prey with sharp eyes."
        },
        baby: { ar: "نسر صغير", en: "Eaglet" },
        female: { ar: "أنثى النسر", en: "Female Eagle" },
        category: { ar: ["طائر", "جارح"], en: ["Bird", "Raptor"] },
        letter: { ar: "ن", en: "E", he: "ה" }
    },
    {
        englishName: "Eel",
        arabicName: "أنقليس",
        imageFileName: "eel.png",
        voices: {
            boy: "eel_boy_ar.mp3",
            girl: "eel_girl_ar.mp3",
            teacher: "eel_teacher_ar.mp3",
            child: "eel_child_ar.mp3"
        },
        description: {
            ar: "الأنقليس سمكة تشبه الثعبان، جسمها طويل وناعم، وتعيش في الماء العذب والمالح.",
            en: "An eel is a snake-like fish with a long, smooth body, living in fresh and saltwater."
        },
        baby: { ar: "صغير الأنقليس", en: "Elver" },
        female: { ar: "أنثى الأنقليس", en: "Female Eel" },
        category: { ar: ["سمك", "مائي"], en: ["Fish", "Aquatic"] },
        letter: { ar: "أ", en: "E", he: "ה" }
    },
    {
        englishName: "Elephant",
        arabicName: "فيل",
        imageFileName: "elephant.png",
        voices: {
            boy: "elephant_boy_ar.mp3",
            girl: "elephant_girl_ar.mp3",
            teacher: "elephant_teacher_ar.mp3",
            child: "elephant_child_ar.mp3"
        },
        description: {
            ar: "الفيل أكبر الحيوانات البرية، يتميز بخرطومه الطويل و أذنيه الكبيرتين و أنيابه العاجية.",
            en: "The elephant is the largest land animal, characterized by its long trunk, large ears, and ivory tusks."
        },
        baby: { ar: "دغفل", en: "Calf" },
        female: { ar: "أنثى الفيل", en: "Elephant cow" },
        category: { ar: ["ثديي", "آكل أعشاب"], en: ["Mammal", "Herbivore"] },
        letter: { ar: "ف", en: "E", he: "ה" }
    },
    {
        englishName: "Elk",
        arabicName: "أيل",
        imageFileName: "elk.png",
        voices: {
            boy: "elk_boy_ar.mp3",
            girl: "elk_girl_ar.mp3",
            teacher: "elk_teacher_ar.mp3",
            child: "elk_child_ar.mp3"
        },
        description: {
            ar: "الأيل حيوان ثديي كبير، الذكور لها قرون ضخمة ومتفرعة، وتعيش في الغابات والمروج.",
            en: "An elk is a large mammal, males have massive branched antlers, and they live in forests and meadows."
        },
        baby: { ar: "عجل", en: "Calf" },
        female: { ar: "أيلة", en: "Cow" },
        category: { ar: ["ثديي", "آكل أعشاب"], en: ["Mammal", "Herbivore"] },
        letter: { ar: "أ", en: "E", he: "ה" }
    },
    {
        englishName: "Emu",
        arabicName: "إيمو",
        imageFileName: "emu.png",
        voices: {
            boy: "emu_boy_ar.mp3",
            girl: "emu_girl_ar.mp3",
            teacher: "emu_teacher_ar.mp3",
            child: "emu_child_ar.mp3"
        },
        description: {
            ar: "الإيمو طائر كبير لا يطير، يشبه النعامة، يعيش في أستراليا ويتميز بساقيه الطويلتين القويتين.",
            en: "An emu is a large flightless bird, similar to an ostrich, living in Australia and characterized by its long, strong legs."
        },
        baby: { ar: "صغير الإيمو", en: "Chick" },
        female: { ar: "أنثى الإيمو", en: "Female Emu" },
        category: { ar: ["طائر", "لا يطير"], en: ["Bird", "Flightless"] },
        letter: { ar: "إ", en: "E", he: "ה" }
    },
    {
        englishName: "Falcon",
        arabicName: "صقر",
        imageFileName: "falcon.png",
        voices: {
            boy: "falcon_boy_ar.mp3",
            girl: "falcon_girl_ar.mp3",
            teacher: "falcon_teacher_ar.mp3",
            child: "falcon_child_ar.mp3"
        },
        description: {
            ar: "الصقر طائر جارح مفترس، يمتلك بصرًا حادًا وسرعة كبيرة في الطيران لاصطياد فريسته.",
            en: "A falcon is a predatory bird of prey, possessing sharp eyesight and great speed in flight to catch its prey."
        },
        baby: { ar: "صغير الصقر", en: "Eyass" },
        female: { ar: "أنثى الصقر", en: "Falcon" },
        category: { ar: ["طائر", "جارح"], en: ["Bird", "Raptor"] },
        letter: { ar: "ص", en: "F", he: "ו" }
    },
    {
        englishName: "Ferret",
        arabicName: "نمس",
        imageFileName: "ferret.png",
        voices: {
            boy: "ferret_boy_ar.mp3",
            girl: "ferret_girl_ar.mp3",
            teacher: "ferret_teacher_ar.mp3",
            child: "ferret_child_ar.mp3"
        },
        description: {
            ar: "النمس حيوان صغير رشيق، جسمه طويل وفروه بني أو أبيض، يحب اللعب والتسلل.",
            en: "A ferret is a small, agile animal with a long body and brown or white fur, fond of playing and sneaking."
        },
        baby: { ar: "صغير النمس", en: "Kit" },
        female: { ar: "أنثى النمس", en: "Jill" },
        category: { ar: ["ثديي", "أليف"], en: ["Mammal", "Domestic"] },
        letter: { ar: "ن", en: "F", he: "ו" }
    },
    {
        englishName: "Fish",
        arabicName: "سمكة",
        imageFileName: "fish.png",
        voices: {
            boy: "fish_boy_ar.mp3",
            girl: "fish_girl_ar.mp3",
            teacher: "fish_teacher_ar.mp3",
            child: "fish_child_ar.mp3"
        },
        description: {
            ar: "السمكة حيوان مائي يمتلك خياشيم للتنفس وزعانف للسباحة، وتعيش في البحار والأنهار.",
            en: "A fish is an aquatic animal with gills for breathing and fins for swimming, living in seas and rivers."
        },
        baby: { ar: "صغير السمك", en: "Fry" },
        female: { ar: "أنثى السمك", en: "Spawn" },
        category: { ar: ["سمك", "مائي"], en: ["Fish", "Aquatic"] },
        letter: { ar: "س", en: "F", he: "ו" }
    },
    {
        englishName: "Flamingo",
        arabicName: "فلامنجو",
        imageFileName: "flamingo.png",
        voices: {
            boy: "flamingo_boy_ar.mp3",
            girl: "flamingo_girl_ar.mp3",
            teacher: "flamingo_teacher_ar.mp3",
            child: "flamingo_child_ar.mp3"
        },
        description: {
            ar: "الفلامنجو طائر وردي طويل الساقين والرقبة، يتميز بمنقاره المنحني الذي يستخدمه لتصفية الطعام.",
            en: "A flamingo is a pink bird with long legs and neck, characterized by its curved beak used for filtering food."
        },
        baby: { ar: "صغير الفلامنجو", en: "Fledgling" },
        female: { ar: "أنثى الفلامنجو", en: "Female Flamingo" },
        category: { ar: ["طائر", "مائي"], en: ["Bird", "Aquatic"] },
        letter: { ar: "ف", en: "F", he: "ו" }
    },
    {
        englishName: "Fly",
        arabicName: "ذبابة",
        imageFileName: "fly.png",
        voices: {
            boy: "fly_boy_ar.mp3",
            girl: "fly_girl_ar.mp3",
            teacher: "fly_teacher_ar.mp3",
            child: "fly_child_ar.mp3"
        },
        description: {
            ar: "الذبابة حشرة صغيرة مجنحة، معروفة بقدرتها على الطيران بسرعة وإزعاج الناس.",
            en: "A fly is a small winged insect, known for its rapid flight and annoying people."
        },
        baby: { ar: "يرقة الذبابة", en: "Maggot" },
        female: { ar: "أنثى الذبابة", en: "Female Fly" },
        category: { ar: ["حشرة", "طائرة"], en: ["Insect", "Flying"] },
        letter: { ar: "ذ", en: "F", he: "ו" }
    },
    {
        englishName: "Fox",
        arabicName: "ثعلب",
        imageFileName: "fox.png",
        voices: {
            boy: "fox_boy_ar.mp3",
            girl: "fox_girl_ar.mp3",
            teacher: "fox_teacher_ar.mp3",
            child: "fox_child_ar.mp3"
        },
        description: {
            ar: "الثعلب حيوان ذكي ومحتال، فروه أحمر مائل للبني، وذيله كثيف، يعيش في الغابات والمزارع.",
            en: "A fox is a clever and cunning animal, with reddish-brown fur and a bushy tail, living in forests and farms."
        },
        baby: { ar: "جرو الثعلب", en: "Kit" },
        female: { ar: "أنثى الثعلب", en: "Vixen" },
        category: { ar: ["ثديي", "محتال"], en: ["Mammal", "Cunning"] },
        letter: { ar: "ث", en: "F", he: "ו" }
    },
    {
        englishName: "Frog",
        arabicName: "ضفدع",
        imageFileName: "frog.png",
        voices: {
            boy: "frog_boy_ar.mp3",
            girl: "frog_girl_ar.mp3",
            teacher: "frog_teacher_ar.mp3",
            child: "frog_child_ar.mp3"
        },
        description: {
            ar: "الضفدع حيوان برمائي، يعيش في الماء وعلى اليابسة، ويتميز بقدرته على القفز لمسافات طويلة.",
            en: "A frog is an amphibious animal, living in water and on land, and characterized by its ability to jump long distances."
        },
        baby: { ar: "شرغوف", en: "Tadpole" },
        female: { ar: "أنثى الضفدع", en: "Female Frog" },
        category: { ar: ["برمائي", "قفاز"], en: ["Amphibian", "Jumper"] },
        letter: { ar: "ض", en: "F", he: "ו" }
    },
    {
        englishName: "Gecko",
        arabicName: "وزغة",
        imageFileName: "gecko.png",
        voices: {
            boy: "gecko_boy_ar.mp3",
            girl: "gecko_girl_ar.mp3",
            teacher: "gecko_teacher_ar.mp3",
            child: "gecko_child_ar.mp3"
        },
        description: {
            ar: "الوزغة زاحف صغير، يمكنه تسلق الجدران بفضل أصابعه اللاصقة، وينشط ليلاً.",
            en: "A gecko is a small reptile that can climb walls thanks to its sticky toes, and is active at night."
        },
        baby: { ar: "صغير الوزغة", en: "Hatchling" },
        female: { ar: "أنثى الوزغة", en: "Female Gecko" },
        category: { ar: ["زاحف", "ليلي"], en: ["Reptile", "Nocturnal"] },
        letter: { ar: "و", en: "G", he: "ז" }
    },
    {
        englishName: "Gazelle",
        arabicName: "غزال",
        imageFileName: "gazelle.png",
        voices: {
            boy: "gazelle_boy_ar.mp3",
            girl: "gazelle_girl_ar.mp3",
            teacher: "gazelle_teacher_ar.mp3",
            child: "gazelle_child_ar.mp3"
        },
        description: {
            ar: "الغزال حيوان رشيق يتميز بسرعة الجري وقفزاته الطويلة، ويعيش في السهول والصحاري.",
            en: "The gazelle is a graceful animal known for its speed and long jumps, living in plains and deserts."
        },
        baby: { ar: "غزال صغير", en: "Fawn" },
        female: { ar: "ظبية", en: "Doe" },
        category: { ar: ["ثديي", "سريع"], en: ["Mammal", "Fast"] },
        letter: { ar: "غ", en: "G", he: "ז" }
    },
    {
        englishName: "Giraffe",
        arabicName: "زرافة",
        imageFileName: "giraffe.png",
        voices: {
            boy: "giraffe_boy_ar.mp3",
            girl: "giraffe_girl_ar.mp3",
            teacher: "giraffe_teacher_ar.mp3",
            child: "giraffe_child_ar.mp3"
        },
        description: {
            ar: "الزرافة أطول حيوان في العالم، لها رقبة طويلة جداً وفرو مرقط، وتأكل أوراق الأشجار العالية.",
            en: "The giraffe is the tallest animal in the world, with a very long neck and spotted fur, eating leaves from tall trees."
        },
        baby: { ar: "صغير الزرافة", en: "Calf" },
        female: { ar: "أنثى الزرافة", en: "Cow" },
        category: { ar: ["ثديي", "آكل أعشاب"], en: ["Mammal", "Herbivore"] },
        letter: { ar: "ز", en: "G", he: "ז" }
    },
    {
        englishName: "Goat",
        arabicName: "ماعز",
        imageFileName: "goat.png",
        voices: {
            boy: "goat_boy_ar.mp3",
            girl: "goat_girl_ar.mp3",
            teacher: "goat_teacher_ar.mp3",
            child: "goat_child_ar.mp3"
        },
        description: {
            ar: "الماعز حيوان أليف، فروه قصير، له قرون، ويعطينا الحليب واللحم، ويحب تسلق الصخور.",
            en: "A goat is a domestic animal with short fur and horns, provides milk and meat, and loves climbing rocks."
        },
        baby: { ar: "جدي", en: "Kid" },
        female: { ar: "عنزة", en: "Doe" },
        category: { ar: ["ثديي", "مزرعة"], en: ["Mammal", "Farm Animal"] },
        letter: { ar: "م", en: "G", he: "ז" }
    },
    {
        englishName: "Goose",
        arabicName: "إوزة",
        imageFileName: "goose.png",
        voices: {
            boy: "goose_boy_ar.mp3",
            girl: "goose_girl_ar.mp3",
            teacher: "goose_teacher_ar.mp3",
            child: "goose_child_ar.mp3"
        },
        description: {
            ar: "الإوزة طائر مائي له رقبة طويلة ومنقار عريض، معروف بصوته العالي، ويعيش في مجموعات.",
            en: "A goose is an aquatic bird with a long neck and a broad beak, known for its loud honk, living in groups."
        },
        baby: { ar: "صغير الإوز", en: "Gosling" },
        female: { ar: "إوزة", en: "Goose" },
        category: { ar: ["طائر", "مائي"], en: ["Bird", "Aquatic"] },
        letter: { ar: "إ", en: "G", he: "ז" }
    },
    {
        englishName: "Gorilla",
        arabicName: "غوريلا",
        imageFileName: "gorilla.png",
        voices: {
            boy: "gorilla_boy_ar.mp3",
            girl: "gorilla_girl_ar.mp3",
            teacher: "gorilla_teacher_ar.mp3",
            child: "gorilla_child_ar.mp3"
        },
        description: {
            ar: "الغوريلا أكبر القردة، قوية جداً ولها فرو أسود، تعيش في الغابات الإفريقية وتأكل النباتات.",
            en: "The gorilla is the largest ape, very strong with black fur, living in African forests and eating plants."
        },
        baby: { ar: "صغير الغوريلا", en: "Infant Gorilla" },
        female: { ar: "أنثى الغوريلا", en : "Female Gorilla"},
        category: { ar: ["ثديي", "آكل نباتات"], en: ["Mammal", "Herbivore"] },
        letter: { ar: "غ", en: "G", he: "ז" }
    },
    {
        englishName: "Grasshopper",
        arabicName: "جرادة",
        imageFileName: "grasshopper.png",
        voices: {
            boy: "grasshopper_boy_ar.mp3",
            girl: "grasshopper_girl_ar.mp3",
            teacher: "grasshopper_teacher_ar.mp3",
            child: "grasshopper_child_ar.mp3"
        },
        description: {
            ar: "الجرادة حشرة خضراء صغيرة، لها أرجل قوية تساعدها على القفز لمسافات طويلة.",
            en: "A grasshopper is a small green insect with strong legs that help it jump long distances."
        },
        baby: { ar: "حورية الجرادة", en: "Nymph" },
        female: { ar: "أنثى الجرادة", en: "Female Grasshopper" },
        category: { ar: ["حشرة", "قفاز"], en: ["Insect", "Jumper"] },
        letter: { ar: "ج", en: "G", he: "ז" }
    },
    {
        englishName: "Grizzly Bear",
        arabicName: "دب أشيب",
        imageFileName: "grizzly_bear.png",
        voices: {
            boy: "grizzly_bear_boy_ar.mp3",
            girl: "grizzly_bear_girl_ar.mp3",
            teacher: "grizzly_bear_teacher_ar.mp3",
            child: "grizzly_bear_child_ar.mp3"
        },
        description: {
            ar: "الدب الأشيب نوع كبير من الدببة، فروه بني داكن، معروف بقوته وشجاعته في البرية.",
            en: "The grizzly bear is a large type of bear with dark brown fur, known for its strength and bravery in the wild."
        },
        baby: { ar: "دغفل", en: "Cub" },
        female: { ar: "أنثى الدب الأشيب", en: "She-bear" },
        category: { ar: ["ثديي", "آكل كل شيء"], en: ["Mammal", "Omnivore"] },
        letter: { ar: "د", en: "G", he: "ז" }
    },
    {
        englishName: "Hamster",
        arabicName: "هامستر",
        imageFileName: "hamster.png",
        voices: {
            boy: "hamster_boy_ar.mp3",
            girl: "hamster_girl_ar.mp3",
            teacher: "hamster_teacher_ar.mp3",
            child: "hamster_child_ar.mp3"
        },
        description: {
            ar: "الهامستر حيوان قارض صغير وأليف، له خدود كبيرة يخزن فيها الطعام، ويحب الجري في العجلة.",
            en: "A hamster is a small, domestic rodent with large cheeks for storing food, and loves running on its wheel."
        },
        baby: { ar: "صغير الهامستر", en: "Pup" },
        female: { ar: "أنثى الهامستر", en: "Female Hamster" },
        category: { ar: ["ثديي", "قاضم"], en: ["Mammal", "Rodent"] },
        letter: { ar: "هـ", en: "H", he: "ח" }
    },
    {
        englishName: "Hare",
        arabicName: "أرنب بري",
        imageFileName: "hare.png",
        voices: {
            boy: "hare_boy_ar.mp3",
            girl: "hare_girl_ar.mp3",
            teacher: "hare_teacher_ar.mp3",
            child: "hare_child_ar.mp3"
        },
        description: {
            ar: "الأرنب البري حيوان سريع جداً، له آذان طويلة وسيقان خلفية قوية تساعده على القفز.",
            en: "A hare is a very fast animal with long ears and strong hind legs that help it jump."
        },
        baby: { ar: "صغير الأرنب", en: "Leveret" },
        female: { ar: "أنثى الأرنب", en: "Doe" },
        category: { ar: ["ثديي", "سريع"], en: ["Mammal", "Fast"] },
        letter: { ar: "أ", en: "H", he: "ח" }
    },
    {
        englishName: "Hawk",
        arabicName: "باز",
        imageFileName: "hawk.png",
        voices: {
            boy: "hawk_boy_ar.mp3",
            girl: "hawk_girl_ar.mp3",
            teacher: "hawk_teacher_ar.mp3",
            child: "hawk_child_ar.mp3"
        },
        description: {
            ar: "الباز طائر جارح متوسط الحجم، له بصر حاد ومخالب قوية لاصطياد فريسته.",
            en: "A hawk is a medium-sized bird of prey, with sharp eyesight and strong talons for catching its prey."
        },
        baby: { ar: "صغير الباز", en: "Eyas" },
        female: { ar: "أنثى الباز", en: "Female Hawk" },
        category: { ar: ["طائر", "جارح"], en: ["Bird", "Raptor"] },
        letter: { ar: "ب", en: "H", he: "ח" }
    },
    {
        englishName: "Hedgehog",
        arabicName: "قنفذ",
        imageFileName: "hedgehog.png",
        voices: {
            boy: "hedgehog_boy_ar.mp3",
            girl: "hedgehog_girl_ar.mp3",
            teacher: "hedgehog_teacher_ar.mp3",
            child: "hedgehog_child_ar.mp3"
        },
        description: {
            ar: "القنفذ حيوان صغير مغطى بالأشواك، يلتف على شكل كرة عند الشعور بالخطر لحماية نفسه.",
            en: "A hedgehog is a small animal covered in quills, curling into a ball when feeling threatened to protect itself."
        },
        baby: { ar: "صغير القنفذ", en: "Hoglet" },
        female: { ar: "أنثى القنفذ", en: "Female Hedgehog" },
        category: { ar: ["ثديي", "شائك"], en: ["Mammal", "Spiny"] },
        letter: { ar: "ق", en: "H", he: "ח" }
    },
    {
        englishName: "Hippopotamus",
        arabicName: "فرس النهر",
        imageFileName: "hippopotamus.png",
        voices: {
            boy: "hippopotamus_boy_ar.mp3",
            girl: "hippopotamus_girl_ar.mp3",
            teacher: "hippopotamus_teacher_ar.mp3",
            child: "hippopotamus_child_ar.mp3"
        },
        description: {
            ar: "فرس النهر حيوان ضخم يعيش في الأنهار والبحيرات، يقضي معظم وقته في الماء.",
            en: "The hippopotamus is a large animal living in rivers and lakes, spending most of its time in water."
        },
        baby: { ar: "صغير فرس النهر", en: "Calf" },
        female: { ar: "أنثى فرس النهر", en: "Cow" },
        category: { ar: ["ثديي", "مائي"], en: ["Mammal", "Aquatic"] },
        letter: { ar: "ف", en: "H", he: "ח" }
    },
    {
        englishName: "Horse",
        arabicName: "حصان",
        imageFileName: "horse.png",
        voices: {
            boy: "horse_boy_ar.mp3",
            girl: "horse_girl_ar.mp3",
            teacher: "horse_teacher_ar.mp3",
            child: "horse_child_ar.mp3"
        },
        description: {
            ar: "الحصان حيوان أليف وجميل، يتميز بالسرعة والقوة، ويستخدم للركوب والعمل.",
            en: "A horse is a beautiful domestic animal, characterized by speed and strength, used for riding and work."
        },
        baby: { ar: "مهر", en: "Foal" },
        female: { ar: "فرس", en: "Mare" },
        category: { ar: ["ثديي", "أليف"], en: ["Mammal", "Domestic"] },
        letter: { ar: "ح", en: "H", he: "ח" }
    },
    {
        englishName: "Hummingbird",
        arabicName: "طائر الطنان",
        imageFileName: "hummingbird.png",
        voices: {
            boy: "hummingbird_boy_ar.mp3",
            girl: "hummingbird_girl_ar.mp3",
            teacher: "hummingbird_teacher_ar.mp3",
            child: "hummingbird_child_ar.mp3"
        },
        description: {
            ar: "طائر الطنان هو أصغر طائر في العالم، يطير بسرعة كبيرة ويصدر صوت طنين بأجنحته.",
            en: "The hummingbird is the smallest bird in the world, flying very fast and producing a humming sound with its wings."
        },
        baby: { ar: "صغير الطنان", en: "Chick" },
        female: { ar: "أنثى الطنان", en: "Female Hummingbird" },
        category: { ar: ["طائر", "صغير"], en: ["Bird", "Tiny"] },
        letter: { ar: "ط", en: "H", he: "ח" }
    },
    {
        englishName: "Hyena",
        arabicName: "ضبع",
        imageFileName: "hyena.png",
        voices: {
            boy: "hyena_boy_ar.mp3",
            girl: "hyena_girl_ar.mp3",
            teacher: "hyena_teacher_ar.mp3",
            child: "hyena_child_ar.mp3"
        },
        description: {
            ar: "الضبع حيوان مفترس ليلي، معروف بصوته الذي يشبه الضحك، ويتغذى على بقايا الحيوانات الأخرى.",
            en: "A hyena is a nocturnal predator, known for its laugh-like call, feeding on other animals' remains."
        },
        baby: { ar: "جرو الضبع", en: "Cub" },
        female: { ar: "أنثى الضبع", en: "Female Hyena" },
        category: { ar: ["ثديي", "آكل لحوم"], en: ["Mammal", "Carnivore"] },
        letter: { ar: "ض", en: "H", he: "ח" }
    },
    {
        englishName: "Ibis",
        arabicName: "أبو منجل",
        imageFileName: "ibis.png",
        voices: {
            boy: "ibis_boy_ar.mp3",
            girl: "ibis_girl_ar.mp3",
            teacher: "ibis_teacher_ar.mp3",
            child: "ibis_child_ar.mp3"
        },
        description: {
            ar: "أبو منجل طائر مائي طويل الساقين ومنقاره منحني للأسفل، يبحث عن طعامه في الوحل.",
            en: "The ibis is an aquatic bird with long legs and a downward-curved beak, searching for food in mud."
        },
        baby: { ar: "صغير أبو منجل", en: "Chick" },
        female: { ar: "أنثى أبو منجل", en: "Female Ibis" },
        category: { ar: ["طائر", "مائي"], en: ["Bird", "Aquatic"] },
        letter: { ar: "أ", en: "I", he: "י" }
    },
    {
        englishName: "Ibex",
        arabicName: "وعل",
        imageFileName: "ibex.png",
        voices: {
            boy: "ibex_boy_ar.mp3",
            girl: "ibex_girl_ar.mp3",
            teacher: "ibex_teacher_ar.mp3",
            child: "ibex_child_ar.mp3"
        },
        description: {
            ar: "الوعل حيوان جبلي، له قرون طويلة ومنحنية، وماهر في تسلق الصخور الوعرة.",
            en: "An ibex is a mountain animal with long, curved horns, skilled at climbing rugged rocks."
        },
        baby: { ar: "صغير الوعل", en: "Kid" },
        female: { ar: "أنثى الوعل", en: "Doe" },
        category: { ar: ["ثديي", "جبلي"], en: ["Mammal", "Mountain"] },
        letter: { ar: "و", en: "I", he: "י" }
    },
    {
        englishName: "Impala",
        arabicName: "إمبالا",
        imageFileName: "impala.png",
        voices: {
            boy: "impala_boy_ar.mp3",
            girl: "impala_girl_ar.mp3",
            teacher: "impala_teacher_ar.mp3",
            child: "impala_child_ar.mp3"
        },
        description: {
            ar: "الإمبالا ظبي رشيق من إفريقيا، معروف بقدرته على القفز عالياً لمسافات بعيدة للهروب من الأعداء.",
            en: "The impala is a graceful antelope from Africa, known for its ability to jump high and far to escape enemies."
        },
        baby: { ar: "صغير الإمبالا", en: "Calf" },
        female: { ar: "أنثى الإمبالا", en: "Ewe" },
        category: { ar: ["ثديي", "ظبي"], en: ["Mammal", "Antelope"] },
        letter: { ar: "إ", en: "I", he: "י" }
    },
    {
        englishName: "Jackal",
        arabicName: "ابن آوى",
        imageFileName: "jackal.png",
        voices: {
            boy: "jackal_boy_ar.mp3",
            girl: "jackal_girl_ar.mp3",
            teacher: "jackal_teacher_ar.mp3",
            child: "jackal_child_ar.mp3"
        },
        description: {
            ar: "ابن آوى حيوان يشبه الكلب، يعيش في مجموعات ويصدر أصواتًا عالية في الليل.",
            en: "A jackal is a dog-like animal, living in groups and making loud calls at night."
        },
        baby: { ar: "جرو ابن آوى", en: "Pup" },
        female: { ar: "أنثى ابن آوى", en: "Female Jackal" },
        category: { ar: ["ثديي", "آكل لحوم"], en: ["Mammal", "Carnivore"] },
        letter: { ar: "ا", en: "J", he: "ג" }
    },
    {
        englishName: "Jaguar",
        arabicName: "جاغوار",
        imageFileName: "jaguar.png",
        voices: {
            boy: "jaguar_boy_ar.mp3",
            girl: "jaguar_girl_ar.mp3",
            teacher: "jaguar_teacher_ar.mp3",
            child: "jaguar_child_ar.mp3"
        },
        description: {
            ar: "الجاغوار قط كبير ومفترس من أمريكا، فروه أصفر وعليه بقع سوداء تشبه الورود.",
            en: "A jaguar is a large predatory cat from America, with yellow fur and black rosette-like spots."
        },
        baby: { ar: "جرو جاغوار", en: "Cub" },
        female: { ar: "أنثى الجاغوار", en: "Female Jaguar" },
        category: { ar: ["ثديي", "مفترس"], en: ["Mammal", "Predator"] },
        letter: { ar: "ج", en: "J", he: "ג" }
    },
    {
        englishName: "Jellyfish",
        arabicName: "قنديل البحر",
        imageFileName: "jellyfish.png",
        voices: {
            boy: "jellyfish_boy_ar.mp3",
            girl: "jellyfish_girl_ar.mp3",
            teacher: "jellyfish_teacher_ar.mp3",
            child: "jellyfish_child_ar.mp3"
        },
        description: {
            ar: "قنديل البحر كائن بحري شفاف وهلامي، يطفو في الماء ويمتلك لوامس قد تلسع.",
            en: "A jellyfish is a transparent, gelatinous marine creature, floating in water and possessing stinging tentacles."
        },
        baby: { ar: "صغير قنديل البحر", en: "Ephyra" },
        female: { ar: "أنثى قنديل البحر", en: "Female Jellyfish" },
        category: { ar: ["لافقاري", "بحري"], en: ["Invertebrate", "Marine"] },
        letter: { ar: "ق", en: "J", he: "ג" }
    },
    {
        englishName: "Jay",
        arabicName: "قيق",
        imageFileName: "jay.png",
        voices: {
            boy: "jay_boy_ar.mp3",
            girl: "jay_girl_ar.mp3",
            teacher: "jay_teacher_ar.mp3",
            child: "jay_child_ar.mp3"
        },
        description: {
            ar: "القيق طائر جميل الألوان، غالباً ما يكون أزرق أو رمادي، وهو ذكي ويحب جمع المكسرات.",
            en: "A jay is a beautifully colored bird, often blue or gray, intelligent and fond of collecting nuts."
        },
        baby: { ar: "فرخ القيق", en: "Chick" },
        female: { ar: "أنثى القيق", en: "Female Jay" },
        category: { ar: ["طائر", "ذكي"], en: ["Bird", "Intelligent"] },
        letter: { ar: "ق", en: "J", he: "ג" }
    },
    {
        englishName: "Kangaroo",
        arabicName: "كنغر",
        imageFileName: "kangaroo.png",
        voices: {
            boy: "kangaroo_boy_ar.mp3",
            girl: "kangaroo_girl_ar.mp3",
            teacher: "kangaroo_teacher_ar.mp3",
            child: "kangaroo_child_ar.mp3"
        },
        description: {
            ar: "الكنغر حيوان يعيش في أستراليا، يتميز بأرجله الخلفية القوية التي تساعده على القفز، وبجراب يحمل فيه صغاره.",
            en: "A kangaroo is an animal living in Australia, characterized by its strong hind legs for jumping, and a pouch for carrying its young."
        },
        baby: { ar: "صغير الكنغر", en: "Joey" },
        female: { ar: "أنثى الكنغر", en: "Doe" },
        category: { ar: ["ثديي", "جرابي"], en: ["Mammal", "Marsupial"] },
        letter: { ar: "ك", en: "K", he: "כ" }
    },
    {
        englishName: "Kingfisher",
        arabicName: "رفراف",
        imageFileName: "kingfisher.png",
        voices: {
            boy: "kingfisher_boy_ar.mp3",
            girl: "kingfisher_girl_ar.mp3",
            teacher: "kingfisher_teacher_ar.mp3",
            child: "kingfisher_child_ar.mp3"
        },
        description: {
            ar: "الرفراف طائر صغير وجميل، يتميز بمنقاره الطويل الذي يستخدمه لاصطياد السمك من الأنهار.",
            en: "A kingfisher is a small, beautiful bird, characterized by its long beak used for catching fish from rivers."
        },
        baby: { ar: "صغير الرفراف", en: "Chick" },
        female: { ar: "أنثى الرفراف", en: "Female Kingfisher" },
        category: { ar: ["طائر", "صياد"], en: ["Bird", "Hunter"] },
        letter: { ar: "ر", en: "K", he: "כ" }
    },
    {
        englishName: "Koala",
        arabicName: "كوالا",
        imageFileName: "koala.png",
        voices: {
            boy: "koala_boy_ar.mp3",
            girl: "koala_girl_ar.mp3",
            teacher: "koala_teacher_ar.mp3",
            child: "koala_child_ar.mp3"
        },
        description: {
            ar: "الكوالا حيوان لطيف يعيش في أستراليا، يشبه الدب الصغير، ويقضي معظم وقته نائماً على أشجار الكينا.",
            en: "A koala is a cute animal living in Australia, resembling a small bear, spending most of its time sleeping in eucalyptus trees."
        },
        baby: { ar: "صغير الكوالا", en: "Joey" },
        female: { ar: "أنثى الكوالا", en: "Female Koala" },
        category: { ar: ["ثديي", "جرابي"], en: ["Mammal", "Marsupial"] },
        letter: { ar: "ك", en: "K", he: "כ" }
    },
    {
        englishName: "Kookaburra",
        arabicName: "كوكابورا",
        imageFileName: "kookaburra.png",
        voices: {
            boy: "kookaburra_boy_ar.mp3",
            girl: "kookaburra_girl_ar.mp3",
            teacher: "kookaburra_teacher_ar.mp3",
            child: "kookaburra_child_ar.mp3"
        },
        description: {
            ar: "الكوكابورا طائر أسترالي معروف بصوته الذي يشبه الضحك البشري، ويعيش في الغابات.",
            en: "A kookaburra is an Australian bird known for its laugh-like call, living in forests."
        },
        baby: { ar: "صغير الكوكابورا", en: "Chick" },
        female: { ar: "أنثى الكوكابورا", en: "Female Kookaburra" },
        category: { ar: ["طائر", "مضحك"], en: ["Bird", "Laughing"] },
        letter: { ar: "ك", en: "K", he: "כ" }
    },
    {
        englishName: "Ladybug",
        arabicName: "دعسوقة",
        imageFileName: "ladybug.png",
        voices: {
            boy: "ladybug_boy_ar.mp3",
            girl: "ladybug_girl_ar.mp3",
            teacher: "ladybug_teacher_ar.mp3",
            child: "ladybug_child_ar.mp3"
        },
        description: {
            ar: "الدعسوقة حشرة صغيرة وجميلة، تتميز بلونها الأحمر أو البرتقالي مع نقاط سوداء.",
            en: "A ladybug is a small and beautiful insect, characterized by its red or orange color with black spots."
        },
        baby: { ar: "يرقة الدعسوقة", en: "Larva" },
        female: { ar: "أنثى الدعسوقة", en: "Female Ladybug" },
        category: { ar: ["حشرة", "نافعة"], en: ["Insect", "Beneficial"] },
        letter: { ar: "د", en: "L", he: "ל" }
    },
    {
        englishName: "Lamb",
        arabicName: "حمل",
        imageFileName: "lamb.png",
        voices: {
            boy: "lamb_boy_ar.mp3",
            girl: "lamb_girl_ar.mp3",
            teacher: "lamb_teacher_ar.mp3",
            child: "lamb_child_ar.mp3"
        },
        description: {
            ar: "الحمل هو صغير الخروف، فروه ناعم، ويحب الرعي واللعب في الحقول الخضراء.",
            en: "A lamb is a young sheep, with soft wool, and loves grazing and playing in green fields."
        },
        baby: { ar: "حمل", en: "Lamb" },
        female: { ar: "أنثى الحمل", en: "Ewe Lamb" },
        category: { ar: ["ثديي", "أليف"], en: ["Mammal", "Domestic"] },
        letter: { ar: "ح", en: "L", he: "ל" }
    },
    {
        englishName: "Leopard",
        arabicName: "فهد",
        imageFileName: "leopard.png",
        voices: {
            boy: "leopard_boy_ar.mp3",
            girl: "leopard_girl_ar.mp3",
            teacher: "leopard_teacher_ar.mp3",
            child: "leopard_child_ar.mp3"
        },
        description: {
            ar: "الفهد حيوان مفترس قوي، فروه مرقط بوردات سوداء، وماهر في التسلق والصيد ليلاً.",
            en: "A leopard is a powerful predator, with black rosette-spotted fur, skilled at climbing and hunting at night."
        },
        baby: { ar: "جرو الفهد", en: "Cub" },
        female: { ar: "أنثى الفهد", en: "Leopardess" },
        category: { ar: ["ثديي", "مفترس"], en: ["Mammal", "Predator"] },
        letter: { ar: "ف", en: "L", he: "ל" }
    },
    {
        englishName: "Lion",
        arabicName: "أسد",
        imageFileName: "lion.png",
        voices: {
            boy: "lion_boy_ar.mp3",
            girl: "lion_girl_ar.mp3",
            teacher: "lion_teacher_ar.mp3",
            child: "lion_child_ar.mp3"
        },
        description: {
            ar: "الأسد ملك الغابة، له لبدة كثيفة (للذكر)، يزأر بصوت عالٍ ويعيش في مجموعات.",
            en: "The lion is the king of the jungle, with a thick mane (for males), roars loudly and lives in groups."
        },
        baby: { ar: "شبل", en: "Cub" },
        female: { ar: "لبؤة", en: "Lioness" },
        category: { ar: ["ثديي", "مفترس"], en: ["Mammal", "Predator"] },
        letter: { ar: "أ", en: "L", he: "ל" }
    },
    {
        englishName: "Lizard",
        arabicName: "سحلية",
        imageFileName: "lizard.png",
        voices: {
            boy: "lizard_boy_ar.mp3",
            girl: "lizard_girl_ar.mp3",
            teacher: "lizard_teacher_ar.mp3",
            child: "lizard_child_ar.mp3"
        },
        description: {
            ar: "السحلية زاحف صغير، لها جسم رشيق وذيل طويل، وتعيش في أماكن دافئة وصخرية.",
            en: "A lizard is a small reptile with a slender body and a long tail, living in warm and rocky places."
        },
        baby: { ar: "صغير السحلية", en: "Hatchling" },
        female: { ar: "أنثى السحلية", en: "Female Lizard" },
        category: { ar: ["زاحف", "بارد الدم"], en: ["Reptile", "Cold-blooded"] },
        letter: { ar: "س", en: "L", he: "ל" }
    },
    {
        englishName: "Llama",
        arabicName: "لاما",
        imageFileName: "llama.png",
        voices: {
            boy: "llama_boy_ar.mp3",
            girl: "llama_girl_ar.mp3",
            teacher: "llama_teacher_ar.mp3",
            child: "llama_child_ar.mp3"
        },
        description: {
            ar: "اللاما حيوان من أمريكا الجنوبية، يستخدم لحمل الأثقال، وله رقبة طويلة وفرو سميك.",
            en: "A llama is an animal from South America, used for carrying loads, with a long neck and thick fur."
        },
        baby: { ar: "صغير اللاما", en: "Cria" },
        female: { ar: "أنثى اللاما", en: "Female Llama" },
        category: { ar: ["ثديي", "أليف"], en: ["Mammal", "Domestic"] },
        letter: { ar: "ل", en: "L", he: "ל" }
    },
    {
        englishName: "Lobster",
        arabicName: "جراد البحر",
        imageFileName: "lobster.png",
        voices: {
            boy: "lobster_boy_ar.mp3",
            girl: "lobster_girl_ar.mp3",
            teacher: "lobster_teacher_ar.mp3",
            child: "lobster_child_ar.mp3"
        },
        description: {
            ar: "جراد البحر حيوان بحري له درع صلب وزوجان كبيران من المخالب، يعيش في قاع المحيط.",
            en: "A lobster is a marine animal with a hard shell and two large claws, living on the ocean floor."
        },
        baby: { ar: "صغير جراد البحر", en: "Larva" },
        female: { ar: "أنثى جراد البحر", en: "Female Lobster" },
        category: { ar: ["لافقاري", "بحري"], en: ["Invertebrate", "Marine"] },
        letter: { ar: "ج", en: "L", he: "ל" }
    },
    {
        englishName: "Macaw",
        arabicName: "مكاو",
        imageFileName: "macaw.png",
        voices: {
            boy: "macaw_boy_ar.mp3",
            girl: "macaw_girl_ar.mp3",
            teacher: "macaw_teacher_ar.mp3",
            child: "macaw_child_ar.mp3"
        },
        description: {
            ar: "المكاو ببغاء كبير ملون جداً، يعيش في الغابات المطيرة، ومعروف بصوته العالي وقدرته على تقليد الكلام.",
            en: "A macaw is a large, very colorful parrot, living in rainforests, known for its loud calls and ability to mimic speech."
        },
        baby: { ar: "صغير المكاو", en: "Chick" },
        female: { ar: "أنثى المكاو", en: "Female Macaw" },
        category: { ar: ["طائر", "ببغاء"], en: ["Bird", "Parrot"] },
        letter: { ar: "م", en: "M", he: "מ" }
    },
    {
        englishName: "Magpie",
        arabicName: "عقعق",
        imageFileName: "magpie.png",
        voices: {
            boy: "magpie_boy_ar.mp3",
            girl: "magpie_girl_ar.mp3",
            teacher: "magpie_teacher_ar.mp3",
            child: "magpie_child_ar.mp3"
        },
        description: {
            ar: "العقعق طائر أسود وأبيض ذكي، معروف بجمعه للأشياء اللامعة وصوته الصاخب.",
            en: "A magpie is an intelligent black and white bird, known for collecting shiny objects and its noisy calls."
        },
        baby: { ar: "فرخ العقعق", en: "Fledgling" },
        female: { ar: "أنثى العقعق", en: "Female Magpie" },
        category: { ar: ["طائر", "ذكي"], en: ["Bird", "Intelligent"] },
        letter: { ar: "ع", en: "M", he: "מ" }
    },
    {
        englishName: "Mallard",
        arabicName: "بط بري",
        imageFileName: "mallard.png",
        voices: {
            boy: "mallard_boy_ar.mp3",
            girl: "mallard_girl_ar.mp3",
            teacher: "mallard_teacher_ar.mp3",
            child: "mallard_child_ar.mp3"
        },
        description: {
            ar: "البط البري هو نوع شائع من البط، الذكر له رأس أخضر لامع، يعيش في البحيرات والبرك.",
            en: "The mallard is a common type of duck, the male has a glossy green head, living in lakes and ponds."
        },
        baby: { ar: "بطوط", en: "Duckling" },
        female: { ar: "بطة", en: "Duck" },
        category: { ar: ["طائر", "مائي"], en: ["Bird", "Aquatic"] },
        letter: { ar: "ب", en: "M", he: "מ" }
    },
    {
        englishName: "Meerkat",
        arabicName: "ميركات",
        imageFileName: "meerkat.png",
        voices: {
            boy: "meerkat_boy_ar.mp3",
            girl: "meerkat_girl_ar.mp3",
            teacher: "meerkat_teacher_ar.mp3",
            child: "meerkat_child_ar.mp3"
        },
        description: {
            ar: "الميركات حيوان صغير اجتماعي، يعيش في الصحاري، يقف منتصبًا لحراسة مجموعته من الأخطار.",
            en: "A meerkat is a small, social animal, living in deserts, standing upright to guard its group from dangers."
        },
        baby: { ar: "صغير الميركات", en: "Pup" },
        female: { ar: "أنثى الميركات", en: "Female Meerkat" },
        category: { ar: ["ثديي", "اجتماعي"], en: ["Mammal", "Social"] },
        letter: { ar: "م", en: "M", he: "מ" }
    },
    {
        englishName: "Monkey",
        arabicName: "قرد",
        imageFileName: "monkey.png",
        voices: {
            boy: "monkey_boy_ar.mp3",
            girl: "monkey_girl_ar.mp3",
            teacher: "monkey_teacher_ar.mp3",
            child: "monkey_child_ar.mp3"
        },
        description: {
            ar: "القرد حيوان ذكي، يعيش في الأشجار، يحب أكل الموز، ومعروف بمهارته في القفز والتسلق.",
            en: "A monkey is an intelligent animal, living in trees, loves eating bananas, and is known for its skill in jumping and climbing."
        },
        baby: { ar: "صغير القرد", en: "Infant Monkey" },
        female: { ar: "أنثى القرد", en: "Female Monkey" },
        category: { ar: ["ثديي", "متسلق"], en: ["Mammal", "Climber"] },
        letter: { ar: "ق", en: "M", he: "מ" }
    },
    {
        englishName: "Moose",
        arabicName: "أيل أمريكي",
        imageFileName: "moose.png",
        voices: {
            boy: "moose_boy_ar.mp3",
            girl: "moose_girl_ar.mp3",
            teacher: "moose_teacher_ar.mp3",
            child: "moose_child_ar.mp3"
        },
        description: {
            ar: "الأيل الأمريكي أكبر أنواع الأيائل، يتميز بقرونه الواسعة المسطحة، ويعيش في الغابات الشمالية.",
            en: "The moose is the largest type of deer, characterized by its broad, flat antlers, living in northern forests."
        },
        baby: { ar: "عجل", en: "Calf" },
        female: { ar: "أنثى الأيل الأمريكي", en: "Cow" },
        category: { ar: ["ثديي", "آكل أعشاب"], en: ["Mammal", "Herbivore"] },
        letter: { ar: "أ", en: "M", he: "מ" }
    },
    {
        englishName: "Mosquito",
        arabicName: "بعوضة",
        imageFileName: "mosquito.png",
        voices: {
            boy: "mosquito_boy_ar.mp3",
            girl: "mosquito_girl_ar.mp3",
            teacher: "mosquito_teacher_ar.mp3",
            child: "mosquito_child_ar.mp3"
        },
        description: {
            ar: "البعوضة حشرة صغيرة مجنحة، معروفة بلدغتها التي تسبب الحكة، وتعيش قرب الماء.",
            en: "A mosquito is a small winged insect, known for its itchy bite, living near water."
        },
        baby: { ar: "يرقة البعوض", en: "Larva" },
        female: { ar: "أنثى البعوض", en: "Female Mosquito" },
        category: { ar: ["حشرة", "طائرة"], en: ["Insect", "Flying"] },
        letter: { ar: "ب", en: "M", he: "מ" }
    },
    {
        englishName: "Mouse",
        arabicName: "فأر",
        imageFileName: "mouse.png",
        voices: {
            boy: "mouse_boy_ar.mp3",
            girl: "mouse_girl_ar.mp3",
            teacher: "mouse_teacher_ar.mp3",
            child: "mouse_child_ar.mp3"
        },
        description: {
            ar: "الفأر حيوان قارض صغير، له ذيل طويل وأذنان كبيرتان، ويحب الجبن.",
            en: "A mouse is a small rodent with a long tail and large ears, and loves cheese."
        },
        baby: { ar: "صغير الفأر", en: "Pup" },
        female: { ar: "أنثى الفأر", en: "Doe" },
        category: { ar: ["ثديي", "قاضم"], en: ["Mammal", "Rodent"] },
        letter: { ar: "ف", en: "M", he: "מ" }
    },
    {
        englishName: "Mule",
        arabicName: "بغل",
        imageFileName: "mule.png",
        voices: {
            boy: "mule_boy_ar.mp3",
            girl: "mule_girl_ar.mp3",
            teacher: "mule_teacher_ar.mp3",
            child: "mule_child_ar.mp3"
        },
        description: {
            ar: "البغل حيوان هجين بين الحصان والحمار، قوي جداً ويستخدم في حمل الأثقال والعمل الزراعي.",
            en: "A mule is a hybrid animal between a horse and a donkey, very strong and used for carrying loads and agricultural work."
        },
        baby: { ar: "صغير البغل", en: "Foal" },
        female: { ar: "أنثى البغل", en: "Mare" },
        category: { ar: ["ثديي", "عمل"], en: ["Mammal", "Working Animal"] },
        letter: { ar: "ب", en: "M", he: "מ" }
    },
    {
        englishName: "Nightingale",
        arabicName: "عندليب",
        imageFileName: "nightingale.png",
        voices: {
            boy: "nightingale_boy_ar.mp3",
            girl: "nightingale_girl_ar.mp3",
            teacher: "nightingale_teacher_ar.mp3",
            child: "nightingale_child_ar.mp3"
        },
        description: {
            ar: "العندليب طائر صغير معروف بصوته الجميل جداً الذي يغرد به في الليل.",
            en: "A nightingale is a small bird known for its very beautiful song that it sings at night."
        },
        baby: { ar: "فرخ العندليب", en: "Chick" },
        female: { ar: "أنثى العندليب", en: "Female Nightingale" },
        category: { ar: ["طائر", "مغرد"], en: ["Bird", "Songbird"] },
        letter: { ar: "ع", en: "N", he: "נ" }
    },
    {
        englishName: "Newt",
        arabicName: "سمندل",
        imageFileName: "newt.png",
        voices: {
            boy: "newt_boy_ar.mp3",
            girl: "newt_girl_ar.mp3",
            teacher: "newt_teacher_ar.mp3",
            child: "newt_child_ar.mp3"
        },
        description: {
            ar: "السمندل حيوان برمائي صغير، يشبه السحلية، ويعيش في الماء وعلى اليابسة.",
            en: "A newt is a small amphibious animal, resembling a lizard, living in water and on land."
        },
        baby: { ar: "صغير السمندل", en: "Eft" },
        female: { ar: "أنثى السمندل", en: "Female Newt" },
        category: { ar: ["برمائي", "ذيل"], en: ["Amphibian", "Tailed"] },
        letter: { ar: "س", en: "N", he: "נ" }
    },
    {
        englishName: "Narwhal",
        arabicName: "حوت وحيد القرن",
        imageFileName: "narwhal.png",
        voices: {
            boy: "narwhal_boy_ar.mp3",
            girl: "narwhal_girl_ar.mp3",
            teacher: "narwhal_teacher_ar.mp3",
            child: "narwhal_child_ar.mp3"
        },
        description: {
            ar: "حوت وحيد القرن حيوان بحري نادر، يتميز بناب طويل يشبه القرن يبرز من رأسه.",
            en: "The narwhal is a rare marine animal, characterized by a long tusk resembling a horn protruding from its head."
        },
        baby: { ar: "صغير حوت وحيد القرن", en: "Calf" },
        female: { ar: "أنثى حوت وحيد القرن", en: "Female Narwhal" },
        category: { ar: ["ثديي", "بحري"], en: ["Mammal", "Marine"] },
        letter: { ar: "ح", en: "N", he: "נ" }
    },
    {
        englishName: "Octopus",
        arabicName: "أخطبوط",
        imageFileName: "octopus.png",
        voices: {
            boy: "octopus_boy_ar.mp3",
            girl: "octopus_girl_ar.mp3",
            teacher: "octopus_teacher_ar.mp3",
            child: "octopus_child_ar.mp3"
        },
        description: {
            ar: "الأخطبوط كائن بحري ذكي، له ثمانية أذرع وماهر في التمويه وتغيير لونه.",
            en: "An octopus is an intelligent marine creature with eight arms, skilled at camouflage and changing its color."
        },
        baby: { ar: "صغير الأخطبوط", en: "Hatchling" },
        female: { ar: "أنثى الأخطبوط", en: "Female Octopus" },
        category: { ar: ["لافقاري", "بحري"], en: ["Invertebrate", "Marine"] },
        letter: { ar: "أ", en: "O", he: "ע" }
    },
    {
        englishName: "Okapi",
        arabicName: "أوكابي",
        imageFileName: "okapi.png",
        voices: {
            boy: "okapi_boy_ar.mp3",
            girl: "okapi_girl_ar.mp3",
            teacher: "okapi_teacher_ar.mp3",
            child: "okapi_child_ar.mp3"
        },
        description: {
            ar: "الأوكابي حيوان نادر يعيش في غابات الكونغو، يشبه الزرافة ولكن بحجم أصغر وله خطوط كالحمار الوحشي على ساقيه.",
            en: "An okapi is a rare animal living in the Congolese forests, resembling a smaller giraffe with zebra-like stripes on its legs."
        },
        baby: { ar: "صغير الأوكابي", en: "Calf" },
        female: { ar: "أنثى الأوكابي", en: "Female Okapi" },
        category: { ar: ["ثديي", "غابة"], en: ["Mammal", "Forest"] },
        letter: { ar: "أ", en: "O", he: "ע" }
    },
    {
        englishName: "Opossum",
        arabicName: "أوبوسوم",
        imageFileName: "opossum.png",
        voices: {
            boy: "opossum_boy_ar.mp3",
            girl: "opossum_girl_ar.mp3",
            teacher: "opossum_teacher_ar.mp3",
            child: "opossum_child_ar.mp3"
        },
        description: {
            ar: "الأوبوسوم حيوان جرابي ليلي، معروف بقدرته على التظاهر بالموت عند الشعور بالخطر.",
            en: "An opossum is a nocturnal marsupial, known for its ability to feign death when feeling threatened."
        },
        baby: { ar: "صغير الأوبوسوم", en: "Joey" },
        female: { ar: "أنثى الأوبوسوم", en: "Female Opossum" },
        category: { ar: ["ثديي", "جرابي"], en: ["Mammal", "Marsupial"] },
        letter: { ar: "أ", en: "O", he: "ע" }
    },
    {
        englishName: "Orangutan",
        arabicName: "إنسان الغاب",
        imageFileName: "orangutan.png",
        voices: {
            boy: "orangutan_boy_ar.mp3",
            girl: "orangutan_girl_ar.mp3",
            teacher: "orangutan_teacher_ar.mp3",
            child: "orangutan_child_ar.mp3"
        },
        description: {
            ar: "إنسان الغاب قرد كبير فروه بني محمر، يعيش على الأشجار في غابات آسيا المطيرة.",
            en: "An orangutan is a large ape with reddish-brown fur, living in the rainforests of Asia."
        },
        baby: { ar: "صغير إنسان الغاب", en: "Infant Orangutan" },
        female: { ar: "أنثى إنسان الغاب", en: "Female Orangutan" },
        category: { ar: ["ثديي", "قرد"], en: ["Mammal", "Ape"] },
        letter: { ar: "إ", en: "O", he: "ע" }
    },
    {
        englishName: "Ostrich",
        arabicName: "نعامة",
        imageFileName: "ostrich.png",
        voices: {
            boy: "ostrich_boy_ar.mp3",
            girl: "ostrich_girl_ar.mp3",
            teacher: "ostrich_teacher_ar.mp3",
            child: "ostrich_child_ar.mp3"
        },
        description: {
            ar: "النعامة أكبر طائر في العالم، لا يطير، لكنه يجري بسرعة كبيرة وله رقبة وساقان طويلتان.",
            en: "The ostrich is the largest bird in the world, flightless but runs very fast with long neck and legs."
        },
        baby: { ar: "صغير النعامة", en: "Chick" },
        female: { ar: "أنثى النعامة", en: "Hen" },
        category: { ar: ["طائر", "لا يطير"], en: ["Bird", "Flightless"] },
        letter: { ar: "ن", en: "O", he: "ע" }
    },
    {
        englishName: "Otter",
        arabicName: "قضاعة",
        imageFileName: "otter.png",
        voices: {
            boy: "otter_boy_ar.mp3",
            girl: "otter_girl_ar.mp3",
            teacher: "otter_teacher_ar.mp3",
            child: "otter_child_ar.mp3"
        },
        description: {
            ar: "القضاعة حيوان مائي فروه ناعم، يحب اللعب والانزلاق في الماء، ويتغذى على الأسماك.",
            en: "An otter is an aquatic animal with soft fur, loves playing and sliding in water, and feeds on fish."
        },
        baby: { ar: "صغير القضاعة", en: "Pup" },
        female: { ar: "أنثى القضاعة", en: "Female Otter" },
        category: { ar: ["ثديي", "مائي"], en: ["Mammal", "Aquatic"] },
        letter: { ar: "ق", en: "O", he: "ע" }
    },
    {
        englishName: "Owl",
        arabicName: "بومة",
        imageFileName: "owl.png",
        voices: {
            boy: "owl_boy_ar.mp3",
            girl: "owl_girl_ar.mp3",
            teacher: "owl_teacher_ar.mp3",
            child: "owl_child_ar.mp3"
        },
        description: {
            ar: "البومة طائر ليلي، له عيون كبيرة ووجه دائري، يطير بهدوء ليلاً لاصطياد الفئران.",
            en: "An owl is a nocturnal bird with large eyes and a round face, flying silently at night to catch mice."
        },
        baby: { ar: "فرخ البومة", en: "Owlet" },
        female: { ar: "أنثى البومة", en: "Female Owl" },
        category: { ar: ["طائر", "ليلي"], en: ["Bird", "Nocturnal"] },
        letter: { ar: "ب", en: "O", he: "ע" }
    },
    {
        englishName: "Ox",
        arabicName: "ثور",
        imageFileName: "ox.png",
        voices: {
            boy: "ox_boy_ar.mp3",
            girl: "ox_girl_ar.mp3",
            teacher: "ox_teacher_ar.mp3",
            child: "ox_child_ar.mp3"
        },
        description: {
            ar: "الثور حيوان مزرعة قوي، يستخدم في الحراثة وسحب العربات، وهو ذكر البقرة.",
            en: "An ox is a strong farm animal, used for plowing and pulling carts, and is a male cow."
        },
        baby: { ar: "عجل", en: "Calf" },
        female: { ar: "بقرة", en: "Cow" },
        category: { ar: ["ثديي", "مزرعة"], en: ["Mammal", "Farm Animal"] },
        letter: { ar: "ث", en: "O", he: "ע" }
    },
    {
        englishName: "Panda",
        arabicName: "باندا",
        imageFileName: "panda.png",
        voices: {
            boy: "panda_boy_ar.mp3",
            girl: "panda_girl_ar.mp3",
            teacher: "panda_teacher_ar.mp3",
            child: "panda_child_ar.mp3"
        },
        description: {
            ar: "الباندا دب لطيف فروه أبيض وأسود، يعيش في الصين ويأكل نبات الخيزران.",
            en: "A panda is a cute black and white bear, living in China and eating bamboo plants."
        },
        baby: { ar: "دغفل الباندا", en: "Cub" },
        female: { ar: "أنثى الباندا", en: "Female Panda" },
        category: { ar: ["ثديي", "آكل أعشاب"], en: ["Mammal", "Herbivore"] },
        letter: { ar: "ب", en: "P", he: "פ" }
    },
    {
        englishName: "Panther",
        arabicName: "فهد أسود",
        imageFileName: "panther.png",
        voices: {
            boy: "panther_boy_ar.mp3",
            girl: "panther_girl_ar.mp3",
            teacher: "panther_teacher_ar.mp3",
            child: "panther_child_ar.mp3"
        },
        description: {
            ar: "الفهد الأسود هو نوع من الفهود أو الجاغوارات ذات فرو أسود بالكامل، وهو مفترس ليلي.",
            en: "A panther is a type of leopard or jaguar with entirely black fur, and is a nocturnal predator."
        },
        baby: { ar: "جرو الفهد الأسود", en: "Cub" },
        female: { ar: "أنثى الفهد الأسود", en: "Female Panther" },
        category: { ar: ["ثديي", "مفترس"], en: ["Mammal", "Predator"] },
        letter: { ar: "ف", en: "P", he: "פ" }
    },
    {
        englishName: "Parrot",
        arabicName: "ببغاء",
        imageFileName: "parrot.png",
        voices: {
            boy: "parrot_boy_ar.mp3",
            girl: "parrot_girl_ar.mp3",
            teacher: "parrot_teacher_ar.mp3",
            child: "parrot_child_ar.mp3"
        },
        description: {
            ar: "الببغاء طائر جميل الألوان، يمكنه تقليد صوت الإنسان، ويعيش في الغابات.",
            en: "A parrot is a beautifully colored bird that can mimic human speech, living in forests."
        },
        baby: { ar: "صغير الببغاء", en: "Chick" },
        female: { ar: "أنثى الببغاء", en: "Female Parrot" },
        category: { ar: ["طائر", "متكلم"], en: ["Bird", "Talking"] },
        letter: { ar: "ب", en: "P", he: "פ" }
    },
    {
        englishName: "Peacock",
        arabicName: "طاووس",
        imageFileName: "peacock.png",
        voices: {
            boy: "peacock_boy_ar.mp3",
            girl: "peacock_girl_ar.mp3",
            teacher: "peacock_teacher_ar.mp3",
            child: "peacock_child_ar.mp3"
        },
        description: {
            ar: "الطاووس طائر جميل جداً، يتميز بذنبه الطويل الملون الذي ينشره في شكل مروحة.",
            en: "A peacock is a very beautiful bird, characterized by its long, colorful tail that it fans out."
        },
        baby: { ar: "صغير الطاووس", en: "Peachick" },
        female: { ar: "أنثى الطاووس", en: "Peahen" },
        category: { ar: ["طائر", "جميل"], en: ["Bird", "Beautiful"] },
        letter: { ar: "ط", en: "P", he: "פ" }
    },
    {
        englishName: "Pelican",
        arabicName: "بجع",
        imageFileName: "pelican.png",
        voices: {
            boy: "pelican_boy_ar.mp3",
            girl: "pelican_girl_ar.mp3",
            teacher: "pelican_teacher_ar.mp3",
            child: "pelican_child_ar.mp3"
        },
        description: {
            ar: "البجع طائر مائي كبير، له منقار طويل جداً وحقيبة تحت المنقار لاصطياد السمك.",
            en: "A pelican is a large aquatic bird with a very long beak and a pouch under it for catching fish."
        },
        baby: { ar: "صغير البجع", en: "Chick" },
        female: { ar: "أنثى البجع", en: "Female Pelican" },
        category: { ar: ["طائر", "مائي"], en: ["Bird", "Aquatic"] },
        letter: { ar: "ب", en: "P", he: "פ" }
    },
    {
        englishName: "Penguin",
        arabicName: "بطريق",
        imageFileName: "penguin.png",
        voices: {
            boy: "penguin_boy_ar.mp3",
            girl: "penguin_girl_ar.mp3",
            teacher: "penguin_teacher_ar.mp3",
            child: "penguin_child_ar.mp3"
        },
        description: {
            ar: "البطريق طائر لا يطير، يعيش في المناطق الباردة، وماهر في السباحة والمشي المتمايل.",
            en: "A penguin is a flightless bird, living in cold regions, skilled at swimming and waddling."
        },
        baby: { ar: "صغير البطريق", en: "Chick" },
        female: { ar: "أنثى البطريق", en: "Female Penguin" },
        category: { ar: ["طائر", "بحري"], en: ["Bird", "Marine"] },
        letter: { ar: "ب", en: "P", he: "פ" }
    },
    {
        englishName: "Pig",
        arabicName: "خنزير",
        imageFileName: "pig.png",
        voices: {
            boy: "pig_boy_ar.mp3",
            girl: "pig_girl_ar.mp3",
            teacher: "pig_teacher_ar.mp3",
            child: "pig_child_ar.mp3"
        },
        description: {
            ar: "الخنزير حيوان مزرعة معروف، له أنف مسطح، يحب الأكل، وهو ذكي جداً.",
            en: "A pig is a well-known farm animal with a flat snout, loves eating, and is very intelligent."
        },
        baby: { ar: "خنزير صغير", en: "Piglet" },
        female: { ar: "أنثى الخنزير", en: "Sow" },
        category: { ar: ["ثديي", "مزرعة"], en: ["Mammal", "Farm Animal"] },
        letter: { ar: "خ", en: "P", he: "פ" }
    },
    {
        englishName: "Pigeon",
        arabicName: "حمامة",
        imageFileName: "pigeon.png",
        voices: {
            boy: "pigeon_boy_ar.mp3",
            girl: "pigeon_girl_ar.mp3",
            teacher: "pigeon_teacher_ar.mp3",
            child: "pigeon_child_ar.mp3"
        },
        description: {
            ar: "الحمامة طائر أليف يعيش في المدن، معروف بصوته المميز و قدرته على إيجاد طريقها للعودة.",
            en: "A pigeon is a domestic bird living in cities, known for its distinctive coo and ability to find its way back."
        },
        baby: { ar: "فرخ الحمامة", en: "Squab" },
        female: { ar: "أنثى الحمامة", en: "Hen" },
        category: { ar: ["طائر", "أليف"], en: ["Bird", "Domestic"] },
        letter: { ar: "ح", en: "P", he: "פ" }
    },
    {
        englishName: "Polar Bear",
        arabicName: "دب قطبي",
        imageFileName: "polar_bear.png",
        voices: {
            boy: "polar_bear_boy_ar.mp3",
            girl: "polar_bear_girl_ar.mp3",
            teacher: "polar_bear_teacher_ar.mp3",
            child: "polar_bear_child_ar.mp3"
        },
        description: {
            ar: "الدب القطبي دب كبير أبيض، يعيش في القطب الشمالي، ماهر في السباحة وصيد الفقمات.",
            en: "A polar bear is a large white bear, living in the Arctic, skilled at swimming and hunting seals."
        },
        baby: { ar: "دغفل", en: "Cub" },
        female: { ar: "أنثى الدب القطبي", en: "She-bear" },
        category: { ar: ["ثديي", "قطبي"], en: ["Mammal", "Arctic"] },
        letter: { ar: "د", en: "P", he: "פ" }
    },
    {
        englishName: "Pony",
        arabicName: "مهر",
        imageFileName: "pony.png",
        voices: {
            boy: "pony_boy_ar.mp3",
            girl: "pony_girl_ar.mp3",
            teacher: "pony_teacher_ar.mp3",
            child: "pony_child_ar.mp3"
        },
        description: {
            ar: "المهر حصان صغير، لطيف ومحبوب، ويستخدم لركوب الأطفال.",
            en: "A pony is a small horse, cute and beloved, used for children to ride."
        },
        baby: { ar: "مهر", en: "Foal" },
        female: { ar: "مهرة", en: "Mare" },
        category: { ar: ["ثديي", "أليف"], en: ["Mammal", "Domestic"] },
        letter: { ar: "م", en: "P", he: "פ" }
    },
    {
        englishName: "Porcupine",
        arabicName: "شيهم",
        imageFileName: "porcupine.png",
        voices: {
            boy: "porcupine_boy_ar.mp3",
            girl: "porcupine_girl_ar.mp3",
            teacher: "porcupine_teacher_ar.mp3",
            child: "porcupine_child_ar.mp3"
        },
        description: {
            ar: "الشيهم حيوان قارض مغطى بأشواك طويلة وحادة يستخدمها للدفاع عن نفسه.",
            en: "A porcupine is a rodent covered in long, sharp quills that it uses for self-defense."
        },
        baby: { ar: "صغير الشيهم", en: "Pup" },
        female: { ar: "أنثى الشيهم", en: "Female Porcupine" },
        category: { ar: ["ثديي", "شائك"], en: ["Mammal", "Spiny"] },
        letter: { ar: "ش", en: "P", he: "פ" }
    },
    {
        englishName: "Quail",
        arabicName: "سمان",
        imageFileName: "quail.png",
        voices: {
            boy: "quail_boy_ar.mp3",
            girl: "quail_girl_ar.mp3",
            teacher: "quail_teacher_ar.mp3",
            child: "quail_child_ar.mp3"
        },
        description: {
            ar: "السمان طائر صغير، يعيش في الحقول، معروف بصوته المميز وطعمه اللذيذ.",
            en: "A quail is a small bird, living in fields, known for its distinctive call and delicious taste."
        },
        baby: { ar: "صغير السمان", en: "Chick" },
        female: { ar: "أنثى السمان", en: "Female Quail" },
        category: { ar: ["طائر", "داجن"], en: ["Bird", "Game Bird"] },
        letter: { ar: "س", en: "Q", he: "ק" }
    },
    {
        englishName: "Quokka",
        arabicName: "كوكا",
        imageFileName: "quokka.png",
        voices: {
            boy: "quokka_boy_ar.mp3",
            girl: "quokka_girl_ar.mp3",
            teacher: "quokka_teacher_ar.mp3",
            child: "quokka_child_ar.mp3"
        },
        description: {
            ar: "الكوكا حيوان جرابي صغير من أستراليا، معروف بابتسامته الدائمة ووجهه الودود.",
            en: "A quokka is a small marsupial from Australia, known for its permanent smile and friendly face."
        },
        baby: { ar: "صغير الكوكا", en: "Joey" },
        female: { ar: "أنثى الكوكا", en: "Female Quokka" },
        category: { ar: ["ثديي", "جرابي"], en: ["Mammal", "Marsupial"] },
        letter: { ar: "ك", en: "Q", he: "ק" }
    },
    {
        englishName: "Rabbit",
        arabicName: "أرنب",
        imageFileName: "rabbit.png",
        voices: {
            boy: "rabbit_boy_ar.mp3",
            girl: "rabbit_girl_ar.mp3",
            teacher: "rabbit_teacher_ar.mp3",
            child: "rabbit_child_ar.mp3"
        },
        description: {
            ar: "الأرنب حيوان أليف، له آذان طويلة وفرو ناعم، ويحب أكل الجزر ويقفز بسرعة.",
            en: "A rabbit is a domestic animal with long ears and soft fur, loves eating carrots and hops quickly."
        },
        baby: { ar: "صغير الأرنب", en: "Kit" },
        female: { ar: "أنثى الأرنب", en: "Doe" },
        category: { ar: ["ثديي", "أليف"], en: ["Mammal", "Domestic"] },
        letter: { ar: "أ", en: "R", he: "ר" }
    },
    {
        englishName: "Raccoon",
        arabicName: "راكون",
        imageFileName: "raccoon.png",
        voices: {
            boy: "raccoon_boy_ar.mp3",
            girl: "raccoon_girl_ar.mp3",
            teacher: "raccoon_teacher_ar.mp3",
            child: "raccoon_child_ar.mp3"
        },
        description: {
            ar: "الراكون حيوان ليلي، له وجه مميز يشبه القناع، وذيل مخطط، وهو ماهر في البحث عن الطعام.",
            en: "A raccoon is a nocturnal animal with a distinctive mask-like face and a striped tail, skilled at foraging."
        },
        baby: { ar: "صغير الراكون", en: "Kit" },
        female: { ar: "أنثى الراكون", en: "Sow" },
        category: { ar: ["ثديي", "ليلي"], en: ["Mammal", "Nocturnal"] },
        letter: { ar: "ر", en: "R", he: "ר" }
    },
    {
        englishName: "Ram",
        arabicName: "كبش",
        imageFileName: "ram.png",
        voices: {
            boy: "ram_boy_ar.mp3",
            girl: "ram_girl_ar.mp3",
            teacher: "ram_teacher_ar.mp3",
            child: "ram_child_ar.mp3"
        },
        description: {
            ar: "الكبش هو ذكر الخروف، يتميز بقرونه الكبيرة المنحنية، وهو قوي البنية.",
            en: "A ram is a male sheep, characterized by its large curved horns, and is strongly built."
        },
        baby: { ar: "حمل", en: "Lamb" },
        female: { ar: "نعجة", en: "Ewe" },
        category: { ar: ["ثديي", "مزرعة"], en: ["Mammal", "Farm Animal"] },
        letter: { ar: "ك", en: "R", he: "ר" }
    },
    {
        englishName: "Rat",
        arabicName: "جرذ",
        imageFileName: "rat.png",
        voices: {
            boy: "rat_boy_ar.mp3",
            girl: "rat_girl_ar.mp3",
            teacher: "rat_teacher_ar.mp3",
            child: "rat_child_ar.mp3"
        },
        description: {
            ar: "الجرذ حيوان قارض ذكي، له ذيل طويل وأسنان قوية، يعيش في أماكن مختلفة.",
            en: "A rat is an intelligent rodent with a long tail and strong teeth, living in various places."
        },
        baby: { ar: "صغير الجرذ", en: "Pup" },
        female: { ar: "أنثى الجرذ", en: "Doe" },
        category: { ar: ["ثديي", "قاضم"], en: ["Mammal", "Rodent"] },
        letter: { ar: "ج", en: "R", he: "ר" }
    },
    {
        englishName: "Raven",
        arabicName: "غراب",
        imageFileName: "raven.png",
        voices: {
            boy: "raven_boy_ar.mp3",
            girl: "raven_girl_ar.mp3",
            teacher: "raven_teacher_ar.mp3",
            child: "raven_child_ar.mp3"
        },
        description: {
            ar: "الغراب طائر كبير وذكي جداً، ريشه أسود لامع، ويشتهر بقدرته على حل المشكلات.",
            en: "A raven is a large and very intelligent bird, with glossy black feathers, known for its problem-solving abilities."
        },
        baby: { ar: "فرخ الغراب", en: "Fledgling" },
        female: { ar: "أنثى الغراب", en: "Female Raven" },
        category: { ar: ["طائر", "ذكي"], en: ["Bird", "Intelligent"] },
        letter: { ar: "غ", en: "R", he: "ר" }
    },
    {
        englishName: "Reindeer",
        arabicName: "رنة",
        imageFileName: "reindeer.png",
        voices: {
            boy: "reindeer_boy_ar.mp3",
            girl: "reindeer_girl_ar.mp3",
            teacher: "reindeer_teacher_ar.mp3",
            child: "reindeer_child_ar.mp3"
        },
        description: {
            ar: "الرنة حيوان يعيش في المناطق القطبية، له قرون كبيرة ومتفرعة (للذكور والإناث)، ويستخدم لسحب الزلاجات.",
            en: "A reindeer is an animal living in polar regions, with large branched antlers (for males and females), used for pulling sleds."
        },
        baby: { ar: "عجل", en: "Calf" },
        female: { ar: "رنة أنثى", en: "Doe" },
        category: { ar: ["ثديي", "قطبي"], en: ["Mammal", "Arctic"] },
        letter: { ar: "ر", en: "R", he: "ר" }
    },
    {
        englishName: "Rhinoceros",
        arabicName: "وحيد القرن",
        imageFileName: "rhinoceros.png",
        voices: {
            boy: "rhinoceros_boy_ar.mp3",
            girl: "rhinoceros_girl_ar.mp3",
            teacher: "rhinoceros_teacher_ar.mp3",
            child: "rhinoceros_child_ar.mp3"
        },
        description: {
            ar: "وحيد القرن حيوان ضخم وقوي، له قرن واحد أو قرنان على أنفه، وجلده سميك جداً.",
            en: "A rhinoceros is a large and powerful animal, with one or two horns on its nose, and very thick skin."
        },
        baby: { ar: "صغير وحيد القرن", en: "Calf" },
        female: { ar: "أنثى وحيد القرن", en: "Cow" },
        category: { ar: ["ثديي", "ضخم"], en: ["Mammal", "Large"] },
        letter: { ar: "و", en: "R", he: "ר" }
    },
    {
        englishName: "Robin",
        arabicName: "أبو الحناء",
        imageFileName: "robin.png",
        voices: {
            boy: "robin_boy_ar.mp3",
            girl: "robin_girl_ar.mp3",
            teacher: "robin_teacher_ar.mp3",
            child: "robin_child_ar.mp3"
        },
        description: {
            ar: "أبو الحناء طائر صغير معروف بصدره الأحمر الزاهي، وصوته الجميل الذي يغرد به.",
            en: "A robin is a small bird known for its bright red breast and beautiful song."
        },
        baby: { ar: "فرخ أبي الحناء", en: "Chick" },
        female: { ar: "أنثى أبي الحناء", en: "Hen" },
        category: { ar: ["طائر", "مغرد"], en: ["Bird", "Songbird"] },
        letter: { ar: "أ", en: "R", he: "ר" }
    },
    {
        englishName: "Salmon",
        arabicName: "سلمون",
        imageFileName: "salmon.png",
        voices: {
            boy: "salmon_boy_ar.mp3",
            girl: "salmon_girl_ar.mp3",
            teacher: "salmon_teacher_ar.mp3",
            child: "salmon_child_ar.mp3"
        },
        description: {
            ar: "السلمون سمكة مشهورة، تعيش في المحيطات وتسبح عكس التيار لتضع بيضها في الأنهار.",
            en: "Salmon is a famous fish, living in oceans and swimming upstream to lay its eggs in rivers."
        },
        baby: { ar: "صغير السلمون", en: "Fry" },
        female: { ar: "أنثى السلمون", en: "Hen" },
        category: { ar: ["سمك", "مهاجر"], en: ["Fish", "Migratory"] },
        letter: { ar: "س", en: "S", he: "ש" }
    },
    {
        englishName: "Scorpion",
        arabicName: "عقرب",
        imageFileName: "scorpion.png",
        voices: {
            boy: "scorpion_boy_ar.mp3",
            girl: "scorpion_girl_ar.mp3",
            teacher: "scorpion_teacher_ar.mp3",
            child: "scorpion_child_ar.mp3"
        },
        description: {
            ar: "العقرب حيوان لا فقاري له ثمانية أرجل، وذيل مقوس ينتهي بإبرة سامة.",
            en: "A scorpion is an invertebrate with eight legs, and a curved tail ending in a venomous stinger."
        },
        baby: { ar: "صغير العقرب", en: "Scorpling" },
        female: { ar: "أنثى العقرب", en: "Female Scorpion" },
        category: { ar: ["لافقاري", "سام"], en: ["Invertebrate", "Venomous"] },
        letter: { ar: "ع", en: "S", he: "ש" }
    },
    {
        englishName: "Seal",
        arabicName: "فقمة",
        imageFileName: "seal.png",
        voices: {
            boy: "seal_boy_ar.mp3",
            girl: "seal_girl_ar.mp3",
            teacher: "seal_teacher_ar.mp3",
            child: "seal_child_ar.mp3"
        },
        description: {
            ar: "الفقمة حيوان بحري، جسمها انسيابي وفروها سميك، وماهرة في السباحة والغوص في الماء البارد.",
            en: "A seal is a marine animal with a streamlined body and thick fur, skilled at swimming and diving in cold water."
        },
        baby: { ar: "صغير الفقمة", en: "Pup" },
        female: { ar: "أنثى الفقمة", en: "Cow" },
        category: { ar: ["ثديي", "بحري"], en: ["Mammal", "Marine"] },
        letter: { ar: "ف", en: "S", he: "ש" }
    },
    {
        englishName: "Shark",
        arabicName: "قرش",
        imageFileName: "shark.png",
        voices: {
            boy: "shark_boy_ar.mp3",
            girl: "shark_girl_ar.mp3",
            teacher: "shark_teacher_ar.mp3",
            child: "shark_child_ar.mp3"
        },
        description: {
            ar: "القرش سمكة مفترسة قوية، لها أسنان حادة، وتعيش في جميع محيطات العالم.",
            en: "A shark is a powerful predatory fish, with sharp teeth, living in all oceans of the world."
        },
        baby: { ar: "صغير القرش", en: "Pup" },
        female: { ar: "أنثى القرش", en: "Female Shark" },
        category: { ar: ["سمك", "مفترس"], en: ["Fish", "Predator"] },
        letter: { ar: "ق", en: "S", he: "ש" }
    },
    {
        englishName: "Sheep",
        arabicName: "خروف",
        imageFileName: "sheep.png",
        voices: {
            boy: "sheep_boy_ar.mp3",
            girl: "sheep_girl_ar.mp3",
            teacher: "sheep_teacher_ar.mp3",
            child: "sheep_child_ar.mp3"
        },
        description: {
            ar: "الخروف حيوان أليف، يغطيه صوف كثيف، ويعيش في المزارع ويعطينا الصوف واللحم.",
            en: "A sheep is a domestic animal, covered in thick wool, living on farms and providing wool and meat."
        },
        baby: { ar: "حمل", en: "Lamb" },
        female: { ar: "نعجة", en: "Ewe" },
        category: { ar: ["ثديي", "مزرعة"], en: ["Mammal", "Farm Animal"] },
        letter: { ar: "خ", en: "S", he: "ש" }
    },
    {
        englishName: "Skunk",
        arabicName: "ظربان",
        imageFileName: "skunk.png",
        voices: {
            boy: "skunk_boy_ar.mp3",
            girl: "skunk_girl_ar.mp3",
            teacher: "skunk_teacher_ar.mp3",
            child: "skunk_child_ar.mp3"
        },
        description: {
            ar: "الظربان حيوان صغير فروه أسود وأبيض، يطلق رائحة كريهة جداً للدفاع عن نفسه.",
            en: "A skunk is a small animal with black and white fur, releasing a very foul smell for self-defense."
        },
        baby: { ar: "صغير الظربان", en: "Kit" },
        female: { ar: "أنثى الظربان", en: "Female Skunk" },
        category: { ar: ["ثديي", "دفاع"], en: ["Mammal", "Defensive"] },
        letter: { ar: "ظ", en: "S", he: "ש" }
    },
    {
        englishName: "Snail",
        arabicName: "حلزون",
        imageFileName: "snail.png",
        voices: {
            boy: "snail_boy_ar.mp3",
            girl: "snail_girl_ar.mp3",
            teacher: "snail_teacher_ar.mp3",
            child: "snail_child_ar.mp3"
        },
        description: {
            ar: "الحلزون كائن بطيء الحركة، يحمل بيته (صدفته) على ظهره ويترك أثراً لامعاً ورائه.",
            en: "A snail is a slow-moving creature that carries its shell on its back and leaves a shiny trail behind."
        },
        baby: { ar: "صغير الحلزون", en: "Hatchling" },
        female: { ar: "أنثى الحلزون", en: "Female Snail" },
        category: { ar: ["لافقاري", "بطيء"], en: ["Invertebrate", "Slow"] },
        letter: { ar: "ح", en: "S", he: "ש" }
    },
    {
        englishName: "Snake",
        arabicName: "أفعى",
        imageFileName: "snake.png",
        voices: {
            boy: "snake_boy_ar.mp3",
            girl: "snake_girl_ar.mp3",
            teacher: "snake_teacher_ar.mp3",
            child: "snake_child_ar.mp3"
        },
        description: {
            ar: "الأفعى زاحف طويل بدون أرجل، يتحرك زاحفاً، وبعضها سام وبعضها غير سام.",
            en: "A snake is a long, legless reptile, moving by slithering, some are venomous and some are not."
        },
        baby: { ar: "صغير الأفعى", en: "Hatchling" },
        female: { ar: "أنثى الأفعى", en: "Female Snake" },
        category: { ar: ["زاحف", "سام"], en: ["Reptile", "Venomous"] },
        letter: { ar: "أ", en: "S", he: "ש" }
    },
    {
        englishName: "Sparrow",
        arabicName: "عصفور",
        imageFileName: "sparrow.png",
        voices: {
            boy: "sparrow_boy_ar.mp3",
            girl: "sparrow_girl_ar.mp3",
            teacher: "sparrow_teacher_ar.mp3",
            child: "sparrow_child_ar.mp3"
        },
        description: {
            ar: "العصفور طائر صغير شائع، يعيش في المدن والحدائق، ويغرد بصوت جميل.",
            en: "A sparrow is a common small bird, living in cities and gardens, singing with a beautiful voice."
        },
        baby: { ar: "فرخ العصفور", en: "Chick" },
        female: { ar: "أنثى العصفور", en: "Female Sparrow" },
        category: { ar: ["طائر", "مغرد"], en: ["Bird", "Songbird"] },
        letter: { ar: "ع", en: "S", he: "ש" }
    },
    {
        englishName: "Spider",
        arabicName: "عنكبوت",
        imageFileName: "spider.png",
        voices: {
            boy: "spider_boy_ar.mp3",
            girl: "spider_girl_ar.mp3",
            teacher: "spider_teacher_ar.mp3",
            child: "spider_child_ar.mp3"
        },
        description: {
            ar: "العنكبوت كائن له ثمانية أرجل، ينسج شبكات لاصطياد الحشرات، وليس حشرة.",
            en: "A spider is a creature with eight legs, weaving webs to catch insects, and is not an insect."
        },
        baby: { ar: "صغير العنكبوت", en: "Spiderling" },
        female: { ar: "أنثى العنكبوت", en: "Female Spider" },
        category: { ar: ["عنكبوتيات", "نسج"], en: ["Arachnid", "Weaver"] },
        letter: { ar: "ع", en: "S", he: "ש" }
    },
    {
        englishName: "Squirrel",
        arabicName: "سنجاب",
        imageFileName: "squirrel.png",
        voices: {
            boy: "squirrel_boy_ar.mp3",
            girl: "squirrel_girl_ar.mp3",
            teacher: "squirrel_teacher_ar.mp3",
            child: "squirrel_child_ar.mp3"
        },
        description: {
            ar: "السنجاب حيوان صغير يعيش في الأشجار، له ذيل كثيف، ويحب جمع المكسرات.",
            en: "A squirrel is a small animal living in trees, with a bushy tail, and loves collecting nuts."
        },
        baby: { ar: "صغير السنجاب", en: "Kit" },
        female: { ar: "أنثى السنجاب", en: "Female Squirrel" },
        category: { ar: ["ثديي", "قاضم"], en: ["Mammal", "Rodent"] },
        letter: { ar: "س", en: "S", he: "ש" }
    },
    {
        englishName: "Starfish",
        arabicName: "نجم البحر",
        imageFileName: "starfish.png",
        voices: {
            boy: "starfish_boy_ar.mp3",
            girl: "starfish_girl_ar.mp3",
            teacher: "starfish_teacher_ar.mp3",
            child: "starfish_child_ar.mp3"
        },
        description: {
            ar: "نجم البحر كائن بحري على شكل نجمة، يعيش في قاع المحيط، وله أذرع يمتد بها.",
            en: "A starfish is a star-shaped marine creature, living on the ocean floor, with arms it extends."
        },
        baby: { ar: "صغير نجم البحر", en: "Larva" },
        female: { ar: "أنثى نجم البحر", en: "Female Starfish" },
        category: { ar: ["لافقاري", "بحري"], en: ["Invertebrate", "Marine"] },
        letter: { ar: "ن", en: "S", he: "ש" }
    },
    {
        englishName: "Swan",
        arabicName: "بجعة",
        imageFileName: "swan.png",
        voices: {
            boy: "swan_boy_ar.mp3",
            girl: "swan_girl_ar.mp3",
            teacher: "swan_teacher_ar.mp3",
            child: "swan_child_ar.mp3"
        },
        description: {
            ar: "البجعة طائر مائي كبير وجميل، له رقبة طويلة ومنحنية، ويسبح بأناقة في البحيرات.",
            en: "A swan is a large and beautiful aquatic bird, with a long, curved neck, swimming elegantly in lakes."
        },
        baby: { ar: "صغير البجعة", en: "Cygnet" },
        female: { ar: "أنثى البجعة", en: "Pen" },
        category: { ar: ["طائر", "مائي"], en: ["Bird", "Aquatic"] },
        letter: { ar: "ب", en: "S", he: "ש" }
    },
    {
        englishName: "Tiger",
        arabicName: "نمر",
        imageFileName: "tiger.png",
        voices: {
            boy: "tiger_boy_ar.mp3",
            girl: "tiger_girl_ar.mp3",
            teacher: "tiger_teacher_ar.mp3",
            child: "tiger_child_ar.mp3"
        },
        description: {
            ar: "النمر قط كبير مفترس، فروه برتقالي مخطط بالأسود، وهو صياد ماهر يعيش في الغابات.",
            en: "A tiger is a large predatory cat, with orange fur striped with black, and is a skilled hunter living in forests."
        },
        baby: { ar: "جرو النمر", en: "Cub" },
        female: { ar: "أنثى النمر", en: "Tigress" },
        category: { ar: ["ثديي", "مفترس"], en: ["Mammal", "Predator"] },
        letter: { ar: "ن", en: "T", he: "ת" }
    },
    {
        englishName: "Toad",
        arabicName: "علجوم",
        imageFileName: "toad.png",
        voices: {
            boy: "toad_boy_ar.mp3",
            girl: "toad_girl_ar.mp3",
            teacher: "toad_teacher_ar.mp3",
            child: "toad_child_ar.mp3"
        },
        description: {
            ar: "العلجوم حيوان برمائي يشبه الضفدع، لكن جلده جاف وأكثر وعورة، ويعيش على اليابسة أكثر.",
            en: "A toad is an amphibian resembling a frog, but its skin is dry and rougher, living more on land."
        },
        baby: { ar: "صغير العلجوم", en: "Tadpole" },
        female: { ar: "أنثى العلجوم", en: "Female Toad" },
        category: { ar: ["برمائي", "قفاز"], en: ["Amphibian", "Jumper"] },
        letter: { ar: "ع", en: "T", he: "ת" }
    },
    {
        englishName: "Toucan",
        arabicName: "طوقان",
        imageFileName: "toucan.png",
        voices: {
            boy: "toucan_boy_ar.mp3",
            girl: "toucan_girl_ar.mp3",
            teacher: "toucan_teacher_ar.mp3",
            child: "toucan_child_ar.mp3"
        },
        description: {
            ar: "الطوقان طائر استوائي، له منقار كبير وملون جداً، ويستخدمه في التقاط الفاكهة.",
            en: "A toucan is a tropical bird with a very large and colorful beak, used for picking fruit."
        },
        baby: { ar: "صغير الطوقان", en: "Chick" },
        female: { ar: "أنثى الطوقان", en: "Female Toucan" },
        category: { ar: ["طائر", "استوائي"], en: ["Bird", "Tropical"] },
        letter: { ar: "ط", en: "T", he: "ת" }
    },
    {
        englishName: "Turkey",
        arabicName: "ديك رومي",
        imageFileName: "turkey.png",
        voices: {
            boy: "turkey_boy_ar.mp3",
            girl: "turkey_girl_ar.mp3",
            teacher: "turkey_teacher_ar.mp3",
            child: "turkey_child_ar.mp3"
        },
        description: {
            ar: "الديك الرومي طائر كبير يربى في المزارع، معروف بصوته المميز ويؤكل لحمه.",
            en: "A turkey is a large bird raised on farms, known for its distinctive gobble and consumed for its meat."
        },
        baby: { ar: "صغير الديك الرومي", en: "Poult" },
        female: { ar: "دجاجة رومية", en: "Hen" },
        category: { ar: ["طائر", "داجن"], en: ["Bird", "Poultry"] },
        letter: { ar: "د", en: "T", he: "ת" }
    },
    {
        englishName: "Turtle",
        arabicName: "سلحفاة",
        imageFileName: "turtle.png",
        voices: {
            boy: "turtle_boy_ar.mp3",
            girl: "turtle_girl_ar.mp3",
            teacher: "turtle_teacher_ar.mp3",
            child: "turtle_child_ar.mp3"
        },
        description: {
            ar: "السلحفاة زاحف، لها درع صلب يحميها، وهي معروفة ببطء حركتها وطول عمرها.",
            en: "A turtle is a reptile with a hard shell that protects it, known for its slow movement and long lifespan."
        },
        baby: { ar: "صغير السلحفاة", en: "Hatchling" },
        female: { ar: "أنثى السلحفاة", en: "Female Turtle" },
        category: { ar: ["زاحف", "درع"], en: ["Reptile", "Shelled"] },
        letter: { ar: "س", en: "T", he: "ת" }
    },
    {
        englishName: "Urial",
        arabicName: "أوريال",
        imageFileName: "urial.png",
        voices: {
            boy: "urial_boy_ar.mp3",
            girl: "urial_girl_ar.mp3",
            teacher: "urial_teacher_ar.mp3",
            child: "urial_child_ar.mp3"
        },
        description: {
            ar: "الأوريال نوع من الخراف البرية، يعيش في الجبال، ويتميز بقرونه الكبيرة المنحنية.",
            en: "The Urial is a type of wild sheep, living in mountains, characterized by its large curved horns."
        },
        baby: { ar: "حمل", en: "Lamb" },
        female: { ar: "نعجة", en: "Ewe" },
        category: { ar: ["ثديي", "جبلي"], en: ["Mammal", "Mountain"] },
        letter: { ar: "أ", en: "U", he: "א" }
    },
    {
        englishName: "Vulture",
        arabicName: "نسر",
        imageFileName: "vulture.png",
        voices: {
            boy: "vulture_boy_ar.mp3",
            girl: "vulture_girl_ar.mp3",
            teacher: "vulture_teacher_ar.mp3",
            child: "vulture_child_ar.mp3"
        },
        description: {
            ar: "النسر طائر جارح كبير، فروه خفيف على رأسه وعنقه، يتغذى على الحيوانات الميتة.",
            en: "A vulture is a large bird of prey, with sparse feathers on its head and neck, feeding on dead animals."
        },
        baby: { ar: "نسر صغير", en: "Eaglet" },
        female: { ar: "أنثى النسر", en: "Female Vulture" },
        category: { ar: ["طائر", "كانس"], en: ["Bird", "Scavenger"] },
        letter: { ar: "ن", en: "V", he: "ו" }
    },
    {
        englishName: "Walrus",
        arabicName: "فظ",
        imageFileName: "walrus.png",
        voices: {
            boy: "walrus_boy_ar.mp3",
            girl: "walrus_girl_ar.mp3",
            teacher: "walrus_teacher_ar.mp3",
            child: "walrus_child_ar.mp3"
        },
        description: {
            ar: "الفظ حيوان بحري ضخم، له أنياب طويلة جداً، ويعيش في المناطق القطبية الباردة.",
            en: "A walrus is a large marine animal, with very long tusks, living in cold polar regions."
        },
        baby: { ar: "صغير الفظ", en: "Calf" },
        female: { ar: "أنثى الفظ", en: "Cow" },
        category: { ar: ["ثديي", "بحري"], en: ["Mammal", "Marine"] },
        letter: { ar: "ف", en: "W", he: "ו" }
    },
    {
        englishName: "Wasp",
        arabicName: "دبور",
        imageFileName: "wasp.png",
        voices: {
            boy: "wasp_boy_ar.mp3",
            girl: "wasp_girl_ar.mp3",
            teacher: "wasp_teacher_ar.mp3",
            child: "wasp_child_ar.mp3"
        },
        description: {
            ar: "الدبور حشرة مجنحة، جسمها مخطط بالأسود والأصفر، وتستطيع لسع الإنسان.",
            en: "A wasp is a winged insect, with a black and yellow striped body, capable of stinging humans."
        },
        baby: { ar: "يرقة الدبور", en: "Larva" },
        female: { ar: "أنثى الدبور", en: "Female Wasp" },
        category: { ar: ["حشرة", "لاسعة"], en: ["Insect", "Stinging"] },
        letter: { ar: "د", en: "W", he: "ו" }
    },
    {
        englishName: "Weasel",
        arabicName: "ابن عرس",
        imageFileName: "weasel.png",
        voices: {
            boy: "weasel_boy_ar.mp3",
            girl: "weasel_girl_ar.mp3",
            teacher: "weasel_teacher_ar.mp3",
            child: "weasel_child_ar.mp3"
        },
        description: {
            ar: "ابن عرس حيوان صغير ونحيل، فروه بني، وماهر في صيد القوارض والطيور.",
            en: "A weasel is a small and slender animal, with brown fur, skilled at hunting rodents and birds."
        },
        baby: { ar: "صغير ابن عرس", en: "Kit" },
        female: { ar: "أنثى ابن عرس", en: "Female Weasel" },
        category: { ar: ["ثديي", "مفترس"], en: ["Mammal", "Predator"] },
        letter: { ar: "ا", en: "W", he: "ו" }
    },
    {
        englishName: "Whale",
        arabicName: "حوت",
        imageFileName: "whale.png",
        voices: {
            boy: "whale_boy_ar.mp3",
            girl: "whale_girl_ar.mp3",
            teacher: "whale_teacher_ar.mp3",
            child: "whale_child_ar.mp3"
        },
        description: {
            ar: "الحوت أكبر حيوان على وجه الأرض، يعيش في المحيطات، ويتنفس الهواء كالأسماك.",
            en: "The whale is the largest animal on Earth, living in oceans, and breathes air like fish."
        },
        baby: { ar: "عجل", en: "Calf" },
        female: { ar: "أنثى الحوت", en: "Cow" },
        category: { ar: ["ثديي", "بحري"], en: ["Mammal", "Marine"] },
        letter: { ar: "ح", en: "W", he: "ו" }
    },
    {
        englishName: "Wolf",
        arabicName: "ذئب",
        imageFileName: "wolf.png",
        voices: {
            boy: "wolf_boy_ar.mp3",
            girl: "wolf_girl_ar.mp3",
            teacher: "wolf_teacher_ar.mp3",
            child: "wolf_child_ar.mp3"
        },
        description: {
            ar: "الذئب حيوان مفترس يعيش في مجموعات، معروف بصوته المميز عندما يعوي في الليل.",
            en: "A wolf is a predatory animal living in packs, known for its distinctive howl at night."
        },
        baby: { ar: "جرو", en: "Pup" },
        female: { ar: "أنثى الذئب", en: "She-wolf" },
        category: { ar: ["ثديي", "مفترس"], en: ["Mammal", "Predator"] },
        letter: { ar: "ذ", en: "W", he: "ו" }
    },
    {
        englishName: "Wolverine",
        arabicName: "ولفرين",
        imageFileName: "wolverine.png",
        voices: {
            boy: "wolverine_boy_ar.mp3",
            girl: "wolverine_girl_ar.mp3",
            teacher: "wolverine_teacher_ar.mp3",
            child: "wolverine_child_ar.mp3"
        },
        description: {
            ar: "الولفرين حيوان ثديي صغير ولكنه شرس جداً وقوي، يعيش في المناطق الباردة.",
            en: "A wolverine is a small but very fierce and strong mammal, living in cold regions."
        },
        baby: { ar: "صغير الولفرين", en: "Kit" },
        female: { ar: "أنثى الولفرين", en: "Female Wolverine" },
        category: { ar: ["ثديي", "مفترس"], en: ["Mammal", "Predator"] },
        letter: { ar: "و", en: "W", he: "ו" }
    },
    {
        englishName: "Wombat",
        arabicName: "ومبات",
        imageFileName: "wombat.png",
        voices: {
            boy: "wombat_boy_ar.mp3",
            girl: "wombat_girl_ar.mp3",
            teacher: "wombat_teacher_ar.mp3",
            child: "wombat_child_ar.mp3"
        },
        description: {
            ar: "الومبات حيوان جرابي يعيش في أستراليا، يشبه الدب الصغير، ومعروف بحفر الجحور.",
            en: "A wombat is a marsupial living in Australia, resembling a small bear, and known for digging burrows."
        },
        baby: { ar: "صغير الومبات", en: "Joey" },
        female: { ar: "أنثى الومبات", en: "Female Wombat" },
        category: { ar: ["ثديي", "جرابي"], en: ["Mammal", "Marsupial"] },
        letter: { ar: "و", en: "W", he: "ו" }
    },
    {
        englishName: "Woodpecker",
        arabicName: "نقار الخشب",
        imageFileName: "woodpecker.png",
        voices: {
            boy: "woodpecker_boy_ar.mp3",
            girl: "woodpecker_girl_ar.mp3",
            teacher: "woodpecker_teacher_ar.mp3",
            child: "woodpecker_child_ar.mp3"
        },
        description: {
            ar: "نقار الخشب طائر له منقار قوي يستخدمه لنقر الأشجار بحثاً عن الحشرات.",
            en: "A woodpecker is a bird with a strong beak that it uses to peck trees in search of insects."
        },
        baby: { ar: "فرخ نقار الخشب", en: "Chick" },
        female: { ar: "أنثى نقار الخشب", en: "Female Woodpecker" },
        category: { ar: ["طائر", "غابة"], en: ["Bird", "Forest"] },
        letter: { ar: "ن", en: "W", he: "ו" }
    },
    {
        englishName: "Xerus",
        arabicName: "سنجاب أرضي",
        imageFileName: "xerus.png",
        voices: {
            boy: "xerus_boy_ar.mp3",
            girl: "xerus_girl_ar.mp3",
            teacher: "xerus_teacher_ar.mp3",
            child: "xerus_child_ar.mp3"
        },
        description: {
            ar: "السنجاب الأرضي نوع من السناجب، يعيش على الأرض ويحفر الجحور، وهو أكثر نشاطاً في النهار.",
            en: "A ground squirrel is a type of squirrel, living on the ground and digging burrows, and is more active during the day."
        },
        baby: { ar: "صغير السنجاب", en: "Pup" },
        female: { ar: "أنثى السنجاب", en: "Female Ground Squirrel" },
        category: { ar: ["ثديي", "قاضم"], en: ["Mammal", "Rodent"] },
        letter: { ar: "س", en: "X", he: "כ" }
    },
    {
        englishName: "Yak",
        arabicName: "ياك",
        imageFileName: "yak.png",
        voices: {
            boy: "yak_boy_ar.mp3",
            girl: "yak_girl_ar.mp3",
            teacher: "yak_teacher_ar.mp3",
            child: "yak_child_ar.mp3"
        },
        description: {
            ar: "الياك حيوان كبير ذو فرو سميك، يعيش في المناطق الجبلية الباردة في آسيا، ويستخدم لحمل الأثقال.",
            en: "A yak is a large animal with thick fur, living in cold mountainous regions of Asia, and used for carrying loads."
        },
        baby: { ar: "عجل", en: "Calf" },
        female: { ar: "أنثى الياك", en: "Cow" },
        category: { ar: ["ثديي", "جبلي"], en: ["Mammal", "Mountain"] },
        letter: { ar: "ي", en: "Y", he: "י" }
    },
    {
        englishName: "Zebra",
        arabicName: "حمار وحشي",
        imageFileName: "zebra.png",
        voices: {
            boy: "zebra_boy_ar.mp3",
            girl: "zebra_girl_ar.mp3",
            teacher: "zebra_teacher_ar.mp3",
            child: "zebra_child_ar.mp3"
        },
        description: {
            ar: "الحمار الوحشي حيوان أفريقي يشبه الحصان، يتميز بخطوطه السوداء والبيضاء المميزة على جسمه.",
            en: "A zebra is an African animal resembling a horse, characterized by its distinctive black and white stripes on its body."
        },
        baby: { ar: "مهر", en: "Foal" },
        female: { ar: "أنثى الحمار الوحشي", en: "Mare" },
        category: { ar: ["ثديي", "عشبي"], en: ["Mammal", "Herbivore"] },
        letter: { ar: "ح", en: "Z", he: "ז" }
    },
];

async function seedAnimalsToFirestore() {
  try {
    console.log("🚀 Starting seeding process for animals to Firestore...");

    let addedCount = 0;
    let updatedCount = 0;
    let skippedCount = 0;

    for (const animal of animalsData) {
      // استخدم الاسم الإنجليزي ليكون معرّف الوثيقة (doc ID) لسهولة التعامل
      const docId = animal.englishName.toLowerCase().replace(/\s+/g, '_'); // تحويل الاسم لمفتاح ID مناسب
      const animalRef = db.collection('categories').doc('animals').collection('items').doc(docId);

      const docSnapshot = await animalRef.get();

      // تجهيز البيانات للوثيقة
      const dataToSet = {
        name: { ar: animal.arabicName, en: animal.englishName },
        image: animal.imageFileName,
        description: animal.description,
        baby: animal.baby,
        female: animal.female,
        category: animal.category,
        voices: animal.voices, // تأكد أن هذا الكائن يحتوي على جميع الأصوات (boy, girl, teacher, child)
        letter: animal.letter // إضافة حقل letter
      };

      if (docSnapshot.exists) {
        // إذا كانت الوثيقة موجودة، قم بالتحديث (مع خيار الدمج لعدم مسح الحقول الأخرى)
        await animalRef.set(dataToSet, { merge: true });
        console.log(`- Updated: ${animal.englishName} (ID: ${docId})`);
        updatedCount++;
      } else {
        // إذا لم تكن الوثيقة موجودة، قم بإنشائها
        await animalRef.set(dataToSet);
        console.log(`- Added: ${animal.englishName} (ID: ${docId})`);
        addedCount++;
      }
    }

    console.log("\n✨ Firestore seeding complete!");
    console.log(`Summary: Added: ${addedCount}, Updated: ${updatedCount}, Skipped: ${skippedCount}`);

  } catch (error) {
    console.error("⛔️ Fatal error during Firestore seeding process:", error);
  } finally {
    // إغلاق Firebase Admin SDK بعد الانتهاء
    admin.app().delete().catch(() => {});
  }
}

// تشغيل الدالة
seedAnimalsToFirestore();