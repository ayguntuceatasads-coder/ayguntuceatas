import Link from "next/link";
import { Brain, Baby, UserPlus, Users, HeartHandshake, ClipboardList, ArrowRight } from "lucide-react";

export default function Home() {
  const services = [
    {
      title: "Yetişkin Terapisi",
      description: "Bireysel zorluklarınızla başa çıkmak ve içsel dengenizi bulmak için profesyonel destek.",
      icon: <Brain className="w-8 h-8 text-teal-600" />,
      href: "/hizmetlerimiz/yetiskin-terapisi"
    },
    {
      title: "Çocuk Terapisi",
      description: "Çocukların duygusal ve davranışsal gelişim süreçlerinde yanlarında oluyoruz.",
      icon: <Baby className="w-8 h-8 text-teal-600" />,
      href: "/hizmetlerimiz/cocuk-terapisi"
    },
    {
      title: "Ergen Terapisi",
      description: "Ergenlik döneminin getirdiği karmaşık duygusal ve sosyal süreçlerde rehberlik.",
      icon: <UserPlus className="w-8 h-8 text-teal-600" />,
      href: "/hizmetlerimiz/ergen-terapisi"
    },
    {
      title: "Aile Terapisi",
      description: "Aile içi iletişimi güçlendirmek ve çatışmaları sağlıklı yollarla çözmek için terapi.",
      icon: <Users className="w-8 h-8 text-teal-600" />,
      href: "/hizmetlerimiz/aile-terapisi"
    },
    {
      title: "Çift Terapisi",
      description: "İlişkinizdeki düğümleri çözmek ve bağınızı yeniden güçlendirmek için güvenli bir alan.",
      icon: <HeartHandshake className="w-8 h-8 text-teal-600" />,
      href: "/hizmetlerimiz/cift-terapisi"
    },
    {
      title: "Psikolojik Testler",
      description: "Kişilik, zeka ve gelişim odaklı bilimsel, güvenilir psikolojik ölçek ve testler.",
      icon: <ClipboardList className="w-8 h-8 text-teal-600" />,
      href: "/hizmetlerimiz/psikolojik-testler"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* HERO BÖLÜMÜ */}
      <section className="relative bg-teal-50/50 py-20 lg:py-32 overflow-hidden">
        <div className="container mx-auto px-4 md:px-8 flex flex-col lg:flex-row items-center gap-12">
          
          {/* Sol: Metin Alanı */}
          <div className="flex-1 space-y-8 text-center lg:text-left z-10">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 leading-tight">
              İçsel Yolculuğunuzda <br className="hidden lg:block"/>
              <span className="text-teal-600">Güvenli Bir Adım Atın</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Antalya'da uzman psikolog kadromuzla yetişkin, çocuk, ergen, aile ve çift terapisi alanlarında bilimsel temelli psikolojik destek sunuyoruz.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <Link 
                href="/iletisim" 
                className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-white bg-teal-600 hover:bg-teal-700 rounded-lg shadow-sm transition-all duration-200"
              >
                Randevu Al
              </Link>
              <Link 
                href="/hizmetlerimiz" 
                className="w-full sm:w-auto px-8 py-3.5 text-base font-medium text-teal-700 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-lg transition-all duration-200"
              >
                Hizmetlerimizi İnceleyin
              </Link>
            </div>
          </div>

          {/* Sağ: Görsel Alanı */}
          <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10">
            <div className="aspect-[4/3] rounded-2xl bg-slate-200 overflow-hidden shadow-2xl border-8 border-white">
              {/* Not: public/ klasörüne 'hero-image.jpg' adında bir görsel eklendiğinde src kısmını değiştirebilirsin */}
              <div className="w-full h-full bg-gradient-to-tr from-teal-200 to-slate-200 flex items-center justify-center text-slate-400">
                Görsel Alanı (800x600 px)
              </div>
            </div>
            {/* Dekoratif Şekiller */}
            <div className="absolute -z-10 top-1/2 -translate-y-1/2 right-0 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50"></div>
          </div>
        </div>
      </section>

      {/* HİZMETLER BÖLÜMÜ */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Hizmetlerimiz</h2>
            <p className="text-slate-600 text-lg">
              İhtiyacınıza uygun psikolojik destek süreçleriyle yaşam kalitenizi artırmak için buradayız.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <div key={index} className="group relative bg-white border border-slate-200 p-8 rounded-2xl hover:border-teal-500 hover:shadow-lg transition-all duration-300">
                <div className="w-16 h-16 bg-teal-50 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-3">
                  {service.title}
                </h3>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {service.description}
                </p>
                <Link 
                  href={service.href} 
                  className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700 transition-colors"
                >
                  Detaylı İncele
                  <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

    </div>
  );
}