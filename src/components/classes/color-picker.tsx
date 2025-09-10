"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CLASS_COLORS, hexToRgba } from "@/lib/colors";
import { Droplets } from "lucide-react";

interface ColorPickerProps {
  isOpen: boolean;
  onClose: () => void;
  currentColorHex: string;
  onColorSelect: (colorHex: string) => void;
  className: string;
}

export function ColorPicker({ isOpen, onClose, currentColorHex, onColorSelect, className }: ColorPickerProps) {
  const [selectedColorHex, setSelectedColorHex] = useState(currentColorHex);
  const [customColor, setCustomColor] = useState(currentColorHex);
  const [isCustomColor, setIsCustomColor] = useState(false);

  const handleColorSelect = (colorHex: string) => {
    setSelectedColorHex(colorHex);
    setIsCustomColor(false);
  };

  const handleCustomColorChange = (color: string) => {
    setCustomColor(color);
    setSelectedColorHex(color);
    setIsCustomColor(true);
  };

  const handleConfirm = () => {
    onColorSelect(selectedColorHex);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-lg bg-white text-foreground">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Choose Color for {className}
          </DialogTitle>
          <DialogDescription>
            Select a color to customize your class card appearance.
          </DialogDescription>
        </DialogHeader>

        {/* Predefined Colors */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">Predefined Colors</h4>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {CLASS_COLORS.map((color) => (
              <button
                key={color.id}
                className={`relative h-16 w-16 rounded-lg border-2 transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${
                  selectedColorHex === color.hex && !isCustomColor 
                    ? 'ring-2 ring-offset-2 ring-primary shadow-lg scale-105' 
                    : 'hover:border-primary/50'
                }`}
                onClick={() => handleColorSelect(color.hex)}
                style={{
                  borderColor: color.hex,
                  backgroundColor: hexToRgba(color.hex, 0.1)
                }}
              >
                <div className="w-full h-full rounded-md" />
                {selectedColorHex === color.hex && !isCustomColor && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-black rounded-full"></div>
                    </div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Custom Color Picker */}
        <div className="space-y-4 pt-6 border-t">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-semibold text-foreground">Custom Color</h4>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <input
                  type="color"
                  value={customColor}
                  onChange={(e) => handleCustomColorChange(e.target.value)}
                  className="absolute opacity-0 w-0 h-0"
                  id="color-picker"
                />
                <button
                  onClick={() => document.getElementById('color-picker')?.click()}
                  className="w-20 h-20 rounded-xl bg-background hover:bg-muted transition-all duration-200 ease-in-out hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 flex items-center justify-center group"
                >
                  <Droplets className="w-8 h-8 text-muted-foreground group-hover:text-foreground transition-colors" />
                </button>
              </div>
              
              <div className="flex-1 space-y-2">
                <label className="text-sm font-medium text-foreground">Color Code</label>
                <input
                  type="text"
                  value={customColor}
                  onChange={(e) => {
                    const value = e.target.value;
                    setCustomColor(value);
                    if (/^#[0-9A-Fa-f]{6}$/.test(value) && value.length === 7) {
                      setSelectedColorHex(value);
                      setIsCustomColor(true);
                    }
                  }}
                  placeholder="#000000"
                  className="w-full px-4 py-3 border border-input bg-background rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
            
            {/* Preview */}
            <div className="p-4 bg-muted rounded-lg border">
              <div className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">Preview</div>
              <div 
                className="w-full h-12 rounded-lg border-2 transition-all duration-200"
                style={{
                  borderColor: selectedColorHex,
                  backgroundColor: hexToRgba(selectedColorHex, 0.1)
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-6 border-t">
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-lg border-2 shadow-sm"
              style={{ 
                borderColor: selectedColorHex,
                backgroundColor: hexToRgba(selectedColorHex, 0.1)
              }}
            />
            <div>
              <div className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Selected</div>
              <span className="text-sm font-mono font-semibold text-foreground">{selectedColorHex}</span>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>
              Apply Color
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
