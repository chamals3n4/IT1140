"use client";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Send, User } from "lucide-react";
import ReactMarkdown from "react-markdown";
import mistral from "@/config/mistral";
import chillguy from "../assets/images/chillguy.jpg";
import supabase from "@/config/supabase";

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [bpm, setBpm] = useState([]);
  const [input, setInput] = useState("");
  const [isFirstMessage, setIsFirstMessage] = useState(true);

  useEffect(() => {
    async function fetchMedications() {
      try {
        const { data, error } = await supabase.from("bpm_readings").select("*");

        if (error) {
          console.error("Error fetching data:", error.message);
        } else {
          setBpm(data || []);
        }
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    }

    fetchMedications();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage = {
      id: Date.now().toString(),
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsFirstMessage(false);
    setInput("");

    try {
      const response = await mistral.chat.complete({
        model: "mistral-large-latest",
        messages: [...messages, userMessage],
      });

      const assistantMessage = {
        id: (Date.now() + 1).toString(),
        content: response.choices[0].message.content,
        role: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-white">
      <Card className="flex-1 mx-4 my-4 border rounded-lg">
        <ScrollArea className="h-[calc(100vh-180px)] p-4">
          {isFirstMessage ? (
            <div className="flex flex-col items-center p-10 justify-center h-full text-center">
              <div className="mb-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={chillguy} alt="@shadcn" draggable="false" />
                  <AvatarFallback>MC</AvatarFallback>
                </Avatar>
              </div>
              <h1 className="text-2xl font-serif mb-2">
                Welcome to Medical Chat
              </h1>
              <p className="text-muted-foreground mb-4">
                Ask anything about your medical conditions
              </p>
              <p className="text-sm text-muted-foreground max-w-md">
                Please note: This chat provides general information and is not a
                substitute for professional medical advice, diagnosis, or
                treatment.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex items-start gap-3 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    {message.role === "user" ? (
                      <>
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="User Avatar"
                        />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    ) : (
                      <>
                        <AvatarImage
                          src="/placeholder.svg?height=32&width=32"
                          alt="Assistant Avatar"
                        />
                        <AvatarFallback>
                          <Bot className="h-4 w-4" />
                        </AvatarFallback>
                      </>
                    )}
                  </Avatar>
                  <div
                    className={`rounded-lg px-4 py-2 max-w-[80%] ${
                      message.role === "user"
                        ? "bg-bgsidebar text-primary-foreground"
                        : "bg-muted"
                    }`}
                  >
                    {message.role === "assistant" ? (
                      <ReactMarkdown>{message.content}</ReactMarkdown>
                    ) : (
                      message.content
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
        <div className="p-4 border-t">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              placeholder="Type your medical question..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" className="bg-bgsidebar">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send message</span>
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
