"use client";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const testimonials = [
  {
    quote: "I found my photographer in 10 minutes — and they nailed the shoot.",
    name: "Thandi M.",
    photo: "https://randomuser.me/api/portraits/women/44.jpg"
  },
  {
    quote: "SnapSpaces is the future of creative work.",
    name: "Sipho K.",
    photo: "https://randomuser.me/api/portraits/men/45.jpg"
  },
  {
    quote: "Booking a videographer was seamless and fast!",
    name: "Ayesha P.",
    photo: "https://randomuser.me/api/portraits/women/46.jpg"
  },
  {
    quote: "I love how easy it is to showcase my portfolio.",
    name: "Lebo N.",
    photo: "https://randomuser.me/api/portraits/men/47.jpg"
  }
];

export default function TestimonialsSlider() {
  return (
    <div className="max-w-5xl mx-auto">
      <Swiper
        spaceBetween={24}
        loop={true}
        pagination={{ clickable: true }}
        breakpoints={{
          0: { slidesPerView: 1 },
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="pb-10"
      >
        {testimonials.map((t, idx) => (
          <SwiperSlide key={idx}>
            <div className="bg-white rounded-2xl shadow-xl p-10 flex flex-col items-center text-center mx-2">
              <img src={t.photo} alt={t.name} className="w-20 h-20 rounded-full object-cover mb-6 border-4 border-[#CBC8C8] shadow" />
              <blockquote className="text-xl sm:text-2xl font-semibold text-[#171717] mb-4">“{t.quote}”</blockquote>
              <span className="text-[#171717]/80 text-lg font-medium">{t.name}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
} 