import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Skills from "./components/Skills";
import Projects from "./components/Projects";
import EngineeringFocus from "./components/EngineeringFocus";
import Experience from "./components/Experience";
import Education from "./components/Education";
import Certificates from "./components/Certificates";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import Streaks from "./components/Streaks";
import { StatsProvider } from "./lib/stats";

export default function App() {
  return (
    <StatsProvider>
      <a
        href="#main"
        className="focus-ring sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-2 focus:text-base-950"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Skills />
        <Projects />
        <EngineeringFocus />
        <Experience />
        <Education />
        <Certificates />
        <Streaks />
        <Contact />
      </main>
      <Footer />
    </StatsProvider>
  );
}
