import { Layout } from "@/components/Layout";
import { Shield, Users, Globe, Award, Sparkles, Heart } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function About() {
    const team = [
        {
            name: "Dr. Elena Rostova",
            role: "Chief Executive Officer",
            bio: "Former AI Ethics Researcher at Stanford. Elena founded AuthenticityVerifier to bridge the gap between technological advancement and digital trust.",
            image: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200&h=200"
        },
        {
            name: "James Chen",
            role: "CTO & Co-Founder",
            bio: "Blockchain veteran with 10+ years experience in cryptography and distributed systems. Previously led protocol development at Ethereum Foundation.",
            image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200"
        },
        {
            name: "Sarah Williams",
            role: "Head of AI Research",
            bio: "Ph.D. in Computer Vision. Sarah leads our consensus model development, specializing in deepfake detection heuristics.",
            image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200&h=200"
        },
        {
            name: "Michael Ross",
            role: "Head of Product",
            bio: "Product visionary who believes in user-centric security tools. Michael ensures our complex technology is accessible to everyone.",
            image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200&h=200"
        }
    ];

    return (
        <Layout>
            {/* Hero Section */}
            <div className="relative overflow-hidden py-20 bg-primary/5">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <h1 className="text-5xl md:text-6xl font-display font-bold mb-6">
                        Restoring Trust in the <span className="text-primary">Digital Age</span>
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                        We are building the definitive verification layer for the internet.
                        By combining decentralized AI consensus with cryptographic proofs,
                        we enable a world where content authenticity is guaranteed.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                {/* Mission & Vision */}
                <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                    <div>
                        <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                        <div className="prose prose-lg dark:prose-invert">
                            <p className="text-muted-foreground mb-4">
                                The internet is flooded with synthetic media. While AI unlocks incredible creativity,
                                it also erodes our ability to discern truth from fiction. AuthenticityVerifier was
                                born from a necessity to solve this crisis.
                            </p>
                            <p className="text-muted-foreground">
                                We believe that verification shouldn't be controlled by a single centralized entity.
                                Truth is a consensus. Our platform leverages the GenLayer protocol to aggregate
                                judgments from diverse AI models, creating a trustless, transparent, and
                                immutable record of authenticity.
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-transparent border-blue-500/20">
                            <Shield className="w-8 h-8 text-blue-500 mb-4" />
                            <h3 className="font-bold text-lg">Unbiased</h3>
                            <p className="text-sm text-muted-foreground">Decentralized consensus removes single points of failure.</p>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                            <Globe className="w-8 h-8 text-purple-500 mb-4" />
                            <h3 className="font-bold text-lg">Universal</h3>
                            <p className="text-sm text-muted-foreground">Works across text, images, and video content.</p>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20">
                            <Award className="w-8 h-8 text-green-500 mb-4" />
                            <h3 className="font-bold text-lg">Accuracy</h3>
                            <p className="text-sm text-muted-foreground">99.9% detection rate for known deepfake models.</p>
                        </Card>
                        <Card className="p-6 bg-gradient-to-br from-orange-500/10 to-transparent border-orange-500/20">
                            <Sparkles className="w-8 h-8 text-orange-500 mb-4" />
                            <h3 className="font-bold text-lg">Speed</h3>
                            <p className="text-sm text-muted-foreground">Real-time verification in under 5 seconds.</p>
                        </Card>
                    </div>
                </div>

                {/* Values */}
                <div className="text-center mb-24">
                    <h2 className="text-3xl font-bold mb-12">Our Core Values</h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="p-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Shield className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Integrity First</h3>
                            <p className="text-muted-foreground">We never compromise on the accuracy or security of our verification process.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Users className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Radical Transparency</h3>
                            <p className="text-muted-foreground">Our code is open source, and our verification logic is verifiable on-chain.</p>
                        </div>
                        <div className="p-6">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Heart className="w-6 h-6 text-primary" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Human Centric</h3>
                            <p className="text-muted-foreground">Technology should serve humanity, protecting our discourse and democracy.</p>
                        </div>
                    </div>
                </div>

                {/* Team Section */}
                <div>
                    <h2 className="text-3xl font-bold mb-12 text-center">Meet the Leadership</h2>
                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {team.map((member, i) => (
                            <Card key={i} className="p-6 text-center hover:border-primary/50 transition-colors group">
                                <Avatar className="w-24 h-24 mx-auto mb-6 ring-4 ring-background shadow-xl">
                                    <AvatarImage src={member.image} alt={member.name} />
                                    <AvatarFallback>{member.name.substring(0, 2)}</AvatarFallback>
                                </Avatar>
                                <h3 className="font-bold text-lg mb-1">{member.name}</h3>
                                <p className="text-primary text-sm font-medium mb-4">{member.role}</p>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {member.bio}
                                </p>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </Layout>
    );
}
