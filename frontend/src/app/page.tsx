"use client"

import Link from "next/link"
import { motion, Variants } from "framer-motion"
import { ArrowRight, Brain, Activity, Upload, Image as ImageIcon, Layers, FileText, CheckCircle2 } from "lucide-react"
import { Button } from "@/components/ui/button"

const FADE_UP_ANIMATION_VARIANTS: Variants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 20 } },
}

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-text-primary overflow-hidden">
      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative w-full py-24 md:py-32 flex items-center justify-center overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 z-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-primary-light/50 via-background to-background"></div>
          
          <motion.div 
            initial="hidden"
            animate="show"
            viewport={{ once: true }}
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: 0.15 } }
            }}
            className="container px-4 md:px-8 max-w-7xl flex flex-col items-center text-center space-y-8 z-10"
          >
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="inline-flex items-center rounded-full border border-primary/20 bg-primary-light/30 px-4 py-2 text-sm font-medium text-primary shadow-sm">
              <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
              Clinical Grade Oral Cancer Detection
            </motion.div>
            
            <motion.h1 variants={FADE_UP_ANIMATION_VARIANTS} className="text-[3rem] md:text-[4rem] font-bold tracking-tight max-w-4xl text-text-primary leading-tight">
              Domain-Aware Deep Learning for <span className="text-primary">Trustworthy Diagnostics.</span>
            </motion.h1>
            
            <motion.p variants={FADE_UP_ANIMATION_VARIANTS} className="max-w-[700px] text-text-secondary md:text-xl leading-relaxed font-medium">
              Eliminating domain shortcuts to deliver robust, explainable, and calibrated predictions for Oral Squamous Cell Carcinoma and Dysplasia.
            </motion.p>
            
            <motion.div variants={FADE_UP_ANIMATION_VARIANTS} className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto pt-4">
              <Link href="/predict">
                <Button size="lg" className="w-full sm:w-auto h-14 px-8 bg-primary hover:bg-primary-hover text-primary-foreground rounded-xl shadow-[var(--shadow-hover)] transition-all text-base font-medium">
                  Run AI Prediction
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
              <Link href="/research">
                <Button size="lg" variant="outline" className="h-14 px-8 bg-surface border-border text-text-primary hover:bg-surface-secondary shadow-sm transition-all">
                  Explore Research
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </section>

        {/* PERFORMANCE SECTION */}
        <section className="w-full py-24 bg-surface border-y border-border">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold tracking-tight text-text-primary">Validated Clinical Performance</h2>
              <p className="mt-4 text-text-secondary max-w-2xl mx-auto">Tested against out-of-distribution hospital data to ensure absolute reliability.</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { label: "Accuracy", value: "85.71%", desc: "Overall correct predictions across all tissue classes." },
                { label: "Macro F1", value: "83.20%", desc: "Balanced performance across majority and minority classes." },
                { label: "Cancer Recall", value: "90.37%", desc: "Critical safety net ensuring malignancies are not missed." },
                { label: "Calibration (ECE)", value: "0.0346", desc: "Highly reliable confidence scores via Temperature Scaling." },
              ].map((stat, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="p-6 bg-surface-secondary rounded-[var(--radius-card)] border border-border shadow-sm transition-all"
                >
                  <h3 className="text-sm font-semibold text-muted uppercase tracking-wider">{stat.label}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-4xl font-bold text-text-primary">{stat.value}</span>
                  </div>
                  <p className="mt-3 text-sm text-text-secondary leading-relaxed">{stat.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* AI PIPELINE SECTION */}
        <section className="w-full py-24 bg-background">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <div className="text-center mb-20">
              <h2 className="text-3xl font-bold tracking-tight text-text-primary">The Inference Pipeline</h2>
              <p className="mt-4 text-text-secondary max-w-2xl mx-auto">A transparent, step-by-step view into how the AI processes tissue imagery.</p>
            </div>

            <div className="relative">
              {/* Connecting Line */}
              <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2 z-0"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-8 relative z-10">
                {[
                  { icon: Upload, title: "Image Upload", desc: "Secure input" },
                  { icon: ImageIcon, title: "Normalization", desc: "Macenko stain transform" },
                  { icon: Layers, title: "EfficientNet-B3", desc: "Deep feature extraction" },
                  { icon: Activity, title: "Calibration", desc: "Temperature scaling" },
                  { icon: Brain, title: "GradCAM++", desc: "Visual explainability" },
                  { icon: FileText, title: "Clinical Report", desc: "PDF generation" },
                ].map((step, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex flex-col items-center text-center group"
                  >
                    <div className="w-16 h-16 bg-surface rounded-2xl border-2 border-border flex items-center justify-center text-text-secondary group-hover:border-primary group-hover:text-primary transition-colors shadow-sm mb-4">
                      <step.icon className="w-7 h-7" />
                    </div>
                    <h4 className="font-semibold text-text-primary">{step.title}</h4>
                    <p className="text-xs text-muted mt-1">{step.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* RESEARCH CONTRIBUTION SECTION */}
        <section className="w-full py-24 bg-surface border-t border-border">
          <div className="container px-4 md:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-text-primary mb-6">Solving the Domain Shortcut Problem</h2>
                <div className="space-y-6 text-text-secondary leading-relaxed">
                  <p>
                    Medical AI models often memorize the color of the stain rather than the underlying cellular morphology. This is known as a domain shortcut.
                  </p>
                  <p>
                    OncoMouth Version 1 resolves this by dynamically applying <strong>Macenko Stain Normalization</strong> at runtime, forcing the EfficientNet-B3 architecture to rely purely on morphological patterns.
                  </p>
                  <ul className="space-y-3 mt-6">
                    {[
                      "Mitigates hospital-specific staining bias",
                      "Improves out-of-distribution generalization",
                      "Ensures robust GradCAM++ heatmaps"
                    ].map((item, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                        <span className="font-medium text-text-primary">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="relative rounded-[var(--radius-card)] overflow-hidden bg-surface-secondary border border-border shadow-inner aspect-square flex flex-col justify-center p-8">
                <div className="flex items-center justify-center space-x-4 mb-8">
                  <div className="w-24 h-24 bg-primary-light/50 rounded-xl shadow-sm border border-primary/20 flex items-center justify-center text-xs text-primary font-medium">Raw Image</div>
                  <ArrowRight className="w-6 h-6 text-muted" />
                  <div className="w-24 h-24 bg-success/20 rounded-xl shadow-sm border border-success/30 flex items-center justify-center text-xs text-success font-medium">Macenko</div>
                </div>
                <div className="p-4 bg-surface rounded-xl border border-border shadow-[var(--shadow-soft)]">
                  <h4 className="font-semibold text-sm mb-2 text-text-primary">Color Deconvolution</h4>
                  <p className="text-xs text-text-secondary leading-relaxed">Separating Hematoxylin (nuclei) and Eosin (cytoplasm) to map to a standardized reference matrix.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-border bg-background">
        <div className="container px-4 md:px-8 max-w-7xl mx-auto text-center text-sm text-text-secondary">
          <p className="font-medium text-text-primary mb-2">OncoMouth Version 1.0</p>
          <p>Intended for research and demonstration purposes. Not a medical device.</p>
        </div>
      </footer>
    </div>
  )
}
