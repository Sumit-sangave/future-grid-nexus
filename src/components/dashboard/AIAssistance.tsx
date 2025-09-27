import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, Lightbulb, TrendingDown, Clock, Thermometer, Zap, Leaf } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
// Using crypto.randomUUID() instead of uuid package

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface Recommendation {
  id: string;
  title: string;
  description: string;
  impact: string;
  category: "efficiency" | "cost" | "maintenance" | "environmental";
  priority: "high" | "medium" | "low";
  icon: any;
}

const recommendations: Recommendation[] = [
  {
    id: "1",
    title: "Optimize AC Usage",
    description: "Schedule AC systems to run during peak solar generation hours (10 AM - 3 PM) to maximize renewable energy usage.",
    impact: "15-20% reduction in grid dependency",
    category: "efficiency",
    priority: "high",
    icon: Thermometer
  },
  {
    id: "2",
    title: "Schedule Heavy Loads",
    description: "Move laundry and kitchen equipment operation to morning hours when solar generation is optimal.",
    impact: "25% cost savings on heavy load operations",
    category: "cost",
    priority: "high",
    icon: Clock
  },
  {
    id: "3",
    title: "Battery Maintenance Check",
    description: "Schedule maintenance for Battery Bank 2 - efficiency dropped to 94%. Preventive maintenance recommended.",
    impact: "Prevent 5-10% capacity loss",
    category: "maintenance",
    priority: "medium",
    icon: Zap
  },
  {
    id: "4",
    title: "Peak Load Reduction",
    description: "Implement load shedding during evening peak hours (6-9 PM) to reduce grid consumption costs.",
    impact: "12% reduction in electricity bills",
    category: "cost",
    priority: "medium",
    icon: TrendingDown
  },
  {
    id: "5",
    title: "Green Energy Certification",
    description: "Your campus is eligible for Green Energy Certification with current 78% renewable energy usage.",
    impact: "Potential tax benefits and grants",
    category: "environmental",
    priority: "low",
    icon: Leaf
  }
];

export const AIAssistance = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [sessionId] = useState(crypto.randomUUID());
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Load chat history when component mounts
    loadChatHistory();
  }, [user]);

  const loadChatHistory = async () => {
    if (!user) return;

    const { data: chatHistory, error } = await supabase
      .from('chat_messages')
      .select('*')
      .eq('user_id', user.id)
      .order('timestamp', { ascending: true });

    if (error) {
      console.error('Error loading chat history:', error);
      return;
    }

    if (chatHistory && chatHistory.length > 0) {
      const formattedMessages: ChatMessage[] = [];
      chatHistory.forEach(msg => {
        formattedMessages.push({
          id: `${msg.id}-user`,
          type: 'user',
          content: msg.message,
          timestamp: new Date(msg.timestamp)
        });
        if (msg.response) {
          formattedMessages.push({
            id: `${msg.id}-assistant`,
            type: 'assistant',
            content: msg.response,
            timestamp: new Date(msg.timestamp)
          });
        }
      });
      setMessages(formattedMessages);
    }
  };

  const saveChatMessage = async (message: string, response: string) => {
    if (!user) return;

    const { error } = await supabase
      .from('chat_messages')
      .insert({
        user_id: user.id,
        message,
        response,
        session_id: sessionId
      });

    if (error) {
      console.error('Error saving chat message:', error);
    }
  };

  const generateResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    if (message.includes('optimize') || message.includes('efficiency')) {
      return "Based on your current energy data, I recommend implementing the AC optimization schedule. This could reduce your grid dependency by 15-20% and save approximately $280 per month. Would you like me to create an automated schedule for your HVAC systems?";
    }
    
    if (message.includes('cost') || message.includes('save') || message.includes('money')) {
      return "Your current energy costs can be reduced by approximately 18% through load scheduling and peak hour management. The biggest opportunity is shifting heavy loads to solar peak hours (10 AM - 3 PM). This could save around $450 monthly. Shall I prepare a detailed cost optimization plan?";
    }
    
    if (message.includes('battery') || message.includes('storage')) {
      return "Your battery system is performing well at 96% health. Current charge level is 78% with 12 hours runtime. I notice Battery Bank 2 efficiency has dropped slightly - I recommend scheduling maintenance within the next 2 weeks to prevent capacity loss. Would you like me to alert the maintenance team?";
    }
    
    if (message.includes('solar') || message.includes('renewable')) {
      return "Excellent question! Your solar generation is currently producing 180 kW. Tomorrow's forecast shows sunny conditions with expected generation of 320.5 kWh. Your renewable energy percentage is 78% - putting you in the top 15% of educational institutions. The solar panels are performing 12% above manufacturer specifications.";
    }
    
    if (message.includes('maintenance') || message.includes('repair')) {
      return "Current maintenance priorities: 1) Battery Bank 2 efficiency check (medium priority), 2) Wind turbine blade cleaning due next week, 3) Solar panel inspection scheduled for month-end. All critical systems are operating within normal parameters. Would you like detailed maintenance schedules?";
    }
    
    if (message.includes('hello') || message.includes('hi') || message.includes('help')) {
      return "Hello! I'm your AI Energy Assistant. I can help you with energy optimization, cost savings, maintenance scheduling, and system analysis. I have access to your real-time energy data and can provide insights on solar generation, battery status, and efficiency improvements. What would you like to know about your energy systems?";
    }
    
    return "I understand you're asking about energy management. Based on your current campus data, I can provide insights on efficiency optimization, cost reduction strategies, maintenance schedules, and renewable energy performance. Could you be more specific about what aspect you'd like me to analyze? I'm here to help optimize your smart energy system!";
  };

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMessage: ChatMessage = {
      id: crypto.randomUUID(),
      type: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    // Simulate AI response delay
    setTimeout(async () => {
      const response = generateResponse(inputMessage);
      const assistantMessage: ChatMessage = {
        id: crypto.randomUUID(),
        type: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setIsLoading(false);

      // Save to database
      await saveChatMessage(inputMessage, response);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "efficiency": return "bg-primary/10 text-primary";
      case "cost": return "bg-accent/10 text-accent";
      case "maintenance": return "bg-warning/10 text-warning";
      case "environmental": return "bg-success/10 text-success";
      default: return "bg-muted/10 text-muted-foreground";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "border-destructive/20 bg-destructive/5";
      case "medium": return "border-warning/20 bg-warning/5";
      case "low": return "border-success/20 bg-success/5";
      default: return "border-muted/20 bg-muted/5";
    }
  };

  return (
    <div className="space-y-6">
      {/* AI Recommendations */}
      <Card className="energy-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Lightbulb className="w-5 h-5" />
            <span>AI Recommendations & Insights</span>
            <Badge variant="outline" className="bg-primary/10 text-primary border-primary/20">
              {recommendations.filter(r => r.priority === 'high').length} High Priority
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {recommendations.map((rec) => {
              const Icon = rec.icon;
              return (
                <div 
                  key={rec.id} 
                  className={`p-4 border rounded-lg ${getPriorityColor(rec.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className={`p-2 rounded-lg ${getCategoryColor(rec.category)}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{rec.title}</h4>
                        <Badge 
                          variant="outline"
                          className={rec.priority === 'high' ? 'border-destructive text-destructive' : 
                                   rec.priority === 'medium' ? 'border-warning text-warning' : 
                                   'border-success text-success'}
                        >
                          {rec.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{rec.description}</p>
                      <div className="text-xs font-medium text-primary">{rec.impact}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* AI Chat Interface */}
      <Card className="energy-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Bot className="w-5 h-5" />
            <span>AI Energy Assistant</span>
            <Badge variant="outline" className="bg-success/10 text-success border-success/20">
              Online
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="flex flex-col h-96">
            <ScrollArea className="flex-1 p-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {messages.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Ask me anything about your energy systems!</p>
                    <p className="text-sm mt-2">Try: "How can I optimize my energy costs?" or "What's my battery status?"</p>
                  </div>
                )}
                {messages.map((message) => (
                  <div 
                    key={message.id} 
                    className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div 
                      className={`max-w-[80%] p-3 rounded-lg ${
                        message.type === 'user' 
                          ? 'bg-primary text-primary-foreground' 
                          : 'bg-muted/50 text-foreground'
                      }`}
                    >
                      <div className="text-sm">{message.content}</div>
                      <div className="text-xs mt-1 opacity-70">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-muted/50 p-3 rounded-lg">
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce"></div>
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                        <div className="w-2 h-2 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                      </div>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>
            
            <div className="p-4 border-t border-border/50">
              <div className="flex space-x-2">
                <Input
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Ask about energy optimization, costs, or system status..."
                  disabled={isLoading}
                />
                <Button 
                  onClick={handleSendMessage}
                  disabled={!inputMessage.trim() || isLoading}
                  size="icon"
                >
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};