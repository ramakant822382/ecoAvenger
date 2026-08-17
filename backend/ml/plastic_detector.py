from transformers import CLIPProcessor, CLIPModel
import torch

MODEL_NAME = "openai/clip-vit-base-patch32"

model = None
processor = None


def load_model():
    global model, processor

    if model is None:
        processor = CLIPProcessor.from_pretrained(MODEL_NAME)

        model = CLIPModel.from_pretrained(
            MODEL_NAME,
            low_cpu_mem_usage=True
        )

        model.eval()

    return model, processor


def detect_plastic(image):

    model, processor = load_model()

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

    with torch.inference_mode():

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