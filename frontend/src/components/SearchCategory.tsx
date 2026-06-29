"use client";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useRef } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import clsx from "clsx";
import { useProduct } from "@/lib/features/product/ProductServer";
import { useAppSelector } from "@/lib/hooks";

export default function SearchCategory() {
  const { category } = useAppSelector((state) => state.product);
  const { SearchCategoryProducts, GetSearchCategoryProducts, GetProducts } = useProduct();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category");
  const isActiveAll = currentCategory === "all" || !currentCategory;

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    GetSearchCategoryProducts();
  }, []);

  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;

    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        container.scrollLeft += e.deltaY;
      }
    };

    container.addEventListener("wheel", handleWheel, { passive: false });
    return () => container.removeEventListener("wheel", handleWheel);
  }, [category]); 

  const handleSearchCategory = (categorySlug: string) => {
    if (categorySlug === "all") {
      return GetProducts();
    }
    SearchCategoryProducts(categorySlug);
  };

  if (!category.length) return null;

  return (
    <div className="w-full my-[10px] md:my-[20px] overflow-hidden container">
      <ScrollContainer
        innerRef={scrollRef}
        vertical={false}
        className="w-full flex items-center justify-start gap-[31px] py-[5px] md:py-[0px] overflow-x-auto scrollbar-none"
      >
        <button
          onClick={() => handleSearchCategory("all")}
          className={clsx(
            `
            font-bold whitespace-nowrap flex-shrink-0
            flex justify-center items-center
            p-0 rounded-[10px] text-black
            text-[16px] md:text-[20px] transition-all duration-200
            border border-transparent
            `,
            { "text-red_first": isActiveAll }
          )}
        >
          Все
        </button>

        {category.map((cat) => {
          if (cat.slug === "all") return null;
          const isActive = currentCategory === cat.slug;

          return (
            <button
              key={cat.id || cat.slug} 
              onClick={() => handleSearchCategory(cat.slug)}
              className={clsx(
                `
                font-bold whitespace-nowrap flex-shrink-0
                flex justify-center items-center
                p-0 rounded-[10px] text-black
                text-[16px] md:text-[20px] transition-all duration-200
                border border-transparent
                `,
                { "text-red_first": isActive }
              )}
            >
              {cat.name}
            </button>
          );
        })}
      </ScrollContainer>
    </div>
  );
}