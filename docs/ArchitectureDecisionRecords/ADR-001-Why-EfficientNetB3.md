# ADR-001: Model Selection - EfficientNet-B3

## Context
Oral cancer histopathology analysis requires identifying subtle cellular morphologies (e.g., nuclear pleomorphism, hyperchromasia) across 224x224 patches. We needed a model that balanced feature extraction depth with computational efficiency for real-time API inference.

## Decision
We selected **EfficientNet-B3** pre-trained on ImageNet.

## Rationale
1. **Compound Scaling:** EfficientNet scales width, depth, and resolution uniformly, extracting complex features without the exponential parameter bloat of ResNet-152 or VGG-19.
2. **Computational Constraints:** B3 operates at ~12 million parameters, allowing sub-200ms inference times on CPU, drastically reducing our cloud deployment costs for V1 compared to Vision Transformers (ViTs).
3. **Accuracy Trade-off:** ViTs require massive datasets to surpass CNNs. Given our strict single-source NDB-UFES dataset constraint (to prevent domain shortcuts), the inductive bias of CNNs (translation invariance) was required to avoid overfitting.

## Consequences
- **Positive:** Fast inference, low memory footprint, high accuracy (83.57%).
- **Negative:** Lower performance on global spatial relationships compared to ViTs, which we mitigate by analyzing at the patch level.
