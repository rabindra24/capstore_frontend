import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Package,
  Users,
  BarChart3,
  Calendar,
  ShoppingCart,
  CheckCircle,
  ArrowRight,
  Star,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import heroImage from "@/assets/hero-dashboard.jpg";

const features = [
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Get intelligent recommendations and automated analysis of your business data.",
  },
  {
    icon: Package,
    title: "Smart Inventory Management",
    description: "Track stock levels, automate reorders, and prevent stockouts with AI predictions.",
  },
  {
    icon: Users,
    title: "Employee Management",
    description: "Manage your team, track performance, and assign tasks efficiently.",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description: "Real-time dashboards and reports to make data-driven decisions.",
  },
  {
    icon: Calendar,
    title: "Meeting Scheduler",
    description: "Integrated calendar and meeting management with team collaboration.",
  },
  {
    icon: ShoppingCart,
    title: "Order Processing",
    description: "Streamline order management from creation to fulfillment.",
  },
];

const benefits = [
  "Increase operational efficiency by 40%",
  "Reduce manual tasks with AI automation",
  "Real-time business insights and reporting",
  "Scalable solution for growing businesses",
  "24/7 customer support and training",
];

export default function Landing() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleContactSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent!",
      description: "We'll get back to you within 24 hours.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Brain className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-bold text-xl">AI Business Assistant</span>
            </div>
            
            <div className="hidden md:flex items-center gap-6">
              <a href="#features" className="text-muted-foreground hover:text-foreground transition-smooth">
                Features
              </a>
              <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-smooth">
                Benefits
              </a>
              <a href="#contact" className="text-muted-foreground hover:text-foreground transition-smooth">
                Contact
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button variant="default" asChild className="shadow-button">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background via-primary-light/20 to-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  🚀 AI-Powered Business Management
                </Badge>
                <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                  Transform Your Business with{" "}
                  <span className="gradient-hero bg-clip-text text-transparent">
                    AI Intelligence
                  </span>
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Streamline operations, boost productivity, and make smarter decisions with our comprehensive AI business management platform.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" asChild className="gradient-primary shadow-button hover-lift">
                  <Link to="/register">
                    Start Free Trial
                    <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="hover-lift">
                  <Link to="/login">Watch Demo</Link>
                </Button>
              </div>

              <div className="flex items-center gap-6 pt-6">
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-warning text-warning" />
                  ))}
                </div>
                <div className="text-sm text-muted-foreground">
                  <span className="font-semibold text-foreground">4.9/5</span> from 2,000+ businesses
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 gradient-hero rounded-2xl blur-3xl opacity-20"></div>
              <img
                src={heroImage}
                alt="AI Business Dashboard"
                className="relative rounded-2xl shadow-elegant hover-lift"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Powerful Features for Modern Business
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to manage and grow your business efficiently with AI-powered automation.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="hover-lift shadow-card">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary-light rounded-lg flex items-center justify-center mb-4">
                    <feature.icon className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle>{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-20 bg-secondary/20">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="w-fit">
                  ✨ Business Impact
                </Badge>
                <h2 className="text-3xl lg:text-4xl font-bold">
                  Measurable Results for Your Business
                </h2>
                <p className="text-lg text-muted-foreground">
                  Join thousands of businesses that have transformed their operations with our AI-powered platform.
                </p>
              </div>

              <div className="space-y-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                    <span className="text-foreground">{benefit}</span>
                  </div>
                ))}
              </div>

              <Button size="lg" asChild className="gradient-success shadow-button hover-lift">
                <Link to="/register">
                  Start Your Success Story
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Link>
              </Button>
            </div>

            <div className="relative">
              <Card className="shadow-elegant">
                <CardHeader>
                  <CardTitle>Business Growth Dashboard</CardTitle>
                  <CardDescription>Real-time metrics and insights</CardDescription>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-success-light rounded-lg">
                      <span className="font-medium">Revenue Growth</span>
                      <span className="text-success font-bold">+45%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-primary-light rounded-lg">
                      <span className="font-medium">Efficiency Gain</span>
                      <span className="text-primary font-bold">+40%</span>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-warning-light rounded-lg">
                      <span className="font-medium">Cost Reduction</span>
                      <span className="text-warning font-bold">-30%</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                Ready to Transform Your Business?
              </h2>
              <p className="text-xl text-muted-foreground">
                Get in touch with our team to learn how AI Business Assistant can help you achieve your goals.
              </p>
            </div>

            <div className="grid lg:grid-cols-2 gap-12">
              <Card className="shadow-card">
                <CardHeader>
                  <CardTitle>Send us a message</CardTitle>
                  <CardDescription>
                    We'll get back to you within 24 hours
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleContactSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">First Name</label>
                        <Input placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Last Name</label>
                        <Input placeholder="Doe" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Email</label>
                      <Input type="email" placeholder="john@company.com" required />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <Input placeholder="Your Company Name" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Message</label>
                      <Textarea 
                        placeholder="Tell us about your business needs..."
                        rows={4}
                        required
                      />
                    </div>
                    <Button 
                      type="submit" 
                      className="w-full gradient-primary shadow-button hover-lift"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <div className="space-y-8">
                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Email Us</h3>
                        <p className="text-muted-foreground mb-2">
                          Get support or ask questions
                        </p>
                        <p className="text-primary">hello@aibusiness.com</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-success-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-success" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Call Us</h3>
                        <p className="text-muted-foreground mb-2">
                          Speak with our sales team
                        </p>
                        <p className="text-success">+1 (555) 123-4567</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="shadow-card">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-warning-light rounded-lg flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-5 h-5 text-warning" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Visit Us</h3>
                        <p className="text-muted-foreground mb-2">
                          Our headquarters
                        </p>
                        <p className="text-warning">
                          123 Business Ave<br />
                          San Francisco, CA 94105
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-bold">AI Business Assistant</span>
              </div>
              <p className="text-muted-foreground">
                Empowering businesses with AI-driven management solutions.
              </p>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Product</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">Features</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">Pricing</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">API</a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Company</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">About</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">Blog</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">Careers</a>
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="font-semibold">Support</h4>
              <div className="space-y-2">
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">Help Center</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">Contact</a>
                <a href="#" className="block text-muted-foreground hover:text-foreground transition-smooth">Status</a>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-12 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 AI Business Assistant. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}