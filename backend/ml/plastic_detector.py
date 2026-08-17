from transformers import CLIPProcessor, CLIPModel
from PIL import Image

model = CLIPModel.from_pretrained(
    "openai/clip-vit-base-patch32"
)

processor = CLIPProcessor.from_pretrained(
    "openai/clip-vit-base-patch32"
)


def detect_plastic(image):

    labels = [
        "a plastic bottle",
        "a plastic bag",
        "a plastic container",
        "plastic waste",
        "non plastic waste"
    ]

    inputs = processor(
        text=labels,
        images=image,
        return_tensors="pt",
        padding=True
    )

    outputs = model(**inputs)

    probabilities = outputs.logits_per_image.softmax(
        dim=1
    )[0]

    index = probabilities.argmax().item()

    prediction = labels[index]
    confidence = probabilities[index].item()

    points = 0

    if prediction == "a plastic bottle":
        points = 10

    elif prediction == "a plastic bag":
        points = 5

    elif prediction == "a plastic container":
        points = 15

    elif prediction == "plastic waste":
        points = 10

    return {
        "prediction": prediction,
        "confidence": round(confidence * 100, 2),
        "points": points
    }