import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { BookOpen, Video, Headphones, FileText, Play, Heart, Brain, Zap, ExternalLink } from "lucide-react";

const Resources = () => {
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [openGuide, setOpenGuide] = useState<null | { title: string; content: string }>(null);

  const categories = [
    { id: "all", label: "All Resources", icon: BookOpen },
    { id: "videos", label: "Videos", icon: Video },
    { id: "audio", label: "Audio", icon: Headphones },
    { id: "guides", label: "Guides", icon: FileText },
  ];

  const resources = [
    {
      id: 1,
      title: "Breathing Exercises for Anxiety",
      description: "Learn simple breathing techniques to calm your mind during stressful moments. Perfect for exam anxiety.",
      type: "videos",
      duration: "8 min",
      language: "English",
      category: "Anxiety",
      thumbnail: "🧘‍♀️",
      difficulty: "Beginner",
      link: "https://www.youtube.com/results?search_query=breathing+exercises+for+anxiety+students",
    },
    {
      id: 2,
      title: "Sleep Meditation in Hindi",
      description: "A soothing guided meditation to help you fall asleep peacefully. Narrated in Hindi for comfort.",
      type: "audio",
      duration: "15 min",
      language: "Hindi",
      category: "Sleep",
      thumbnail: "🌙",
      difficulty: "Beginner",
      link: "https://www.youtube.com/results?search_query=sleep+meditation+in+hindi",
    },
    {
      id: 3,
      title: "Managing Academic Stress - Complete Guide",
      description: "Comprehensive strategies for handling coursework pressure, time management, and maintaining balance.",
      type: "guides",
      duration: "10 min read",
      language: "English",
      category: "Academic Stress",
      thumbnail: "📚",
      difficulty: "Intermediate",
      content:
        "Academic stress is one of the most common challenges students face, but it's manageable with the right approach.\n\n" +
        "1. Break work into smaller chunks. A big assignment feels overwhelming as a whole, but a to-do list of small, specific tasks feels achievable.\n\n" +
        "2. Try the Pomodoro Technique. Study in focused 25-minute blocks with 5-minute breaks in between. After four rounds, take a longer 20-30 minute break.\n\n" +
        "3. Protect your sleep. Pulling all-nighters before exams usually hurts performance more than it helps — your brain consolidates memory during sleep.\n\n" +
        "4. Talk about it. Sharing what's stressing you with a friend, family member, or counselor can lighten the load more than people expect.\n\n" +
        "5. Remember: one exam or assignment does not define your worth or your future. Progress matters more than perfection.\n\n" +
        "If academic stress starts affecting your sleep, appetite, or mood for more than two weeks, consider booking a session with a counselor through this platform.",
    },
    {
      id: 4,
      title: "Progressive Muscle Relaxation",
      description: "Video guide to systematically relax your body and release physical tension from stress.",
      type: "videos",
      duration: "12 min",
      language: "English",
      category: "Relaxation",
      thumbnail: "💆‍♂️",
      difficulty: "Beginner",
      link: "https://www.youtube.com/results?search_query=progressive+muscle+relaxation+guided",
    },
    {
      id: 5,
      title: "Mindfulness for Students in Tamil",
      description: "Introduction to mindfulness practices specifically designed for students, explained in Tamil.",
      type: "audio",
      duration: "20 min",
      language: "Tamil",
      category: "Mindfulness",
      thumbnail: "🧠",
      difficulty: "Beginner",
      link: "https://www.youtube.com/results?search_query=mindfulness+for+students+in+tamil",
    },
    {
      id: 6,
      title: "Building Self-Confidence Workbook",
      description: "Interactive exercises and reflection prompts to build lasting self-confidence and self-esteem.",
      type: "guides",
      duration: "30 min read",
      language: "English",
      category: "Self-Esteem",
      thumbnail: "⭐",
      difficulty: "Intermediate",
      content:
        "Self-confidence isn't something you either have or don't — it's a skill you build through small, repeated actions.\n\n" +
        "Exercise 1 — Evidence log: Write down three things you did well this week, no matter how small. Do this daily for two weeks and notice the pattern.\n\n" +
        "Exercise 2 — Challenge the inner critic: Next time you think 'I'm not good enough,' write the thought down, then write a more balanced version, like 'I'm still learning this, and that's okay.'\n\n" +
        "Exercise 3 — Body language: Standing tall and making eye contact, even when you don't feel confident, has been shown to actually shift how you feel over time.\n\n" +
        "Exercise 4 — Celebrate progress, not perfection: Compare yourself to who you were last month, not to someone else's highlight reel.\n\n" +
        "Reflection prompt: What is one small thing you're proud of today? Write it down — you're allowed to take up space and be proud of yourself.",
    },
    {
      id: 7,
      title: "Quick Energy Boost Techniques",
      description: "5-minute techniques to combat fatigue and boost mental energy when studying or feeling low.",
      type: "videos",
      duration: "5 min",
      language: "English",
      category: "Energy",
      thumbnail: "⚡",
      difficulty: "Beginner",
      link: "https://www.youtube.com/results?search_query=quick+energy+boost+techniques+students",
    },
    {
      id: 8,
      title: "Overcoming Loneliness - Bengali Audio Series",
      description: "A 4-part audio series addressing loneliness and building meaningful connections, in Bengali.",
      type: "audio",
      duration: "45 min total",
      language: "Bengali",
      category: "Social Connection",
      thumbnail: "🤝",
      difficulty: "Intermediate",
      link: "https://www.youtube.com/results?search_query=overcoming+loneliness+bengali",
    }
  ];

  const filteredResources = resources.filter(resource => {
    return selectedCategory === "all" || resource.type === selectedCategory;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case "videos": return Video;
      case "audio": return Headphones; 
      case "guides": return FileText;
      default: return BookOpen;
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      "Anxiety": "bg-red-100 text-red-700",
      "Sleep": "bg-purple-100 text-purple-700",
      "Academic Stress": "bg-blue-100 text-blue-700",
      "Relaxation": "bg-green-100 text-green-700",
      "Mindfulness": "bg-indigo-100 text-indigo-700",
      "Self-Esteem": "bg-yellow-100 text-yellow-700",
      "Energy": "bg-orange-100 text-orange-700",
      "Social Connection": "bg-pink-100 text-pink-700",
    };
    return colors[category] || "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gradient-calm py-16">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Resource Hub</h1>
          </div>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore our curated collection of mental health resources including guided videos, audio sessions, and comprehensive guides in multiple regional languages.
          </p>
        </div>

        {/* Filter */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(({ id, label, icon: Icon }) => (
              <Button
                key={id}
                variant={selectedCategory === id ? "default" : "outline"}
                onClick={() => setSelectedCategory(id)}
                className="flex items-center gap-2"
              >
                <Icon className="w-4 h-4" />
                {label}
              </Button>
            ))}
          </div>
        </div>

        {/* Featured Quick Access */}
        <div className="max-w-6xl mx-auto mb-12">
          <h2 className="text-2xl font-semibold mb-6 text-center">Quick Access</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="card-feature text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="p-6">
                <Heart className="w-8 h-8 text-accent mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Crisis Support</h3>
                <p className="text-sm text-muted-foreground mb-4">Immediate help resources for mental health emergencies</p>
                <Button size="sm" className="btn-accent">Access Now</Button>
              </div>
            </Card>
            
            <Card className="card-feature text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="p-6">
                <Brain className="w-8 h-8 text-secondary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Daily Wellness</h3>  
                <p className="text-sm text-muted-foreground mb-4">Short exercises for daily mental health maintenance</p>
                <Button size="sm" className="btn-secondary">Explore</Button>
              </div>
            </Card>
            
            <Card className="card-feature text-center cursor-pointer hover:scale-105 transition-transform">
              <div className="p-6">
                <Zap className="w-8 h-8 text-primary mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Exam Support</h3>
                <p className="text-sm text-muted-foreground mb-4">Specialized resources for academic stress and exam anxiety</p>
                <Button size="sm" className="btn-primary">Get Help</Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Resources Grid */}
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-semibold">
              {selectedCategory === "all" ? "All Resources" : categories.find(c => c.id === selectedCategory)?.label} 
              <span className="text-muted-foreground text-lg ml-2">({filteredResources.length})</span>
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.map((resource) => {
              const IconComponent = getIcon(resource.type);
              return (
                <Card key={resource.id} className="card-calm hover:shadow-soft transition-all cursor-pointer group">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="text-4xl mb-3">{resource.thumbnail}</div>
                      <div className="flex items-center gap-2">
                        <IconComponent className="w-4 h-4 text-muted-foreground" />
                      </div>
                    </div>
                    
                    <h3 className="font-semibold mb-2 group-hover:text-primary transition-colors">
                      {resource.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                      {resource.description}
                    </p>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(resource.category)}`}>
                        {resource.category}
                      </span>
                      {resource.language.split(",").map((lang) => (
                        <span
                          key={lang}
                          className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground"
                        >
                          {lang.trim()}
                        </span>
                      ))}
                      <span className="px-2 py-1 bg-muted rounded-full text-xs text-muted-foreground">
                        {resource.difficulty}
                      </span>
                    </div>
                    
                    <div className="flex gap-2">
                      {resource.type === "guides" ? (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() =>
                            setOpenGuide({ title: resource.title, content: resource.content || "" })
                          }
                        >
                          <Play className="w-3 h-3 mr-1" />
                          Read
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => window.open(resource.link, "_blank", "noopener,noreferrer")}
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          {resource.type === "audio" ? "Listen" : "Watch"}
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
          
          {filteredResources.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No resources found</h3>
              <p className="text-muted-foreground">Try adjusting your category filter.</p>
            </div>
          )}
        </div>
        
        {/* Language Support Notice */}
        <div className="max-w-4xl mx-auto mt-12">
          <Card className="bg-soft-green border-secondary">
            <div className="p-6 text-center">
              <h3 className="font-semibold text-secondary mb-2">Multilingual Support</h3>
              <p className="text-sm text-muted-foreground">
                Our resources are available in English, Hindi, Tamil, Bengali, and more regional languages. 
                We're continuously adding content to support students from diverse linguistic backgrounds.
              </p>
            </div>
          </Card>
        </div>
      </div>

      {/* Guide Reading Dialog */}
      <Dialog open={!!openGuide} onOpenChange={(open) => !open && setOpenGuide(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{openGuide?.title}</DialogTitle>
            <DialogDescription className="sr-only">
              Full guide content
            </DialogDescription>
          </DialogHeader>
          <div className="whitespace-pre-line text-sm text-foreground leading-relaxed pt-2">
            {openGuide?.content}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Resources;