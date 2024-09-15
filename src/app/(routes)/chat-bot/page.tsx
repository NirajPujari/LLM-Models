"use client";
import React, { useState, useEffect, useRef } from "react";
import { Header, Footer } from "@/components";
import { ArrowRight, Loader2 } from "lucide-react";
import ReactMarkdown from "react-markdown";

const Page: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [messages, setMessages] = useState<string[][]>([]);
	const [textInput, setTextInput] = useState<string>("");
	const messagesEndRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (messagesEndRef.current) {
			messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
		}
	}, [messages]);

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (!textInput.trim()) return;

		setLoading(true);
		const newMessage = [textInput, ""];
		setMessages((prevMessages) => [...prevMessages, newMessage]);
		setTextInput("");

		try {
			const response = await fetch("/api/chat-bot", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ role: "user", content: textInput }),
			});

			if (!response.ok) throw new Error(response.statusText);

			const data = await response.json();
			newMessage[1] = data.result;

			setMessages((prevMessages) => {
				const updatedMessages = [...prevMessages];
				updatedMessages.pop();
				updatedMessages.push(newMessage);
				return updatedMessages;
			});
		} catch (error) {
			console.error("Error occurred: ", error);
			setMessages((prevMessages) => [
				...prevMessages,
				["Error occurred"],
			]);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTextInput(e.target.value);
	};

	return (
		<div className="min-h-screen bg-secondary text-accent flex flex-col justify-between">
			<Header />

			<section className="container mx-auto py-8">
				{/* Model Description */}
				<h2 className="text-2xl font-bold mb-4">Model: GEMMA-2.2B</h2>
				<p className="mb-4">
					The <strong className="underline">GEMMA-2.2B</strong> is a
					conversational model built by Google. It specializes in
					natural language understanding and generation, capable of
					providing meaningful and contextual replies to user queries.
				</p>
				<p className="mb-4">
					This model is ideal for tasks involving chatbots,
					conversational agents, and dynamic information retrieval.
					It&apos;s built using advanced techniques in
					transformer-based language models and offers a high degree
					of flexibility and contextual understanding.
				</p>

				<h3 className="text-xl font-bold mb-2">How to Use the Model</h3>
				<ol className="list-decimal list-inside mb-4">
					<li>Enter a prompt or question in the input field.</li>
					<li>Click on the &quot;Send&quot; button to submit.</li>
					<li>
						The model will process your input and provide a
						response, which will be displayed in the chat window.
					</li>
				</ol>
				<p>
					<strong>Note:</strong> You can experiment with various types
					of queries. The more specific your prompt, the better the
					response quality will be. And the Model does not store the
					history so you cant make it for conversational purposes.
				</p>
			</section>

			<section
				className={`container mx-auto py-8 flex flex-col overflow-y-auto transition-all duration-500 ease-in-out ${
					messages.length > 0
						? "justify-end gap-8 h-[60vh]"
						: "justify-center h-fit"
				}`}
			>
				{/* Messages Section */}
				<div className="flex flex-col gap-2 overflow-y-auto">
					{messages.map((listStr, index) => (
						<React.Fragment key={index}>
							{/* User Message */}
							<div className="flex justify-end">
								<div className="bg-accent text-secondary p-2 rounded-md max-w-md">
									<ReactMarkdown>{listStr[0]}</ReactMarkdown>
								</div>
							</div>
							{/* Bot Response */}
							<div className="flex justify-start">
								<div className="bg-primary text-accent p-2 rounded-md max-w-md">
									{loading &&
									index === messages.length - 1 ? (
										<Loader2 className="animate-spin h-8 w-8 text-accent" />
									) : (
										<ReactMarkdown>
											{listStr[1]}
										</ReactMarkdown>
									)}
								</div>
							</div>
						</React.Fragment>
					))}
					<div ref={messagesEndRef} />
				</div>
				{/* Form Section */}
				<form
					className="flex gap-4 mt-8 justify-center"
					onSubmit={handleSubmit}
				>
					<input
						type="text"
						placeholder="Ask something..."
						value={textInput}
						onChange={handleInputChange}
						className="w-[80%] rounded-md py-3 px-4 focus:outline-none bg-secondary text-accent border-2 border-transparent focus:border-accent transition-all duration-500 ease-in-out"
						disabled={loading}
					/>
					<button
						type="submit"
						disabled={loading}
						className="flex justify-center items-center bg-button text-secondary px-4 py-2 rounded-md transition-colors hover:bg-accent"
					>
						<ArrowRight className="h-5 w-5 mr-2" />
						<span>Send</span>
					</button>
				</form>
			</section>

			<Footer />
		</div>
	);
};

export default Page;
