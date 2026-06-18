import numpy as np
import cv2
from app.config.settings import settings
from app.logs.logger import logger

class MacenkoNormalizer:
    """Runtime Macenko stain normalization for H&E histopathology images."""

    def __init__(self):
        # Target H&E stain matrix (reference values from config)
        self.target_stains = np.array(settings.target_stains)
        self.target_concentrations = np.array(settings.target_concentrations)

    def normalize(self, img: np.ndarray) -> np.ndarray:
        """
        Normalize a single RGB image.
        Input: RGB uint8 image (H, W, 3)
        Output: Normalized RGB uint8 image
        """
        try:
            # Convert to float [0, 1]
            img_f = img.astype(np.float32) / 255.0
            h, w, c = img_f.shape
            img_2d = img_f.reshape(-1, 3)

            # Convert RGB to optical density (OD)
            od = -np.log(img_2d + 1e-6)

            # Remove background (low OD pixels)
            od_hat = od[~np.any(od < 0.15, axis=1)]

            if len(od_hat) < 2:
                logger.warning("Not enough tissue found for Macenko normalization.")
                return img

            # Compute eigenvectors (stain directions)
            _, eigvecs = np.linalg.eigh(np.cov(od_hat.T))
            eigvecs = eigvecs[:, [2, 1]]  # Top 2 eigenvectors

            # Project OD onto stain space
            that = od_hat @ eigvecs
            phi  = np.arctan2(that[:, 1], that[:, 0])

            # Find H and E stain directions
            min_phi, max_phi = np.percentile(phi, [1, 99])
            v_min = eigvecs @ np.array([np.cos(min_phi), np.sin(min_phi)])
            v_max = eigvecs @ np.array([np.cos(max_phi), np.sin(max_phi)])

            # Build stain matrix (H first)
            stain_matrix = (np.column_stack((v_min, v_max))
                           if v_min[0] > v_max[0]
                           else np.column_stack((v_max, v_min)))
            stain_matrix /= np.linalg.norm(stain_matrix, axis=0)

            # Get stain concentrations
            conc = np.linalg.lstsq(stain_matrix, od.T, rcond=None)[0]

            # Normalize to target concentrations
            max_c = np.percentile(conc, 99, axis=1, keepdims=True)
            conc  = conc / (max_c + 1e-6) * self.target_concentrations.T

            # Reconstruct with target stains
            od_norm  = self.target_stains @ conc
            img_norm = np.clip(np.exp(-od_norm.T).reshape(h, w, c), 0, 1)

            return (img_norm * 255).astype(np.uint8)

        except Exception as e:
            logger.error(f"Macenko normalization failed: {str(e)}")
            return img
