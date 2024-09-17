"use client";
import React, { useState } from "react";
import { Header, Footer } from "@/components";
import { ArrowRight, Loader2 } from "lucide-react";

const Page: React.FC = () => {
	const [loading, setLoading] = useState<boolean>(false);
	const [messages, setMessages] = useState<string | null>(null);
	const [textInput, setTextInput] = useState<string>("");

	const handleSubmit = async (e: React.FormEvent<HTMLButtonElement>) => {
		e.preventDefault();
		if (!textInput.trim()) return;

		setLoading(true);

		try {
			const response = await fetch("/api/summerizer", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					content: textInput,
				}),
			});

			if (!response.ok) {
				setMessages((await response.json()).message);
				throw new Error(response.statusText);
			}

			const data = await response.json();

			setMessages(data.result);
		} catch (error) {
			console.error("Error occurred: ", error);
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
		setTextInput(e.target.value);
	};

	return (
		<div className="min-h-screen bg-secondary text-accent flex flex-col justify-between">
			<Header />

			<section className="container mx-auto py-8">
				{/* Model Description */}
				<h2 className="text-2xl font-bold mb-4">
					Model: BART-Large-CNN
				</h2>
				<p className="mb-4">
					The <strong className="underline">BART-Large-CNN</strong> is
					a state-of-the-art abstractive summarization model developed
					by Facebook. It is designed to generate concise summaries of
					large pieces of text while retaining the most important
					information.
				</p>
				<p className="mb-4">
					This model excels at tasks like summarizing articles,
					reports, and lengthy documents. It leverages a transformer
					architecture, which enables it to understand the context and
					produce coherent and meaningful summaries.
				</p>

				<h3 className="text-xl font-bold mb-2">How to Use the Model</h3>
				<ol className="list-decimal list-inside mb-4">
					<li>Enter the text or article you want to summarize.</li>
					<li>
						Click on the &quot;Send&quot; button to generate the
						summary.
					</li>
					<li>
						The model will return a concise summary of the input
						text.
					</li>
				</ol>

				<p>
					<strong>Note:</strong> The longer the input text, the more
					meaningful and detailed the summary will be. Experiment with
					different text lengths to see the model&apos;s full
					capabilities.
				</p>
			</section>

			<section className="container mx-auto py-8 flex h-[81vh] overflow-y-auto justify-between">
				{/* Input Section */}
				<div className="w-[45%] flex flex-col">
					<label className="mb-2 text-lg text-white font-bold">
						Enter your text:
					</label>
					<textarea
						placeholder="Paste or type a large paragraph here..."
						value={textInput}
						onChange={handleInputChange}
						className="w-full h-[75vh] rounded-md py-3 px-4 focus:outline-none bg-secondary text-accent border-2 border-transparent focus:border-accent transition-all duration-500 ease-in-out resize-none"
						disabled={loading}
					/>
					<button
						type="submit"
						onClick={handleSubmit}
						disabled={loading}
						className="mt-4 flex justify-center items-center bg-button text-secondary px-4 py-2 rounded-md transition-colors hover:bg-accent"
					>
						<ArrowRight className="h-5 w-5 mr-2" />
						<span>Send</span>
					</button>
				</div>

				{/* Output Section */}
				<div className="w-[45%] flex flex-col">
					<label className="mb-2 text-lg text-white">
						Processed Output:
					</label>
					<div className="h-[75vh] bg-primary text-accent p-4 rounded-md overflow-y-auto border-2 border-transparent">
						{loading ? (
							<div className="h-full w-full flex justify-center items-center">
								<Loader2 className="animate-spin h-20 w-20 text-accent " />
							</div>
						) : (
							<div className="whitespace-pre-wrap">
								{messages}
							</div>
						)}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Page;
