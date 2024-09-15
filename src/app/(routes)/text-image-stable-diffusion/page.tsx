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
	const [imageCount, setImageCount] = useState<number>(5);

	const fetchData = async () => {
		setLoading(true);

		const urls: string[] = [];
		try {
			// Helper function to fetch a single image
			const fetchSingleImage = async (prompt: string) => {
				const response = await fetch(
					"/api/text-image-stable-diffusion",
					{
						body: JSON.stringify({ prompt }),
						method: "POST",
					}
				);
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

			let counter = 0;
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
		<div className="min-h-screen bg-secondary text-accent flex flex-col justify-evenly">
			<Header />

			<section className="container mx-auto py-8">
				{/* Model Description */}
				<div className="flex gap-3 flex-col p-4 -mt-8">
					<h1 className="text-3xl font-bold">
						Model: Stable Diffusion XL Base 1.0
					</h1>
					<p>
						The{" "}
						<strong className="underline">
							Stable Diffusion XL Base 1.0
						</strong>{" "}
						model is a state-of-the-art text-to-image generator that
						produces high-resolution, diverse images based on text
						prompts. Developed by Stability AI, this model extends
						the capabilities of the Stable Diffusion series,
						offering improved quality and versatility in generating
						images from textual descriptions.
					</p>
					<h2 className="text-2xl font-semibold">
						How to Use the Model
					</h2>
					<ul className="list-disc list-inside">
						<li>
							<strong>Enter a Command:</strong> Provide a textual
							description or prompt of the image you want to
							generate in the text input field. The more detailed
							the prompt, the more specific the generated image
							will be.
						</li>
						<li>
							<strong>Specify Number of Images:</strong> Set the
							number of images you want to generate. The model
							will create multiple variations based on your
							prompt.
							<br />
							<ul className="list-disc list-inside pl-6">
								<li>
									<strong>Mininum:</strong> 1 <br />
								</li>
								<li>
									<strong>Maximum:</strong> 10
								</li>
							</ul>
						</li>
						<li>
							<strong>Execute:</strong> Click the
							&quot;Execute&quot; button to start the image
							generation process. The system will send your
							request to the model and display the generated
							images once they are ready.
						</li>
					</ul>
					<p>
						For more detailed instructions or if you encounter
						issues, please contact support.
					</p>
				</div>
			</section>

			<section className="container mx-auto py-8">
				{/* Form Section */}
				<form
					className="flex flex-col gap-4 mb-8 p-4"
					onSubmit={handleSubmit}
				>
					<h1 className="text-3xl font-bold">Execute Your Command</h1>
					<div className="flex gap-4">
						<input
							type="text"
							placeholder="Enter your command..."
							value={inputText}
							onChange={handleInputChange}
							className="w-[80%] rounded-md py-3 px-4 focus:outline-none bg-secondary text-accent border-2 border-transparent focus:border-accent transition-all duration-500 ease-in-out"
						/>
						<input
							type="number"
							placeholder="Number of images"
							value={imageCount}
							onChange={handleCountChange}
							className="w-[5%] h-[53px] text-2xl rounded-md py-3 px-4 focus:outline-none bg-secondary text-accent border-2 border-transparent focus:border-accent transition-all duration-500 ease-in-out"
							min="1"
							max="10"
						/>
						<button
							type="submit"
							disabled={loading}
							className="flex justify-center items-center bg-button text-secondary px-4 py-2 rounded-md transition-colors hover:bg-accent"
						>
							<ArrowRight className="h-5 w-5 mr-2" />
							<span>Execute</span>
						</button>
					</div>
				</form>

				{/* Image Fetch Section */}
				<div className="w-full flex justify-center items-center flex-col gap-10">
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
