"use client";
import React, { useState } from "react";
import { Header, Footer } from "@/components";
import { ArrowRight, Loader2 } from "lucide-react";
import Image from "next/image";

const Page: React.FC = () => {
	const [imageFile, setImageFile] = useState<File | null>(null);
	const [description, setDescription] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const [error, setError] = useState<string | null>(null);

	const fetchData = async () => {
		if (!imageFile) {
			setError("Please upload an image");
			return;
		}

		setLoading(true);
		setError(null);
		setDescription(null);

		try {
			const formData = new FormData();
			formData.append("image", imageFile);

			const response = await fetch("/api/image-text", {
				method: "POST",
				body: formData,
			});

			if (!response.ok) {
				throw new Error("Failed to process the image");
			}

			const data = await response.json();
			setDescription(data.generated_text);
		} catch (error) {
			console.error("Error fetching data:", error);
			setError("Failed to load description");
		} finally {
			setLoading(false);
		}
	};

	const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		if (e.target.files && e.target.files[0]) {
			setImageFile(e.target.files[0]);
			console.log(e.target.files[0]); // Log the selected file
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		console.log("Form submitted");
		fetchData();
	};

	return (
		<div className="min-h-screen bg-secondary text-accent flex flex-col justify-between">
			<Header />

			<section className="container mx-auto py-8">
				<h1 className="text-3xl font-bold mb-6 text-center md:text-left">
					Upload an Image
				</h1>

				{/* Form Section */}
				<form
					className="flex flex-col gap-4 mb-8"
					onSubmit={handleSubmit}
				>
					<div className="flex flex-col md:flex-row gap-4 items-center justify-between">
						<div className="flex gap-4 items-center">
							<input
								id="image-upload"
								title="image"
								type="file"
								accept="image/*"
								onChange={handleFileChange}
								className="hidden"
							/>
							<label
								htmlFor="image-upload"
								className="cursor-pointer bg-button text-secondary px-4 py-2 rounded-md transition-colors hover:bg-accent flex items-center"
							>
								<ArrowRight className="h-5 w-5 mr-2" />
								<span>Upload Image</span>
							</label>
							<span className="text-lg">
								{imageFile
									? imageFile.name
									: "No image selected"}
							</span>
						</div>

						<button
							type="submit"
							disabled={loading || !imageFile}
							className="flex justify-center items-center bg-button text-secondary px-4 py-2 rounded-md transition-colors hover:bg-accent"
						>
							<ArrowRight className="h-5 w-5 mr-2" />
							<span>Execute</span>
						</button>
					</div>
				</form>

				{/* Image Display and Description Section */}
				<div className="w-full flex flex-col items-center gap-10">
					{loading && (
						<div className="flex items-center justify-center">
							<Loader2 className="animate-spin h-8 w-8 text-accent" />
							<p className="ml-2">Processing image...</p>
						</div>
					)}

					{error && !loading && (
						<p className="text-red-500 text-center">{error}</p>
					)}

					{description && (
						<div className="text-xl font-medium text-center text-accent">
							<p>{description}</p>
						</div>
					)}

					{imageFile && (
						<div className="max-w-full md:max-w-[45rem] max-h-[45rem] overflow-hidden">
							<Image
								src={URL.createObjectURL(imageFile)}
								alt="Uploaded image"
								width={800} // Adjust width as needed
								height={600} // Adjust height as needed
								className="rounded-lg shadow-lg max-w-full h-auto"
							/>
						</div>
					)}
				</div>
			</section>

			<Footer />
		</div>
	);
};

export default Page;
