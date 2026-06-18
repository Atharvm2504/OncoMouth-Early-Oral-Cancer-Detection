/* eslint-disable @next/next/no-img-element */
"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { predictImage, generateReport } from "@/services/api"
import { PredictionResponse } from "@/types/api"
import { UploadCloud, CheckCircle2, AlertCircle, Loader2, Download, SplitSquareHorizontal, Layers, Image as ImageIcon, Brain, ShieldCheck, FileText, ZoomIn, ZoomOut, Maximize, ChevronDown, ChevronUp, Clock, Activity } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PredictionHistory } from "@/components/features/PredictionHistory"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { Skeleton } from "@/components/ui/skeleton"

const PROCESSING_STEPS = [
  "Validating",
  "Normalizing",
  "Tensor",
  "Inference",
  "Calibration",
  "GradCAM"
]

export default function PredictionWorkspace() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [result, setResult] = useState<PredictionResponse | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [activeView, setActiveView] = useState<"original" | "overlay" | "split" | "normalized">("overlay")
  const [opacity, setOpacity] = useState(60)

  const handleDragOver = (e: React.DragEvent) => e.preventDefault()

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (selectedFile: File) => {
    if (!selectedFile.type.startsWith("image/")) {
      setError("Please select a valid image file (PNG, JPG).")
      return
    }
    setFile(selectedFile)
    setPreviewUrl(URL.createObjectURL(selectedFile))
    setResult(null)
    setError(null)
    setActiveStep(0)
  }

  const runPrediction = async () => {
    if (!file) return
    setIsProcessing(true)
    setError(null)
    setResult(null)

    let stepInterval: NodeJS.Timeout | undefined
    
    const runPipeline = async () => {
      try {
        const res = await predictImage(file)
        for (let i = activeStep; i < PROCESSING_STEPS.length; i++) {
          setActiveStep(i)
          await new Promise(r => setTimeout(r, 150))
        }
        setResult(res)
        setIsProcessing(false)
        setActiveStep(0)

        // Save History
        try {
          const stored = localStorage.getItem("oncomouth_history");
          const history = stored ? JSON.parse(stored) : [];
          history.unshift({
            request_id: res.request_id,
            prediction: res.prediction,
            confidence: res.confidence,
            timestamp: res.timestamp
          });
          if (history.length > 10) history.pop();
          localStorage.setItem("oncomouth_history", JSON.stringify(history));
          window.dispatchEvent(new Event("storage"));
        } catch (e) {
          console.error("Failed to save history", e);
        }
      } catch (err: unknown) {
        setIsProcessing(false)
        setError(err instanceof Error ? err.message : "An error occurred during inference.")
      }
    }

    let currentStep = 0
    stepInterval = setInterval(() => {
      if (currentStep < PROCESSING_STEPS.length - 2) {
        currentStep++
        setActiveStep(currentStep)
      }
    }, 400)

    await runPipeline()
    clearInterval(stepInterval)
  }

  return (
    <div className="min-h-screen bg-slate-50/50 flex flex-col items-center py-8 font-sans">
      <div className="w-full max-w-[1600px] px-4 md:px-8 flex flex-col gap-8">
        
        {/* DASHBOARD GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT: ZONE A - INPUT */}
          <div className="lg:col-span-3 flex flex-col h-full gap-6">
            <ZoneAInput 
              file={file} previewUrl={previewUrl} isProcessing={isProcessing} error={error}
              onDragOver={handleDragOver} onDrop={handleDrop} onFileChange={handleFileChange}
              onRunPrediction={runPrediction} onClearError={() => setError(null)}
            />
          </div>

          {/* CENTER: ZONE B (Diagnosis) & ZONE D (Pipeline) */}
          <div className="lg:col-span-5 flex flex-col h-full gap-6">
            <ZoneBDiagnosis result={result} isProcessing={isProcessing} />
            <ZoneDPipeline isProcessing={isProcessing} result={result} activeStep={activeStep} />
          </div>

          {/* RIGHT: ZONE C (Explainability) */}
          <div className="lg:col-span-4 flex flex-col h-full gap-6">
            <ZoneCExplainability 
              result={result} isProcessing={isProcessing} 
              activeView={activeView} setActiveView={setActiveView}
              opacity={opacity} setOpacity={setOpacity}
            />
          </div>

        </div>

        {/* BOTTOM: ZONE E (Report) */}
        <AnimatePresence>
          {result && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <ZoneEReport result={result} />
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  )
}


/* =========================================================================
   ZONE A: PATIENT INPUT (Left Column)
   ========================================================================= */
function ZoneAInput({ file, previewUrl, isProcessing, error, onDragOver, onDrop, onFileChange, onRunPrediction, onClearError }: any) {
  return (
    <div className="bg-surface-secondary rounded-[var(--radius-card)] border border-border shadow-sm p-6 flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">Patient Input</h2>
        <PredictionHistory />
      </div>

      {!previewUrl ? (
        <label 
          onDragOver={onDragOver} 
          onDrop={onDrop}
          className="w-full flex-grow border-2 border-dashed border-border-hover hover:border-primary/50 hover:bg-surface rounded-xl flex flex-col items-center justify-center cursor-pointer transition-all group min-h-[300px] bg-surface"
        >
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>
          <p className="mt-6 font-semibold text-text-primary text-sm">Drag & Drop Tissue Sample</p>
          <p className="text-xs text-muted mt-2 text-center max-w-[200px]">High-resolution PNG or JPG.<br/>Max file size 10MB.</p>
          <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
        </label>
      ) : (
        <div className="w-full flex flex-col gap-6 flex-grow">
          <div className="w-full aspect-square rounded-xl overflow-hidden border border-border relative group shadow-sm bg-black">
            <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex flex-col items-center justify-center text-white font-medium cursor-pointer transition-opacity backdrop-blur-sm">
              <UploadCloud className="w-8 h-8 mb-2" />
              Replace Image
              <input type="file" accept="image/*" className="hidden" onChange={onFileChange} />
            </label>
          </div>
          
          <div className="bg-surface rounded-lg p-4 border border-border/50">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Filename</span>
              <span className="text-xs font-medium text-text-secondary truncate max-w-[120px]" title={file?.name}>{file?.name}</span>
            </div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">File Size</span>
              <span className="text-xs font-medium text-text-secondary">{((file?.size || 0) / 1024 / 1024).toFixed(2)} MB</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-semibold text-muted uppercase tracking-wider">Status</span>
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5"/> Validated</span>
            </div>
          </div>

          <Button 
            onClick={onRunPrediction} 
            disabled={isProcessing}
            className="w-full h-14 rounded-xl bg-primary hover:bg-primary/90 text-white font-semibold text-base mt-auto shadow-md transition-all active:scale-[0.98]"
          >
            {isProcessing ? (
              <span className="flex items-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Tissue...</span>
            ) : "Run AI Inference"}
          </Button>
        </div>
      )}

      {error && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-6 w-full bg-red-50 border border-red-100 rounded-xl p-4 flex flex-col gap-2">
          <div className="flex items-center gap-2 text-red-700">
            <AlertCircle className="w-5 h-5" />
            <h3 className="font-semibold text-sm">Pipeline Error</h3>
          </div>
          <p className="text-xs text-red-600/80 leading-relaxed">
            {error}
          </p>
          <Button variant="ghost" size="sm" onClick={onClearError} className="h-8 mt-2 text-xs font-medium text-red-700 hover:bg-red-100 self-end">
            Dismiss
          </Button>
        </motion.div>
      )}
    </div>
  )
}

/* =========================================================================
   ZONE B: AI DIAGNOSIS (Center Column)
   ========================================================================= */
function ZoneBDiagnosis({ result, isProcessing }: any) {
  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-sm p-8 flex flex-col flex-grow">
      
      {!result && !isProcessing && (
        <div className="flex-grow flex flex-col items-center justify-center text-muted">
          <Brain className="w-16 h-16 mb-6 opacity-20" />
          <h3 className="text-lg font-semibold text-text-primary mb-2">Diagnostic Engine Idle</h3>
          <p className="text-sm text-center max-w-[250px]">Upload an image and run inference to generate an AI diagnosis.</p>
        </div>
      )}

      {isProcessing && (
        <div className="flex flex-col gap-8 w-full flex-grow">
          <Skeleton className="w-full h-[180px] rounded-2xl" />
          <div className="grid grid-cols-2 gap-4">
            <Skeleton className="w-full h-[90px] rounded-xl" />
            <Skeleton className="w-full h-[90px] rounded-xl" />
            <Skeleton className="w-full h-[90px] rounded-xl" />
            <Skeleton className="w-full h-[90px] rounded-xl" />
          </div>
          <Skeleton className="w-full h-[120px] rounded-xl mt-auto" />
        </div>
      )}

      {result && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col flex-grow">
          
          {/* HERO DIAGNOSIS CARD */}
          <div className={`p-8 rounded-2xl border mb-8 flex flex-col items-center justify-center text-center shadow-sm ${
            result.prediction === "Cancer" ? "bg-red-50 border-red-200" :
            result.prediction === "PreCancer" ? "bg-amber-50 border-amber-200" :
            "bg-emerald-50 border-emerald-200"
          }`}>
            <p className={`text-sm font-bold uppercase tracking-widest mb-3 ${
               result.prediction === "Cancer" ? "text-red-700/70" : result.prediction === "PreCancer" ? "text-amber-700/70" : "text-emerald-700/70"
            }`}>Model Diagnosis</p>
            <h1 className={`text-6xl font-black tracking-tight mb-4 ${
               result.prediction === "Cancer" ? "text-red-700" : result.prediction === "PreCancer" ? "text-amber-700" : "text-emerald-700"
            }`}>
              {result.prediction.toUpperCase()}
            </h1>
            <p className={`text-lg font-medium max-w-[80%] ${
               result.prediction === "Cancer" ? "text-red-900/80" : result.prediction === "PreCancer" ? "text-amber-900/80" : "text-emerald-900/80"
            }`}>
              AI predicts {result.prediction} with {(result.confidence * 100).toFixed(1)}% calibrated confidence.
            </p>
          </div>

          {/* COMPACT METRICS (2x2 Grid) */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <MetricCard title="Calibrated Confidence" value={` ${(result.confidence * 100).toFixed(1)}%`} icon={Activity} />
            <MetricCard title="Calibration Status" value={result.calibration_status} icon={ShieldCheck} isEmerald />
            <MetricCard title="Expected Calib. Error" value="0.0346" icon={AlertCircle} />
            <MetricCard title="Inference Time" value={`${result.inference_time_ms.toFixed(1)}ms`} icon={Clock} />
          </div>

          {/* PROBABILITY DISTRIBUTION */}
          <div className="mt-auto bg-surface-secondary rounded-xl p-6 border border-border/50">
            <h4 className="text-sm font-semibold text-text-primary mb-5 uppercase tracking-wide">Class Probabilities</h4>
            <div className="space-y-4">
              {Object.entries(result.probability_distribution).sort((a: any, b: any) => b[1] - a[1]).map(([label, prob]: any) => (
                <div key={label} className="group">
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-semibold text-text-secondary">{label}</span>
                    <span className="text-text-primary font-bold">{(prob * 100).toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-surface rounded-full h-2.5 overflow-hidden border border-border shadow-inner">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${prob * 100}%` }}
                      transition={{ duration: 1, ease: "easeOut" }}
                      className={`h-full rounded-full ${
                        label === "Cancer" ? "bg-red-500" :
                        label === "PreCancer" ? "bg-amber-500" :
                        "bg-emerald-500"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

        </motion.div>
      )}
    </div>
  )
}

function MetricCard({ title, value, icon: Icon, isEmerald }: any) {
  return (
    <div className={`p-4 rounded-xl border ${isEmerald ? 'bg-emerald-50/30 border-emerald-100' : 'bg-surface-secondary border-border/50'} flex flex-col justify-between`}>
      <p className="text-xs font-semibold text-muted uppercase tracking-wider flex items-center gap-1.5 mb-2">
        <Icon className="w-3.5 h-3.5" /> {title}
      </p>
      <p className={`text-xl font-bold ${isEmerald ? 'text-emerald-700' : 'text-text-primary'}`}>{value}</p>
    </div>
  )
}

/* =========================================================================
   ZONE D: AI PIPELINE (Horizontal)
   ========================================================================= */
function ZoneDPipeline({ isProcessing, result, activeStep }: any) {
  if (!isProcessing && !result) return null;

  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-sm p-6">
      <h4 className="text-xs font-semibold text-muted uppercase tracking-wider mb-4">Pipeline Execution</h4>
      <div className="flex items-center justify-between relative">
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-border/50 z-0" />
        {PROCESSING_STEPS.map((step, idx) => {
          const isCompleted = result ? true : idx < activeStep;
          const isActive = isProcessing && idx === activeStep;
          return (
            <div key={idx} className="relative z-10 flex flex-col items-center gap-2">
              <motion.div 
                initial={false}
                animate={{ 
                  scale: isActive ? 1.2 : 1, 
                  backgroundColor: isCompleted ? "var(--color-emerald-500)" : isActive ? "var(--color-primary)" : "var(--color-surface)",
                  borderColor: isCompleted || isActive ? "transparent" : "var(--color-border-hover)"
                }}
                className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors shadow-sm`}
              >
                {isActive && <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />}
              </motion.div>
              <span className={`text-[10px] font-semibold uppercase tracking-wider absolute top-6 whitespace-nowrap ${isCompleted || isActive ? "text-text-primary" : "text-muted"}`}>
                {step}
              </span>
            </div>
          )
        })}
      </div>
      <div className="h-6" /> {/* Spacing for absolute labels */}
    </div>
  )
}


/* =========================================================================
   ZONE C: EXPLAINABILITY (Right Column)
   ========================================================================= */
function ZoneCExplainability({ result, isProcessing, activeView, setActiveView, opacity, setOpacity }: any) {
  return (
    <div className="bg-surface rounded-[var(--radius-card)] border border-border shadow-sm p-6 flex flex-col flex-grow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-text-primary">GradCAM Explorer</h2>
      </div>

      <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden relative flex flex-col shadow-inner flex-grow min-h-[400px]">
        
        {/* Toolbar Overlay */}
        {result && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex bg-white/10 backdrop-blur-md p-1 rounded-lg border border-white/20 z-20 shadow-lg">
            {[
              { id: "original", icon: ImageIcon, label: "Raw" },
              { id: "overlay", icon: Layers, label: "Overlay" },
              { id: "split", icon: SplitSquareHorizontal, label: "Split" },
              { id: "normalized", icon: Brain, label: "Dev" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveView(tab.id as any)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold transition-all ${
                  activeView === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-white/70 hover:text-white hover:bg-white/10"
                }`}
              >
                <tab.icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            ))}
          </div>
        )}

        {/* Canvas */}
        <div className="flex-grow flex items-center justify-center relative p-4 mt-12">
          {!result && !isProcessing && (
            <div className="text-slate-500 flex flex-col items-center">
              <Layers className="w-12 h-12 mb-4 opacity-30" />
              <p className="text-sm font-medium">Explainability will appear after inference.</p>
            </div>
          )}

          {isProcessing && (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 z-10">
              <Loader2 className="w-8 h-8 text-white/50 animate-spin" />
            </div>
          )}

          {result && (
            <motion.div key={activeView} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="relative w-full h-full flex items-center justify-center">
              {activeView === "original" && (
                <img src={`data:image/jpeg;base64,${result.images.original}`} alt="Original" className="max-w-full max-h-full object-contain rounded-lg" />
              )}
              {activeView === "normalized" && (
                <img src={`data:image/jpeg;base64,${result.images.normalized}`} alt="Normalized" className="max-w-full max-h-full object-contain rounded-lg" />
              )}
              {activeView === "overlay" && result.images.gradcam && (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img src={`data:image/jpeg;base64,${result.images.original}`} alt="Original" className="absolute max-w-full max-h-full object-contain rounded-lg" />
                  <img 
                    src={`data:image/jpeg;base64,${result.images.gradcam}`} 
                    alt="GradCAM Overlay" 
                    className="absolute max-w-full max-h-full object-contain rounded-lg transition-opacity duration-200"
                    style={{ opacity: opacity / 100 }}
                  />
                </div>
              )}
              {activeView === "split" && result.images.gradcam && (
                <div className="w-full h-full flex items-center justify-center gap-4">
                  <img src={`data:image/jpeg;base64,${result.images.original}`} alt="Original" className="w-1/2 h-full object-contain border border-white/10 rounded-lg" />
                  <img src={`data:image/jpeg;base64,${result.images.gradcam}`} alt="Overlay" className="w-1/2 h-full object-contain border border-white/10 rounded-lg" />
                </div>
              )}
            </motion.div>
          )}
        </div>
      </div>

      {/* Clinical Interpretation & Controls */}
      {result && (
        <div className="mt-6 bg-surface-secondary rounded-xl p-5 border border-border/50 flex flex-col gap-4">
          {activeView === "overlay" && result.images.gradcam && (
            <div>
              <div className="flex justify-between text-xs font-semibold text-text-secondary mb-3 uppercase tracking-wider">
                <span>Overlay Opacity</span>
                <span>{opacity}%</span>
              </div>
              <input 
                type="range" min="0" max="100" value={opacity} 
                onChange={(e) => setOpacity(parseInt(e.target.value))}
                className="w-full h-1.5 bg-border rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          )}
          <div className="pt-2 border-t border-border/50">
            <p className="text-xs font-semibold text-muted uppercase tracking-wider mb-2">Clinical Interpretation</p>
            <p className="text-sm text-text-secondary leading-relaxed">
              Warm regions (Red/Yellow) indicate tissue morphology contributing most strongly to the predicted <strong className="text-text-primary">{result.prediction}</strong> class. Cold regions (Blue) were clinically ignored by the model.
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

/* =========================================================================
   ZONE E: CLINICAL REPORT (Bottom Section, Collapsed by default)
   ========================================================================= */
function ZoneEReport({ result }: any) {
  const [expanded, setExpanded] = useState(false)

  const handleDownload = async (e: any) => {
    e.stopPropagation();
    try {
      const blob = await generateReport(result)
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `OncoMouth-Report-${result.request_id}.pdf`
      a.click()
    } catch (e) {
      console.error("Failed to generate report", e)
    }
  }

  return (
    <div className="w-full bg-surface rounded-[var(--radius-card)] border border-border shadow-sm overflow-hidden transition-all duration-300">
      
      {/* Header / Summary Bar */}
      <div 
        className="p-6 flex flex-col md:flex-row items-center justify-between cursor-pointer hover:bg-surface-secondary/50 transition-colors"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-4">
          <div className="p-3 bg-primary/10 rounded-xl text-primary">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-text-primary">Clinical Diagnostic Report</h2>
            <p className="text-sm text-text-secondary">Summary for Request: <span className="font-mono text-xs">{result.request_id.split('-')[0]}</span></p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          <Button onClick={handleDownload} className="h-10 px-5 bg-primary hover:bg-primary/90 text-white shadow-sm font-semibold text-sm">
            <Download className="w-4 h-4 mr-2" /> Export PDF
          </Button>
          <div className="w-10 h-10 rounded-full bg-surface-secondary border border-border flex items-center justify-center text-muted">
            {expanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
          </div>
        </div>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }} 
            animate={{ height: "auto", opacity: 1 }} 
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-border"
          >
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Patient ID</span>
                  <span className="text-sm font-mono text-text-primary bg-surface-secondary px-2 py-1 rounded w-fit">{result.request_id}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Timestamp</span>
                  <span className="text-sm font-medium text-text-primary">{new Date(result.timestamp).toLocaleString()}</span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Diagnosis</span>
                  <span className={`text-sm font-bold ${result.prediction === "Cancer" ? "text-red-600" : result.prediction === "PreCancer" ? "text-amber-600" : "text-emerald-600"}`}>
                    {result.prediction}
                  </span>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-xs font-semibold text-muted uppercase tracking-wider">Confidence</span>
                  <span className="text-sm font-bold text-text-primary">{(result.confidence * 100).toFixed(1)}%</span>
                </div>
              </div>

              <div className="mt-8 p-5 bg-amber-50/50 rounded-xl border border-amber-100 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed font-medium">
                  {result.disclaimer}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
