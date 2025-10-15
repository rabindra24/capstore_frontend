import React, { useState } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Mic, Send, Smile, Plus, Menu, ArrowLeft } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface Chat {
  id: string;
  name: string;
  avatar?: string;
  lastMessage: string;
  timestamp: string;
  unread: number;
  isOnline: boolean;
}

interface Message {
  id: string;
  text: string;
  timestamp: string;
  isSent: boolean;
  isRead: boolean;
}

const mockChats: Chat[] = [
  {
    id: '1',
    name: 'John Doe',
    lastMessage: 'Hey, how are you doing?',
    timestamp: '2:30 PM',
    unread: 2,
    isOnline: true
  },
  {
    id: '2',
    name: 'Sarah Wilson',
    lastMessage: 'The meeting is scheduled for tomorrow',
    timestamp: '1:45 PM',
    unread: 0,
    isOnline: false
  },
  {
    id: '3',
    name: 'Team Marketing',
    lastMessage: 'Great job on the campaign!',
    timestamp: '12:15 PM',
    unread: 5,
    isOnline: true
  },
  {
    id: '4',
    name: 'Alex Chen',
    lastMessage: 'Can you send me the report?',
    timestamp: '11:30 AM',
    unread: 1,
    isOnline: true
  }
];

const mockMessages: Message[] = [
  {
    id: '1',
    text: 'Hey, how are you doing?',
    timestamp: '2:25 PM',
    isSent: false,
    isRead: true
  },
  {
    id: '2',
    text: 'I\'m doing great! Just working on the new project.',
    timestamp: '2:27 PM',
    isSent: true,
    isRead: true
  },
  {
    id: '3',
    text: 'That sounds exciting! How is it going so far?',
    timestamp: '2:28 PM',
    isSent: false,
    isRead: true
  },
  {
    id: '4',
    text: 'Really well! The AI assistant features are coming along nicely. I think users will love the new chat interface.',
    timestamp: '2:30 PM',
    isSent: true,
    isRead: false
  }
];

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState<Chat | null>(mockChats[0]);
  const [newMessage, setNewMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const isMobile = useIsMobile();

  const filteredChats = mockChats.filter(chat =>
    chat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      // In a real app, this would send the message to the backend
      console.log('Sending message:', newMessage);
      setNewMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const chatListSidebar = (
    <div className="h-full border-r border-border/50 bg-card/30 backdrop-blur-sm flex flex-col">
      {/* Search Header */}
      <div className="p-4 border-b border-border/50">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search chats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/20"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => {
                setSelectedChat(chat);
                setSidebarOpen(false);
              }}
              className={`flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200 mb-1 ${
                selectedChat?.id === chat.id ? 'bg-accent shadow-sm' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12 ring-2 ring-background">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {chat.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-semibold truncate text-foreground">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{chat.timestamp}</span>
                </div>
                <div className="flex justify-between items-center gap-2">
                  <p className="text-sm text-muted-foreground truncate flex-1">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5 min-w-5 flex-shrink-0">
                      {chat.unread}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background rounded-lg shadow-elegant overflow-hidden">
      {/* Chat List Sidebar - Desktop */}
      {!isMobile && (
        <div className="w-80 border-r border-border/50 bg-card/30 backdrop-blur-sm">
          {/* Search Header */}
          <div className="p-4 border-b border-border/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search chats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background/50 border-border/50 focus-visible:ring-primary/20"
              />
            </div>
          </div>

          {/* Chat List */}
          <ScrollArea className="h-[calc(100%-5rem)]">
            <div className="p-2">
              {filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => setSelectedChat(chat)}
                  className={`flex items-center gap-3 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-all duration-200 mb-1 ${
                    selectedChat?.id === chat.id ? 'bg-accent shadow-sm' : ''
                  }`}
                >
                  <div className="relative">
                    <Avatar className="h-12 w-12 ring-2 ring-background">
                      <AvatarImage src={chat.avatar} />
                      <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                        {chat.name.split(' ').map(n => n[0]).join('')}
                      </AvatarFallback>
                    </Avatar>
                    {chat.isOnline && (
                      <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-green-500 rounded-full border-2 border-background"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-1">
                      <h3 className="font-semibold truncate text-foreground">{chat.name}</h3>
                      <span className="text-xs text-muted-foreground flex-shrink-0 ml-2">{chat.timestamp}</span>
                    </div>
                    <div className="flex justify-between items-center gap-2">
                      <p className="text-sm text-muted-foreground truncate flex-1">{chat.lastMessage}</p>
                      {chat.unread > 0 && (
                        <Badge className="bg-primary text-primary-foreground text-xs px-2 py-0.5 min-w-5 flex-shrink-0">
                          {chat.unread}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>
      )}

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col bg-gradient-to-b from-background to-muted/20">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="flex items-center gap-3">
              {isMobile && (
                <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="left" className="w-80 p-0">
                    {chatListSidebar}
                  </SheetContent>
                </Sheet>
              )}
              <div className="relative">
                <Avatar className="h-11 w-11 ring-2 ring-primary/10">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                    {selectedChat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {selectedChat.isOnline && (
                  <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-foreground">{selectedChat.name}</h2>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  {selectedChat.isOnline && <span className="h-1.5 w-1.5 bg-green-500 rounded-full"></span>}
                  {selectedChat.isOnline ? 'Online' : 'Last seen recently'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              {!isMobile && (
                <>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent">
                    <Phone className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent">
                    <Video className="h-4 w-4" />
                  </Button>
                </>
              )}
              <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full hover:bg-accent">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 max-w-4xl mx-auto">
              {mockMessages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <div
                    className={`max-w-[70%] lg:max-w-[60%] px-4 py-3 rounded-2xl transition-all hover:shadow-sm ${
                      message.isSent
                        ? 'bg-primary text-primary-foreground rounded-br-sm shadow-md'
                        : 'bg-card border border-border/50 text-card-foreground rounded-bl-sm'
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{message.text}</p>
                    <div className={`flex items-center gap-1.5 mt-2 ${
                      message.isSent ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className={`text-xs ${message.isSent ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                        {message.timestamp}
                      </span>
                      {message.isSent && (
                        <div className="flex">
                          <div className={`h-3.5 w-3.5 ${message.isRead ? 'text-blue-300' : 'text-primary-foreground/50'}`}>
                            <svg viewBox="0 0 16 15" className="w-full h-full fill-current">
                              <path d="M10.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L6.85 8.616 4.2 6.327a.367.367 0 0 0-.51-.063l-.478.372a.365.365 0 0 0-.063.51l3.378 3.646a.367.367 0 0 0 .51.063.365.365 0 0 0 .063-.51L10.973 3.89a.365.365 0 0 0-.063-.574z"/>
                              {message.isRead && (
                                <path d="M16.91 3.316l-.478-.372a.365.365 0 0 0-.51.063L12.85 8.616 10.2 6.327a.367.367 0 0 0-.51-.063l-.478.372a.365.365 0 0 0-.063.51l3.378 3.646a.367.367 0 0 0 .51.063.365.365 0 0 0 .063-.51L16.973 3.89a.365.365 0 0 0-.063-.574z"/>
                              )}
                            </svg>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Message Input */}
          <div className="p-4 border-t border-border/50 bg-background/80 backdrop-blur-sm">
            <div className="flex items-end gap-2 max-w-4xl mx-auto">
              {!isMobile && (
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-accent flex-shrink-0">
                  <Paperclip className="h-5 w-5" />
                </Button>
              )}
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-12 h-12 rounded-full bg-muted/50 border-border/50 focus-visible:ring-primary/20 transition-all"
                />
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-1 top-1/2 transform -translate-y-1/2 h-9 w-9 rounded-full hover:bg-accent"
                >
                  <Smile className="h-5 w-5" />
                </Button>
              </div>
              {newMessage.trim() ? (
                <Button 
                  onClick={handleSendMessage} 
                  size="icon"
                  className="h-10 w-10 rounded-full shadow-md hover:shadow-lg transition-all hover-scale"
                >
                  <Send className="h-5 w-5" />
                </Button>
              ) : !isMobile ? (
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-accent flex-shrink-0">
                  <Mic className="h-5 w-5" />
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gradient-to-b from-background to-muted/20">
          <div className="text-center animate-fade-in">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
              <Send className="h-10 w-10 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2 text-foreground">Select a chat</h3>
            <p className="text-muted-foreground max-w-sm mx-auto">Choose a conversation from the sidebar to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}