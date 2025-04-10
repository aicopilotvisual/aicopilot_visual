"use client";

interface TestimonialProps {
  quote: string;
  author: string;
  role: string;
}

function Testimonial({ quote, author, role }: TestimonialProps) {
  return (
    <div className="flex flex-col p-6 bg-card/80 backdrop-blur-sm rounded-lg border-2 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="mb-4">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
          <path d="M11.0001 4.5C10.3255 4.5 9.7011 4.22126 9.2323 3.75232C8.76349 3.28339 8.48486 2.65979 8.48486 2C8.48486 1.60241 8.59373 1.21139 8.79882 0.86669C9.0039 0.521987 9.29632 0.238068 9.64542 0.04403C9.99451 -0.150008 10.3878 -0.245136 10.7871 -0.231383C11.1864 -0.21763 11.5703 -0.0955847 11.9033 0.123723C12.2363 0.34303 12.5042 0.650239 12.6799 1.0083C12.8556 1.36636 12.9325 1.76316 12.901 2.15823C12.8695 2.5533 12.7311 2.93044 12.501 3.25415C12.2708 3.57785 11.959 3.83565 11.5988 4.0015M11.0001 4.5H4C3.60249 4.47574 3.21164 4.55879 2.86689 4.74072C2.52214 4.92266 2.23817 5.19607 2.04418 5.52913C1.85019 5.86218 1.75507 6.24167 1.76902 6.62558C1.78296 7.00949 1.90545 7.38089 2.12413 7.698C2.34281 8.01511 2.6496 8.26245 3.00686 8.41404C3.36413 8.56563 3.75995 8.61456 4.14564 8.55584C4.53133 8.49712 4.89271 8.33329 5.18785 8.08347C5.483 7.83366 5.7005 7.50799 5.8183 7.146M10.9997 19.5C11.6699 19.5 12.3126 19.2718 12.8193 18.858C13.326 18.4441 13.6627 17.8679 13.7712 17.2297C13.8797 16.5916 13.754 15.9351 13.4167 15.3849C13.0795 14.8348 12.5535 14.4293 11.9384 14.2413C11.3233 14.0534 10.6602 14.0952 10.0709 14.3597C9.48159 14.6242 9.00782 15.0945 8.73682 15.6831C8.46582 16.2717 8.41582 16.9367 8.59574 17.5604C8.77566 18.1841 9.17399 18.7275 9.7183 19.0877M10.9997 19.5H18.0003C18.7911 19.5 19.5497 19.2361 20.1213 18.7639C20.6929 18.2917 21.0357 17.6488 21.0818 16.9596C21.1279 16.2703 20.8742 15.5909 20.3764 15.0592C19.8786 14.5274 19.1764 14.1849 18.4203 14.0996C17.6642 14.0143 16.9007 14.1926 16.2804 14.5986C15.6601 15.0046 15.2279 15.6097 15.0646 16.3016" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <p className="text-lg mb-6 italic text-foreground">{quote}</p>
      <div className="mt-auto">
        <p className="font-semibold text-foreground">{author}</p>
        <p className="text-sm text-muted-foreground">{role}</p>
      </div>
    </div>
  );
}

export default function Testimonials() {
  return (
    <div className="py-20 px-4 bg-muted/30 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-foreground">What Our Users Say</h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Hear from professionals who have transformed their workflows with AI Copilot
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Testimonial 
            quote="AI Copilot has helped us reduce our onboarding process from 2 weeks to just 3 days. The visual workflows make it easy to identify bottlenecks."
            author="Sarah Johnson"
            role="Operations Manager"
          />
          <Testimonial 
            quote="I was skeptical about AI tools, but this really simplified our complex approval workflows. Now anyone on the team can understand our processes."
            author="Michael Chen"
            role="Project Lead"
          />
          <Testimonial 
            quote="The ability to describe a workflow in plain language and get a visual representation has been transformative for our non-technical stakeholders."
            author="Amelia Rodriguez"
            role="Business Analyst"
          />
        </div>
      </div>
    </div>
  );
}