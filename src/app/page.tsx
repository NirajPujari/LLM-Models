import Image from "next/image";
import React from "react";
import { Members, Models } from "@/data";
import { Header, Footer } from "@/components";

const HomePage: React.FC = () => {
	return (
		<div className="min-h-screen bg-secondary text-accent">
			{/* Header */}
			<Header isHomePage />

			{/* Introduction Section */}
			<section className="container mx-auto py-8">
				<h2 className="text-3xl font-bold mb-4">
					Welcome to Our LLM Project
				</h2>
				<div className="px-4">
					<p className="mb-2">
						Discover the various models and filters used in large
						language models. Our project aims to showcase how these
						models can be applied in different scenarios.
					</p>
					<p className="mb-2">
						We offer a range of options to explore, from fine-tuning
						models to generating text. Dive in to learn more about
						these fascinating tools.
					</p>
				</div>
			</section>

			{/* Filter/Model Selection Section */}
			<section className="container mx-auto py-10 px-10 bg-primary rounded-lg">
				<h3 className="text-2xl font-bold pb-6">Select a Model</h3>
				<div className="flex gap-4 px-6 flex-wrap justify-center">
					{Models.map((model) => (
						<a
							key={model.name}
							href={model.link}
							className="group block w-[49%] bg-button p-4 rounded-lg hover:bg-accent transition-all duration-500 ease-in-out text-secondary"
						>
							<h3 className="text-xl font-bold">{model.name}</h3>
							<h5 className="text-md font-semibold pl-4">
								{model.company}
							</h5>

							<p className="pl-4 text-sm">{model.desc}</p>
							<p className="float-right text-sm italic font-light py-2 px-2 rounded-3xl group-hover:underline transition-all duration-500 ease-in-out">
								{model.type}
							</p>
						</a>
					))}
				</div>
			</section>

			{/* Team Section */}
			<section className="container mx-auto py-8">
				<h2 className="text-3xl font-bold mb-4">Meet the Team</h2>
				<div className="flex flex-wrap gap-4 justify-between px-16 py-4">
					{Members.map((member) => (
						<div key={member.name} className="text-center">
							<Image
								src={member.image}
								alt={member.name}
								width={500}
								height={500}
								className="mx-auto rounded-full w-24 h-24 mb-2"
							/>
							<p>{member.name}</p>
						</div>
					))}
				</div>
			</section>

			{/* Resources Section */}
			<section className="container mx-auto py-8">
				<h2 className="text-3xl font-bold mb-4">
					Resources & Documentation
				</h2>
				<ul className="list-disc list-inside space-y-2 px-4">
					<li>
						<a
							href="https://example.com/llm-guide"
							className="text-accent hover:underline"
						>
							LLM Guide
						</a>
					</li>
					<li>
						<a
							href="https://example.com/llm-tutorial"
							className="text-accent hover:underline"
						>
							LLM Tutorial
						</a>
					</li>
				</ul>
			</section>

			{/* Contact Section */}
			<section className="container mx-auto py-8 px-6 bg-primary rounded-lg mb-10">
				<h2 className="text-3xl font-bold mb-4">Contact Us</h2>
				<p>
					If you have any questions or need further information, feel
					free to{" "}
					<a
						href="mailto:contact@example.com"
						className="text-accent hover:underline"
					>
						email us
					</a>
					.
				</p>
			</section>
			<Footer />
		</div>
	);
};

export default HomePage;
