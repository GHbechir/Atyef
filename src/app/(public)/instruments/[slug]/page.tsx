import Link from "next/link";
import { Music2, BookOpen, Users, Star, ChevronRight, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSTRUMENTS, FEATURED_COURSES } from "@/lib/mock-data";

// List of known instrument slugs for static generation
const instrumentData: Record<string, { heroEmoji: string; heroTitle: string; heroDescription: string; features: string[] }> = {
  piano: {
    heroEmoji: "🎹",
    heroTitle: "Apprenez le Piano en ligne",
    heroDescription: "Des fondamentaux aux techniques avancées. Classique, jazz, pop et plus encore. Progressez à votre rythme avec des professeurs passionnés.",
    features: ["Lecture de notes et solfège", "Accords et accompagnement", "Improvisation jazz", "Morceaux classiques et pop"],
  },
  guitare: {
    heroEmoji: "🎸",
    heroTitle: "Cours de Guitare en ligne",
    heroDescription: "Acoustique ou électrique, débutant ou confirmé. Rock, blues, folk, fingerpicking. Apprenez les chansons que vous aimez.",
    features: ["Accords ouverts et barrés", "Strumming et fingerpicking", "Solos et improvisation", "Tablatures et partitions"],
  },
  basse: {
    heroEmoji: "🎸",
    heroTitle: "Cours de Basse en ligne",
    heroDescription: "Grooves, slap, walking bass et techniques modernes. Devenez le pilier rythmique de votre groupe.",
    features: ["Grooves funk et rock", "Technique du slap", "Walking bass jazz", "Lecture de grilles"],
  },
  batterie: {
    heroEmoji: "🥁",
    heroTitle: "Cours de Batterie en ligne",
    heroDescription: "Rythmes, rudiments, fills et coordination. Du rock au jazz, maîtrisez la batterie étape par étape.",
    features: ["Rythmes fondamentaux", "Rudiments et technique", "Fills et solos", "Coordination main-pied"],
  },
  chant: {
    heroEmoji: "🎤",
    heroTitle: "Cours de Chant en ligne",
    heroDescription: "Technique vocale, respiration, placement de voix et interprétation. Libérez votre voix avec nos professeurs experts.",
    features: ["Respiration abdominale", "Placement de voix", "Extension de tessiture", "Interprétation et style"],
  },
};

export default async function InstrumentPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const instrument = INSTRUMENTS.find(i => i.slug === slug);
  const data = instrumentData[slug];

  if (!instrument || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-6xl mb-4">🎵</p>
          <h1 className="text-2xl font-bold text-white mb-2">Instrument non trouvé</h1>
          <Link href="/instruments" className="text-primary hover:underline">
            Voir tous les instruments
          </Link>
        </div>
      </div>
    );
  }

  const courses = FEATURED_COURSES.filter(c => c.instrument.slug === slug);

  return (
    <div className="min-h-screen bg-background">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 bg-background/80 backdrop-blur-lg border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-bg flex items-center justify-center">
              <Music2 className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-lg">Aty<span className="gradient-text-purple">ef</span></span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/sign-in">
              <Button variant="ghost" size="sm">Se connecter</Button>
            </Link>
            <Link href="/sign-up">
              <Button size="sm" className="gradient-bg">Commencer</Button>
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <span className="text-8xl mb-6 block">{data.heroEmoji}</span>
          <h1 className="text-4xl md:text-6xl font-bold font-heading text-white mb-6">
            {data.heroTitle}
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
            {data.heroDescription}
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/sign-up">
              <Button size="lg" className="gradient-bg text-base px-8 py-6">
                Essai gratuit 7 jours <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
            <Link href="/courses">
              <Button size="lg" variant="outline" className="text-base px-8 py-6 border-white/10">
                Voir les cours
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold font-heading text-white text-center mb-12">
            Ce que vous apprendrez
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {data.features.map((feature, i) => (
              <div key={i} className="flex items-center gap-4 p-5 rounded-2xl bg-white/5 border border-white/10">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: `${instrument.color}20` }}>
                  <Star className="w-5 h-5" style={{ color: instrument.color }} />
                </div>
                <p className="text-white font-medium">{feature}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Courses */}
      {courses.length > 0 && (
        <section className="py-20 px-4">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl font-bold font-heading text-white text-center mb-12">
              Cours populaires
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <div key={course.id} className="rounded-2xl bg-white/5 border border-white/10 overflow-hidden hover:border-white/20 transition-all duration-300 group">
                  <div className="h-40 flex items-center justify-center text-6xl" style={{ backgroundColor: `${instrument.color}15` }}>
                    {data.heroEmoji}
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ backgroundColor: `${instrument.color}20`, color: instrument.color }}>
                        {course.level === "BEGINNER" ? "Débutant" : course.level === "INTERMEDIATE" ? "Intermédiaire" : "Avancé"}
                      </span>
                    </div>
                    <h3 className="font-semibold text-white mb-1 group-hover:text-primary transition-colors">{course.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{course.lessonCount} leçons</span>
                      <span>{Math.round(course.duration / 60)}h de contenu</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Stats */}
      <section className="py-20 px-4 bg-white/[0.02]">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-white mb-1">{instrument.courseCount}+</p>
              <p className="text-sm text-muted-foreground">Cours disponibles</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1">500+</p>
              <p className="text-sm text-muted-foreground">Heures de contenu</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-white mb-1">4.8</p>
              <p className="text-sm text-muted-foreground">Note moyenne ⭐</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold font-heading text-white mb-4">
            Prêt à commencer ?
          </h2>
          <p className="text-muted-foreground mb-8">
            Essayez Atyef gratuitement pendant 7 jours. Annulez à tout moment.
          </p>
          <Link href="/sign-up">
            <Button size="lg" className="gradient-bg text-base px-10 py-6">
              Commencer gratuitement
            </Button>
          </Link>
          <p className="text-xs text-muted-foreground mt-4">
            À partir de 9,90€/mois après l&apos;essai gratuit
          </p>
        </div>
      </section>
    </div>
  );
}
