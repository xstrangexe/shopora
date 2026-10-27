import { useEffect, useRef, useState } from "react";
import { trackViewContent } from "@/lib/pixels";
import { useI18n } from "@/lib/i18n-context";
import { averageRating, sortVariants, useReviews, type CatalogueProduct } from "@/lib/queries";
import {
  colourOptions,
  findVariant,
  imagesForColour,
  initialChoice,
  sizeAfterColourChange,
  sizeOptions,
} from "@/lib/variant-options";
import { StarRating } from "./star-rating";
import { ProductGallery } from "./product-gallery";
import { ModelHelp, OrderActions, StockLine, variantLabel } from "./product-purchase";
import { TrustCard } from "./trust-card";
import { ExpressOrderForm, ORDER_FORM_ID } from "./express-order-form";
import { StickyOrderBar } from "./sticky-order-bar";
import { localized } from "@/lib/i18n";
import { ColourPicker, SizePicker } from "./variant-picker";

/**
 * Product page layout.
 *
 * Built as a landing page for ad traffic: photos, name, price, the three
 * promises, the model and colour pickers, a short description, then the express
 * order form, so a buyer on a phone reads why to buy and then how, with nothing
 * between them. Actions live in `product-purchase.tsx` and `express-order-form.tsx`;
 * this file holds the state they share.
 */
export function ProductDetail({ product }: { product: CatalogueProduct }) {
  const { t, locale } = useI18n();
  const { data: reviews } = useReviews(product.id);

  const variants = sortVariants(product.product_variants);
  const stockable = variants.filter((v) => v.stock > 0);

  useEffect(() => {
    if (product.product_variants.length === 0) return;
    const price = Math.min(...product.product_variants.map((v) => v.price));
    trackViewContent({ id: product.id, name: product.name, price, quantity: 1 });
  }, [product.id]); // eslint-disable-line react-hooks/exhaustive-deps -- once per product

  const [choice, setChoice] = useState(() => initialChoice(variants));
  const [activeImage, setActiveImage] = useState(0);

  const colours = colourOptions(variants);
  const sizes = sizeOptions(variants, colours.length > 0 ? choice.colour : null);
  // No variant until every option shown is chosen: `findVariant` treats a null
  // size as "any size", which would quietly order the first model in the list.
  const choiceComplete =
    (colours.length === 0 || choice.colour !== null) &&
    (sizes.length === 0 || choice.size !== null);
  const selected = choiceComplete ? findVariant(variants, choice.colour, choice.size) : null;
  // The gallery follows the colour. With no colour photos, fall back to all.
  const colourImages = imagesForColour(variants, choice.colour);
  const images = colourImages.length > 0 ? colourImages : imagesForColour(variants, null);

  const pickColour = (colour: string) => {
    setChoice({ colour, size: sizeAfterColourChange(variants, colour, choice.size) });
    setActiveImage(0);
  };
  const pickSize = (size: string) => {
    setChoice((current) => ({ ...current, size }));
  };

  const pickersRef = useRef<HTMLDivElement>(null);
  const scrollToForm = () =>
    document.getElementById(ORDER_FORM_ID)?.scrollIntoView({ behavior: "smooth", block: "start" });
  const showPickers = () =>
    pickersRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
  const fromPrice = Math.min(...variants.map((v) => v.price));
  const label = selected ? variantLabel(selected) : null;

  const rating = reviews ? averageRating(reviews) : null;
  const description = product.description
    ? localized(locale, product.description, product.description_fr)
    : product.description_fr;
  const name = localized(locale, product.name, product.name_fr);

  return (
    <div className="grid grid-cols-[minmax(0,1fr)] gap-8 lg:grid-cols-2 lg:gap-12">
      <ProductGallery
        images={images}
        alt={choice.colour ? `${name} — ${choice.colour}` : name}
        active={activeImage}
        onSelect={setActiveImage}
      />

      <div className="flex flex-col gap-5">
        <div className="flex flex-col gap-2">
          <h1 className="font-display text-2xl font-semibold sm:text-3xl">{name}</h1>
          {reviews && reviews.length > 0 && (
            <span className="flex items-center gap-2">
              <StarRating value={rating ?? 0} />
              <span className="text-sm text-on-surface-muted">
                {t("reviews.count", { count: reviews.length })}
              </span>
            </span>
          )}
        </div>

        <StockLine
          selected={selected}
          fromPrice={fromPrice}
          hasStock={selected ? selected.stock > 0 : stockable.length > 0}
        />

        <TrustCard />

        <div ref={pickersRef} className="flex flex-col gap-5">
          <ColourPicker colours={colours} selected={choice.colour} onSelect={pickColour} />
          <SizePicker sizes={sizes} selected={choice.size} onSelect={pickSize} />
          {sizes.length > 0 && <ModelHelp name={name} />}
        </div>

        {/* What the case is, above the form: the selling points a buyer on a
            phone should read before the fields, not after them. */}
        {description && <Description text={description} />}

        {stockable.length > 0 && (
          <>
            <ExpressOrderForm
              product={product}
              name={name}
              selected={selected && selected.stock > 0 ? selected : null}
              variantLabel={label === "—" ? null : label}
              onMissingVariant={showPickers}
            />
            <OrderActions name={name} selected={selected} />
            <StickyOrderBar price={selected?.price ?? fromPrice} onOrder={scrollToForm} />
          </>
        )}
      </div>
    </div>
  );
}

/**
 * The product description, four lines at first with a "more" toggle, so a long
 * one does not push the form out of sight. Short descriptions show whole.
 */
function Description({ text }: { text: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const long = text.split("\n").length > 5 || text.length > 260;

  return (
    <div className="flex flex-col items-start gap-1">
      <p
        className={`whitespace-pre-line text-sm leading-7 text-on-surface-muted ${
          long && !open ? "line-clamp-5" : ""
        }`}
      >
        {text}
      </p>
      {long && (
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          className="min-h-10 text-sm font-semibold text-gold-ink"
        >
          {open ? t("store.readLess") : t("store.readMore")}
        </button>
      )}
    </div>
  );
}
