'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ContactIcon from "@/components/icons/contact"
import CloseIcon from '@/components/icons/close';
import SupportIcon from '@/components/icons/support';
import CustomerIcon from '@/components/icons/customer';
import SendIcon from '@/components/icons/send';

export function Chat() {
  const [messages, setMessages] = useState([{ sender: 'bot', text: 'Hi there! How can I assist you today?' }]);
  const [userInput, setUserInput] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleInputChange = (event: { target: { value: React.SetStateAction<string>; }; }) => {
    setUserInput(event.target.value);
  };

  const shouldShowContactSupportButton = () => {
    return messages.some(message => message.text.toLowerCase().includes('contact with support'));
  };

  
  
  const handleSendMessage = async () => {
    if (userInput.trim() === '') return;

    if (shouldShowContactSupportButton()) {
      return
    }

    const newMessage = { sender: 'user', text: userInput };
    setMessages([...messages, newMessage]);
    setIsSending(true);

    try {
      if (userInput.toLowerCase().includes('contact with support')) {
        return;
      }
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_input: userInput }),
      });

      const data = await response.json();
      if (data.response) {
        setMessages([...messages, newMessage, { sender: 'bot', text: data.response }]);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setUserInput('');
      setIsSending(false);
    }
  };

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {isOpen ? (
        <div className="fixed bottom-10 right-10 z-50 w-[360px] rounded-lg border border-gray-200 bg-white shadow-lg dark:border-gray-800 dark:bg-gray-950">
          <div className="flex items-center justify-between rounded-t-lg bg-gray-100 px-4 dark:bg-gray-800">
            <div className="flex items-center gap-2">
              <ContactIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <h3 className="text-sm pt-1 font-medium text-gray-900 dark:text-gray-50">Support bot</h3>
            </div>
            <Button className="rounded-full" size="icon" variant="ghost" onClick={toggleChat}>
              <CloseIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
              <span className="sr-only">Close chat</span>
            </Button>
          </div>
          <div className="flex flex-col h-[500px] overflow-hidden">
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div key={index} className={`flex items-start gap-3 ${message.sender === 'user' ? 'justify-end' : ''}`}>
                  {message.sender === 'bot' && <SupportIcon className="h-[20px] w-[20px]" />}
                  <div className={`max-w-[240px] rounded-lg flex items-center border p-3 text-sm shadow-sm ${message.sender === 'user' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white dark:bg-gray-800'} dark:border-gray-800`}>
                    <p>{message.text}</p>
                  </div>
                  {message.sender === 'user' && <CustomerIcon className="h-[20px] w-[20px]" />}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>
            <div className="border-t border-gray-200 bg-gray-100 px-4 py-3 dark:border-gray-800 dark:bg-gray-800">
              <div className="flex items-center gap-2">
                <Input
                  className="flex-1 bg-transparent focus:outline-none"
                  placeholder="Type your message..."
                  type="text"
                  value={isSending ? 'Loading..' : userInput}
                  onChange={handleInputChange}
                  onKeyPress={(event) => {
                    if (event.key === 'Enter' && !isSending) {
                      handleSendMessage();
                    }
                  }}
                />
                <Button className="rounded-full hover:bg-slate-500" size="icon" variant="ghost" onClick={handleSendMessage} disabled={isSending || !userInput.trim().length }>
                  <SendIcon className="h-5 w-5 text-gray-500 dark:text-gray-400" />
                  <span className="sr-only">Send message</span>
                </Button>
              </div>
            </div>
            {shouldShowContactSupportButton() && (
              <div className="px-4 py-3">
                <Button className="w-full">Contact Support</Button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className='fixed bottom-4 right-4 z-50'>
          <Button size='icon' className="rounded-full bg-slate-100" onClick={toggleChat}>
            <ContactIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
            <span className="sr-only">Open chat</span>
          </Button>
        </div>
      )}
    </>
  );
}