import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Bot, 
  Shield, 
  Zap, 
  Users, 
  Award, 
  Globe, 
  Cpu, 
  Heart,
  ArrowRight,
  CheckCircle,
  Target,
  Lightbulb
} from "lucide-react";

const About = () => {
  const stats = [
    { icon: Bot, label: "Robots Deployed", value: "10,000+" },
    { icon: Users, label: "Happy Customers", value: "2,500+" },
    { icon: Globe, label: "Countries Served", value: "25+" },
    { icon: Award, label: "Years Experience", value: "15+" },
  ];

  const values = [
    {
      icon: Lightbulb,
      title: "Innovation",
      description: "Pushing the boundaries of robotics technology with cutting-edge AI and engineering solutions."
    },
    {
      icon: Shield,
      title: "Reliability",
      description: "Building robots that work flawlessly in critical environments, backed by comprehensive warranties."
    },
    {
      icon: Heart,
      title: "Customer First",
      description: "Every robot is designed with our customers' needs in mind, ensuring maximum value and satisfaction."
    },
    {
      icon: Target,
      title: "Precision",
      description: "Delivering exact specifications and performance through meticulous engineering and quality control."
    },
  ];

  const teamMembers = [
    {
      name: "Abhayadev S L",
      role: "CEO & Founder",
      background: "Student of STIST TVM",
      expertise: "AI,  Robotics"
    },
    {
      name: "Abhijith S",
      role: "CTO",
      background: "Student of STIST TVM",
      expertise: "Computer Vision, ML"
    },
    {
      name: "Abhinav M S",
      role: "Head of Design",
      background: "Student of STIST TVM",
      expertise: "UX, Industrial Design"
    },
    {
      name: "Abhin Raj C P",
      role: "Chief Scientist",
      background: "Student of STIST TVM",
      expertise: "Materials Science, AI"
    },
  ];

  const milestones = [
    {
      year: "2024",
      title: "Company Founded",
      description: "Started with a vision to make robotics accessible to everyone"
    },
    {
      year: "2024", 
      title: "First Commercial Robot",
      description: "Launched our breakthrough security robot, revolutionizing the industry"
    },
    {
      year: "2024",
      title: "Global Expansion",
      description: "Expanded operations to 15 countries, serving major enterprises worldwide"
    },
    {
      year: "2024",
      title: "AI Integration",
      description: "Integrated advanced AI capabilities across all product lines"
    },
    {
      year: "2024",
      title: "Custom Build Platform",
      description: "Launched industry-first custom robot builder platform"
    },
    {
      year: "2025",
      title: "Next Generation",
      description: "Introducing quantum-enhanced processing and autonomous fleet management"
    },
  ];

  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary text-primary-foreground">About Customo RoBo</Badge>
          <h1 className="text-5xl font-bold mb-6">
            Pioneering the Future of Robotics
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
            For over 15 years, we've been at the forefront of robotics innovation, 
            creating intelligent machines that enhance human capabilities and transform industries.
          </p>
          <Button variant="cta" size="lg">
            Join Our Mission
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center hover:glow-primary transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-primary rounded-full flex items-center justify-center mx-auto mb-4">
                    <stat.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <p className="text-3xl font-bold text-primary mb-2">{stat.value}</p>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-muted-foreground mb-6">
                To democratize robotics technology by making advanced, intelligent robots 
                accessible to businesses and individuals worldwide. We believe that robotics 
                should enhance human potential, not replace it.
              </p>
              <div className="space-y-3">
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Advancing AI and robotics research</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Creating sustainable and ethical technology</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-3" />
                  <span>Empowering businesses through automation</span>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Our Vision</h3>
                <p className="text-muted-foreground">
                  A world where intelligent robots work alongside humans to solve complex 
                  challenges, improve quality of life, and push the boundaries of what's possible.
                </p>
              </Card>
              <Card className="p-6">
                <h3 className="text-xl font-semibold mb-3">Our Values</h3>
                <p className="text-muted-foreground">
                  Innovation, reliability, and customer-centricity drive everything we do. 
                  We're committed to building trust through transparency and excellence.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">What Drives Us</h2>
            <p className="text-muted-foreground text-lg">
              Our core values shape every decision and guide our innovation
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center hover:glow-primary transition-all duration-300">
                <CardContent className="p-8">
                  <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-accent-foreground" />
                  </div>
                  <h3 className="text-xl font-semibold mb-3">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Meet Our Leadership</h2>
            <p className="text-muted-foreground text-lg">
              Visionary leaders with decades of robotics and AI expertise
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:glow-primary transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gradient-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary-foreground">
                      {member.name.split(' ').map(n => n[0]).join('')}
                    </span>
                  </div>
                  <h3 className="text-lg font-semibold mb-1">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground mb-3">{member.background}</p>
                  <Badge variant="outline" className="text-xs">
                    {member.expertise}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Company Timeline */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-muted-foreground text-lg">
              Key milestones in our mission to revolutionize robotics
            </p>
          </div>
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-border"></div>
              <div className="space-y-8">
                {milestones.map((milestone, index) => (
                  <div key={index} className="relative flex items-center">
                    <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                    <div className="ml-16">
                      <Card className="hover:glow-primary transition-all duration-300">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className="bg-primary text-primary-foreground">{milestone.year}</Badge>
                          </div>
                          <h3 className="text-xl font-semibold mb-2">{milestone.title}</h3>
                          <p className="text-muted-foreground">{milestone.description}</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Build the Future?</h2>
          <p className="text-muted-foreground mb-8 text-lg max-w-2xl mx-auto">
            Join thousands of innovators who trust Customo RoBo to bring their robotic visions to life.
            Let's create something extraordinary together.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="cta" size="lg">
              Start Your Project
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button variant="outline" size="lg">
              Contact Us
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;