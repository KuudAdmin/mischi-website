import Nav from './components/nav/Nav'
import Hero from './components/hero/Hero'
import HowItWorks from './components/how-it-works/HowItWorks'
import Features from './components/features/Features'
import Download from './components/download/Download'
import FAQ from './components/faq/FAQ'
import Footer from './components/footer/Footer'
import DraggablePet from './components/demo/DraggablePet'

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <Download />
        <FAQ />
      </main>
      <Footer />
      <DraggablePet />
    </>
  )
}
