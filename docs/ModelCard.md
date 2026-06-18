# OncoMouth Model Card

## Model Details
* **Name:** OncoMouth EfficientNet-B3
* **Version:** 1.0.0
* **Architecture:** EfficientNet-B3 (PyTorch)
* **Task:** Image Classification (3-class: Cancer, PreCancer, Normal)
* **Date:** October 2023

## Intended Use
* **Primary Use Case:** Research and clinical decision support for screening Oral Squamous Cell Carcinoma (OSCC) from H&E stained tissue patches.
* **Out of Scope:** Whole Slide Image (WSI) macroscopic diagnosis, non-H&E stains.

## Training Data
* **Dataset:** NDB-UFES (Single-Source to prevent domain shift shortcuts).
* **Patch Size:** 224x224 pixels.
* **Preprocessing:** Strict Macenko Normalization to standardize Hematoxylin and Eosin stain vectors.

## Evaluation Results
* **Accuracy:** 83.57%
* **Macro F1:** 82.90%
* **Cancer Recall:** 90.37% (Prioritizing low false-negative rate for safety).
* **Calibration:** Expected Calibration Error (ECE) = 0.0346 (via Temperature Scaling).

## Limitations
The model is trained entirely on a single demographic and scanner source. While Macenko normalization mitigates stain variance, structural artifacts from different cutting protocols may reduce accuracy in uncalibrated clinical environments.
