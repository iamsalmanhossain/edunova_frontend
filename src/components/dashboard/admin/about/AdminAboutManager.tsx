"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import {
  FileText,
  Upload,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Eye,
  Columns,
  Code,
  Save,
  Trash2,
  Plus,
  Compass,
  Target,
  History,
  Building,
  Sparkles,
  X,
  FileCheck,
  Bold,
  Italic,
  Heading1,
  Heading2,
  List,
  ListOrdered,
  Quote,
  Table as TableIcon,
  Link2,
} from "lucide-react";
import { AuthUser } from "@/types/auth";
import { InstituteAbout, CreateAboutPayload } from "@/types/about";
import { aboutService, DEFAULT_ABOUT_DATA } from "@/services/about.service";
import { useToastStore } from "@/store/useToastStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import MarkdownViewer from "@/components/shared/MarkdownViewer";

interface AdminAboutManagerProps {
  user: AuthUser;
}

export default function AdminAboutManager({ user }: AdminAboutManagerProps) {
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"content" | "media" | "mission" | "preview">("content");
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

  const readmeInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);
  const galleryInputRef = useRef<HTMLInputElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Load about records
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

  const populateForm = (about: InstituteAbout) => {
    setSelectedId(about.id === "default-kipi-about" ? null : about.id);
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

  // Markdown Toolbar Helpers
  const insertFormatting = (prefix: string, suffix = "") => {
    const textarea = textareaRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    const replacement = `${prefix}${selectedText || "text"}${suffix}`;

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + prefix.length,
        start + prefix.length + (selectedText.length || 4)
      );
    }, 0);
  };

  // Save handler
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
      toastSuccess(
        selectedId
          ? "Institute About updated successfully!"
          : "Institute About created and published successfully!"
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

      {/* Main Grid: Settings & Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column (4 cols): Meta details, images, readme dropzone */}
        <div className="lg:col-span-4 space-y-5">
          {/* Basic Identity Card */}
          <Card className="border-[#e2e8e4]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center justify-between">
                <span>Core Profile Details</span>
                {isPublished ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]">
                    Published
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-amber-700 border-amber-300 text-[10px]">
                    Draft
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3.5 text-xs">
              <div>
                <Label htmlFor="about-title" className="text-xs font-medium text-gray-700">
                  Institute Title <span className="text-rose-500">*</span>
                </Label>
                <Input
                  id="about-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Kishoreganj Polytechnic Institute (KIPI)"
                  className="mt-1 h-8 text-xs"
                />
              </div>

              <div>
                <Label htmlFor="about-tagline" className="text-xs font-medium text-gray-700">
                  Tagline / Motto
                </Label>
                <Input
                  id="about-tagline"
                  value={tagline}
                  onChange={(e) => setTagline(e.target.value)}
                  placeholder="e.g. Empowering Technical Innovation & Engineering"
                  className="mt-1 h-8 text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <Label htmlFor="about-slug" className="text-xs font-medium text-gray-700">
                    Slug ID
                  </Label>
                  <Input
                    id="about-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    placeholder="main"
                    className="mt-1 h-8 text-xs font-mono"
                  />
                </div>
                <div>
                  <Label className="text-xs font-medium text-gray-700">Publication State</Label>
                  <button
                    type="button"
                    onClick={() => setIsPublished(!isPublished)}
                    className={`mt-1 w-full h-8 px-2 rounded-md border text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                      isPublished
                        ? "bg-emerald-50 text-emerald-800 border-emerald-300"
                        : "bg-gray-100 text-gray-700 border-gray-300"
                    }`}
                  >
                    <CheckCircle2 className={`w-3.5 h-3.5 ${isPublished ? "text-emerald-600" : "text-gray-400"}`} />
                    {isPublished ? "Published" : "Draft (Hidden)"}
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* README.md File Dropzone */}
          <Card className="border-[#e2e8e4]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Upload README.md File</span>
              </CardTitle>
              <CardDescription className="text-xs">
                Drag and drop a local markdown file to auto-populate the editor and preview.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={readmeInputRef}
                type="file"
                accept=".md,.markdown,text/markdown"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleReadmeSelect(file);
                }}
              />

              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const file = e.dataTransfer.files?.[0];
                  if (file) handleReadmeSelect(file);
                }}
                onClick={() => readmeInputRef.current?.click()}
                className="border-2 border-dashed border-[#cfe0d5] hover:border-[#0a4b32] bg-[#f9fbf9] hover:bg-[#f1f7f3] transition-all rounded-xl p-4 text-center cursor-pointer group"
              >
                <div className="w-10 h-10 rounded-full bg-[#eef5f1] group-hover:bg-[#d6e6db] text-[#0a4b32] flex items-center justify-center mx-auto mb-2 transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-xs font-semibold text-gray-800">
                  Click to upload or drag .md file
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Supports README.md, documentation, or syllabus files (up to 10MB)
                </p>
              </div>

              {readmeInfo && (
                <div className="mt-3 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="font-medium text-emerald-900 truncate">
                      {readmeInfo.name}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setReadmeFile(null);
                      setReadmeInfo(null);
                    }}
                    className="text-emerald-700 hover:text-emerald-900 ml-2"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Banner Image Uploader */}
          <Card className="border-[#e2e8e4]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center gap-2">
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Banner Image</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                ref={bannerInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleBannerSelect(file);
                }}
              />

              {bannerPreview ? (
                <div className="relative h-32 rounded-xl overflow-hidden border border-gray-200 group bg-gray-100">
                  <Image
                    src={bannerPreview}
                    alt="Banner preview"
                    fill
                    unoptimized
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                    <Button
                      type="button"
                      size="sm"
                      variant="secondary"
                      onClick={() => bannerInputRef.current?.click()}
                      className="text-xs h-7 px-2"
                    >
                      Change
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setBannerFile(null);
                        setBannerPreview("");
                        setBannerUrl("");
                      }}
                      className="text-xs h-7 px-2"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => bannerInputRef.current?.click()}
                  className="border-2 border-dashed border-[#cfe0d5] hover:border-[#0a4b32] bg-[#f9fbf9] hover:bg-[#f1f7f3] transition-all rounded-xl p-4 text-center cursor-pointer"
                >
                  <Upload className="w-5 h-5 text-gray-400 mx-auto mb-1.5" />
                  <p className="text-xs font-semibold text-gray-700">Select Banner Image</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">JPG, PNG, WEBP (1200x500 recommended)</p>
                </div>
              )}

              <div>
                <Label htmlFor="banner-url" className="text-[11px] text-gray-500">
                  Or provide direct Image URL
                </Label>
                <Input
                  id="banner-url"
                  value={bannerUrl}
                  onChange={(e) => {
                    setBannerUrl(e.target.value);
                    if (!bannerFile) setBannerPreview(e.target.value);
                  }}
                  placeholder="https://..."
                  className="mt-1 h-7 text-xs"
                />
              </div>
            </CardContent>
          </Card>

          {/* Gallery Images Uploader (Up to 10) */}
          <Card className="border-[#e2e8e4]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-emerald-600" />
                  <span>Gallery Images</span>
                </span>
                <span className="text-xs text-gray-500 font-normal">
                  {existingImages.length + galleryFiles.length} / 10
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <input
                ref={galleryInputRef}
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={(e) => handleGallerySelect(e.target.files)}
              />

              <div className="grid grid-cols-3 gap-2">
                {/* Existing Images */}
                {existingImages.map((img, idx) => (
                  <div key={`exist-${idx}`} className="relative h-20 rounded-lg overflow-hidden border border-gray-200 group">
                    <Image src={img} alt={`Gallery ${idx}`} fill unoptimized className="object-cover" />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Newly Uploaded Images */}
                {galleryPreviews.map((preview, idx) => (
                  <div key={`new-${idx}`} className="relative h-20 rounded-lg overflow-hidden border border-emerald-300 group">
                    <Image src={preview} alt={`Upload ${idx}`} fill unoptimized className="object-cover" />
                    <span className="absolute bottom-1 left-1 bg-emerald-700 text-white text-[9px] px-1 rounded">
                      New
                    </span>
                    <button
                      type="button"
                      onClick={() => removeGalleryFile(idx)}
                      className="absolute top-1 right-1 w-5 h-5 bg-black/70 hover:bg-rose-600 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}

                {/* Upload Trigger Button */}
                {existingImages.length + galleryFiles.length < 10 && (
                  <button
                    type="button"
                    onClick={() => galleryInputRef.current?.click()}
                    className="h-20 rounded-lg border-2 border-dashed border-gray-300 hover:border-[#0a4b32] bg-gray-50 hover:bg-[#f1f7f3] flex flex-col items-center justify-center text-gray-500 hover:text-[#0a4b32] transition-colors"
                  >
                    <Plus className="w-4 h-4 mb-0.5" />
                    <span className="text-[10px] font-medium">Add Photo</span>
                  </button>
                )}
              </div>
            </CardContent>
          </Card>
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

          {activeTab === "content" && (
            <Card className="border-[#e2e8e4] rounded-t-none -mt-5">
              <CardHeader className="pb-3 border-b bg-[#fafcfa]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <CardTitle className="text-sm font-bold text-[#0f1f17]">
                      Live Markdown Documentation Editor
                    </CardTitle>
                    <CardDescription className="text-xs">
                      Write formatted text with headers, tables, code blocks, lists, and callout alerts.
                    </CardDescription>
                  </div>

                  {/* Editor Mode Switcher */}
                  <div className="flex items-center gap-1 bg-white p-1 rounded-lg border border-gray-200 shrink-0">
                    <button
                      type="button"
                      onClick={() => setEditorMode("split")}
                      className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                        editorMode === "split"
                          ? "bg-[#0a4b32] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Columns className="w-3 h-3" />
                      Split View
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode("edit")}
                      className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                        editorMode === "edit"
                          ? "bg-[#0a4b32] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Code className="w-3 h-3" />
                      Editor Only
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditorMode("preview")}
                      className={`px-2.5 py-1 text-xs font-medium rounded flex items-center gap-1.5 transition-colors ${
                        editorMode === "preview"
                          ? "bg-[#0a4b32] text-white"
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Eye className="w-3 h-3" />
                      Live Preview
                    </button>
                  </div>
                </div>

                {/* Formatting Toolbar */}
                <div className="flex items-center gap-1 pt-2 flex-wrap text-gray-700">
                  <button
                    type="button"
                    onClick={() => insertFormatting("**", "**")}
                    title="Bold"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                  >
                    <Bold className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("*", "*")}
                    title="Italic"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                  >
                    <Italic className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-px h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertFormatting("# ")}
                    title="Heading 1"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs"
                  >
                    H1
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("## ")}
                    title="Heading 2"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs"
                  >
                    H2
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("### ")}
                    title="Heading 3"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700 font-bold text-xs"
                  >
                    H3
                  </button>
                  <span className="w-px h-4 bg-gray-300 mx-1" />
                  <button
                    type="button"
                    onClick={() => insertFormatting("- ")}
                    title="Bullet List"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("1. ")}
                    title="Numbered List"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                  >
                    <ListOrdered className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("> ")}
                    title="Blockquote"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                  >
                    <Quote className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("```\n", "\n```")}
                    title="Code Block"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                  >
                    <Code className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("[link title](", ")")}
                    title="Link"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                  >
                    <Link2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => insertFormatting("\n| Feature | Status |\n|---|---|\n| Item 1 | Active |\n")}
                    title="Table"
                    className="p-1.5 hover:bg-gray-200 rounded text-gray-700"
                  >
                    <TableIcon className="w-3.5 h-3.5" />
                  </button>
                </div>
              </CardHeader>

              <CardContent className="p-0">
                <div
                  className={`grid ${
                    editorMode === "split"
                      ? "grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200"
                      : "grid-cols-1"
                  }`}
                >
                  {/* Editor Column */}
                  {(editorMode === "split" || editorMode === "edit") && (
                    <div className="p-4">
                      <textarea
                        ref={textareaRef}
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder="Write your markdown content or drop a README.md file here..."
                        rows={20}
                        className="w-full h-[540px] p-3 text-xs sm:text-sm font-mono text-gray-900 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#0a4b32]/40 resize-none leading-relaxed"
                      />
                    </div>
                  )}

                  {/* Preview Column */}
                  {(editorMode === "split" || editorMode === "preview") && (
                    <div className="p-5 h-[572px] overflow-y-auto bg-[#fafdfa]">
                      <div className="flex items-center justify-between pb-3 mb-3 border-b border-gray-200 text-xs text-gray-500 font-semibold uppercase tracking-wider">
                        <span>Real-time Preview</span>
                        <span className="text-[10px] text-[#0a4b32] lowercase bg-[#eef5f1] px-2 py-0.5 rounded">
                          {content.length} characters
                        </span>
                      </div>
                      {content.trim() ? (
                        <MarkdownViewer content={content} />
                      ) : (
                        <div className="text-center py-20 text-gray-400 text-xs">
                          <Eye className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                          <p>Nothing to preview yet. Start typing or drop a README file.</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "mission" && (
            <div className="space-y-5 -mt-5">
              {/* Mission & Vision Card */}
              <Card className="border-[#e2e8e4] rounded-t-none">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center gap-2">
                    <Target className="w-4 h-4 text-emerald-600" />
                    <span>Institutional Mission &amp; Vision</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Clear strategic direction presented to prospective students, industry partners, and governing boards.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="about-mission" className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5 text-emerald-600" />
                      Institutional Mission
                    </Label>
                    <Textarea
                      id="about-mission"
                      value={mission}
                      onChange={(e) => setMission(e.target.value)}
                      placeholder="To deliver accessible, high-quality technical education that equips students with real-world engineering skills..."
                      rows={4}
                      className="mt-1 text-xs text-gray-900 leading-relaxed"
                    />
                  </div>

                  <div>
                    <Label htmlFor="about-vision" className="text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Institutional Vision
                    </Label>
                    <Textarea
                      id="about-vision"
                      value={vision}
                      onChange={(e) => setVision(e.target.value)}
                      placeholder="To be recognized as a leading technical institute producing globally competent diploma engineers..."
                      rows={4}
                      className="mt-1 text-xs text-gray-900 leading-relaxed"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* History & Legacy Card */}
              <Card className="border-[#e2e8e4]">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-bold text-[#0f1f17] flex items-center gap-2">
                    <History className="w-4 h-4 text-emerald-600" />
                    <span>History &amp; Pedagogical Legacy</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={history}
                    onChange={(e) => setHistory(e.target.value)}
                    placeholder="Established under BTEB to meet regional technical demands..."
                    rows={5}
                    className="text-xs text-gray-900 leading-relaxed"
                  />
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
