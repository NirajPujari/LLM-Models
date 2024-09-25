"use client";
import React, { useState } from "react";
import { Header, Footer } from "@/components";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

const Page: React.FC = () => {
	const [images, setImages] = useState<string[] | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);
	const [inputText, setInputText] = useState<string>("");
	const [imageCount, setImageCount] = useState<number>(2);

	const fetchData = async () => {
		setLoading(true);

		const urls: string[] = [];
		try {
			// Helper function to fetch a single image
			const fetchSingleImage = async (prompt: string) => {
				const response = await fetch("/api/text-image-black-forest", {
					body: JSON.stringify({ prompt }),
					method: "POST",
				});
				if (!response.ok) {
					return "";
				}
				const data = await response.blob();
				return URL.createObjectURL(data);
			};

			// Generate the number of prompts based on the imageCount
			const prompts = Array.from(
				{ length: imageCount + 5 },
				(_, i) =>
					`${inputText} version ${Math.floor(Math.random() * 100)}`
			);

			const results = await Promise.all(prompts.map(fetchSingleImage));

			var counter = 0;
			results.forEach((imageURL) => {
				if (imageURL !== "" && counter < imageCount) {
					urls.push(imageURL);
					counter++;
				}
			});

			// Append new images to existing ones
			images?.forEach((imageURL) => {
				urls.push(imageURL);
			});

			setImages(urls);
			setError(null);
		} catch (error) {
			console.error("Error fetching data:", error);
			setError("Failed to load images");
		} finally {
			setLoading(false);
		}
	};

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputText(e.target.value);
	};

	const handleCountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = parseInt(e.target.value, 10);
		setImageCount(value > 0 ? value : 1); // Ensure at least 1 image is generated
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		fetchData();
		console.log("Executing command:", inputText);
	};

	return (
		<div className="min-h-screen bg-secondary text-accent flex flex-col justify-between">
			<Header />

			{/* Model Information Section */}
			<section className="container mx-auto py-8">
				<div className="flex flex-col gap-4 p-4 -mt-8">
					<h2 className="text-3xl font-bold">Model: FLUX.1-dev</h2>
					<p>
						The <strong className="underline">FLUX.1-dev</strong>{" "}
						model is a state-of-the-art text-to-image generation
						model built by{" "}
						<strong className="underline">Black Forest Labs</strong>
						. It utilizes deep learning techniques to create highly
						detailed images based on user-provided textual
						descriptions.
					</p>
					<p>
						This model is ideal for tasks involving artistic image
						creation, conceptual designs, and visualizing abstract
						ideas. The model leverages the latest advancements in
						the Stable Diffusion model family and provides
						flexibility in generating multiple variations of images.
					</p>
					<p>
						To use the model, simply provide a descriptive prompt
						that specifies what you want the model to generate. The
						model will return images based on the prompt, using
						randomization to create unique variations with each run.
					</p>

					<h3 className="text-2xl font-semibold">
						How to Use the Model
					</h3>
					<ol className="list-disc list-inside">
						<li>
							Enter a descriptive prompt in the input field
							provided.
						</li>
						<li>
							Specify the number of images you want to generate
							(between 1 and 10).
						</li>
						<li>
							Click on the &quot;Execute&quot; button to trigger
							the image generation.
						</li>
						<li>
							The model will return a set of images based on the
							prompt, which will be displayed below the input
							fields.
						</li>
						<li>
							If needed, you can adjust the prompt or the image
							count and run the generation again to get different
							results.
						</li>
					</ol>

					<p>
						<strong>Note:</strong> The more specific and detailed
						your prompt, the more accurate the model&apos;s output
						will be. Additionally, slight variations in the prompt
						can lead to entirely different visual outputs, so feel
						free to experiment!
					</p>
				</div>
			</section>

			<section className="container mx-auto py-8 ">
				{/* Form Section */}
				<form
					className="flex flex-col gap-4 mb-8 p-4 w-full"
					onSubmit={handleSubmit}
				>
					<h1 className="text-3xl font-bold">Execute Your Command</h1>
					<div className="flex flex-col md:flex-row gap-4 justify-center items-center w-full">
						<input
							type="text"
							placeholder="Enter your command..."
							value={inputText}
							onChange={handleInputChange}
							className="flex-1 rounded-md py-3 px-4 focus:outline-none bg-secondary text-accent border-2 border-transparent focus:border-accent transition-all duration-500 ease-in-out max-md:w-full"
						/>
						<input
							type="number"
							placeholder="Number of images"
							value={imageCount}
							onChange={handleCountChange}
							className="h-[53px] text-2xl rounded-md py-3 px-4 focus:outline-none bg-secondary text-accent border-2 border-transparent focus:border-accent transition-all duration-500 ease-in-out"
							min="1"
							max="10"
						/>
						<button
							type="submit"
							disabled={loading || inputText.length < 3}
							className="flex justify-center items-center bg-button text-secondary px-4 py-2 rounded-md transition-colors hover:bg-accent"
						>
							<ArrowRight className="h-5 w-5 mr-2" />
							<span>Execute</span>
						</button>
					</div>
				</form>
			</section>

			<section className="container mx-auto py-8 flex flex-col md:flex-row">
				{/* Image Fetch Section */}
				<div className="w-full flex flex-col items-center gap-10">
					{loading && (
						<div className="flex items-center justify-center">
							<Loader2 className="animate-spin h-8 w-8 text-accent" />
							<p className="ml-2">Loading images...</p>
						</div>
					)}

					{error && !loading && (
						<p className="text-red-500">{error}</p>
					)}

					<div className="flex flex-wrap gap-5 items-center justify-center">
						{images?.length &&
							!(loading && error && !(images.length < 5)) &&
							images.map((image) => (
								<Image
									key={image}
									src={image}
									alt="Generated"
									width={300}
									height={300}
									className="rounded-lg shadow-lg max-w-full h-auto"
								/>
							))}
					</div>
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Page;
