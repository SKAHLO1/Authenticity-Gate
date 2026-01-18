import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Zap, Coffee, Laptop, Globe } from "lucide-react";

export default function Careers() {
    const benefits = [
        {
            icon: <Laptop className="w-5 h-5" />,
            title: "Remote First",
            description: "Work from anywhere in the world. We believe in output, not hours in a chair."
        },
        {
            icon: <Zap className="w-5 h-5" />,
            title: "Competitive Equity",
            description: "Early employee equity packages. Be a true owner of the platform."
        },
        {
            icon: <Coffee className="w-5 h-5" />,
            title: "Health & Wellness",
            description: "Full medical/dental/vision coverage plus a monthly wellness stipend."
        },
        {
            icon: <Globe className="w-5 h-5" />,
            title: "Global Offsites",
            description: "Quarterly team retreats in inspiring locations around the globe."
        }
    ];

    const positions = [
        {
            title: "Senior AI Research Engineer",
            department: "Engineering",
            location: "Remote (Global)",
            type: "Full-time",
            salary: "$180k - $240k + Equity",
            tags: ["Python", "PyTorch", "LLMs"],
            description: "Lead the development of our next-generation deepfake detection models. You'll work with state-of-the-art transformer architectures to identify synthetic media artifacts."
        },
        {
            title: "Senior Blockchain Developer",
            department: "Protocol",
            location: "New York, NY / Remote",
            type: "Full-time",
            salary: "$160k - $220k + Equity",
            tags: ["Solidity", "Rust", "GenLayer"],
            description: "Architect the consensus mechanisms that power our verification engine. You'll optimize smart contracts for gas efficiency and implement cross-chain interoperability."
        },
        {
            title: "Product Designer",
            department: "Design",
            location: "Remote (Europe/US East)",
            type: "Full-time",
            salary: "$130k - $170k + Equity",
            tags: ["Figma", "UI/UX", "Design Systems"],
            description: "Define the visual language of trust. You'll design intuitive interfaces that make complex verification data understandable for everyday users."
        },
        {
            title: "Developer Advocate",
            department: "Growth",
            location: "Remote",
            type: "Full-time",
            salary: "$120k - $160k + Equity",
            tags: ["Content", "Public Speaking", "Community"],
            description: "Be the bridge between our engineering team and the developer community. Create tutorials, speak at conferences, and help developers build on our API."
        }
    ];

    return (
        <Layout>
            <div className="bg-primary/5 py-20">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20 px-4 py-1 text-sm">We're Hiring</Badge>
                    <h1 className="text-5xl font-display font-bold mb-6">Build the Future of Truth</h1>
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        Join a world-class team solving one of the most critical challenges of our time.
                        Help us secure the information ecosystem for the AI era.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">

                {/* Benefits Grid */}
                <div className="mb-24">
                    <h2 className="text-3xl font-bold mb-12 text-center">Why AuthenticityVerifier?</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((benefit, i) => (
                            <Card key={i} className="p-6 bg-card/50 backdrop-blur-sm border-border/50">
                                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                                    {benefit.icon}
                                </div>
                                <h3 className="font-bold text-lg mb-2">{benefit.title}</h3>
                                <p className="text-sm text-muted-foreground">{benefit.description}</p>
                            </Card>
                        ))}
                    </div>
                </div>

                {/* Open Positions */}
                <div>
                    <h2 className="text-3xl font-bold mb-10">Open Positions</h2>
                    <div className="space-y-6">
                        {positions.map((job, i) => (
                            <Card key={i} className="p-6 hover:border-primary/50 transition-colors group">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                                    <div className="flex-1">
                                        <div className="flex flex-wrap items-center gap-3 mb-2">
                                            <h3 className="text-2xl font-bold group-hover:text-primary transition-colors">{job.title}</h3>
                                            <Badge variant="secondary" className="font-medium">{job.department}</Badge>
                                        </div>

                                        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-4">
                                            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {job.location}</span>
                                            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> {job.type}</span>
                                            <span className="font-medium text-foreground">{job.salary}</span>
                                        </div>

                                        <p className="text-muted-foreground mb-4 leading-relaxed max-w-3xl">
                                            {job.description}
                                        </p>

                                        <div className="flex gap-2">
                                            {job.tags.map((tag, t) => (
                                                <span key={t} className="text-xs bg-muted px-2 py-1 rounded-md text-muted-foreground">
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex-shrink-0 pt-2">
                                        <Button size="lg" className="w-full lg:w-auto">Apply Now</Button>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </div>

                <div className="mt-20 text-center bg-muted/30 rounded-3xl p-12 border border-border/50">
                    <h3 className="text-2xl font-bold mb-4">Don't see the right role?</h3>
                    <p className="text-muted-foreground mb-8">
                        We are always looking for exceptional talent. If you think you can help us, we want to hear from you.
                    </p>
                    <Button variant="outline" size="lg">Email General Application</Button>
                </div>
            </div>
        </Layout>
    );
}
