import React from "react";

export const Footer = () => {
	return (
		<footer className="bg-primary py-6">
			<div className="container mx-auto text-center">
				<p className="text-sm text-accent mb-2">
					© {new Date().getFullYear()} LLM Project. All rights
					reserved.
				</p>
				<div className="flex justify-center flex-wrap gap-4">
					<a
						href="/privacy-policy"
						className="text-accent relative before:content-[''] before:w-0 before:h-0.5 before:absolute before:bg-white before:left-0 before:bottom-0 before:transition-all before:duration-700 before:origin-left hover:before:w-full"
					>
						Privacy Policy
					</a>
					<a
						href="/terms-of-service"
						className="text-accent relative before:content-[''] before:w-0 before:h-0.5 before:absolute before:bg-white before:left-0 before:bottom-0 before:transition-all before:duration-700 before:origin-left hover:before:w-full"
					>
						Terms of Service
					</a>
					<a
						href="/about"
						className="text-accent relative before:content-[''] before:w-0 before:h-0.5 before:absolute before:bg-white before:left-0 before:bottom-0 before:transition-all before:duration-700 before:origin-left hover:before:w-full"
					>
						About Us
					</a>
				</div>
			</div>
		</footer>
	);
};
