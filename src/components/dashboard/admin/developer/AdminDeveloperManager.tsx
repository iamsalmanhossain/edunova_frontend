"use client";

import React, { useState, useEffect } from "react";
import {
  Code2,
  Globe,
  Mail,
  Phone,
  MapPin,
  UploadCloud,
  Plus,
  Trash,
  Loader2,
  CheckCircle2,
  ExternalLink,
  ShieldAlert,
  Sparkles,
  Save,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AuthUser } from "@/types/auth";
import { DeveloperProfile } from "@/types/developer";
import { developerService, VERIFIED_DEVELOPER_PROFILE } from "@/services/developer.service";
import { useToastStore } from "@/store/useToastStore";
import { GithubIcon } from "@/components/shared/Icons";

interface AdminDeveloperManagerProps {
  user: AuthUser;
}

export default function AdminDeveloperManager({ user }: AdminDeveloperManagerProps) {
  const isAuthorized = user.role === "SUPER_ADMIN" || user.role === "ADMIN";
  const toast = useToastStore();

  const [profile, setProfile] = useState<DeveloperProfile>(VERIFIED_DEVELOPER_PROFILE);
  const [name, setName] = useState(profile.name);
  const [title, setTitle] = useState(profile.title);
  const [tagline, setTagline] = useState(profile.tagline || "");
  const [bio, setBio] = useState(profile.bio);
  const [skills, setSkills] = useState<string[]>(profile.skills || []);
  const [skillInput, setSkillInput] = useState("");
  const [githubUrl, setGithubUrl] = useState(profile.githubUrl || "");
  const [linkedinUrl, setLinkedinUrl] = useState(profile.linkedinUrl || "");
  const [portfolioUrl, setPortfolioUrl] = useState(profile.portfolioUrl || "");
  const [email, setEmail] = useState(profile.email || "");
  const [phone, setPhone] = useState(profile.phone || "");
  const [location, setLocation] = useState(profile.location || "");
  const [isAvailableForHire, setIsAvailableForHire] = useState(profile.isAvailableForHire ?? true);
  const [isPublished, setIsPublished] = useState(profile.isPublished ?? true);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string>(profile.avatarUrl || "");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isAuthorized) return;

    const loadProfile = async () => {
      try {
        setIsLoading(true);
        const data = await developerService.getAdminDeveloper();
        setProfile(data);
        setName(data.name);
        setTitle(data.title);
        setTagline(data.tagline || "");
        setBio(data.bio);
        setSkills(data.skills || []);
        setGithubUrl(data.githubUrl || "");
        setLinkedinUrl(data.linkedinUrl || "");
        setPortfolioUrl(data.portfolioUrl || "");
        setEmail(data.email || "");
        setPhone(data.phone || "");
        setLocation(data.location || "");
        setIsAvailableForHire(data.isAvailableForHire ?? true);
        setIsPublished(data.isPublished ?? true);
        if (data.avatarUrl) setAvatarPreview(data.avatarUrl);
      } catch {
        // Fallback already pre-populated
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [isAuthorized]);

  if (!isAuthorized) {
    return (
      <div className="p-8 max-w-lg mx-auto text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Access Restricted</h2>
        <p className="text-sm text-gray-600">
          Only administrators can configure the developer identity and system architect profile.
        </p>
        <Link href="/dashboard/admin">
          <Button variant="outline">Return to Admin Console</Button>
        </Link>
      </div>
    );
  }

  const handleAddSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const handleRemoveSkill = (idx: number) => {
    setSkills(skills.filter((_, i) => i !== idx));
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !title.trim() || !bio.trim()) {
      toast.error("Name, title, and bio are required fields");
      return;
    }

    try {
      setIsSaving(true);
      const updated = await developerService.saveDeveloper(
        {
          name: name.trim(),
          title: title.trim(),
          tagline: tagline.trim() || undefined,
          bio: bio.trim(),
          skills,
          githubUrl: githubUrl.trim() || undefined,
          linkedinUrl: linkedinUrl.trim() || undefined,
          portfolioUrl: portfolioUrl.trim() || undefined,
          email: email.trim() || undefined,
          phone: phone.trim() || undefined,
          location: location.trim() || undefined,
          isAvailableForHire,
          isPublished,
          avatarUrl: avatarPreview || undefined,
        },
        avatarFile
      );

      setProfile(updated);
      toast.success("Developer profile updated successfully!");
    } catch {
      toast.error("Failed to save developer profile");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 bg-white rounded-2xl border border-[#e2e8e4] shadow-xs">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-[#0a4b32] border border-emerald-200">
              Platform Architect Profile
            </span>
            <span className="text-xs text-[#5a6b62]">Live API Driven</span>
          </div>
          <h1 className="text-2xl font-bold text-[#0f1f17]">
            Developer & Systems Architect Control
          </h1>
          <p className="text-xs sm:text-sm text-[#5a6b62]">
            Control developer credentials, bio, tech stack capabilities, and public portfolio presentation.
          </p>
        </div>

        {/* View Public Profile Link */}
        <div className="shrink-0">
          <Link
            href="/developer"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2.5 text-xs font-bold rounded-xl bg-[#0a4b32] hover:bg-[#073624] text-white shadow-xs transition"
          >
            <span>View Public Showcase</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Editor & Live Preview Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Form Editor (7 cols) */}
        <form onSubmit={handleSave} className="lg:col-span-7 space-y-5">
          <div className="p-6 bg-white rounded-2xl border border-[#e2e8e4] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0f1f17] flex items-center gap-2">
              <Code2 className="w-4 h-4 text-[#0a4b32]" />
              <span>Core Identity & Designation</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1c2e24]">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Md Salman Hossain"
                  required
                  className="h-10 text-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-[#1c2e24]">
                  Professional Title <span className="text-rose-500">*</span>
                </label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Full Stack Developer & Systems Architect"
                  required
                  className="h-10 text-sm"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-[#1c2e24]">Tagline</label>
              <Input
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="e.g. Next.js 16 Architect • NestJS Specialist • Enterprise Full Stack Engineer"
                className="h-10 text-sm"
              />
            </div>

            {/* Avatar Photo Upload */}
            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-semibold text-[#1c2e24]">Avatar / Profile Photo</label>
              <div className="flex items-center gap-4">
                <label className="flex-1 flex flex-col items-center justify-center p-4 border-2 border-dashed border-[#c5d5cb] hover:border-[#0a4b32] rounded-xl cursor-pointer bg-emerald-50/20 transition text-center">
                  <UploadCloud className="w-5 h-5 text-[#0a4b32] mb-1" />
                  <span className="text-xs font-medium text-[#1c2e24]">
                    {avatarFile ? avatarFile.name : "Click to select avatar image"}
                  </span>
                  <span className="text-[10px] text-[#718278]">PNG, JPG, WEBP (Square recommended)</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleAvatarChange}
                    className="hidden"
                  />
                </label>

                {avatarPreview && (
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-[#d2ddd6] relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Bio & Story */}
          <div className="p-6 bg-white rounded-2xl border border-[#e2e8e4] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0f1f17]">Biography & Architecture Motivation</h2>
            <Textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={6}
              required
              placeholder="Why EduNova was built, systemic problems solved, academic vision..."
              className="text-sm leading-relaxed resize-none"
            />
          </div>

          {/* Technical Skills & Tags */}
          <div className="p-6 bg-white rounded-2xl border border-[#e2e8e4] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0f1f17]">Core Engineering Skills & Tech Stack</h2>
            <div className="flex gap-2">
              <Input
                type="text"
                value={skillInput}
                onChange={(e) => setSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="e.g. Next.js 16 (App Router)"
                className="h-9 text-xs"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleAddSkill}
                className="h-9 px-3 text-xs"
              >
                <Plus className="w-3.5 h-3.5 mr-1" /> Add Skill
              </Button>
            </div>

            <div className="flex flex-wrap gap-1.5 pt-1">
              {skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 text-[#0a4b32] text-xs font-semibold border border-emerald-200"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(idx)}
                    className="text-emerald-700 hover:text-rose-600"
                  >
                    <Trash className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
          </div>

          {/* Social Links & Contact */}
          <div className="p-6 bg-white rounded-2xl border border-[#e2e8e4] shadow-xs space-y-4">
            <h2 className="text-base font-bold text-[#0f1f17]">Social Links & Inquiries</h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1c2e24]">GitHub URL</label>
                <Input
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                  placeholder="https://github.com/..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1c2e24]">LinkedIn URL</label>
                <Input
                  value={linkedinUrl}
                  onChange={(e) => setLinkedinUrl(e.target.value)}
                  placeholder="https://linkedin.com/in/..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1c2e24]">Portfolio URL</label>
                <Input
                  value={portfolioUrl}
                  onChange={(e) => setPortfolioUrl(e.target.value)}
                  placeholder="https://salmanhossain.dev"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1c2e24]">Contact Email</label>
                <Input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="contact@salmanhossain.dev"
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1c2e24]">Phone Number</label>
                <Input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+880 1711-..."
                  className="h-9 text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-[#1c2e24]">Location</label>
                <Input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Dhaka, Bangladesh"
                  className="h-9 text-xs"
                />
              </div>
            </div>

            {/* Status Toggles */}
            <div className="pt-3 border-t border-[#f0f4f1] flex flex-wrap items-center justify-between gap-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAvailableForHire}
                  onChange={(e) => setIsAvailableForHire(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0a4b32] focus:ring-[#0a4b32]"
                />
                <span className="text-xs font-semibold text-[#1c2e24]">
                  Available for Enterprise Engineering &amp; Hire
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-[#0a4b32] focus:ring-[#0a4b32]"
                />
                <span className="text-xs font-semibold text-[#1c2e24]">
                  Publish Developer Profile on Public Website
                </span>
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-end">
            <Button
              type="submit"
              disabled={isSaving}
              className="h-11 px-8 rounded-xl bg-[#0a4b32] hover:bg-[#073624] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving Changes...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Developer Profile</span>
                </>
              )}
            </Button>
          </div>
        </form>

        {/* Right Column: Live Interactive Card Preview (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="sticky top-6">
            <div className="flex items-center justify-between pb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-[#5a6b62]">
                Live Showcase Preview
              </span>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                Synchronized
              </span>
            </div>

            {/* Card Mockup */}
            <div className="p-6 rounded-2xl bg-white border border-[#0a4b32]/25 shadow-lg space-y-5">
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 rounded-2xl overflow-hidden ring-4 ring-[#0a4b32]/10 bg-[#0a4b32] shrink-0 shadow-md">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt={name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white">
                      <Code2 className="w-8 h-8 text-[#ecdcb9]" />
                    </div>
                  )}
                </div>

                <div className="space-y-0.5 overflow-hidden">
                  <div className="flex items-center gap-1.5">
                    <Badge variant="gold" className="text-[10px] font-bold">
                      Full Stack Developer
                    </Badge>
                    {isAvailableForHire && (
                      <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                        Available
                      </span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-[#0f1f17] truncate">{name || "Developer Name"}</h3>
                  <p className="text-xs font-semibold text-[#0a4b32] truncate">{title || "Title"}</p>
                </div>
              </div>

              {tagline && (
                <p className="text-xs font-medium text-[#5a6b62] bg-[#f9fbf9] p-2.5 rounded-xl border border-[#e2e8e4]">
                  {tagline}
                </p>
              )}

              <p className="text-xs text-[#5a6b62] line-clamp-4 leading-relaxed">
                {bio || "Developer biography preview..."}
              </p>

              {/* Skills */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#0a4b32]">
                  Skills ({skills.length}):
                </span>
                <div className="flex flex-wrap gap-1">
                  {skills.slice(0, 6).map((s, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-emerald-50 text-[#0a4b32] border border-emerald-100"
                    >
                      {s}
                    </span>
                  ))}
                  {skills.length > 6 && (
                    <span className="text-[10px] text-[#5a6b62] self-center">
                      +{skills.length - 6} more
                    </span>
                  )}
                </div>
              </div>

              {/* Social Buttons */}
              <div className="pt-2 border-t border-[#f0f4f1] flex flex-wrap gap-2 text-xs">
                {githubUrl && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-[#0f1f17] text-[11px] font-semibold">
                    <GithubIcon className="w-3 h-3" />
                    <span>GitHub</span>
                  </span>
                )}
                {portfolioUrl && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 border border-emerald-200 text-[#0a4b32] text-[11px] font-semibold">
                    <Globe className="w-3 h-3" />
                    <span>Portfolio</span>
                  </span>
                )}
                {email && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 border border-gray-200 text-[#0f1f17] text-[11px] font-semibold">
                    <Mail className="w-3 h-3 text-[#0a4b32]" />
                    <span className="truncate max-w-[120px]">{email}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
