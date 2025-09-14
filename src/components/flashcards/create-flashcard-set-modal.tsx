"use client";

import { useState, useCallback, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, File, X, Loader2 } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useRef } from "react";

interface CreateFlashcardSetModalProps {
  children: React.ReactNode;
  onSuccess?: (setId: number) => void;
}

interface FileWithContent {
  file: File;
  content: string;
  type: string;
}

const FLASHCARD_TYPES = [
  { id: "question", label: "Question & Answer", description: "Traditional Q&A format" },
  { id: "vocab", label: "Vocabulary", description: "Key terms and definitions" },
  { id: "definition", label: "Definition", description: "Concept explanations" },
  { id: "example", label: "Example", description: "Practical examples and use cases" },
  { id: "formula", label: "Formula", description: "Mathematical formulas and equations" },
  { id: "concept", label: "Concept", description: "Core concepts and theories" },
];

export function CreateFlashcardSetModal({
  children,
  onSuccess,
}: CreateFlashcardSetModalProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [files, setFiles] = useState<FileWithContent[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [maxCards, setMaxCards] = useState([15]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["question", "vocab", "definition"]);
  const [selectedClassId, setSelectedClassId] = useState<string>("none");
  const [classes, setClasses] = useState<Array<{id: string, name: string, colorHex: string, emoji: string}>>([]);
  const [currentStep, setCurrentStep] = useState(1);
  const navigationRef = useRef<HTMLDivElement>(null);

  // Fetch user's classes when modal opens
  useEffect(() => {
    if (open) {
      fetchClasses();
    }
  }, [open]);


  // Also fetch classes on component mount as fallback
  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await fetch("/api/app/classes");
      
      if (response.ok) {
        const data = await response.json();
        setClasses(data.classes || []);
      } else {
        console.error("Failed to fetch classes:", response.status, response.statusText);
      }
    } catch (error) {
      console.error("Error fetching classes:", error);
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: FileWithContent[] = [];
    
    for (const file of acceptedFiles) {
      try {
        const content = await readFileContent(file);
        newFiles.push({
          file,
          content,
          type: file.type,
        });
      } catch (error) {
        console.error("Error reading file:", error);
      }
    }
    
    setFiles(prev => [...prev, ...newFiles]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'text/markdown': ['.md'],
    },
    multiple: true,
  });

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleTypeChange = (typeId: string, checked: boolean) => {
    if (checked) {
      setSelectedTypes(prev => [...prev, typeId]);
    } else {
      setSelectedTypes(prev => prev.filter(id => id !== typeId));
    }
  };

  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return name.trim().length > 0;
      case 2:
        return selectedTypes.length > 0;
      case 3:
        return files.length > 0;
      default:
        return false;
    }
  };

  const scrollToNavigation = () => {
    // Only scroll if both name is filled and class is selected
    if (name.trim().length > 0 && selectedClassId !== "" && navigationRef.current) {
      navigationRef.current.scrollIntoView({ 
        behavior: 'smooth', 
        block: 'center' 
      });
    }
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || files.length === 0) {
      return;
    }

    setIsUploading(true);
    
    try {
      const response = await fetch("/api/ingest-flashcards", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name.trim(),
          maxCards: maxCards[0],
          types: selectedTypes,
          classId: selectedClassId === "none" ? null : selectedClassId,
          files: files.map(f => ({
            name: f.file.name,
            content: f.content,
            type: f.type,
          })),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create flashcard set");
      }

      const result = await response.json();
      
      // Reset form
      setName("");
      setFiles([]);
      setMaxCards([15]);
      setSelectedTypes(["question", "vocab", "definition"]);
      setSelectedClassId("none");
      setCurrentStep(1);
      setOpen(false);
      
      onSuccess?.(result.setId);
    } catch (error) {
      console.error("Error creating flashcard set:", error);
      // You might want to show a toast notification here
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create Flashcard Set</DialogTitle>
          <DialogDescription>
            Upload study materials to automatically generate flashcards using AI.
          </DialogDescription>
        </DialogHeader>
        
            <form onSubmit={handleSubmit} className="space-y-6 relative">
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-sm h-4">
              <div 
                className="bg-myBlue h-4 rounded-sm transition-all duration-300 ease-out"
                style={{ width: `${(currentStep / 3) * 100}%` }}
              />
            </div>
          </div>


          {/* Animated Steps */}
          <div className="min-h-[300px] relative overflow-hidden">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <motion.div
                  key="step1"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  
                  
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Set Name</Label>
                      <Input
                        id="name"
                        value={name}
                        onChange={(e) => {
                          setName(e.target.value);
                          // Scroll if name is filled and class is selected
                          if (e.target.value.trim().length > 0 && selectedClassId !== "") {
                            setTimeout(scrollToNavigation, 100);
                          }
                        }}
                        placeholder="e.g., Biology Chapter 5"
                        required
                      />
                    </div>

                    <div className="space-y-3">
                      <Label>Class (Optional)</Label>
                      
                      {/* No Class Option */}
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedClassId("none");
                          setTimeout(scrollToNavigation, 100);
                        }}
                        className={`w-full p-3 rounded-lg border-2 transition-all duration-200 ${
                          selectedClassId === "none"
                            ? "border-gray-400 bg-gray-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 text-sm">—</span>
                          </div>
                          <span className="text-gray-700 font-medium">No class</span>
                        </div>
                      </button>

                      {/* Class Options */}
                      {classes.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2">
                          {classes.map((cls) => (
                            <button
                              key={cls.id}
                              type="button"
                              onClick={() => {
                                setSelectedClassId(cls.id);
                                setTimeout(scrollToNavigation, 100);
                              }}
                              className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                                selectedClassId === cls.id
                                  ? "border-opacity-100"
                                  : "border-opacity-50 hover:border-opacity-75 hover:shadow-sm"
                              }`}
                              style={{
                                borderColor: cls.colorHex,
                                backgroundColor: selectedClassId === cls.id ? cls.colorHex : `${cls.colorHex}15`, // Full color when selected, 15% opacity when not
                              }}
                            >
                              <div className="flex items-center gap-3">
                                <div 
                                  className="w-8 h-8  flex items-center justify-center text-white text-base font-medium"
                                  
                                >
                                  {cls.emoji}
                                </div>
                                <div className="flex-1 text-left">
                                  <span 
                                    className={`font-semibold truncate block ${
                                      selectedClassId === cls.id ? "text-white" : "text-black"
                                    }`}
                                  >
                                    {cls.name}
                                  </span>
                                </div>

                              </div>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                          <p className="text-sm">No classes found. Create a class first to assign flashcard sets.</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}

              {currentStep === 2 && (
                <motion.div
                  key="step2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-6">
                    
                    <div className="space-y-3">
                      <Label>Flashcard Types</Label>
                      <div className="grid grid-cols-2 gap-3">
                        {FLASHCARD_TYPES.map((type) => (
                          <div key={type.id} className="flex items-start space-x-2">
                            <Checkbox
                              id={type.id}
                              checked={selectedTypes.includes(type.id)}
                              onCheckedChange={(checked) => handleTypeChange(type.id, checked as boolean)}
                            />
                            <div className="grid gap-1.5 leading-none">
                              <label
                                htmlFor={type.id}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {type.label}
                              </label>
                              <p className="text-xs text-muted-foreground">
                                {type.description}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Number of Cards (Max 25)</Label>
                      <div className="">
                        <Slider
                          value={maxCards}
                          onValueChange={setMaxCards}
                          max={25}
                          min={5}
                          step={1}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>5</span>
                          <span className="font-medium">{maxCards[0]} cards</span>
                          <span>25</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </motion.div>
              )}

              {currentStep === 3 && (
                <motion.div
                  key="step3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="text-center mb-8">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Upload Study Materials</h3>
                    <p className="text-gray-600">Upload your documents to generate flashcards from</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                        isDragActive
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300 hover:border-gray-400"
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                      <p className="text-lg text-gray-600 font-medium mb-2">
                        {isDragActive
                          ? "Drop files here..."
                          : "Drag & drop files here, or click to select"}
                      </p>
                      <p className="text-sm text-gray-500">
                        Supports: PDF, DOC, DOCX, TXT, MD
                      </p>
                    </div>

                    {files.length > 0 && (
                      <div className="space-y-2">
                        <Label>Uploaded Files</Label>
                        <div className="space-y-2 max-h-[80px] overflow-y-auto">
                          {files.map((fileWithContent, index) => (
                            <Card key={index} className="p-3">
                              <CardContent className="p-0">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <File className="h-4 w-4 text-gray-500" />
                                    <span className="text-sm font-medium">
                                      {fileWithContent.file.name}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                      ({Math.round(fileWithContent.file.size / 1024)} KB)
                                    </span>
                                  </div>
                                  <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => removeFile(index)}
                                    className="h-6 w-6 p-0"
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Navigation Buttons */}
          <div ref={navigationRef} className="flex justify-between pt-6 border-t border-gray-200">
            <Button
              type="button"
              variant="outline"
              onClick={currentStep === 1 ? () => setOpen(false) : prevStep}
              disabled={isUploading}
            >
              {currentStep === 1 ? (
                "Cancel"
              ) : (
                <>
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Back
                </>
              )}
            </Button>
            
            {currentStep < 3 ? (
              <Button
                type="button"
                onClick={nextStep}
                disabled={!canProceedToNext()}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={!canProceedToNext() || isUploading}
              >
                {isUploading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Set"
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
