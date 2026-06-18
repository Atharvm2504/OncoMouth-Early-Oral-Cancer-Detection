import torch
import numpy as np
import cv2
import albumentations as A
from app.config.settings import settings

class ImageTransforms:
    def __init__(self):
        self.resize_transform = A.Compose([
            A.Resize(settings.img_size, settings.img_size)
        ])
        
        self.mean = torch.tensor(settings.imagenet_mean).view(3, 1, 1)
        self.std = torch.tensor(settings.imagenet_std).view(3, 1, 1)

    def preprocess(self, img_rgb: np.ndarray) -> torch.Tensor:
        """
        Resizes the image, converts to tensor [0, 1], and applies ImageNet normalization.
        Expects a normalized RGB image from Macenko.
        """
        # Resize
        resized = self.resize_transform(image=img_rgb)['image']
        
        # Convert to tensor [0, 1] -> (C, H, W)
        tensor_img = torch.from_numpy(resized).permute(2, 0, 1).float() / 255.0
        
        # ImageNet normalization
        normalized_tensor = (tensor_img - self.mean) / self.std
        
        # Add batch dimension
        return normalized_tensor.unsqueeze(0)
