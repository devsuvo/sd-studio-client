"use client";

import { useState } from "react";
import type { Swiper as SwiperType } from "swiper";
import { A11y, FreeMode, Keyboard, Navigation, Pagination, Thumbs } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/thumbs";
import StudioImage from "@/components/studio-image";

export default function Gallery({ images, title }: { images: string[]; title: string }) {
  const [thumbs, setThumbs] = useState<SwiperType | null>(null);

  return (
    <div className="gallery-carousel space-y-3">
      <Swiper
        modules={[Navigation, Pagination, Thumbs, Keyboard, A11y]}
        navigation={images.length > 1}
        pagination={{ clickable: true }}
        keyboard={{ enabled: true }}
        loop={images.length > 1}
        thumbs={{ swiper: thumbs && !thumbs.destroyed ? thumbs : null }}
        className="aspect-[16/9] overflow-hidden rounded-3xl bg-base-200"
      >
        {images.map((src, i) => (
          <SwiperSlide key={src + i}>
            <StudioImage src={src} alt={`${title} — photo ${i + 1}`} className="size-full" />
          </SwiperSlide>
        ))}
      </Swiper>
      {images.length > 1 && (
        <Swiper
          modules={[FreeMode, Thumbs]}
          onSwiper={setThumbs}
          freeMode
          watchSlidesProgress
          slidesPerView={3.2}
          spaceBetween={12}
          breakpoints={{ 640: { slidesPerView: 5 }, 1024: { slidesPerView: 6 } }}
        >
          {images.map((src, i) => (
            <SwiperSlide key={src + i} className="cursor-pointer">
              <StudioImage src={src} alt="" className="aspect-[4/3] w-full rounded-xl" />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </div>
  );
}
