import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Send, Mic, MicOff, Bot, User, Zap } from "lucide-react";

interface Message {
  id: string;
  content: string;
  sender: "user" | "bot";
  timestamp: Date;
}

const energyResponses = [
  "Today's solar generation is 1,250 kWh, which is 15% above average for this time of year.",
  "Current battery charge level is at 78%. The system is operating efficiently.",
  "Wind turbines are generating 85 kW right now. Wind conditions are favorable.",
  "Grid connection is stable. We're currently feeding 45 kW back to the grid.",
  "Energy efficiency has improved by 12% this month compared to last month.",
  "All energy systems are operating within normal parameters.",
  "Peak energy demand today was 180 kW at 2:30 PM.",
  "Carbon footprint reduced by 2.3 tons CO2 this week through renewable energy."
];

export const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello! I'm your AI Energy Assistant. I can help you with energy statistics, system status, and provide insights about your campus energy management. What would you like to know?",
      sender: "bot",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const generateBotResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();
    
    if (lowerMessage.includes("solar")) {
      return energyResponses[0];
    } else if (lowerMessage.includes("battery")) {
      return energyResponses[1];
    } else if (lowerMessage.includes("wind")) {
      return energyResponses[2];
    } else if (lowerMessage.includes("grid")) {
      return energyResponses[3];
    } else if (lowerMessage.includes("efficiency")) {
      return energyResponses[4];
    } else if (lowerMessage.includes("status") || lowerMessage.includes("system")) {
      return energyResponses[5];
    } else if (lowerMessage.includes("peak") || lowerMessage.includes("demand")) {
      return energyResponses[6];
    } else if (lowerMessage.includes("carbon") || lowerMessage.includes("environment")) {
      return energyResponses[7];
    } else {
      return energyResponses[Math.floor(Math.random() * energyResponses.length)];
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      content: inputMessage,
      sender: "user",
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsTyping(true);

    // Simulate AI processing delay
    setTimeout(() => {
      const botResponse: Message = {
        id: `bot-${Date.now()}`,
        content: generateBotResponse(inputMessage),
        sender: "bot",
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  const toggleListening = () => {
    setIsListening(!isListening);
    // In a real implementation, this would start/stop speech recognition
    if (!isListening) {
      setTimeout(() => {
        setIsListening(false);
        // Simulate voice input
        setInputMessage("What's the current energy status?");
      }, 2000);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Chat Header */}
      <Card className="energy-card border-primary/20">
        <CardHeader>
          <CardTitle className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <span>AI Energy Assistant</span>
              <div className="flex items-center space-x-2 mt-1">
                <Badge variant="outline" className="text-xs bg-success/10 text-success border-success/20">
                  Online
                </Badge>
                <Badge variant="outline" className="text-xs">
                  Voice Enabled
                </Badge>
              </div>
            </div>
          </CardTitle>
        </CardHeader>
      </Card>

      {/* Chat Messages */}
      <Card className="energy-card">
        <CardContent className="p-0">
          <div className="h-96 overflow-y-auto p-6 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex max-w-xs lg:max-w-md space-x-3 ${
                  message.sender === "user" ? "flex-row-reverse space-x-reverse" : "flex-row"
                }`}>
                  <div className={`p-2 rounded-full ${
                    message.sender === "user" 
                      ? "bg-primary/10" 
                      : "bg-accent/10"
                  }`}>
                    {message.sender === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}>
                    <p className="text-sm">{message.content}</p>
                    <p className="text-xs mt-1 opacity-70">
                      {message.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex space-x-3">
                  <div className="p-2 rounded-full bg-accent/10">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="p-3 rounded-lg bg-muted">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                      <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Chat Input */}
          <div className="border-t border-border/50 p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about energy stats, system status, or efficiency..."
                className="flex-1"
                disabled={isListening}
              />
              <Button
                variant={isListening ? "destructive" : "outline"}
                size="icon"
                onClick={toggleListening}
                className="shrink-0"
              >
                {isListening ? (
                  <MicOff className="w-4 h-4" />
                ) : (
                  <Mic className="w-4 h-4" />
                )}
              </Button>
              <Button onClick={sendMessage} disabled={!inputMessage.trim() || isListening}>
                <Send className="w-4 h-4" />
              </Button>
            </div>
            {isListening && (
              <div className="mt-2 text-sm text-primary flex items-center space-x-2">
                <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                <span>Listening... Speak now</span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          "Solar status",
          "Battery level", 
          "Wind output",
          "Energy efficiency"
        ].map((action) => (
          <Button
            key={action}
            variant="outline"
            onClick={() => setInputMessage(action)}
            className="text-sm"
          >
            <Zap className="w-3 h-3 mr-2" />
            {action}
          </Button>
        ))}
      </div>
    </div>
  );
};