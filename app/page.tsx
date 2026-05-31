import Nav from './components/nav/Nav'
import Hero from './components/hero/Hero'
import HowItWorks from './components/how-it-works/HowItWorks'
import Features from './components/features/Features'
import Download from './components/download/Download'
import FAQ from './components/faq/FAQ'
import Footer from './components/footer/Footer'
import DraggablePet from './components/demo/DraggablePet'
import Reveal from './components/Reveal'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        {/* Hero animates on load; the sections below reveal as they scroll in. */}
        <Hero />
        <Reveal><HowItWorks /></Reveal>
        <Reveal><Features /></Reveal>
        <Reveal><Download /></Reveal>
        <Reveal><FAQ /></Reveal>
      </main>
      <Footer />
      <DraggablePet />
    </>
  )
}
