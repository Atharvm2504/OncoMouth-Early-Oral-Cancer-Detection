# OncoMouth Demo Video Script

**Duration:** 2 Minutes
**Target Audience:** Clinical Researchers, AI Engineers, Hiring Managers

## Scene 1: The Clinical Problem (0:00 - 0:30)
*Visual:* Screen recording of the Landing Page.
*Script:* "Oral cancer is one of the most deadly cancers when caught late. However, diagnosing dysplasia from histopathology slides is incredibly difficult. While many AI models claim 100% accuracy, they often cheat by learning scanner artifacts—a problem known as Domain Shift. Welcome to OncoMouth, a platform engineered to eliminate those shortcuts."

## Scene 2: The UI & Validation (0:30 - 0:50)
*Visual:* User clicks 'Prediction Workspace'. Tries to upload an invalid file, sees the strict error. Uploads a valid image.
*Script:* "The OncoMouth prediction workspace is built for clinical trust. Before an image even hits our PyTorch backend, the Next.js frontend strictly validates the file format and resolution to ensure data integrity."

## Scene 3: The Hybrid UX Pipeline (0:50 - 1:20)
*Visual:* Clicks 'Run Prediction'. The pipeline smoothly animates through standard mode, user toggles to Technical mode to see Macenko and Temperature Scaling.
*Script:* "When we run the prediction, our FastAPI backend processes the entire pipeline in under 200 milliseconds. But instead of flashing the result instantly, our Hybrid UX timeline explains the orchestration to the user. You can switch to Technical Mode to see the exact AI architecture at work: from Runtime Macenko Normalization to Probability Calibration."

## Scene 4: Explainability & Results (1:20 - 2:00)
*Visual:* Shows the Results card (Cancer 92.4%). Plays with the GradCAM opacity slider, switches to Tabbed view. Downloads the PDF.
*Script:* "The results are completely transparent. We display the full probability distribution and the Temperature-Scaled calibration status. The signature feature is our interactive GradCAM++ viewer, allowing clinicians to slide the opacity of the heatmap to see exactly which cellular morphology drove the AI's decision. Finally, the clinician can download a fully formatted PDF report containing the required clinical guardrails. This is OncoMouth: robust, explainable, and production-ready."
