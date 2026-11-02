"use client";

import { ArrowRight, Warehouse } from "lucide-react";
import Link from "next/link";
import { A11y, Autoplay, EffectFade, Keyboard, Navigation, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/effect-fade";
import "swiper/css/navigation";
import "swiper/css/pagination";
import StudioImage from "./studio-image";

const img = (id: string) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=2000&q=85`;

const SLIDES = [
  {
    image: img("1516035069371-29a1b244cc32"),
    eyebrow: "Photo studios & cyc walls",
    title: "Your next campaign starts in the right light.",
    text: "Daylight lofts, infinity cyc walls and moody portrait sets, booked by the hour with gear already on the floor.",
  },
  {
    image: img("1485846234645-a62644f84728"),
    eyebrow: "Sound stages & film sets",
    title: "Roll camera on a stage built for it.",
    text: "Blackout stages with lighting grids, green screens and drive-in access for music videos, ads and short films.",
  },
  {
    image: img("1598488035139-bdbb2231ce04"),
    eyebrow: "Podcast rooms & music suites",
    title: "Record where the sound is already right.",
    text: "Treated podcast lounges, vocal booths and tracking rooms with mics and multi-cam setups ready when you arrive.",
  },
];

export default function HeroSlider() {
  return (
    <section className="hero-slider relative">
      <Swiper
        modules={[Autoplay, EffectFade, Navigation, Pagination, Keyboard, A11y]}
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={900}
        autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        navigation
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        className="h-[560px] sm:h-[620px]"
      >
        {SLIDES.map((s, i) => (
          <SwiperSlide key={s.title}>
            <div className="relative size-full">
              <StudioImage src={s.image} alt={s.eyebrow} className="absolute inset-0 size-full" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/10" />
              <div className="container-page relative flex h-full items-center">
                <div className="max-w-2xl px-2 text-white sm:px-8">
                  <span className="badge badge-primary">{s.eyebrow}</span>
                  {i === 0 ? (
                    <h1 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-6xl">{s.title}</h1>
                  ) : (
                    <h2 className="mt-5 text-4xl font-bold leading-[1.05] sm:text-6xl">{s.title}</h2>
                  )}
                  <p className="mt-5 max-w-xl text-lg text-white/85">{s.text}</p>
                  <div className="mt-8 flex flex-wrap gap-3">
                    <Link href="/studios" className="btn btn-primary btn-lg">
                      Explore Studios <ArrowRight className="size-5" />
                    </Link>
                    <Link
                      href="/add-studio"
                      className="btn btn-lg btn-outline border-white/70 text-white hover:border-white hover:bg-white hover:text-black"
                    >
                      <Warehouse className="size-5" /> Host Your Space
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
