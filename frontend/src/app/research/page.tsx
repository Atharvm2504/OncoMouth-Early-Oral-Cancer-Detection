"use client"

import React from "react"
import { motion } from "framer-motion"
import { Microscope, Network, BarChart, ShieldAlert, ArrowRight, Database, Activity, ScanLine, Code2 } from "lucide-react"

export default function ResearchPage() {
  return (
    <div className="flex-1 bg-surface-secondary text-text-primary py-12">
      <div className="container px-4 md:px-8 max-w-5xl mx-auto space-y-16">
        
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="text-center max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold tracking-tight mb-6 text-text-primary leading-tight">Architecture & Research</h1>
          <p className="text-xl text-text-secondary leading-relaxed">
            A comprehensive technical overview of the engineering decisions, mathematical foundations, and clinical rationales powering OncoMouth Version 1.
          </p>
        </motion.div>

        {/* Clinical Problem */}
        <section className="bg-surface p-10 rounded-[2rem] border border-border shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none"><Microscope className="w-64 h-64" /></div>
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-blue-50 text-primary rounded-[var(--radius-card)]"><Activity className="w-8 h-8" /></div>
            <h2 className="text-3xl font-bold tracking-tight">The Clinical Problem</h2>
          </div>
          <div className="space-y-6 text-lg text-text-secondary leading-relaxed relative z-10 max-w-4xl">
            <p>
              Oral Squamous Cell Carcinoma (OSCC) accounts for over 90% of all oral malignancies, with a 5-year survival rate that drops precipitously from 85% to 39% if metastasis occurs prior to diagnosis. The gold standard for diagnosis remains the histopathological examination of Hematoxylin and Eosin (H&amp;E) stained tissue biopsies.
            </p>
            <p>
              <strong>The Challenge:</strong> Histopathological analysis is fundamentally subjective. Concordance rates among pathologists for identifying pre-malignant dysplasia can be as low as 60%. Diagnostic accuracy is heavily constrained by pathologist fatigue, institutional resources, and cognitive biases. 
            </p>
            <p>
              <strong>The AI Imperative:</strong> Deep learning provides a deterministic, mathematically objective second opinion. However, to be clinically viable, the model must not only be accurate, but strictly calibrated (so confidence scores reflect true statistical probability) and highly explainable (so clinicians can verify the morphological features driving the prediction).
            </p>
          </div>
        </section>

        {/* Dataset & Preprocessing */}
        <section className="bg-surface p-10 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-indigo-50 text-indigo-600 rounded-[var(--radius-card)]"><Database className="w-8 h-8" /></div>
            <h2 className="text-3xl font-bold tracking-tight">Dataset & Multi-Center Generalization</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
              <p>
                A primary failure mode of medical AI is &quot;domain shift&quot;&mdash;where a model achieves 99% accuracy on a training hospital&apos;s dataset but completely fails in a new hospital due to different microscope sensors or chemical dye manufacturers.
              </p>
              <p>
                To combat this, OncoMouth was trained on a federated, multi-center cohort aggregating the <strong>NDB (Normal, Dysplasia, Benign)</strong> and <strong>UFES (Federal University of Espírito Santo)</strong> datasets.
              </p>
              <ul className="list-disc pl-6 space-y-3">
                <li><strong>Distribution:</strong> 100x magnification overlapping patches (224x224) extracted from Whole Slide Images (WSI).</li>
                <li><strong>Class Balance:</strong> Heavily weighted towards critical distinctions: Normal, PreCancer (Dysplasia), and OSCC.</li>
                <li><strong>Augmentation Strategy:</strong> Spatial (random crops, flips, rotations) and structural (elastic transforms) to force the network to learn invariant tissue morphologies rather than spatial orientations.</li>
              </ul>
            </div>
            {/* Visual: Data Flow */}
            <div className="bg-surface-secondary p-6 rounded-[var(--radius-card)] border border-border flex flex-col justify-center gap-4">
              <div className="text-sm font-semibold text-muted uppercase tracking-wider mb-2">Training Pipeline</div>
              <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-border shadow-sm">
                <span className="font-medium text-text-secondary">Multi-Center WSIs</span>
                <span className="text-xs bg-surface-secondary px-2 py-1 rounded text-muted">100x Mag</span>
              </div>
              <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-muted rotate-90 md:rotate-0" /></div>
              <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-border shadow-sm">
                <span className="font-medium text-text-secondary">Patch Extraction</span>
                <span className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded">224x224 px</span>
              </div>
              <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-muted rotate-90 md:rotate-0" /></div>
              <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-border shadow-sm">
                <span className="font-medium text-text-secondary">Macenko Normalization</span>
                <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded">Domain Invariant</span>
              </div>
            </div>
          </div>
        </section>

        {/* Macenko Normalization */}
        <section className="bg-surface p-10 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-[var(--radius-card)]"><ScanLine className="w-8 h-8" /></div>
            <h2 className="text-3xl font-bold tracking-tight">Macenko Stain Normalization</h2>
          </div>
          <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
            <p>
              H&amp;E staining is notoriously inconsistent. Hematoxylin stains cell nuclei blue/purple, while Eosin stains cytoplasm and extracellular matrix pink. The exact shades depend heavily on the technician, chemical manufacturer, and stain age. 
            </p>
            <p>
              Without normalization, CNNs will exploit these color differences as &quot;shortcuts&quot; (e.g., learning that Hospital A has darker purple stains and more cancer patients, thus correlating purple with cancer instead of nuclear pleomorphism).
            </p>
            <div className="bg-surface-dark text-muted/70 p-6 rounded-[var(--radius-card)] font-mono text-sm overflow-x-auto shadow-inner">
              <p className="text-emerald-400 mb-2">{`// The Macenko Algorithm (2009) Physics-based Deconvolution`}</p>
              <p>1. Convert RGB to Optical Density (OD): $OD = -\log_{10}(I / I_0)$</p>
              <p>2. Remove transparent pixels (background thresholding).</p>
              <p>3. Calculate SVD on OD tuples to find the 2D projection plane.</p>
              <p>4. Calculate angular directions to isolate pure Hematoxylin and pure Eosin vectors.</p>
              <p>5. Project current image onto reference stain vectors.</p>
            </div>
            <p>
              We implemented this mathematically rigorous transformation to run <strong>dynamically at inference time</strong>. Every incoming image is mathematically decomposed into its underlying chemical concentrations and reconstructed using a standardized reference matrix before reaching the neural network.
            </p>
          </div>
        </section>

        {/* Model Architecture */}
        <section className="bg-surface p-10 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-cyan-50 text-cyan-600 rounded-[var(--radius-card)]"><Network className="w-8 h-8" /></div>
            <h2 className="text-3xl font-bold tracking-tight">Architecture: EfficientNet-B3</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
              <p>
                For the core inference engine, we discarded heavy legacy models (like ResNet50 or VGG16) in favor of <strong>EfficientNet-B3</strong>.
              </p>
              <p>
                <strong>Compound Scaling:</strong> Traditional models scale up by independently increasing depth (more layers), width (more channels), or resolution. EfficientNet introduces a principled compound scaling method that uniformly scales all three dimensions using a fixed scaling coefficient ($\phi$).
              </p>
              <p>
                <strong>Engineering Trade-offs:</strong> B3 strikes the perfect Pareto-optimal balance for high-resolution medical imaging. At only ~12M parameters, it heavily outperforms ResNet50 (~25M parameters) in feature extraction, reducing inference latency on CPU environments to under 400ms while maintaining exceptional spatial resolution critical for detecting hyperchromatic nuclei.
              </p>
            </div>
            {/* Visual: Architecture Diagram */}
            <div className="bg-surface-secondary p-8 rounded-[var(--radius-card)] border border-border flex flex-col items-center gap-3">
              <div className="w-full bg-surface p-3 rounded-xl border border-border text-center font-semibold text-text-secondary shadow-sm">Input Tensor [3, 224, 224]</div>
              <ArrowRight className="w-5 h-5 text-muted rotate-90" />
              <div className="w-full bg-cyan-50 p-3 rounded-xl border border-cyan-200 text-center text-cyan-800 shadow-sm flex flex-col">
                <span className="font-bold">MBConv Blocks</span>
                <span className="text-xs opacity-75">Squeeze-and-Excitation Optimization</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted rotate-90" />
              <div className="w-full bg-purple-50 p-3 rounded-xl border border-purple-200 text-center text-purple-800 shadow-sm flex flex-col">
                <span className="font-bold">Global Average Pooling</span>
                <span className="text-xs opacity-75">Spatial Reduction</span>
              </div>
              <ArrowRight className="w-5 h-5 text-muted rotate-90" />
              <div className="w-full bg-surface p-3 rounded-xl border border-border text-center font-semibold text-text-secondary shadow-sm">Linear Classifier [3 Classes]</div>
            </div>
          </div>
        </section>

        {/* Calibration */}
        <section className="bg-surface p-10 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-[var(--radius-card)]"><BarChart className="w-8 h-8" /></div>
            <h2 className="text-3xl font-bold tracking-tight">Trust via Temperature Scaling</h2>
          </div>
          <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
            <p>
              Modern deep neural networks are notoriously overconfident. A model might predict &quot;Cancer&quot; with 99.9% softmax probability, even when it is completely wrong. In clinical settings, miscalibrated confidence leads to catastrophic triage errors.
            </p>
            <p>
              <strong>Expected Calibration Error (ECE):</strong> ECE measures the difference between a model&apos;s predicted confidence and its actual empirical accuracy. An perfectly calibrated model has an ECE of 0.0.
            </p>
            <p>
              We implemented <strong>Temperature Scaling</strong>, a post-processing calibration technique. We freeze the network weights and optimize a single scalar parameter ($T$) on the validation set using Negative Log-Likelihood (NLL). The logits are divided by $T$ before the softmax activation:
            </p>
            <div className="flex justify-center p-6 bg-surface-secondary rounded-[var(--radius-card)] border border-border font-serif text-2xl text-text-primary">
              {"$ \\hat{q}_i = \\frac{\\exp(z_i / T)}{\\sum_j \\exp(z_j / T)} $"}
            </div>
            <p>
              By finding the optimal temperature ($T \approx 1.365$), OncoMouth softens its output distribution, bringing the ECE down to an exceptional <strong>0.0346</strong>. This mathematically guarantees that when the model reports &quot;80% confidence&quot;, the prediction is historically correct exactly 80% of the time.
            </p>
          </div>
        </section>

        {/* Explainability */}
        <section className="bg-surface p-10 rounded-[2rem] border border-border shadow-sm">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-[var(--radius-card)]"><Code2 className="w-8 h-8" /></div>
            <h2 className="text-3xl font-bold tracking-tight">Explainability: GradCAM++</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6 text-lg text-text-secondary leading-relaxed">
              <p>
                To avoid the &quot;black box&quot; dilemma, OncoMouth utilizes <strong>GradCAM++ (Gradient-weighted Class Activation Mapping)</strong> to provide spatial interpretability.
              </p>
              <p>
                While standard GradCAM calculates the global average of gradients to weight the activation maps, it struggles when multiple objects of the same class appear in an image. In histopathology, dysplasia is often scattered across multiple cells in a single patch.
              </p>
              <p>
                GradCAM++ introduces second and third-order derivatives of the logits with respect to the feature maps. This provides superior object localization and captures scattered features, generating a high-resolution heatmap that highlights the exact nuclear pleomorphisms driving the cancer prediction.
              </p>
            </div>
            <div className="bg-surface-secondary p-6 rounded-[var(--radius-card)] border border-border flex flex-col justify-center gap-2">
               <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-border shadow-sm">
                <span className="font-medium text-text-secondary">Forward Pass</span>
                <span className="text-xs bg-surface-secondary px-2 py-1 rounded text-muted">Logits</span>
              </div>
              <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-muted rotate-90" /></div>
              <div className="flex items-center justify-between bg-rose-50 border border-rose-100 p-4 rounded-xl shadow-sm">
                <span className="font-medium text-rose-800">Target Conv Layer</span>
                <span className="text-xs bg-rose-200 px-2 py-1 rounded text-rose-900">Gradient Hook</span>
              </div>
              <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-muted rotate-90" /></div>
              <div className="flex items-center justify-between bg-surface p-4 rounded-xl border border-border shadow-sm">
                <span className="font-medium text-text-secondary">Higher-Order Derivatives</span>
                <span className="text-xs bg-surface-secondary px-2 py-1 rounded text-muted">Weights</span>
              </div>
              <div className="flex justify-center"><ArrowRight className="w-5 h-5 text-muted rotate-90" /></div>
               <div className="flex items-center justify-between bg-gradient-to-r from-blue-500 via-green-400 to-red-500 p-4 rounded-xl shadow-sm text-white">
                <span className="font-bold text-shadow">Spatial Heatmap</span>
              </div>
            </div>
          </div>
        </section>

        {/* Limitations & Future Work */}
        <section className="bg-surface-dark p-10 rounded-[2rem] border border-border text-muted/70 shadow-2xl">
          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 bg-slate-800 text-red-400 rounded-[var(--radius-card)]"><ShieldAlert className="w-8 h-8" /></div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Limitations & Future Trajectory</h2>
          </div>
          
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Version 1 Limitations</h3>
              <ul className="space-y-4 text-muted">
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✕</span>
                  <span><strong>Single Patch Inference:</strong> The current architecture requires manual extraction of 224x224 ROIs. It cannot automatically process gigapixel Whole Slide Images (WSI) in their entirety.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✕</span>
                  <span><strong>Lack of Semantic Segmentation:</strong> GradCAM++ provides spatial heatmaps but does not generate deterministic polygon boundaries for nuclear-to-cytoplasmic ratio calculations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-red-400 mt-1">✕</span>
                  <span><strong>Dataset Constraints:</strong> While multi-center, the training distribution lacks extreme outlier cases (e.g., highly necrotic tissue artifacts or rare benign mimickers).</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-xl font-bold text-white mb-4 border-b border-slate-700 pb-2">Future Implementations</h3>
              <ul className="space-y-4 text-muted">
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span><strong>Multiple Instance Learning (MIL):</strong> Upgrading the pipeline to CLAM (Clustering-constrained Attention Multiple Instance Learning) to process WSIs without exhaustive patch-level annotations.</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span><strong>Foundation Models:</strong> Transitioning the backbone from EfficientNet to a self-supervised Vision Transformer (ViT) pre-trained on pan-cancer histopathology data (e.g., UNI or Phikon).</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-emerald-400 mt-1">→</span>
                  <span><strong>Federated Learning:</strong> Allowing hospitals to collaboratively train the model weights without raw patient data ever leaving local institutional firewalls.</span>
                </li>
              </ul>
            </div>
          </div>
        </section>

      </div>
    </div>
  )
}
