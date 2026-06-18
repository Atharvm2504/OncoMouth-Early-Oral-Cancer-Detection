# ADR-002: Offline vs. Runtime Macenko Normalization

## Context
Histopathology slides suffer from massive color variance due to different staining protocols, chemical batches, and scanner profiles. AI models easily learn these "domain shortcuts" rather than actual biology.

## Decision
We implemented **Macenko Normalization** both *offline* during training and *at runtime* during inference.

## Rationale
1. **Preventing Data Leakage:** If we don't normalize, a model might learn that "darker purple slides always mean cancer" just because the cancer dataset came from a lab that stains darker. 
2. **Training/Inference Parity:** By running Macenko dynamically in the FastAPI pipeline, we guarantee that the incoming clinical image mathematically matches the exact color distribution of the training set.

## Consequences
- **Positive:** Total elimination of domain shortcuts. The model generalizes to new clinics.
- **Negative:** Adds ~50-80ms of latency per API request due to SVD (Singular Value Decomposition) calculations on the CPU.
