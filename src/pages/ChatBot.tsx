import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Send, Bot, User, Heart, AlertTriangle, BookOpen, ArrowRight } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
  emotion?: string;
}

interface ResourceSuggestion {
  title: string;
  description: string;
  emoji: string;
}

// Maps each detected emotion to relevant resources from the Resource Hub
const resourceSuggestionsMap: Record<string, ResourceSuggestion[]> = {
  anxiety: [
    { title: "Breathing Exercises for Anxiety", description: "8 min video — simple techniques to calm your mind", emoji: "🧘‍♀️" },
    { title: "Progressive Muscle Relaxation", description: "12 min video — release physical tension from stress", emoji: "💆‍♂️" },
  ],
  sadness: [
    { title: "Overcoming Loneliness - Bengali Audio Series", description: "45 min — building meaningful connections", emoji: "🤝" },
    { title: "Building Self-Confidence Workbook", description: "30 min read — exercises to build self-esteem", emoji: "⭐" },
  ],
  "academic stress": [
    { title: "Managing Academic Stress - Complete Guide", description: "10 min read — coursework pressure & time management", emoji: "📚" },
    { title: "Quick Energy Boost Techniques", description: "5 min video — combat fatigue while studying", emoji: "⚡" },
  ],
  loneliness: [
    { title: "Overcoming Loneliness - Bengali Audio Series", description: "45 min — building meaningful connections", emoji: "🤝" },
    { title: "Mindfulness for Students in Tamil", description: "20 min audio — mindfulness practices for students", emoji: "🧠" },
  ],
  sleep: [
    { title: "Sleep Meditation in Hindi", description: "15 min audio — soothing guided meditation for rest", emoji: "🌙" },
    { title: "Progressive Muscle Relaxation", description: "12 min video — wind down before bed", emoji: "💆‍♂️" },
  ],
  homesickness: [
    { title: "Overcoming Loneliness - Bengali Audio Series", description: "45 min — building meaningful connections", emoji: "🤝" },
  ],
  "self-doubt": [
    { title: "Building Self-Confidence Workbook", description: "30 min read — exercises to build self-esteem", emoji: "⭐" },
  ],
  family: [
    { title: "Building Self-Confidence Workbook", description: "30 min read — exercises to build self-esteem", emoji: "⭐" },
  ],
  relationship: [
    { title: "Building Self-Confidence Workbook", description: "30 min read — exercises to build self-esteem", emoji: "⭐" },
  ],
  "financial stress": [
    { title: "Quick Energy Boost Techniques", description: "5 min video — combat fatigue when things feel heavy", emoji: "⚡" },
  ],
  anger: [
    { title: "Progressive Muscle Relaxation", description: "12 min video — release physical tension", emoji: "💆‍♂️" },
    { title: "Breathing Exercises for Anxiety", description: "8 min video — techniques to calm intense emotion", emoji: "🧘‍♀️" },
  ],
  motivation: [
    { title: "Quick Energy Boost Techniques", description: "5 min video — combat fatigue and low motivation", emoji: "⚡" },
  ],
  happy: [
    { title: "Building Self-Confidence Workbook", description: "30 min read — keep the momentum going", emoji: "⭐" },
  ],
};

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [moodResult, setMoodResult] = useState<string | null>(null);
  const [moodResources, setMoodResources] = useState<ResourceSuggestion[]>([]);
  const [moodEmoji, setMoodEmoji] = useState("🙂");
  const [language, setLanguage] = useState("en"); // ✅ NEW

  // Load chat history from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("chatHistory");
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Message[];
        const restored = parsed.map(m => ({ ...m, timestamp: new Date(m.timestamp) }));
        setMessages(restored);
        return;
      } catch {}
    }
    setMessages([
      {
        id: "1",
        content: "Hello! I'm Saathi, your mental health support companion. I'm here to listen and provide helpful resources. How are you feeling today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  }, []);

  // Save chat history
  useEffect(() => {
    localStorage.setItem("chatHistory", JSON.stringify(messages));
  }, [messages]);

  // --- Emotion Detection ---
  const detectEmotion = (message: string): string => {
    const input = message.toLowerCase();
    if (
      input.includes("suicide") ||
      input.includes("kill myself") ||
      input.includes("self-harm") ||
      input.includes("self harm") ||
      input.includes("hurt myself") ||
      input.includes("end my life") ||
      input.includes("want to die")
    )
      return "crisis";
    if (input.includes("stress") || input.includes("anxious") || input.includes("worried") || input.includes("panic"))
      return "anxiety";
    if (input.includes("sad") || input.includes("depressed") || input.includes("down") || input.includes("crying") || input.includes("hopeless"))
      return "sadness";
    if (input.includes("exam") || input.includes("test") || input.includes("study") || input.includes("assignment") || input.includes("coursework"))
      return "academic stress";
    if (input.includes("lonely") || input.includes("alone") || input.includes("isolated") || input.includes("no friends"))
      return "loneliness";
    if (input.includes("sleep") || input.includes("insomnia") || input.includes("can't sleep") || input.includes("tired") || input.includes("exhausted"))
      return "sleep";
    if (input.includes("homesick") || input.includes("miss home") || input.includes("miss my family"))
      return "homesickness";
    if (input.includes("imposter") || input.includes("not good enough") || input.includes("not smart enough") || input.includes("self-doubt") || input.includes("self doubt") || input.includes("don't belong"))
      return "self-doubt";
    if (input.includes("family") || input.includes("parents") || input.includes("mom") || input.includes("dad"))
      return "family";
    if (input.includes("breakup") || input.includes("relationship") || input.includes("boyfriend") || input.includes("girlfriend") || input.includes("partner"))
      return "relationship";
    if (input.includes("money") || input.includes("financial") || input.includes("afford") || input.includes("debt") || input.includes("tuition"))
      return "financial stress";
    if (input.includes("angry") || input.includes("frustrated") || input.includes("furious") || input.includes("irritated"))
      return "anger";
    if (input.includes("procrastinat") || input.includes("can't focus") || input.includes("unmotivated") || input.includes("no motivation"))
      return "motivation";
    if (input.includes("happy") || input.includes("joy") || input.includes("glad") || input.includes("excited"))
      return "happy";
    return "neutral";
  };

  // --- Send Message ---
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputMessage,
      sender: "user",
      timestamp: new Date(),
      emotion: detectEmotion(inputMessage),
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = inputMessage;
    setInputMessage("");
    setIsTyping(true);

    // Try the real AI first; if it's unavailable, fall back to the
    // rule-based responses so the chat never breaks for the user.
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: currentInput, language }),
      });

      if (!response.ok) throw new Error("AI request failed");

      const data = await response.json();

      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: data.reply,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (err) {
      const botResponse: Message = {
        id: (Date.now() + 1).toString(),
        content: getBotResponse(currentInput),
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
    } finally {
      setIsTyping(false);
    }
  };

  // --- Bot Reply Rules ---
  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    // Crisis — always checked first, always gives direct help
    if (
      input.includes("suicide") ||
      input.includes("kill myself") ||
      input.includes("self-harm") ||
      input.includes("self harm") ||
      input.includes("hurt myself") ||
      input.includes("end my life") ||
      input.includes("want to die")
    ) {
      return language === "hi"
        ? "मुझे खुशी है कि आपने यह साझा किया, और मैं चाहता हूं कि आप जानें कि आप अकेले नहीं हैं। कृपया अभी आपातकालीन सेवाओं (112) या हमारी क्राइसिस हेल्पलाइन 1800-123-4567 से संपर्क करें। कोई है जो अभी आपकी मदद करना चाहता है।"
        : "I'm really glad you shared that, and I want you to know you're not alone. Please reach out right now to emergency services (911) or our crisis helpline at 1800-123-4567. There is someone available to help you immediately.";
    }

    // Stress / Anxiety
    if (input.includes("stress") || input.includes("anxious") || input.includes("worried") || input.includes("panic")) {
      return language === "hi"
        ? "मैं समझता हूँ कि आप तनाव या चिंता महसूस कर रहे हैं। गहरी साँस लें: 4 सेकंड अंदर और 6 सेकंड बाहर। क्या आप चाहेंगे कि मैं आपको गाइड करूँ?"
        : "I understand you're feeling stressed or anxious. These feelings are normal. Try deep breathing: inhale for 4 sec, exhale for 6 sec. Would you like me to guide you?";
    }

    // Sadness
    if (input.includes("sad") || input.includes("depressed") || input.includes("down") || input.includes("crying") || input.includes("hopeless")) {
      return language === "hi"
        ? "मैं समझ सकता हूँ कि आप कठिन समय से गुजर रहे हैं। आप अकेले नहीं हैं। किसी से बात करना मददगार हो सकता है — क्या आप काउंसलर की जानकारी चाहते हैं?"
        : "I hear that you're going through a tough time. You're not alone. Talking to someone can really help — would you like info about counselors?";
    }

    // Exam / Studies
    if (input.includes("exam") || input.includes("test") || input.includes("study") || input.includes("assignment") || input.includes("coursework")) {
      return language === "hi"
        ? "परीक्षा का दबाव कठिन हो सकता है! पोमोडोरो तकनीक आज़माएँ (25 मिनट पढ़ाई + 5 मिनट ब्रेक)। क्या आप अपनी देखभाल कर रहे हैं?"
        : "Exam pressure can be tough! Try the Pomodoro technique (25 min study + 5 min break). Also, don't forget rest & food. Are you taking care of yourself?";
    }

    // Loneliness
    if (input.includes("lonely") || input.includes("alone") || input.includes("isolated") || input.includes("no friends")) {
      return language === "hi"
        ? "अकेलापन महसूस करना कठिन है। आप हमारे पीयर फ़ोरम में जुड़ सकते हैं। क्या आपके पास कोई भरोसेमंद व्यक्ति है जिससे आप बात कर सकें?"
        : "Feeling lonely is hard. You can try connecting in our peer forum. Is there anyone you trust to talk to?";
    }

    // Sleep
    if (input.includes("sleep") || input.includes("insomnia") || input.includes("can't sleep") || input.includes("tired") || input.includes("exhausted")) {
      return language === "hi"
        ? "नींद न आना बहुत थका देने वाला हो सकता है। सोने से पहले स्क्रीन टाइम कम करने और एक निश्चित सोने का समय रखने की कोशिश करें। क्या आप हमारी स्लीप मेडिटेशन रिकॉर्डिंग सुनना चाहेंगे?"
        : "Trouble sleeping can be really draining. Try cutting screen time before bed and keeping a consistent sleep schedule. Would you like to try one of our guided sleep meditations?";
    }

    // Homesickness
    if (input.includes("homesick") || input.includes("miss home") || input.includes("miss my family")) {
      return language === "hi"
        ? "घर की याद आना बहुत स्वाभाविक है, खासकर जब आप नई जगह पर हों। नियमित रूप से परिवार से बात करना और अपने कमरे को घर जैसा महसूस कराना मदद कर सकता है।"
        : "Homesickness is completely natural, especially somewhere new. Staying in regular touch with family and making your space feel a little more like home can really help.";
    }

    // Self-doubt / Imposter syndrome
    if (input.includes("imposter") || input.includes("not good enough") || input.includes("not smart enough") || input.includes("self-doubt") || input.includes("self doubt") || input.includes("don't belong")) {
      return language === "hi"
        ? "यह महसूस करना कि आप 'काफी अच्छे नहीं' हैं, बहुत आम है — इसे इम्पॉस्टर सिंड्रोम कहा जाता है, और कई सफल लोग भी इसे महसूस करते हैं। आप यहाँ होने के हकदार हैं।"
        : "Feeling like you're 'not good enough' is really common — it's often called imposter syndrome, and even highly accomplished people feel it. You've earned your place here.";
    }

    // Family
    if (input.includes("family") || input.includes("parents") || input.includes("mom") || input.includes("dad")) {
      return language === "hi"
        ? "पारिवारिक रिश्ते जटिल हो सकते हैं। क्या आप बता सकते हैं कि क्या हो रहा है? कभी-कभी किसी तटस्थ व्यक्ति से बात करना नजरिया साफ करने में मदद करता है।"
        : "Family dynamics can be really complicated. Would you like to share what's going on? Sometimes talking it through with a neutral third party can help bring some clarity.";
    }

    // Relationship
    if (input.includes("breakup") || input.includes("relationship") || input.includes("boyfriend") || input.includes("girlfriend") || input.includes("partner")) {
      return language === "hi"
        ? "रिश्तों में उतार-चढ़ाव भावनात्मक रूप से थका देने वाले हो सकते हैं। अपनी भावनाओं को महसूस करने का समय दें — यह ठीक है।"
        : "Relationship ups and downs can be emotionally exhausting. It's okay to give yourself time to feel whatever you're feeling right now.";
    }

    // Financial stress
    if (input.includes("money") || input.includes("financial") || input.includes("afford") || input.includes("debt") || input.includes("tuition")) {
      return language === "hi"
        ? "पैसों की चिंता तनावपूर्ण हो सकती है। कई कॉलेज छात्रों को वित्तीय सहायता या परामर्श सेवाएं प्रदान करते हैं — क्या आप जानना चाहेंगे कि कहाँ से शुरू करें?"
        : "Money worries can weigh heavily on you. Many colleges offer financial aid or advising services — would you like to know where to start looking?";
    }

    // Anger / frustration
    if (input.includes("angry") || input.includes("frustrated") || input.includes("furious") || input.includes("irritated")) {
      return language === "hi"
        ? "गुस्सा या निराशा महसूस करना पूरी तरह से मान्य है। एक पल के लिए रुकें और गहरी सांस लें — क्या आप बताना चाहेंगे कि क्या हुआ?"
        : "Feeling angry or frustrated is completely valid. Take a moment to pause and breathe — would you like to share what happened?";
    }

    // Motivation / procrastination
    if (input.includes("procrastinat") || input.includes("can't focus") || input.includes("unmotivated") || input.includes("no motivation")) {
      return language === "hi"
        ? "प्रेरणा की कमी महसूस करना आम है, खासकर जब आप थके हुए हों। एक छोटा, आसान कदम उठाने की कोशिश करें — कभी-कभी शुरुआत करना ही सबसे कठिन हिस्सा होता है।"
        : "Feeling unmotivated happens to everyone, especially when you're stretched thin. Try starting with one small, easy step — often getting started is the hardest part.";
    }

    // Happiness
    if (input.includes("happy") || input.includes("joy") || input.includes("glad") || input.includes("excited")) {
      return language === "hi"
        ? "यह सुनकर बहुत अच्छा लगा! 😊 खुश रहिए और सकारात्मक ऊर्जा फैलाइए!"
        : "That's wonderful to hear! 😊 Keep enjoying the good vibes and spreading positivity!";
    }

    // Gratitude
    if (input.includes("thank") || input.includes("grateful") || input.includes("appreciate")) {
      return language === "hi"
        ? "मुझे खुशी है कि मैं मदद कर सका 💙। याद रखिए, आप सहायता लेकर बहुत अच्छा कर रहे हैं!"
        : "I'm glad I could help 💙. Remember, you're doing great by seeking support!";
    }

    // Default Fallback
    return language === "hi"
      ? "आपके विचार साझा करने के लिए धन्यवाद। हर किसी का अनुभव अलग होता है — क्या आप और बता सकते हैं?"
      : "Thanks for sharing 💙. Everyone's journey is unique — can you tell me more about what's on your mind?";
  };

  // Quick Responses
  const quickResponses = [
    "I'm feeling anxious about exams",
    "I'm having trouble sleeping",
    "I feel overwhelmed with coursework",
    "I'm feeling lonely at university",
    "I feel like an imposter in my program",
    "I'm homesick and miss my family",
    "I'm stressed about money",
    "I'm feeling happy today 😊",
  ];

  // Clear Chat
  const clearChat = () => {
    localStorage.removeItem("chatHistory");
    setMessages([
      {
        id: "1",
        content:
          "Hello! I'm Saathi, your mental health support companion. I'm here to listen and provide helpful resources. How are you feeling today?",
        sender: "bot",
        timestamp: new Date(),
      },
    ]);
  };

  // Analyze Mood (text summary)
  const analyzeMood = (history: Message[]) => {
    const counts: Record<string, number> = {};
    history.forEach((m) => {
      if (m.sender !== "user") return;
      const e = m.emotion || "neutral";
      counts[e] = (counts[e] || 0) + 1;
    });
    const totalUser = history.filter((h) => h.sender === "user").length || 1;
    let summary = `User messages: ${totalUser}\n\nEmotion counts:\n`;
    Object.entries(counts).forEach(([k, v]) => (summary += `${k}: ${v}\n`));
    const anxiety = counts["anxiety"] || 0;
    const sadness = counts["sadness"] || 0;
    if (anxiety + sadness >= 3)
      summary += `\n⚠ Suggestion: User may be under elevated distress. Consider counselor support.`;
    return summary;
  };

  // --- Pick Resource Suggestions based on top detected emotions ---
  const getResourceSuggestions = (history: Message[]): ResourceSuggestion[] => {
    const counts: Record<string, number> = {};
    history.forEach((m) => {
      if (m.sender !== "user") return;
      const e = m.emotion || "neutral";
      if (e === "neutral") return;
      counts[e] = (counts[e] || 0) + 1;
    });

    const sortedEmotions = Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([emotion]) => emotion);

    const suggestions: ResourceSuggestion[] = [];
    const seenTitles = new Set<string>();

    for (const emotion of sortedEmotions) {
      const matches = resourceSuggestionsMap[emotion] || [];
      for (const resource of matches) {
        if (!seenTitles.has(resource.title)) {
          suggestions.push(resource);
          seenTitles.add(resource.title);
        }
      }
      if (suggestions.length >= 3) break;
    }

    return suggestions.slice(0, 3);
  };

  // --- Mood Emoji (overall) ---
  const analyzeMoodEmoji = (history: Message[]): string => {
    if (history.length === 0) return "🙂";

    const userMsgs = history.filter(m => m.sender === "user");
    let score = 0;

    userMsgs.forEach(m => {
      if (
        m.emotion === "sadness" ||
        m.emotion === "anxiety" ||
        m.emotion === "loneliness" ||
        m.emotion === "self-doubt" ||
        m.emotion === "crisis"
      ) {
        score -= 1;
      }
      if (
        m.emotion === "academic stress" ||
        m.emotion === "sleep" ||
        m.emotion === "homesickness" ||
        m.emotion === "family" ||
        m.emotion === "relationship" ||
        m.emotion === "financial stress" ||
        m.emotion === "anger" ||
        m.emotion === "motivation"
      ) {
        score -= 0.5;
      }
      if (m.emotion === "happy") {
        score += 2;
      }
    });

    if (score > 1) return "😊";
    if (score === 1) return "🙂";
    if (score < 0) return "😔";
    return "😐";
  };

  // Update emoji whenever messages change
  useEffect(() => {
    setMoodEmoji(analyzeMoodEmoji(messages));
  }, [messages]);

  // Export Chat
  const exportChatJSON = () => {
    const dataStr =
      "data:text/json;charset=utf-8," +
      encodeURIComponent(JSON.stringify(messages, null, 2));
    const a = document.createElement("a");
    a.href = dataStr;
    a.download = `saathi_chat_${Date.now()}.json`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-calm py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 bg-gradient-primary rounded-full flex items-center justify-center">
              <Bot className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Talk to Saathi</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Your AI mental health companion is here to listen and provide support. Share what's on
            your mind in a safe, judgment-free space.
          </p>
        </div>

        {/* Emergency Notice */}
        <Card className="mb-6 border-accent bg-accent-light">
          <div className="p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-accent mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-accent">Emergency Support</p>
              <p className="text-accent/80 mt-1">
                If you're having thoughts of self-harm, please contact emergency services (911) or
                our crisis helpline: 1800-123-4567
              </p>
            </div>
          </div>
        </Card>

        {/* Mood Emoji Display */}
        <div className="px-6 pb-4 flex items-center gap-2">
          <span className="text-2xl">{moodEmoji}</span>
          <p className="text-sm text-muted-foreground">Overall Mood</p>
        </div>

        {/* Chat Interface */}
        <Card className="card-calm">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.sender === "bot" && (
                  <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center flex-shrink-0">
                    <Heart className="w-4 h-4 text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] p-4 rounded-2xl ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground ml-auto"
                      : "bg-muted text-foreground"
                  }`}
                >
                  <p className="text-sm leading-relaxed">{message.content}</p>
                  {message.sender === "user" && message.emotion && (
                    <p className="text-xs opacity-70 mt-1">
                      Emotion: {message.emotion}{" "}
                      {message.emotion === "happy" ? "😊" : ""}
                    </p>
                  )}
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
                {message.sender === "user" && (
                  <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
              </div>
            ))}

            {isTyping && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 bg-gradient-primary rounded-full flex items-center justify-center">
                  <Heart className="w-4 h-4 text-white" />
                </div>
                <div className="bg-muted p-4 rounded-2xl">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                    <div
                      className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                      style={{ animationDelay: "0.4s" }}
                    ></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Quick Responses */}
          <div className="px-6 pb-4">
            <p className="text-sm text-muted-foreground mb-3">Quick responses:</p>
            <div className="flex flex-wrap gap-2 mb-4">
              {quickResponses.map((response, index) => (
                <Button
                  key={index}
                  variant="outline"
                  size="sm"
                  onClick={() => setInputMessage(response)}
                  className="text-xs h-8"
                >
                  {response}
                </Button>
              ))}
            </div>
          </div>

          {/* Actions Row */}
          <div className="flex gap-3 px-6 pb-4 items-center">
            <Button variant="outline" onClick={clearChat}>Clear Chat</Button>
            <Button
              variant="outline"
              onClick={() => {
                setMoodResult(analyzeMood(messages));
                setMoodResources(getResourceSuggestions(messages));
              }}
            >
              Analyze Mood
            </Button>
            <Button variant="outline" onClick={exportChatJSON}>Export Chat</Button>

            {/* ✅ NEW Language Dropdown */}
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="border rounded px-2 py-1 text-sm"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
          </div>

          {moodResult && (
            <div className="px-6 pb-4 space-y-3">
              <Card className="bg-muted p-3 text-sm">
                <p className="whitespace-pre-line">{moodResult}</p>
              </Card>

              {moodResources.length > 0 && (
                <Card className="p-4 bg-soft-green border-secondary">
                  <div className="flex items-center gap-2 mb-3">
                    <BookOpen className="w-4 h-4 text-secondary" />
                    <p className="font-medium text-secondary text-sm">
                      Resources that might help
                    </p>
                  </div>
                  <div className="space-y-2">
                    {moodResources.map((resource, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between bg-white/60 rounded-lg p-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xl">{resource.emoji}</span>
                          <div>
                            <p className="text-sm font-medium text-foreground">
                              {resource.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {resource.description}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Link to="/resources">
                    <Button size="sm" variant="outline" className="mt-3 w-full">
                      Browse Resource Hub
                      <ArrowRight className="w-3 h-3 ml-2" />
                    </Button>
                  </Link>
                </Card>
              )}
            </div>
          )}

          {/* Input */}
          <div className="border-t border-border p-6">
            <div className="flex gap-3">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Type your message here..."
                onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                className="flex-1"
              />
              <Button onClick={handleSendMessage} disabled={!inputMessage.trim() || isTyping}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ChatBot;
