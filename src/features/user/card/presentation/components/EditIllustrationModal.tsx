"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { X, Palette, Check, Info, Sparkles } from "lucide-react";
import { cn } from "@/utils";
import { Modal } from "@/views/ui/modal";

export interface CardIllustrationOption {
  id: string;
  category: "gradient" | "geometric";
  name: string;
  src: string;
}

export const CARD_ILLUSTRATIONS: CardIllustrationOption[] = [
  // Gradient Cards
  {
    id: "gradient-1",
    category: "gradient",
    name: "Midnight Indigo",
    src: "/images/card/gradient/card.gradient.1.png",
  },
  {
    id: "gradient-2",
    category: "gradient",
    name: "Aurora Glow",
    src: "/images/card/gradient/card.gradient.2.png",
  },
  {
    id: "gradient-3",
    category: "gradient",
    name: "Sunset Purple",
    src: "/images/card/gradient/card.gradient.3.png",
  },
  {
    id: "gradient-4",
    category: "gradient",
    name: "Cosmic Cyan",
    src: "/images/card/gradient/card.gradient.4.png",
  },
  {
    id: "gradient-5",
    category: "gradient",
    name: "Electric Magenta",
    src: "/images/card/gradient/card.gradient.5.png",
  },
  {
    id: "gradient-6",
    category: "gradient",
    name: "Deep Horizon",
    src: "/images/card/gradient/card.gradient.6.png",
  },
  // Geometric Cards
  {
    id: "geometric-1",
    category: "geometric",
    name: "Violet Blocks",
    src: "/images/card/geometric/card.geometric.1.png",
  },
  {
    id: "geometric-2",
    category: "geometric",
    name: "Cyber Grid",
    src: "/images/card/geometric/card.geometric.2.png",
  },
  {
    id: "geometric-3",
    category: "geometric",
    name: "Neon Matrix",
    src: "/images/card/geometric/card.geometric.3.png",
  },
  {
    id: "geometric-4",
    category: "geometric",
    name: "Prism Flow",
    src: "/images/card/geometric/card.geometric.4.png",
  },
  {
    id: "geometric-5",
    category: "geometric",
    name: "Digital Pulse",
    src: "/images/card/geometric/card.geometric.5.png",
  },
  {
    id: "geometric-6",
    category: "geometric",
    name: "Quantum Shift",
    src: "/images/card/geometric/card.geometric.6.png",
  },
  {
    id: "geometric-7",
    category: "geometric",
    name: "Abstract Circuit",
    src: "/images/card/geometric/card.geometric.7.png",
  },
  {
    id: "geometric-8",
    category: "geometric",
    name: "Synth Wave",
    src: "/images/card/geometric/card.geometric.8.png",
  },
];

interface EditIllustrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImage?: string;
  cardName: string;
  cardLast4: string;
  onSave: (selectedImage: string) => void;
}

export const EditIllustrationModal: React.FC<EditIllustrationModalProps> = ({
  isOpen,
  onClose,
  currentImage = "/images/card/gradient/card.gradient.1.png",
  cardName,
  cardLast4,
  onSave,
}) => {
  const [selectedImage, setSelectedImage] = useState(currentImage);
  const [activeCategory, setActiveCategory] = useState<"gradient" | "geometric">("gradient");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setSelectedImage(currentImage);
      // Auto-detect tab category based on current image
      if (currentImage.includes("geometric")) {
        setActiveCategory("geometric");
      } else {
        setActiveCategory("gradient");
      }
    }
  }, [isOpen, currentImage]);

  if (!isOpen) return null;

  const filteredDesigns = CARD_ILLUSTRATIONS.filter(
    (item) => item.category === activeCategory
  );

  const handleSave = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      onSave(selectedImage);
      onClose();
    }, 350);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="lg"
      className="p-5 sm:p-6 flex flex-col max-h-[90vh]"
    >
      {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-100 dark:border-gray-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400">
              <Palette className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-gray-900 dark:text-white">
                Edit Tema Kartu
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {cardName} • **** {cardLast4}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer"
            aria-label="Tutup modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body - Scrollable */}
        <div className="overflow-y-auto overscroll-contain py-4 space-y-4 pr-0.5 custom-scrollbar flex-1 min-h-0">
          {/* Category Tabs: Gradient vs Geometric */}
          <div className="flex items-center gap-1.5 p-1 bg-gray-100 dark:bg-gray-800/90 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveCategory("gradient")}
              className={cn(
                "flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5",
                activeCategory === "gradient"
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-500" />
              <span>Gradien ({CARD_ILLUSTRATIONS.filter((c) => c.category === "gradient").length})</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory("geometric")}
              className={cn(
                "flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5",
                activeCategory === "geometric"
                  ? "bg-white dark:bg-gray-900 text-gray-900 dark:text-white shadow-xs"
                  : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"
              )}
            >
              <Palette className="w-3.5 h-3.5 text-blue-500" />
              <span>Geometris ({CARD_ILLUSTRATIONS.filter((c) => c.category === "geometric").length})</span>
            </button>
          </div>

          {/* Cards Grid */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                Pilih Desain Tema {activeCategory === "gradient" ? "Gradien" : "Geometris"}
              </span>
              <span className="text-[11px] text-gray-400">
                Klik kartu untuk memilih
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {filteredDesigns.map((design) => {
                const isSelected = selectedImage === design.src;
                return (
                  <button
                    key={design.id}
                    type="button"
                    onClick={() => setSelectedImage(design.src)}
                    className={cn(
                      "group relative flex flex-col p-1.5 rounded-2xl border text-left transition-all cursor-pointer",
                      isSelected
                        ? "border-brand-500 dark:border-brand-400 ring-2 ring-brand-500/20 bg-brand-50/20 dark:bg-brand-950/20 shadow-md scale-[1.02]"
                        : "border-gray-200/80 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-850/50 hover:border-gray-300 dark:hover:border-gray-700 hover:scale-[1.01]"
                    )}
                  >
                    {/* Card Preview Image */}
                    <div className="relative w-full aspect-[561/355] rounded-xl overflow-hidden shadow-xs">
                      <Image
                        src={design.src}
                        alt={design.name}
                        fill
                        className="object-contain"
                        sizes="(max-width: 640px) 45vw, 150px"
                      />

                      {/* Checkmark Badge for Selected */}
                      {isSelected && (
                        <div className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-brand-500 text-white shadow-md animate-in zoom-in-75 duration-150">
                          <Check className="h-3 w-3 stroke-[3]" />
                        </div>
                      )}
                    </div>

                    {/* Name */}
                    <div className="mt-1.5 px-0.5 pb-0.5">
                      <span className={cn(
                        "text-[11px] sm:text-xs font-bold block truncate",
                        isSelected
                          ? "text-brand-600 dark:text-brand-400"
                          : "text-gray-800 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white"
                      )}>
                        {design.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Important Information Notice */}
          <div className="flex items-start gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/80 dark:border-amber-900/40 text-amber-900 dark:text-amber-200">
            <Info className="h-4 w-4 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
            <p className="text-xs leading-relaxed font-medium">
              Desain kartu yang dipilih hanya sebagai ilustrasi di website Sakuin.id, tidak akan berubah baik di Apple Pay maupun Google Pay
            </p>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="pt-3 border-t border-gray-100 dark:border-gray-800 flex items-center justify-end gap-2.5 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-xs sm:text-sm font-semibold text-gray-700 dark:text-gray-300 transition-colors cursor-pointer"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-brand-500 hover:bg-brand-600 active:scale-95 text-white text-xs sm:text-sm font-semibold shadow-md transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none flex items-center gap-2"
          >
            {isSaving ? (
              <>
                <div className="h-4 w-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                <span>Menyimpan...</span>
              </>
            ) : (
              <>
                <Check className="w-4 h-4" />
                <span>Simpan Desain</span>
              </>
            )}
          </button>
        </div>
    </Modal>
  );
};

export default EditIllustrationModal;
