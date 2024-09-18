import Link from "next/link";
import React from "react";

interface HeaderProps {
	isHomePage?: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isHomePage = false }) => {
	return (
		<header className="bg-primary py-6">
			<div className="container mx-auto text-center px-4">
				<h1 className="text-3xl md:text-4xl font-bold mb-2">
					LLM Project
				</h1>
				<p className="text-base md:text-lg">
					Explore the world of Large Language Models and their diverse
					applications.
				</p>

				{/* Show the button only when not on the home page */}
				{!isHomePage && (
					<div className="pt-5">
						<Link
							className="bg-button text-secondary px-4 py-2 rounded-md transition-colors duration-500 ease-in-out hover:bg-accent"
							href="/"
						>
							Go to Home
						</Link>
					</div>
				)}
			</div>
		</header>
	);
};
