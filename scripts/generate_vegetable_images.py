# scripts/generate_vegetable_images.py
import os
import base64
import requests

# Set your API key directly for development, but use environment variables in production
# STABILITY_API_KEY = os.getenv("STABILITY_API_KEY")
STABILITY_API_KEY = "YOUR_STABILITY_API_KEY" # Replace with your actual API key

STABILITY_IMAGE_MODEL_ID = "stable-diffusion-xl-1024-v1-0" # Or other suitable model

OUTPUT_DIR = "../public/images/vegetables"
os.makedirs(OUTPUT_DIR, exist_ok=True)

# List of vegetables (English names for prompts)
VEGETABLES_DATA = [
    "artichoke",
    "asparagus",
    "beet",
    "broccoli",
    "brussels sprouts",
    "cabbage",
    "carrot",
    "cauliflower",
    "celery",
    "corn",
    "cucumber",
    "eggplant",
    "garlic",
    "green bean",
    "kale",
    "leek",
    "lettuce",
    "mushroom",
    "onion",
    "pea",
    "pepper",
    "potato",
    "pumpkin",
    "radish",
    "spinach",
    "sweet potato",
    "tomato",
    "turnip",
    "zucchini",
]

def generate_image(vegetable_name):
    print(f"Generating image for: {vegetable_name}")
    prompt_text = f"A vibrant, clear, cartoon-style illustration of a {vegetable_name}. Show one whole {vegetable_name} next to a perfectly cut half. The background is simple and clean. Bright colors, suitable for children's encyclopedia."

    response = requests.post(
        f"https://api.stability.ai/v1/generation/{STABILITY_IMAGE_MODEL_ID}/text-to-image",
        headers={
            "Content-Type": "application/json",
            "Accept": "application/json",
            "Authorization": f"Bearer {STABILITY_API_KEY}"
        },
        json={
            "text_prompts": [
                {"text": prompt_text}
            ],
            "cfg_scale": 7,
            "height": 1024,
            "width": 1024,
            "samples": 1,
            "steps": 30,
        },
    )

    if response.status_code != 200:
        print(f"Error generating image for {vegetable_name}: {response.status_code} - {response.text}")
        if response.status_code == 400:
            print("Possible reasons: unsupported dimensions (try 1024x1024 for SDXL 1.0) or malformed payload.")
        elif response.status_code == 402:
            print("Credit/Plan limit reached. Consider a new API key or upgrading your plan.")
        return

    data = response.json()
    for i, image in enumerate(data["artifacts"]):
        file_path = os.path.join(OUTPUT_DIR, f"{vegetable_name.replace(' ', '_')}_image.png")
        with open(file_path, "wb") as f:
            f.write(base64.b64decode(image["base64"]))
        print(f"Saved image to: {file_path}")

def main():
    for vegetable in VEGETABLES_DATA:
        generate_image(vegetable)

if __name__ == "__main__":
    main()