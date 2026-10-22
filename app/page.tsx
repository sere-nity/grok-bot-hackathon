"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { voiceProfiles } from "@/lib/voice-profiles";
import { Sparkles, Clock, Users, FileText, Image as ImageIcon, CheckCircle2, Edit, RotateCw, Loader2, Download } from "lucide-react";

interface GeneratedContent {
  runSheet: any;
  budget: any;
  volunteerRota: any;
  content: {
    eventPageCopy: string;
    newsletterDraft: string;
    posts: {
      whatsapp: string;
      linkedin: string;
      discord: string;
    };
  };
}

const MANUAL_MINUTES: Record<string, number> = {
  runSheet: 45,
  budget: 30,
  volunteerRota: 25,
  eventPageCopy: 40,
  newsletterDraft: 35,
  whatsapp: 15,
  linkedin: 20,
  discord: 15,
  visual: 60,
};

export default function Home() {
  const [eventInput, setEventInput] = useState("");
  const [lumaUrl, setLumaUrl] = useState("");
  const [notes, setNotes] = useState("");
  const [selectedProfile, setSelectedProfile] = useState(voiceProfiles[0].id);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generated, setGenerated] = useState<GeneratedContent | null>(null);
  const [eventData, setEventData] = useState<any>(null);
  const [approvedItems, setApprovedItems] = useState<Set<string>>(new Set());

  const totalManualMinutes = Object.values(MANUAL_MINUTES).reduce((a, b) => a + b, 0);
  const approvedMinutes = Array.from(approvedItems).reduce((sum, item) => sum + (MANUAL_MINUTES[item] || 0), 0);

  const handleTrySample = async () => {
    setEventInput("AI Builders Meetup: Build Your First AI Workflow");
    setNotes("Venue: Tech Hub Central, 50 capacity. Budget: £500. Need 5 volunteers. Pizza + drinks included.");
    setSelectedProfile("ai-builders");
    
    setTimeout(() => {
      handleGenerate();
    }, 500);
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerated(null);
    setApprovedItems(new Set());
    
    try {
      let eventInfo = {
        name: eventInput,
        description: "",
        start_at: new Date().toISOString(),
      };

      // Try to fetch from Luma if URL provided
      if (lumaUrl) {
        const eventIdMatch = lumaUrl.match(/evt-[a-zA-Z0-9]+/);
        if (eventIdMatch) {
          try {
            const response = await fetch(`/api/luma?event_api_id=${eventIdMatch[0]}`);
            if (response.ok) {
              const data = await response.json();
              eventInfo = {
                name: data.name || eventInput,
                description: data.description || "",
                start_at: data.start_at || new Date().toISOString(),
              };
              setEventData(data);
            }
          } catch (e) {
            console.log("Luma fetch failed, using manual input");
          }
        }
      }

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventData: eventInfo,
          voiceProfileId: selectedProfile,
          notes,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        setGenerated(data);
      }
    } catch (error) {
      console.error("Generation failed:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const toggleApproval = (itemId: string) => {
    setApprovedItems(prev => {
      const next = new Set(prev);
      if (next.has(itemId)) {
        next.delete(itemId);
      } else {
        next.add(itemId);
      }
      return next;
    });
  };

  const approveAll = () => {
    setApprovedItems(new Set(Object.keys(MANUAL_MINUTES)));
  };

  const imageUrl = eventData?.name 
    ? `/api/image?title=${encodeURIComponent(eventData.name)}&date=${encodeURIComponent(new Date(eventData.start_at || Date.now()).toLocaleDateString())}&venue=${encodeURIComponent(eventData.geo?.address || "")}`
    : `/api/image?title=${encodeURIComponent(eventInput || "Community Event")}`;

  return (
    <main className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Hero */}
        {!generated && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16 space-y-6"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <Sparkles className="w-4 h-4" />
              Event Autopilot
            </div>
            
            <h1 className="text-6xl font-bold tracking-tight bg-gradient-to-b from-foreground to-foreground/70 bg-clip-text text-transparent">
              Turn one event into<br />everything you need
            </h1>
            
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Run sheets, posts, visuals, and newsletters that match your community's voice. Generated in seconds, approved with one click.
            </p>

            <Button size="lg" onClick={handleTrySample} className="mt-4">
              <Sparkles className="w-4 h-4 mr-2" />
              Try with sample event
            </Button>
          </motion.div>
        )}

        {/* Input Form */}
        <AnimatePresence mode="wait">
          {!isGenerating && !generated && (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-3xl mx-auto"
            >
              <Card className="bg-card/50 backdrop-blur border-border/50">
                <CardHeader>
                  <CardTitle>Create Your Event Assets</CardTitle>
                  <CardDescription>
                    Enter your event details or paste a Luma event URL
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Event Name or Idea</label>
                    <Input
                      placeholder="e.g., AI Builders Workshop: Ship Your First Product"
                      value={eventInput}
                      onChange={(e) => setEventInput(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Luma Event URL (optional)</label>
                    <Input
                      placeholder="https://lu.ma/... or evt-xxx"
                      value={lumaUrl}
                      onChange={(e) => setLumaUrl(e.target.value)}
                      className="bg-background/50"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Additional Notes</label>
                    <Textarea
                      placeholder="Venue, food, budget, volunteers needed..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="bg-background/50 min-h-24"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Community Voice</label>
                    <div className="grid grid-cols-1 gap-3">
                      {voiceProfiles.map((profile) => (
                        <button
                          key={profile.id}
                          onClick={() => setSelectedProfile(profile.id)}
                          className={`p-4 rounded-lg border-2 text-left transition-all ${
                            selectedProfile === profile.id
                              ? "border-primary bg-primary/5"
                              : "border-border hover:border-primary/50 bg-background/50"
                          }`}
                        >
                          <div className="font-medium">{profile.name}</div>
                          <div className="text-sm text-muted-foreground mt-1">
                            {profile.description}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={handleGenerate}
                    disabled={!eventInput}
                    className="w-full"
                    size="lg"
                  >
                    <Sparkles className="w-4 h-4 mr-2" />
                    Generate Everything
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Loading State */}
          {isGenerating && (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="text-center space-y-4 mb-12">
                <Loader2 className="w-12 h-12 animate-spin mx-auto text-primary" />
                <h2 className="text-2xl font-semibold">Generating your event assets...</h2>
                <p className="text-muted-foreground">This usually takes 5-10 seconds</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {[
                  { icon: Clock, label: "Run Sheet" },
                  { icon: FileText, label: "Budget" },
                  { icon: Users, label: "Volunteer Rota" },
                  { icon: FileText, label: "Event Page" },
                  { icon: FileText, label: "Newsletter" },
                  { icon: ImageIcon, label: "Social Posts" },
                ].map((item, i) => (
                  <motion.div
                    key={item.label}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Card className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                          <item.icon className="w-5 h-5 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium">{item.label}</div>
                          <div className="text-sm text-muted-foreground">Processing...</div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}

          {/* Results */}
          {generated && !isGenerating && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              {/* Hours Saved Banner */}
              <Card className="bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20">
                <CardContent className="p-8">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-3xl font-bold">{totalManualMinutes} minutes</div>
                      <div className="text-muted-foreground">saved if you approve all</div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-semibold text-primary">{approvedMinutes} min</div>
                      <div className="text-sm text-muted-foreground">approved so far</div>
                    </div>
                    <Button onClick={approveAll} size="lg">
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Approve All
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Asset Cards */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Run Sheet */}
                <AssetCard
                  id="runSheet"
                  title="Run Sheet"
                  icon={Clock}
                  minutes={MANUAL_MINUTES.runSheet}
                  approved={approvedItems.has("runSheet")}
                  onToggleApproval={toggleApproval}
                >
                  <div className="space-y-2">
                    {generated.runSheet?.timeline?.map((item: any, i: number) => (
                      <div key={i} className="flex gap-3 text-sm p-2 rounded bg-background/50">
                        <div className="font-mono text-muted-foreground whitespace-nowrap">{item.time}</div>
                        <div className="flex-1">{item.activity}</div>
                        <div className="text-muted-foreground">{item.owner}</div>
                      </div>
                    ))}
                  </div>
                </AssetCard>

                {/* Budget */}
                <AssetCard
                  id="budget"
                  title="Budget"
                  icon={FileText}
                  minutes={MANUAL_MINUTES.budget}
                  approved={approvedItems.has("budget")}
                  onToggleApproval={toggleApproval}
                >
                  <div className="space-y-2">
                    {generated.budget?.items?.map((item: any, i: number) => (
                      <div key={i} className="flex justify-between text-sm p-2 rounded bg-background/50">
                        <div>
                          <div className="font-medium">{item.category}</div>
                          <div className="text-muted-foreground text-xs">{item.description}</div>
                        </div>
                        <div className="font-mono">£{item.cost}</div>
                      </div>
                    ))}
                    <div className="flex justify-between text-sm p-2 rounded bg-primary/10 font-semibold border-t border-border mt-2">
                      <div>Total</div>
                      <div className="font-mono">£{generated.budget?.total}</div>
                    </div>
                  </div>
                </AssetCard>

                {/* Volunteer Rota */}
                <AssetCard
                  id="volunteerRota"
                  title="Volunteer Rota"
                  icon={Users}
                  minutes={MANUAL_MINUTES.volunteerRota}
                  approved={approvedItems.has("volunteerRota")}
                  onToggleApproval={toggleApproval}
                >
                  <div className="space-y-2">
                    {generated.volunteerRota?.roles?.map((role: any, i: number) => (
                      <div key={i} className="text-sm p-3 rounded bg-background/50">
                        <div className="font-medium">{role.role}</div>
                        <div className="text-muted-foreground text-xs mt-1">{role.time}</div>
                        <div className="text-xs mt-1">{role.volunteers.join(", ")}</div>
                      </div>
                    ))}
                  </div>
                </AssetCard>

                {/* Event Page Copy */}
                <AssetCard
                  id="eventPageCopy"
                  title="Event Page Copy"
                  icon={FileText}
                  minutes={MANUAL_MINUTES.eventPageCopy}
                  approved={approvedItems.has("eventPageCopy")}
                  onToggleApproval={toggleApproval}
                >
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    {generated.content.eventPageCopy}
                  </div>
                </AssetCard>

                {/* Newsletter */}
                <AssetCard
                  id="newsletterDraft"
                  title="Newsletter Draft"
                  icon={FileText}
                  minutes={MANUAL_MINUTES.newsletterDraft}
                  approved={approvedItems.has("newsletterDraft")}
                  onToggleApproval={toggleApproval}
                >
                  <div className="text-sm leading-relaxed text-muted-foreground">
                    {generated.content.newsletterDraft}
                  </div>
                </AssetCard>

                {/* Visual */}
                <AssetCard
                  id="visual"
                  title="Event Graphic"
                  icon={ImageIcon}
                  minutes={MANUAL_MINUTES.visual}
                  approved={approvedItems.has("visual")}
                  onToggleApproval={toggleApproval}
                >
                  <div className="space-y-3">
                    <img
                      src={imageUrl}
                      alt="Event graphic"
                      className="w-full rounded-lg border border-border"
                    />
                    <a
                      href={imageUrl}
                      download="event-graphic.png"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button variant="outline" size="sm" className="w-full">
                        <Download className="w-4 h-4 mr-2" />
                        Download PNG
                      </Button>
                    </a>
                  </div>
                </AssetCard>
              </div>

              {/* Social Posts */}
              <Card>
                <CardHeader>
                  <CardTitle>Social Posts</CardTitle>
                  <CardDescription>Customized for each platform</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <SocialPostPreview
                    id="whatsapp"
                    platform="WhatsApp"
                    content={generated.content.posts.whatsapp}
                    approved={approvedItems.has("whatsapp")}
                    minutes={MANUAL_MINUTES.whatsapp}
                    onToggleApproval={toggleApproval}
                  />
                  <SocialPostPreview
                    id="linkedin"
                    platform="LinkedIn"
                    content={generated.content.posts.linkedin}
                    approved={approvedItems.has("linkedin")}
                    minutes={MANUAL_MINUTES.linkedin}
                    onToggleApproval={toggleApproval}
                  />
                  <SocialPostPreview
                    id="discord"
                    platform="Discord"
                    content={generated.content.posts.discord}
                    approved={approvedItems.has("discord")}
                    minutes={MANUAL_MINUTES.discord}
                    onToggleApproval={toggleApproval}
                  />
                </CardContent>
              </Card>

              <div className="flex justify-center gap-4">
                <Button variant="outline" onClick={() => setGenerated(null)}>
                  Start Over
                </Button>
                <Button size="lg" onClick={approveAll}>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve All & Export
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}

function AssetCard({
  id,
  title,
  icon: Icon,
  minutes,
  approved,
  onToggleApproval,
  children,
}: {
  id: string;
  title: string;
  icon: any;
  minutes: number;
  approved: boolean;
  onToggleApproval: (id: string) => void;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={approved ? "border-primary bg-primary/5" : ""}>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <CardDescription>{minutes} min saved</CardDescription>
              </div>
            </div>
            {approved && (
              <CheckCircle2 className="w-5 h-5 text-primary" />
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {children}
          <div className="flex gap-2 pt-2">
            <Button
              variant={approved ? "secondary" : "default"}
              size="sm"
              className="flex-1"
              onClick={() => onToggleApproval(id)}
            >
              {approved ? (
                <>
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approved
                </>
              ) : (
                "Approve"
              )}
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <RotateCw className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

function SocialPostPreview({
  id,
  platform,
  content,
  approved,
  minutes,
  onToggleApproval,
}: {
  id: string;
  platform: string;
  content: string;
  approved: boolean;
  minutes: number;
  onToggleApproval: (id: string) => void;
}) {
  return (
    <div className={`p-4 rounded-lg border ${approved ? "border-primary bg-primary/5" : "border-border bg-background/50"}`}>
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="font-medium">{platform}</div>
          <div className="text-xs text-muted-foreground">{minutes} min saved</div>
        </div>
        {approved && <CheckCircle2 className="w-4 h-4 text-primary" />}
      </div>
      <div className="text-sm mb-3 p-3 rounded bg-background border border-border/50">
        {content}
      </div>
      <div className="flex gap-2">
        <Button
          variant={approved ? "secondary" : "default"}
          size="sm"
          className="flex-1"
          onClick={() => onToggleApproval(id)}
        >
          {approved ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Approved
            </>
          ) : (
            "Approve"
          )}
        </Button>
        <Button variant="outline" size="sm">
          <Edit className="w-4 h-4" />
        </Button>
        <Button variant="outline" size="sm">
          <RotateCw className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
}
