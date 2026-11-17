"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Building, Plus, Save, RefreshCw, FileText, Target } from "lucide-react";
import { AuthUser } from "@/types/auth";
import { InstituteAbout, CreateAboutPayload } from "@/types/about";
import { aboutService, DEFAULT_ABOUT_DATA } from "@/services/about.service";
import { useToastStore } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

import AboutProfileForm from "./AboutProfileForm";
import AboutReadmeDropzone from "./AboutReadmeDropzone";
import AboutBannerUploader from "./AboutBannerUploader";
import AboutGalleryUploader from "./AboutGalleryUploader";
import AboutMarkdownEditor from "./AboutMarkdownEditor";
import AboutMissionHistoryForm from "./AboutMissionHistoryForm";

interface AdminAboutManagerProps {
  user: AuthUser;
}

export default function AdminAboutManager({ user }: AdminAboutManagerProps) {
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "mission">("content");
  const [editorMode, setEditorMode] = useState<"split" | "edit" | "preview">("split");

  // All entries from backend
  const [entries, setEntries] = useState<InstituteAbout[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Form State
  const [title, setTitle] = useState("");
  const [tagline, setTagline] = useState("");
  const [slug, setSlug] = useState("main");
  const [content, setContent] = useState("");
  const [mission, setMission] = useState("");
  const [vision, setVision] = useState("");
  const [history, setHistory] = useState("");
  const [isPublished, setIsPublished] = useState(true);

  // Media files & previews
  const [readmeFile, setReadmeFile] = useState<File | null>(null);
  const [readmeInfo, setReadmeInfo] = useState<{ name: string; size: number } | null>(null);

  const [bannerUrl, setBannerUrl] = useState<string>("");
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerPreview, setBannerPreview] = useState<string>("");

  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
  const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);

  // Populate form with existing data
  const populateForm = (about: InstituteAbout) => {
    setSelectedId(about.id === "default-kigpi-about" || about.id === "default-kipi-about" ? null : about.id);
    setTitle(about.title || "");
    setTagline(about.tagline || "");
    setSlug(about.slug || "main");
    setContent(about.content || "");
    setMission(about.mission || "");
    setVision(about.vision || "");
    setHistory(about.history || "");
    setIsPublished(about.isPublished ?? true);

    setBannerUrl(about.bannerUrl || "");
    setBannerPreview(about.bannerUrl || "");
    setBannerFile(null);

    setExistingImages(about.images || []);
    setGalleryFiles([]);
    setGalleryPreviews([]);

    setReadmeFile(null);
    setReadmeInfo(about.markdownFile ? { name: about.markdownFile, size: 0 } : null);
  };

  // Load about records from API
  const loadAboutData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await aboutService.getAdminAll({ limit: 20 });
      const items = res?.data || [];
      setEntries(items);

      if (items.length > 0) {
        populateForm(items[0]);
      } else {
        populateForm(DEFAULT_ABOUT_DATA);
      }
    } catch (err: any) {
      toastError(err?.message || "Failed to load about data");
      populateForm(DEFAULT_ABOUT_DATA);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAboutData();
  }, [loadAboutData]);

  // Handle Markdown file drop or selection
  const handleReadmeSelect = (file: File) => {
    if (!file) return;
    if (!file.name.endsWith(".md") && !file.name.endsWith(".markdown") && file.type !== "text/markdown") {
      toastError("Please select a valid Markdown (.md) file");
      return;
    }

    setReadmeFile(file);
    setReadmeInfo({ name: file.name, size: file.size });

    // Client-side instant reading into editor
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (text) {
        setContent(text);
        toastSuccess(`Imported "${file.name}" into editor successfully!`);
      }
    };
    reader.readAsText(file);
  };

  const handleBannerSelect = (file: File) => {
    if (!file) return;
    setBannerFile(file);
    const objectUrl = URL.createObjectURL(file);
    setBannerPreview(objectUrl);
  };

  const handleGallerySelect = (files: FileList | null) => {
    if (!files) return;
    const newFiles = Array.from(files);
    const combinedCount = existingImages.length + galleryFiles.length + newFiles.length;
    if (combinedCount > 10) {
      toastError("Maximum 10 gallery images allowed in total.");
      return;
    }

    const newPreviews = newFiles.map((f) => URL.createObjectURL(f));
    setGalleryFiles((prev) => [...prev, ...newFiles]);
    setGalleryPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeGalleryFile = (index: number) => {
    setGalleryFiles((prev) => prev.filter((_, i) => i !== index));
    setGalleryPreviews((prev) => {
      URL.revokeObjectURL(prev[index]);
      return prev.filter((_, i) => i !== index);
    });
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  // Save or update handler
  const handleSave = async () => {
    if (!title.trim()) {
      toastError("Institute Title is required");
      return;
    }

    try {
      setSaving(true);
      const payload: CreateAboutPayload = {
        title: title.trim(),
        tagline: tagline.trim() || undefined,
        slug: slug.trim() || "main",
        content: content.trim() || undefined,
        mission: mission.trim() || undefined,
        vision: vision.trim() || undefined,
        history: history.trim() || undefined,
        isPublished,
        images: existingImages,
        bannerUrl: bannerUrl.trim() || undefined,
      };

      const files = {
        readmeFile,
        bannerFile,
        galleryFiles,
      };

      const result = await aboutService.saveAbout(payload, files, selectedId || undefined);
      if (result?.id) {
        setSelectedId(result.id);
      }
      toastSuccess(
        selectedId
          ? "Institute About updated successfully!"
          : "Institute About saved and published successfully!"
      );

      // Refresh list
      await loadAboutData();
    } catch (err: any) {
      toastError(err?.message || "Failed to save about data");
    } finally {
      setSaving(false);
    }
  };

  // Reset to create new section
  const handleStartNew = () => {
    setSelectedId(null);
    setTitle("");
    setTagline("");
    setSlug("department-overview");
    setContent("# Department Overview\n\nAdd your custom markdown content here...");
    setMission("");
    setVision("");
    setHistory("");
    setIsPublished(true);
    setBannerUrl("");
    setBannerPreview("");
    setBannerFile(null);
    setExistingImages([]);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setReadmeFile(null);
    setReadmeInfo(null);
  };

  if (loading) {
    return (
      <div className="p-12 text-center text-gray-500">
        <RefreshCw className="w-8 h-8 mx-auto animate-spin text-[#0a4b32] mb-3" />
        <p className="text-sm font-medium">Loading institutional profile &amp; markdown content...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-[#e2e8e4] shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building className="w-5 h-5 text-[#0a4b32]" />
            <h1 className="text-xl sm:text-2xl font-bold text-[#0f1f17]">
              Institute About &amp; Content Management
            </h1>
            <Badge className="bg-[#eef5f1] text-[#0a4b32] border-[#d6e6db]">
              BTEB / DTE Profile
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-gray-500">
            Publish institutional legacy, accreditation, mission, vision, and rich Markdown documentation.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={handleStartNew}
            className="border-[#d6e6db] text-[#0a4b32] hover:bg-[#eef5f1] text-xs h-9"
          >
            <Plus className="w-3.5 h-3.5 mr-1.5" />
            New Section
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="bg-[#0a4b32] hover:bg-[#083c28] text-white text-xs h-9 px-4 font-semibold shadow-sm"
          >
            {saving ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 mr-1.5 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-3.5 h-3.5 mr-1.5" />
                {selectedId ? "Save Changes" : "Publish Section"}
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Sections Selector Pills (if multiple exist) */}
      {entries.length > 1 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider shrink-0">
            Sections:
          </span>
          {entries.map((entry) => {
            const isSelected = selectedId === entry.id || (!selectedId && entry.slug === slug);
            return (
              <button
                key={entry.id}
                onClick={() => populateForm(entry)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-[#0a4b32] text-white border-[#0a4b32]"
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span>{entry.title || entry.slug}</span>
                <span className="text-[10px] opacity-75">({entry.slug})</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Grid: Form Controls (Left) & Editor (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Meta details, images, readme dropzone */}
        <div className="lg:col-span-4 space-y-5">
          <AboutProfileForm
            title={title}
            onChangeTitle={setTitle}
            tagline={tagline}
            onChangeTagline={setTagline}
            slug={slug}
            onChangeSlug={setSlug}
            isPublished={isPublished}
            onTogglePublished={() => setIsPublished(!isPublished)}
          />

          <AboutReadmeDropzone
            readmeInfo={readmeInfo}
            onSelectFile={handleReadmeSelect}
            onRemoveFile={() => {
              setReadmeFile(null);
              setReadmeInfo(null);
            }}
          />

          <AboutBannerUploader
            bannerUrl={bannerUrl}
            bannerPreview={bannerPreview}
            onChangeBannerUrl={(val) => {
              setBannerUrl(val);
              if (!bannerFile) setBannerPreview(val);
            }}
            onSelectFile={handleBannerSelect}
            onRemoveBanner={() => {
              setBannerFile(null);
              setBannerPreview("");
              setBannerUrl("");
            }}
          />

          <AboutGalleryUploader
            existingImages={existingImages}
            galleryPreviews={galleryPreviews}
            onSelectFiles={handleGallerySelect}
            onRemoveExisting={removeExistingImage}
            onRemoveNew={removeGalleryFile}
          />
        </div>

        {/* Right Column (8 cols): Tabs for Content, Mission/Vision, and History */}
        <div className="lg:col-span-8 space-y-5">
          {/* Section Navigation Tabs */}
          <div className="flex border-b border-gray-200 bg-white px-4 pt-2 rounded-t-2xl border-t border-x">
            <button
              type="button"
              onClick={() => setActiveTab("content")}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "content"
                  ? "border-[#0a4b32] text-[#0a4b32]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <FileText className="w-4 h-4" />
              Markdown Content &amp; README
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("mission")}
              className={`pb-3 px-4 text-xs font-semibold border-b-2 transition-colors flex items-center gap-2 ${
                activeTab === "mission"
                  ? "border-[#0a4b32] text-[#0a4b32]"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Target className="w-4 h-4" />
              Mission, Vision &amp; History
            </button>
          </div>

          {activeTab === "content" ? (
            <AboutMarkdownEditor
              content={content}
              onChangeContent={setContent}
              editorMode={editorMode}
              onChangeEditorMode={setEditorMode}
            />
          ) : (
            <AboutMissionHistoryForm
              mission={mission}
              onChangeMission={setMission}
              vision={vision}
              onChangeVision={setVision}
              history={history}
              onChangeHistory={setHistory}
            />
          )}
        </div>
      </div>
    </div>
  );
}
