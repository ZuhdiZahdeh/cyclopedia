# seed_vegetables_firestore.py
import firebase_admin
from firebase_admin import credentials, firestore
import os

# Initialize Firebase Admin SDK
# Ensure your service account key file is in the 'config' directory
# You can download this from Firebase Console -> Project settings -> Service accounts
# For production, consider environment variables or other secure methods
try:
    # قم بتغيير المسار هنا لاستخدام المسار المطلق
    # تأكد من أن المسافات البادئة (المسافات البيضاء في بداية السطر) صحيحة
    cred = credentials.Certificate(r"E:\cyclopedia\config\your-firebase-service-account-key.json")
    firebase_admin.initialize_app(cred)
except ValueError as e:
    print(f"Firebase app already initialized or error with credentials: {e}")

db = firestore.client()

VEGETABLES_DATA_FOR_FIRESTORE = [
    {
        "category": "vegetables",
        "name": {"ar": "خرشوف", "en": "Artichoke", "he": "ארטישוק"},
        "description": {
            "ar": "الخرشوف نبات شوكي صالح للأكل، يتميز بقلبه اللذيذ وأوراقه التي تؤكل بعد الطهي.",
            "en": "Artichoke is an edible thistle plant, characterized by its delicious heart and leaves eaten after cooking.",
            "he": "ארטישוק הוא צמח קוצני אכיל, המאופיין בליבו הטעים ובעליו הנאכלים לאחר בישול.",
        },
        "image": "artichoke_image.png",
        "sound_base": "artichoke_teacher_ar.mp3",
        "voices": {
            "teacher": "artichoke_teacher_ar.mp3",
            "boy": "artichoke_boy_ar.mp3",
            "girl": "artichoke_girl_ar.mp3",
            "child": "artichoke_child_ar.mp3",
        },
        "letter": {"ar": "خ", "en": "A", "he": "א"},
        "sora_prompt": "A short video showing an artichoke plant, then a close-up of its edible parts.",
        "benefits": {"ar": "غني بالألياف ومضادات الأكسدة", "en": "Rich in fiber and antioxidants", "he": "עשير בסיבים תזונתיים ונוגדי חמצון"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "هليون", "en": "Asparagus", "he": "אספרגוס"},
        "description": {
            "ar": "الهليون هو نبات ربيعي طري ولذيذ، غالبًا ما يتم طهيه بالبخار أو الشوي.",
            "en": "Asparagus is a tender and delicious spring vegetable, often steamed or grilled.",
            "he": "אספרגוס הוא ירק אביבי רך וטעים, לרוב מאודה או בגריל.",
        },
        "image": "asparagus_image.png",
        "sound_base": "asparagus_teacher_ar.mp3",
        "voices": {
            "teacher": "asparagus_teacher_ar.mp3",
            "boy": "asparagus_boy_ar.mp3",
            "girl": "asparagus_girl_ar.mp3",
            "child": "asparagus_child_ar.mp3",
        },
        "letter": {"ar": "هـ", "en": "A", "he": "א"},
        "sora_prompt": "A short video of asparagus spears growing, then being harvested and prepared.",
        "benefits": {"ar": "مصدر جيد للفيتامينات K و A", "en": "Good source of Vitamins K and A", "he": "מקור טוב לויטמינים K ו-A"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "شمندر", "en": "Beet", "he": "סלק"},
        "description": {
            "ar": "الشمندر هو خضروات جذرية ذات لون أحمر بنفسجي غامق، حلوة المذاق ومغذية.",
            "en": "Beet is a deep reddish-purple root vegetable, sweet and nutritious.",
            "he": "סלק הוא ירק שורש סגול-אדום עמוק, מתוק ומזין.",
        },
        "image": "beet_image.png",
        "sound_base": "beet_teacher_ar.mp3",
        "voices": {
            "teacher": "beet_teacher_ar.mp3",
            "boy": "beet_boy_ar.mp3",
            "girl": "beet_girl_ar.mp3",
            "child": "beet_child_ar.mp3",
        },
        "letter": {"ar": "ش", "en": "B", "he": "ס"},
        "sora_prompt": "A short video showing beets growing underground, then being pulled out and cleaned.",
        "benefits": {"ar": "مفيد لصحة القلب، غني بالحديد", "en": "Good for heart health, rich in iron", "he": "טוב לבריאות הלב, עשיר בברזל"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "بروكلي", "en": "Broccoli", "he": "ברוקולי"},
        "description": {
            "ar": "البروكلي هو خضروات خضراء تشبه الشجرة الصغيرة، غنية بالفيتامينات ومضادات الأكسدة.",
            "en": "Broccoli is a green vegetable resembling a small tree, rich in vitamins and antioxidants.",
            "he": "ברוקולי הוא ירק ירוק הדומה לעץ קטן, עשיר בויטמינים ונוגדי חמצון.",
        },
        "image": "broccoli_image.png",
        "sound_base": "broccoli_teacher_ar.mp3",
        "voices": {
            "teacher": "broccoli_teacher_ar.mp3",
            "boy": "broccoli_boy_ar.mp3",
            "girl": "broccoli_girl_ar.mp3",
            "child": "broccoli_child_ar.mp3",
        },
        "letter": {"ar": "ب", "en": "B", "he": "ב"},
        "sora_prompt": "A short video of broccoli florets being steamed and served on a plate.",
        "benefits": {"ar": "يقوي المناعة، مضاد للسرطان", "en": "Boosts immunity, anti-cancer", "he": "מחזק חסינות, אנטי סרטני"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "كرنب بروكسل", "en": "Brussels Sprouts", "he": "כרוב ניצנים"},
        "description": {
            "ar": "كرنب بروكسل هي براعم صغيرة تشبه الملفوف، غنية بالفيتامينات والمعادن.",
            "en": "Brussels sprouts are small cabbage-like buds, rich in vitamins and minerals.",
            "he": "כרוב ניצנים הם ניצנים קטנים דמויי כרוב, עשירים בויטמינים ומינרלים.",
        },
        "image": "brussels_sprouts_image.png",
        "sound_base": "brussels_sprouts_teacher_ar.mp3",
        "voices": {
            "teacher": "brussels_sprouts_teacher_ar.mp3",
            "boy": "brussels_sprouts_boy_ar.mp3",
            "girl": "brussels_sprouts_girl_ar.mp3",
            "child": "brussels_sprouts_child_ar.mp3",
        },
        "letter": {"ar": "ك", "en": "B", "he": "כ"},
        "sora_prompt": "A short video of roasted brussels sprouts on a baking sheet.",
        "benefits": {"ar": "غني بفيتامين ك، يدعم صحة العظام", "en": "Rich in Vitamin K, supports bone health", "he": "עשير בויטמין K, תומך בבריאות העצם"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "ملفوف", "en": "Cabbage", "he": "כרוב"},
        "description": {
            "ar": "الملفوف خضروات ورقية مستديرة، تستخدم في السلطات والمحاشي.",
            "en": "Cabbage is a round leafy vegetable, used in salads and stuffed dishes.",
            "he": "כרוב הוא ירק עלים עגול, המשמש בסלטים וממולאים.",
        },
        "image": "cabbage_image.png",
        "sound_base": "cabbage_teacher_ar.mp3",
        "voices": {
            "teacher": "cabbage_teacher_ar.mp3",
            "boy": "cabbage_boy_ar.mp3",
            "girl": "cabbage_girl_ar.mp3",
            "child": "cabbage_child_ar.mp3",
        },
        "letter": {"ar": "م", "en": "C", "he": "כ"},
        "sora_prompt": "A short video of a whole cabbage being chopped for a salad.",
        "benefits": {"ar": "مضاد للالتهابات، غني بفيتامين ج", "en": "Anti-inflammatory, rich in Vitamin C", "he": "אנטי דלקתי, עשיר בויטמין C"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "جزر", "en": "Carrot", "he": "גזר"},
        "description": {
            "ar": "الجزر خضروات جذرية مقرمشة ولذيذة، غنية بفيتامين أ ومفيدة للنظر.",
            "en": "Carrots are crunchy and delicious root vegetables, rich in Vitamin A and good for eyesight.",
            "he": "גזר הוא ירק שורש פריך וטעים, עשיר בויטמין A וטוב לראייה.",
        },
        "image": "carrot_image.png",
        "sound_base": "carrot_teacher_ar.mp3",
        "voices": {
            "teacher": "carrot_teacher_ar.mp3",
            "boy": "carrot_boy_ar.mp3",
            "girl": "carrot_girl_ar.mp3",
            "child": "carrot_child_ar.mp3",
        },
        "letter": {"ar": "ج", "en": "C", "he": "ג"},
        "sora_prompt": "A short video of a carrot growing from the ground, then being picked and eaten happily by a child.",
        "benefits": {"ar": "غني بفيتامين أ، مفيد للنظر", "en": "Rich in Vitamin A, good for eyesight", "he": "עשير בויטמין A, טוב לראייה"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "قرنبيط", "en": "Cauliflower", "he": "כרובית"},
        "description": {
            "ar": "القرنبيط خضروات بيضاء تشبه الزهرة، متعددة الاستخدامات في الطهي.",
            "en": "Cauliflower is a white, flower-like vegetable, versatile in cooking.",
            "he": "כרובית היא ירק לבן דמוי פרח, רב שימושי בבישול.",
        },
        "image": "cauliflower_image.png",
        "sound_base": "cauliflower_teacher_ar.mp3",
        "voices": {
            "teacher": "cauliflower_teacher_ar.mp3",
            "boy": "cauliflower_boy_ar.mp3",
            "girl": "cauliflower_girl_ar.mp3",
            "child": "cauliflower_child_ar.mp3",
        },
        "letter": {"ar": "ق", "en": "C", "he": "כ"},
        "sora_prompt": "A short video of cauliflower florets being roasted until golden.",
        "benefits": {"ar": "غني بفيتامين ج، يدعم الهضم", "en": "Rich in Vitamin C, supports digestion", "he": "עשير בויטמין C, תומך בעיכול"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "كرفس", "en": "Celery", "he": "סלרי"},
        "description": {
            "ar": "الكرفس خضروات مقرمشة ذات سيقان طويلة، تستخدم في السلطات والشوربات.",
            "en": "Celery is a crunchy vegetable with long stalks, used in salads and soups.",
            "he": "סלרי הוא ירק פריך עם גבעולים ארוכים, המשמש בסלטים ומרקים.",
        },
        "image": "celery_image.png",
        "sound_base": "celery_teacher_ar.mp3",
        "voices": {
            "teacher": "celery_teacher_ar.mp3",
            "boy": "celery_boy_ar.mp3",
            "girl": "celery_girl_ar.mp3",
            "child": "celery_child_ar.mp3",
        },
        "letter": {"ar": "ك", "en": "C", "he": "ס"},
        "sora_prompt": "A short video of celery stalks being chopped for a vegetable platter.",
        "benefits": {"ar": "مرطب، غني بمضادات الأكسدة", "en": "Hydrating, rich in antioxidants", "he": "מלחח, עשير בנוגדי חמצון"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "ذرة", "en": "Corn", "he": "תירس"},
        "description": {
            "ar": "الذرة حبوب حلوة ولذيذة تنمو على كوز، تستخدم في العديد من الأطباق.",
            "en": "Corn is a sweet and delicious grain that grows on a cob, used in many dishes.",
            "he": "תירס הוא דגן מתוק וטעים שגדל על קלח, המשמש במנות רבות.",
        },
        "image": "corn_image.png",
        "sound_base": "corn_teacher_ar.mp3",
        "voices": {
            "teacher": "corn_teacher_ar.mp3",
            "boy": "corn_boy_ar.mp3",
            "girl": "corn_girl_ar.mp3",
            "child": "corn_child_ar.mp3",
        },
        "letter": {"ar": "ذ", "en": "C", "he": "ת"},
        "sora_prompt": "A short video of corn on the cob being grilled and buttered.",
        "benefits": {"ar": "مصدر للطاقة، غني بالألياف", "en": "Energy source, rich in fiber", "he": "מקור לאנרגיה, עשיר בסיבים תזונתיים"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "خيار", "en": "Cucumber", "he": "מלפפון"},
        "description": {
            "ar": "الخيار خضروات منعشة ومائية، تستخدم في السلطات والسندويتشات.",
            "en": "Cucumber is a refreshing and watery vegetable, used in salads and sandwiches.",
            "he": "מלפפון هو ירק מרענן ומימי, המשמש בסלטים וכריכים.",
        },
        "image": "cucumber_image.png",
        "sound_base": "cucumber_teacher_ar.mp3",
        "voices": {
            "teacher": "cucumber_teacher_ar.mp3",
            "boy": "cucumber_boy_ar.mp3",
            "girl": "cucumber_girl_ar.mp3",
            "child": "cucumber_child_ar.mp3",
        },
        "letter": {"ar": "خ", "en": "C", "he": "מ"},
        "sora_prompt": "A short video of a cucumber being sliced for a refreshing drink.",
        "benefits": {"ar": "مرطب للجسم، يساعد على الهضم", "en": "Hydrating, aids digestion", "he": "מלחח את הגוף, עוזר לעיכול"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "باذنجان", "en": "Eggplant", "he": "חציל"},
        "description": {
            "ar": "الباذنجان خضروات بنفسجية اللون، ذات قوام إسفنجي وطعم مميز بعد الطهي.",
            "en": "Eggplant is a purple vegetable with a spongy texture and a distinctive taste after cooking.",
            "he": "חציל הוא ירק סגול בעל מרקם ספוגי וטעם ייחודי לאחר בישול.",
        },
        "image": "eggplant_image.png",
        "sound_base": "eggplant_teacher_ar.mp3",
        "voices": {
            "teacher": "eggplant_teacher_ar.mp3",
            "boy": "eggplant_boy_ar.mp3",
            "girl": "eggplant_girl_ar.mp3",
            "child": "eggplant_child_ar.mp3",
        },
        "letter": {"ar": "ب", "en": "E", "he": "ח"},
        "sora_prompt": "A short video of eggplant slices being grilled and seasoned.",
        "benefits": {"ar": "غني بالألياف ومضادات الأكسدة", "en": "Rich in fiber and antioxidants", "he": "עשير בסיבים תזונתיים ונוגדי חמצון"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "ثوم", "en": "Garlic", "he": "שום"},
        "description": {
            "ar": "الثوم نبات ذو رائحة قوية ونكهة مميزة، يستخدم كتوابل في الطهي.",
            "en": "Garlic is a plant with a strong aroma and distinctive flavor, used as a spice in cooking.",
            "he": "שום הוא צמח בעל ריח חזק וטעם ייחודי, המשמש כתבלין בבישול.",
        },
        "image": "garlic_image.png",
        "sound_base": "garlic_teacher_ar.mp3",
        "voices": {
            "teacher": "garlic_teacher_ar.mp3",
            "boy": "garlic_boy_ar.mp3",
            "girl": "garlic_girl_ar.mp3",
            "child": "garlic_child_ar.mp3",
        },
        "letter": {"ar": "ث", "en": "G", "he": "ש"},
        "sora_prompt": "A short video of garlic cloves being peeled and minced.",
        "benefits": {"ar": "مضاد للبكتيريا، يعزز المناعة", "en": "Antibacterial, boosts immunity", "he": "אנטיבקטריאלי, מחזק חסינות"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "فاصوليا خضراء", "en": "Green Bean", "he": "שעועית ירוקה"},
        "description": {
            "ar": "الفاصوليا الخضراء هي قرون طويلة ورفيعة، تؤكل كاملة بعد الطهي.",
            "en": "Green beans are long, slender pods, eaten whole after cooking.",
            "he": "שעועית ירוקה היא תרמילים ארוכים ודקים, הנאכלים בשלמותם לאחר בישול.",
        },
        "image": "green_bean_image.png",
        "sound_base": "green_bean_teacher_ar.mp3",
        "voices": {
            "teacher": "green_bean_teacher_ar.mp3",
            "boy": "green_bean_boy_ar.mp3",
            "girl": "green_bean_girl_ar.mp3",
            "child": "green_bean_child_ar.mp3",
        },
        "letter": {"ar": "ف", "en": "G", "he": "ש"},
        "sora_prompt": "A short video of green beans being steamed and served as a side dish.",
        "benefits": {"ar": "غنية بالفيتامينات K و C", "en": "Rich in Vitamins K and C", "he": "עשירה בויטמינים K ו-C"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "لفت", "en": "Kale", "he": "קייל"},
        "description": {
            "ar": "اللفت خضروات ورقية خضراء داكنة، تعتبر من الأطعمة الفائقة لغناها بالعناصر الغذائية.",
            "en": "Kale is a dark green leafy vegetable, considered a superfood due to its rich nutrients.",
            "he": "קייל הוא ירק עלים ירוק כהה, הנחשב למזון על בשל עושרו התזונתי.",
        },
        "image": "kale_image.png",
        "sound_base": "kale_teacher_ar.mp3",
        "voices": {
            "teacher": "kale_teacher_ar.mp3",
            "boy": "kale_boy_ar.mp3",
            "girl": "kale_girl_ar.mp3",
            "child": "kale_child_ar.mp3",
        },
        "letter": {"ar": "ل", "en": "K", "he": "ק"},
        "sora_prompt": "A short video of kale leaves being massaged with olive oil for a salad.",
        "benefits": {"ar": "غني بفيتامين K و C، مضاد للالتهابات", "en": "Rich in Vitamins K and C, anti-inflammatory", "he": "עשיר בויטמינים K ו-C, אנטי דלקתי"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "كراث", "en": "Leek", "he": "כרשה"},
        "description": {
            "ar": "الكراث نبات يشبه البصل الأخضر الكبير، ذو طعم خفيف وحلو.",
            "en": "Leek is a plant resembling a large green onion, with a mild and sweet flavor.",
            "he": "כרשה היא צמח הדומה לבצל ירוק גדול, בעל טעם עדין ומתוק.",
        },
        "image": "leek_image.png",
        "sound_base": "leek_teacher_ar.mp3",
        "voices": {
            "teacher": "leek_teacher_ar.mp3",
            "boy": "leek_boy_ar.mp3",
            "girl": "leek_girl_ar.mp3",
            "child": "leek_child_ar.mp3",
        },
        "letter": {"ar": "ك", "en": "L", "he": "כ"},
        "sora_prompt": "A short video of leeks being cleaned and sliced for a soup.",
        "benefits": {"ar": "غني بالفيتامينات A و K", "en": "Rich in Vitamins A and K", "he": "עשير בויטמינים A ו-K"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "خس", "en": "Lettuce", "he": "חסה"},
        "description": {
            "ar": "الخس خضروات ورقية خضراء، أساسية في تحضير السلطات.",
            "en": "Lettuce is a green leafy vegetable, essential for preparing salads.",
            "he": "חסה هي ירק עלים ירוק, חיונית להכנת סלטים.",
        },
        "image": "lettuce_image.png",
        "sound_base": "lettuce_teacher_ar.mp3",
        "voices": {
            "teacher": "lettuce_teacher_ar.mp3",
            "boy": "lettuce_boy_ar.mp3",
            "girl": "lettuce_girl_ar.mp3",
            "child": "lettuce_child_ar.mp3",
        },
        "letter": {"ar": "خ", "en": "L", "he": "ח"},
        "sora_prompt": "A short video of fresh lettuce leaves being washed and torn for a salad.",
        "benefits": {"ar": "مرطب، غني بفيتامين K", "en": "Hydrating, rich in Vitamin K", "he": "מלחח, עשير בויטמין K"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "فطر", "en": "Mushroom", "he": "פטריות"},
        "description": {
            "ar": "الفطر هو نوع من الفطريات الصالحة للأكل، يستخدم في العديد من الأطباق لنكهته الفريدة.",
            "en": "Mushroom is an edible type of fungus, used in many dishes for its unique flavor.",
            "he": "פטריות הן סוג של פטריות אכילות, המשמשות במנות רבות בשל טעמן הייחודי.",
        },
        "image": "mushroom_image.png",
        "sound_base": "mushroom_teacher_ar.mp3",
        "voices": {
            "teacher": "mushroom_teacher_ar.mp3",
            "boy": "mushroom_boy_ar.mp3",
            "girl": "mushroom_girl_ar.mp3",
            "child": "mushroom_child_ar.mp3",
        },
        "letter": {"ar": "ف", "en": "M", "he": "פ"},
        "sora_prompt": "A short video of various mushrooms growing in a forest, then being sautéed.",
        "benefits": {"ar": "مصدر لفيتامين د، يقوي المناعة", "en": "Source of Vitamin D, boosts immunity", "he": "מקור לויטמין D, מחזק חסינות"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "بصل", "en": "Onion", "he": "בצל"},
        "description": {
            "ar": "البصل خضروات ذات طبقات، تستخدم لإضافة نكهة قوية للعديد من الأطباق.",
            "en": "Onion is a layered vegetable, used to add a strong flavor to many dishes.",
            "he": "בצל הוא ירק שכבות, המשמש להוספת טעם חזק למנות רבות.",
        },
        "image": "onion_image.png",
        "sound_base": "onion_teacher_ar.mp3",
        "voices": {
            "teacher": "onion_teacher_ar.mp3",
            "boy": "onion_boy_ar.mp3",
            "girl": "onion_girl_ar.mp3",
            "child": "onion_child_ar.mp3",
        },
        "letter": {"ar": "ب", "en": "O", "he": "ב"},
        "sora_prompt": "A short video of an onion being peeled and chopped, with tears in eyes.",
        "benefits": {"ar": "مضاد للالتهابات، غني بفيتامين ج", "en": "Anti-inflammatory, rich in Vitamin C", "he": "אנטי דלקתי, עשיר בויטמין C"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "بازلاء", "en": "Pea", "he": "אפונה"},
        "description": {
            "ar": "البازلاء هي حبوب خضراء صغيرة حلوة، تنمو داخل قرون.",
            "en": "Peas are small, sweet green seeds that grow inside pods.",
            "he": "אפונה هي זרעים ירוקים קטנים ומתוקים, הגדלים בתוך תרמילים.",
        },
        "image": "pea_image.png",
        "sound_base": "pea_teacher_ar.mp3",
        "voices": {
            "teacher": "pea_teacher_ar.mp3",
            "boy": "pea_boy_ar.mp3",
            "girl": "pea_girl_ar.mp3",
            "child": "pea_child_ar.mp3",
        },
        "letter": {"ar": "ب", "en": "P", "he": "א"},
        "sora_prompt": "A short video of fresh peas being shelled from their pods.",
        "benefits": {"ar": "غنية بالبروتين والألياف", "en": "Rich in protein and fiber", "he": "עשירה בחלבון וסיבים תזונתיים"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "فلفل", "en": "Pepper", "he": "פלפל"},
        "description": {
            "ar": "الفلفل خضروات ملونة، يمكن أن تكون حلوة أو حارة، وتستخدم في العديد من الأطباق.",
            "en": "Pepper is a colorful vegetable, can be sweet or spicy, used in many dishes.",
            "he": "פלפל הוא ירק צבעוני, יכול להיות מתוק או חריף, ומשמש במנות רבות.",
        },
        "image": "pepper_image.png",
        "sound_base": "pepper_teacher_ar.mp3",
        "voices": {
            "teacher": "pepper_teacher_ar.mp3",
            "boy": "pepper_boy_ar.mp3",
            "girl": "pepper_girl_ar.mp3",
            "child": "pepper_child_ar.mp3",
        },
        "letter": {"ar": "ف", "en": "P", "he": "פ"},
        "sora_prompt": "A short video of colorful bell peppers being sliced for a stir-fry.",
        "benefits": {"ar": "غني بفيتامين ج، مضاد للأكسدة", "en": "Rich in Vitamin C, antioxidant", "he": "עשיר בויטמין C, נוגד חמצון"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "بطاطا", "en": "Potato", "he": "תפוח אדמה"},
        "description": {
            "ar": "البطاطا خضروات جذرية نشوية، تستخدم على نطاق واسع في الطهي.",
            "en": "Potato is a starchy root vegetable, widely used in cooking.",
            "he": "תפוח אדמה הוא ירק שורש עמילני, בשימוש נרחב בבישול.",
        },
        "image": "potato_image.png",
        "sound_base": "potato_teacher_ar.mp3",
        "voices": {
            "teacher": "potato_teacher_ar.mp3",
            "boy": "potato_boy_ar.mp3",
            "girl": "potato_girl_ar.mp3",
            "child": "potato_child_ar.mp3",
        },
        "letter": {"ar": "ب", "en": "P", "he": "ת"},
        "sora_prompt": "A short video of potatoes being dug from the ground, then mashed.",
        "benefits": {"ar": "مصدر للطاقة، غنية بالبوتاسيوم", "en": "Energy source, rich in potassium", "he": "מקור לאנרגיה, עשير באשלגן"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "يقطين", "en": "Pumpkin", "he": "דלעת"},
        "description": {
            "ar": "اليقطين فاكهة كبيرة برتقالية اللون تستخدم كخضروات، تشتهر في الخريف.",
            "en": "Pumpkin is a large orange fruit used as a vegetable, popular in autumn.",
            "he": "דלעת היא פרי גדול כתום המשמש כירק, פופולרי בסתיו.",
        },
        "image": "pumpkin_image.png",
        "sound_base": "pumpkin_teacher_ar.mp3",
        "voices": {
            "teacher": "pumpkin_teacher_ar.mp3",
            "boy": "pumpkin_boy_ar.mp3",
            "girl": "pumpkin_girl_ar.mp3",
            "child": "pumpkin_child_ar.mp3",
        },
        "letter": {"ar": "ي", "en": "P", "he": "ד"},
        "sora_prompt": "A short video of a pumpkin being carved for Halloween, then used in a soup.",
        "benefits": {"ar": "غني بفيتامين أ، يدعم صحة العين", "en": "Rich in Vitamin A, supports eye health", "he": "עשير בויטמין A, תומך בבריאות העין"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "فجل", "en": "Radish", "he": "צנון"},
        "description": {
            "ar": "الفجل خضروات جذرية صغيرة وحارة، غالبًا ما تستخدم في السلطات.",
            "en": "Radish is a small, spicy root vegetable, often used in salads.",
            "he": "צנון هو ירק שורש קטן וחריף, המשמש לרוב בסלטים.",
        },
        "image": "radish_image.png",
        "sound_base": "radish_teacher_ar.mp3",
        "voices": {
            "teacher": "radish_teacher_ar.mp3",
            "boy": "radish_boy_ar.mp3",
            "girl": "radish_girl_ar.mp3",
            "child": "radish_child_ar.mp3",
        },
        "letter": {"ar": "ف", "en": "R", "he": "צ"},
        "sora_prompt": "A short video of radishes being washed and sliced for a fresh salad.",
        "benefits": {"ar": "منظف للجسم، غني بفيتامين ج", "en": "Body cleanser, rich in Vitamin C", "he": "מטהר גוף, עשير בויטמין C"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "سبانخ", "en": "Spinach", "he": "תרד"},
        "description": {
            "ar": "السبانخ خضروات ورقية خضراء داكنة، غنية بالحديد والفيتامينات.",
            "en": "Spinach is a dark green leafy vegetable, rich in iron and vitamins.",
            "he": "תרד هو ירק עלים ירוק כהה, עשיר בברזל ובוויטמינים.",
        },
        "image": "spinach_image.png",
        "sound_base": "spinach_teacher_ar.mp3",
        "voices": {
            "teacher": "spinach_teacher_ar.mp3",
            "boy": "spinach_boy_ar.mp3",
            "girl": "spinach_girl_ar.mp3",
            "child": "spinach_child_ar.mp3",
        },
        "letter": {"ar": "س", "en": "S", "he": "ת"},
        "sora_prompt": "A short video of fresh spinach leaves being sautéed in a pan.",
        "benefits": {"ar": "غني بالحديد، يقوي العظام", "en": "Rich in iron, strengthens bones", "he": "עשير בברזל, מחזק עצמות"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "بطاطا حلوة", "en": "Sweet Potato", "he": "בטטה"},
        "description": {
            "ar": "البطاطا الحلوة خضروات جذرية حلوة المذاق، غنية بالألياف والفيتامينات.",
            "en": "Sweet potato is a sweet-tasting root vegetable, rich in fiber and vitamins.",
            "he": "בטטה هي ירק שורש מתוק, עשיר בסיבים תזונתיים ובוויטמינים.",
        },
        "image": "sweet_potato_image.png",
        "sound_base": "sweet_potato_teacher_ar.mp3",
        "voices": {
            "teacher": "sweet_potato_teacher_ar.mp3",
            "boy": "sweet_potato_boy_ar.mp3",
            "girl": "sweet_potato_girl_ar.mp3",
            "child": "sweet_potato_child_ar.mp3",
        },
        "letter": {"ar": "ب", "en": "S", "he": "ב"},
        "sora_prompt": "A short video of sweet potatoes being roasted with herbs.",
        "benefits": {"ar": "مصدر جيد لفيتامين أ، مضاد للالتهابات", "en": "Good source of Vitamin A, anti-inflammatory", "he": "מקור טוב לויטמין A, אנטי דלקתי"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "طماطم", "en": "Tomato", "he": "עגבנייה"},
        "description": {
            "ar": "الطماطم فاكهة تستخدم كخضروات في الطهي، وهي حمراء ومليئة بالعصارة.",
            "en": "Tomatoes are fruits used as vegetables in cooking, they are red and juicy.",
            "he": "עגבניות הן פירות המשמשים כירקות בבישול, הן אדומות ועסיסיות.",
        },
        "image": "tomato_image.png",
        "sound_base": "tomato_teacher_ar.mp3",
        "voices": {
            "teacher": "tomato_teacher_ar.mp3",
            "boy": "tomato_boy_ar.mp3",
            "girl": "tomato_girl_ar.mp3",
            "child": "tomato_child_ar.mp3",
        },
        "letter": {"ar": "ط", "en": "T", "he": "ע"},
        "sora_prompt": "A close-up video of a red tomato ripening on the vine, then being sliced for a salad.",
        "benefits": {"ar": "مصدر جيد لفيتامين ج، مضادات أكسدة", "en": "Good source of Vitamin C, antioxidants", "he": "מקור טוב לויטמין C, נוגدي חמצון"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "لفت", "en": "Turnip", "he": "לפת"},
        "description": {
            "ar": "اللفت خضروات جذرية بيضاء أو بنفسجية، ذات طعم مر قليلاً.",
            "en": "Turnip is a white or purple root vegetable, with a slightly bitter taste.",
            "he": "לפת هي ירק שורש לבן או סגול, בעל טעם מעט מריר.",
        },
        "image": "turnip_image.png",
        "sound_base": "turnip_teacher_ar.mp3",
        "voices": {
            "teacher": "turnip_teacher_ar.mp3",
            "boy": "turnip_boy_ar.mp3",
            "girl": "turnip_girl_ar.mp3",
            "child": "turnip_child_ar.mp3",
        },
        "letter": {"ar": "ل", "en": "T", "he": "ל"},
        "sora_prompt": "A short video of turnips being harvested and cleaned.",
        "benefits": {"ar": "غني بفيتامين ج، يدعم الهضم", "en": "Rich in Vitamin C, aids digestion", "he": "عشير بويטמין C, תומך בעיכול"},
    },
    {
        "category": "vegetables",
        "name": {"ar": "كوسة", "en": "Zucchini", "he": "קישוא"},
        "description": {
            "ar": "الكوسة خضروات صيفية خضراء، تستخدم في الشوربات والسلطات واليخنات.",
            "en": "Zucchini is a green summer vegetable, used in soups, salads, and stews.",
            "he": "קישוא هو ירק קיץ ירוק, המשמש במרקים, סלטים ותבשילים.",
        },
        "image": "zucchini_image.png",
        "sound_base": "zucchini_teacher_ar.mp3",
        "voices": {
            "teacher": "zucchini_teacher_ar.mp3",
            "boy": "zucchini_boy_ar.mp3",
            "girl": "zucchini_girl_ar.mp3",
            "child": "zucchini_child_ar.mp3",
        },
        "letter": {"ar": "ك", "en": "Z", "he": "ק"},
        "sora_prompt": "A short video of zucchini being sliced into spirals for a healthy meal.",
        "benefits": {"ar": "مرطب، غني بمضادات الأكسدة", "en": "Hydrating, rich in antioxidants", "he": "מלחח, עשיר בנוגדי חמצון"},
    },
]

# Collection path where the vegetable data will be added
VEGETABLES_COLLECTION_PATH = "categories/vegetables/items"

def seed_vegetables():
    print(f"Seeding data into {VEGETABLES_COLLECTION_PATH}...")
    collection_ref = db.collection(VEGETABLES_COLLECTION_PATH)

    for vegetable_doc in VEGETABLES_DATA_FOR_FIRESTORE:
        # Use the English name (slugified) as the document ID for consistency
        doc_id = vegetable_doc["name"]["en"].replace(" ", "_").lower()
        doc_ref = collection_ref.document(doc_id)

        try:
            doc_ref.set(vegetable_doc)
            print(f"Successfully added/updated document for: {vegetable_doc['name']['en']}")
        except Exception as e:
            print(f"Error adding/updating document for {vegetable_doc['name']['en']}: {e}")

if __name__ == "__main__":
    seed_vegetables()