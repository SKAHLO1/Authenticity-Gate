import { Layout } from "@/components/Layout";
import { Card } from "@/components/ui/card";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import { Search, BrainCircuit, ShieldCheck, Database, ArrowRight, Layers, Lock, Cpu } from "lucide-react";
import { motion } from "framer-motion";

export default function HowItWorks() {
    const steps = [
        {
            icon: <Search className="w-8 h-8 text-blue-500" />,
            title: "1. Content Scanning",
            description: "You submit a URL. Our high-speed crawler extracts text, images, and metadata while respecting robots.txt. We normalize the data into a standardized format for analysis."
        },
        {
            icon: <BrainCircuit className="w-8 h-8 text-purple-500" />,
            title: "2. Multi-Model Consensus",
            description: "The content is broadcast to our network of 5 independent AI models (LLMs). Each model analyzes the content for different vectors: plagiarism, style inconsistencies, and diffusion artifacts."
        },
        {
            icon: <Database className="w-8 h-8 text-green-500" />,
            title: "3. Cryptographic Verification",
            description: "The results are aggregated using a Byzantine Fault Tolerance algorithm. The final consensus is hashed and signed, creating a permanent proof of verification."
        },
        {
            icon: <ShieldCheck className="w-8 h-8 text-primary" />,
            title: "4. Trust Score Generation",
            description: "You receive a detail report with a final Trust Score (0-100). This score is your quick reference for credibility, backed by the detailed forensic breakdown."
        }
    ];

    const faqs = [
        {
            question: "How accurate is the deepfake detection?",
            answer: "Our multi-model consensus approach significantly reduces false positives compared to single-model detectors. We currently achieve a 99.9% accuracy rate on established benchmarks (FaceForensics++, Celeb-DF). However, as generative AI evolves, we continuously update our diverse model set."
        },
        {
            question: "Is the verification data private?",
            answer: "The content you submit is processed ephemerally by our AI nodes. We only store the cryptographic hash of the content and the verification result on-chain. The original content itself is never permanently stored on our servers unless you explicitly opt-in for our dataset contribution program."
        },
        {
            question: "Which blockchain do you use?",
            answer: "We utilize GenLayer, a specialized Intelligent Layer 1 protocol designed for AI consensus. This allows us to perform complex non-deterministic computations (like AI inference) within the consensus mechanism itself, which is not possible on traditional chains like Ethereum."
        },
        {
            question: "Can I use the API for commercial purposes?",
            answer: "Yes! We offer a robust enterprise API for high-volume verification. Please check our API Reference page for integration details and contact our sales team for custom rate limits."
        }
    ];

    return (
        <Layout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">

                {/* Header */}
                <div className="text-center max-w-3xl mx-auto mb-20">
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        The <span className="text-primary">Technology</span> Behind Trust
                    </h1>
                    <p className="text-xl text-muted-foreground leading-relaxed">
                        We don't just "guess" if content is real. We prove it mathematically.
                        Discover the pipeline that powers the world's most advanced verification engine.
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative mb-32">
                    <div className="hidden lg:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-green-500/20 -z-10" />
                    {steps.map((step, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                        >
                            <Card className="h-full p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/50 transition-colors shadow-sm cursor-default">
                                <div className="w-16 h-16 rounded-2xl bg-background border border-border/50 flex items-center justify-center mb-6 shadow-sm">
                                    {step.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-3">{step.title}</h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {step.description}
                                </p>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                {/* Technical Architecture */}
                <div className="bg-muted/20 rounded-3xl p-8 md:p-12 mb-24 border border-border/50">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Under the Hood: GenLayer Protocol</h2>
                            <p className="text-muted-foreground mb-6 leading-relaxed">
                                Traditional blockchains can only verify deterministic code ("Is 1+1=2?").
                                AuthenticityVerifier runs on <strong>GenLayer</strong>, a revolutionary protocol
                                that enables validators to reach consensus on subjective data ("Is this image fake?").
                            </p>
                            <ul className="space-y-4">
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-primary/10 p-1.5 rounded-lg text-primary"><Layers className="w-4 h-4" /></div>
                                    <div>
                                        <h4 className="font-bold text-sm">Intelligent Validators</h4>
                                        <p className="text-xs text-muted-foreground">Nodes running LLMs instead of just hashing functions.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-primary/10 p-1.5 rounded-lg text-primary"><Lock className="w-4 h-4" /></div>
                                    <div>
                                        <h4 className="font-bold text-sm">Optimistic Security</h4>
                                        <p className="text-xs text-muted-foreground">Results are challenged/slashed if validators disagree.</p>
                                    </div>
                                </li>
                                <li className="flex items-start gap-3">
                                    <div className="mt-1 bg-primary/10 p-1.5 rounded-lg text-primary"><Cpu className="w-4 h-4" /></div>
                                    <div>
                                        <h4 className="font-bold text-sm">Cross-compatible</h4>
                                        <p className="text-xs text-muted-foreground">Connects to Ethereum, Solana, and other chains.</p>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div className="relative aspect-square md:aspect-auto md:h-full bg-background rounded-2xl border border-border flex items-center justify-center p-8 overflow-hidden">
                            {/* Abstract visualization placeholder - generated via CSS/Divs */}
                            <div className="relative w-full h-64 flex items-center justify-center">
                                <div className="absolute w-48 h-48 border-2 border-dashed border-primary/20 rounded-full animate-spin-slow" />
                                <div className="absolute w-32 h-32 border-2 border-primary/40 rounded-full animate-reverse-spin" />
                                <div className="z-10 bg-card p-4 rounded-xl shadow-lg border border-border/50 flex flex-col items-center">
                                    <BrainCircuit className="w-8 h-8 text-primary mb-2" />
                                    <span className="font-bold text-xs">Consensus Engine</span>
                                </div>
                                {/* Satellite nodes */}
                                <div className="absolute top-0 bg-background p-2 rounded-lg border shadow-sm text-xs font-mono">Node A</div>
                                <div className="absolute bottom-10 left-0 bg-background p-2 rounded-lg border shadow-sm text-xs font-mono">Node B</div>
                                <div className="absolute bottom-10 right-0 bg-background p-2 rounded-lg border shadow-sm text-xs font-mono">Node C</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* FAQ */}
                <div className="max-w-3xl mx-auto">
                    <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {faqs.map((faq, i) => (
                            <AccordionItem key={i} value={`item-${i}`}>
                                <AccordionTrigger className="text-left font-medium text-lg">{faq.question}</AccordionTrigger>
                                <AccordionContent className="text-muted-foreground leading-relaxed pb-4">
                                    {faq.answer}
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </div>

                {/* CTA */}
                <div className="mt-20 text-center">
                    <Link href="/">
                        <Button size="lg" className="h-12 px-8 text-lg gap-2 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-shadow">
                            Verify Content Now <ArrowRight className="w-5 h-5" />
                        </Button>
                    </Link>
                </div>
            </div>
        </Layout>
    );
}
