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
				body: JSON.stringify({ content: textInput }),
			});

			if (!response.ok) {
				const errorRes = await response.json();
				newMessage[1] = errorRes.message;
				setMessages((prevMessages) => {
					const updatedMessages = [...prevMessages];
					updatedMessages.pop();
					updatedMessages.push(newMessage);
					return updatedMessages;
				});
				throw new Error(response.statusText);
			}

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
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setTextInput(e.target.value);
	};

	return (
		<div className="min-h-screen bg-secondary text-accent flex flex-col">
			<Header />

			{messages.length === 0 ? (
				<section className="container mx-auto py-8 px-4">
					<h2 className="text-2xl font-bold mb-4">
						Model: Meta-LLaMA-3-8B-Instruct
					</h2>
					<p className="mb-4">
						The{" "}
						<strong className="underline">
							Meta-LLaMA-3-8B-Instruct
						</strong>{" "}
						is a conversational model developed by Meta AI. It is
						designed for natural language understanding and
						generation, excelling at providing detailed, contextual
						responses to user inputs.
					</p>
					<p className="mb-4">
						This model is ideal for applications such as chatbots,
						conversational agents, and task-specific information
						retrieval. It leverages cutting-edge transformer-based
						architectures, offering high levels of adaptability and
						deep contextual comprehension.
					</p>

					<h3 className="text-xl font-bold mb-2">
						How to Use the Model
					</h3>
					<ol className="list-decimal list-inside mb-4">
						<li>Enter a question or command in the input field.</li>
						<li>
							Click the &quot;Submit&quot; button to send your
							query.
						</li>
						<li>
							The model will process your input and generate a
							response, which will appear in the chat window.
						</li>
					</ol>
					<p>
						<strong>Note:</strong> You can try out a variety of
						questions or prompts. More detailed and precise inputs
						will yield better response quality. The model does not
						store session history, so it&apos;s not intended for
						multi-turn conversation tracking.
					</p>
				</section>
			) : (
				<section className="container mx-auto px-8 h-[54.8vh]">
					<div className="flex flex-col gap-2 w-full h-full overflow-y-auto">
						{messages.map((listStr, index) => (
							<React.Fragment key={index}>
								{/* User Message */}
								<div className="flex justify-end">
									<div className="bg-accent text-secondary p-2 rounded-md max-w-3xl">
										<ReactMarkdown>
											{listStr[0]}
										</ReactMarkdown>
										<div ref={messagesEndRef} />
									</div>
								</div>
								{/* Bot Response */}
								<div className="flex justify-start">
									<div className="bg-primary text-accent p-2 rounded-md max-w-3xl">
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
					</div>
				</section>
			)}

			<section
				className={`container mx-auto py-8 flex flex-col justify-end gap-8 transition-all duration-500 ease-in-out ${
					messages.length === 0 ? "h-[26vh]" : "h-fit"
				}`}
			>
				<form
					className="flex flex-col md:flex-row gap-4 mt-8"
					onSubmit={handleSubmit}
				>
					<input
						type="text"
						placeholder="Ask something..."
						value={textInput}
						onChange={handleInputChange}
						className="w-full rounded-md py-3 px-4 focus:outline-none bg-secondary text-accent border-2 border-transparent focus:border-accent transition-all duration-500 ease-in-out"
						disabled={loading}
					/>
					<button
						type="submit"
						disabled={loading}
						className="mt-4 md:mt-0 flex justify-center items-center bg-button text-secondary px-4 py-2 rounded-md transition-colors hover:bg-accent"
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
