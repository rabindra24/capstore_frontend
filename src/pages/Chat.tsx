import React, { useState } from 'react';
import { Search, Phone, Video, MoreVertical, Paperclip, Mic, Send, Smile } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';

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

  return (
    <div className="flex h-[calc(100vh-8rem)] bg-background rounded-lg border overflow-hidden">
      {/* Chat List Sidebar */}
      <div className="w-80 border-r bg-muted/30">
        {/* Search Header */}
        <div className="p-4 border-b bg-background">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-muted/50"
            />
          </div>
        </div>

        {/* Chat List */}
        <ScrollArea className="flex-1">
          {filteredChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`flex items-center gap-3 p-4 hover:bg-muted/50 cursor-pointer transition-colors border-b ${
                selectedChat?.id === chat.id ? 'bg-muted/50' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 h-4 w-4 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-center">
                  <h3 className="font-medium truncate">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                </div>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  {chat.unread > 0 && (
                    <span className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1 min-w-5 text-center">
                      {chat.unread}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </ScrollArea>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="flex items-center justify-between p-4 border-b bg-background">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedChat.avatar} />
                  <AvatarFallback>{selectedChat.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                {selectedChat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-green-500 rounded-full border-2 border-background"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold">{selectedChat.name}</h2>
                <p className="text-xs text-muted-foreground">
                  {selectedChat.isOnline ? 'Online' : 'Last seen recently'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Phone className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4 bg-muted/10">
            <div className="space-y-4">
              {mockMessages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isSent ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
                      message.isSent
                        ? 'bg-primary text-primary-foreground rounded-br-md'
                        : 'bg-background border rounded-bl-md'
                    }`}
                  >
                    <p className="text-sm">{message.text}</p>
                    <div className={`flex items-center gap-1 mt-1 ${
                      message.isSent ? 'justify-end' : 'justify-start'
                    }`}>
                      <span className="text-xs opacity-70">{message.timestamp}</span>
                      {message.isSent && (
                        <div className="flex">
                          <div className={`h-3 w-3 ${message.isRead ? 'text-blue-400' : 'text-muted-foreground opacity-70'}`}>
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
          <div className="p-4 border-t bg-background">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Paperclip className="h-4 w-4" />
              </Button>
              <div className="flex-1 relative">
                <Input
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pr-20"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                >
                  <Smile className="h-4 w-4" />
                </Button>
              </div>
              {newMessage.trim() ? (
                <Button onClick={handleSendMessage} size="sm">
                  <Send className="h-4 w-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="sm">
                  <Mic className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-muted/10">
          <div className="text-center">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Select a chat</h3>
            <p className="text-muted-foreground">Choose a conversation to start messaging</p>
          </div>
        </div>
      )}
    </div>
  );
}