import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { ImagePlus, Plus } from "lucide-react";
import { toast } from "sonner";
import { StarRatingInput } from "@/components/storefront/star-rating";
import { Button } from "@/components/ui/button";
import { Field, Input, Select, Textarea } from "@/components/ui/form";
import { useI18n } from "@/lib/i18n-context";
import { addCustomerReview } from "@/lib/admin-reviews";
import { uploadProductImage } from "@/lib/image";
import { useProductPicker } from "@/lib/product-picker";

type Draft = { productId: string; name: string; rating: number; comment: string };
const EMPTY: Draft = { productId: "", name: "", rating: 5, comment: "" };

/**
 * "Add a customer review": the owner turns a photo and a message a buyer sent on
 * WhatsApp into a published review, with the photo, on the product's page and
 * the home page. Folded away until opened, so moderation stays the main view.
 */
export function ReviewAdd({ onAdded }: { onAdded: () => void }) {
  const { t } = useI18n();
  const products = useProductPicker();
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [photo, setPhoto] = useState<File | null>(null);

  const save = useMutation({
    mutationFn: async () => {
      let imageUrl: string | null = null;
      if (photo) {
        const upload = await uploadProductImage(photo, "reviews");
        if (upload.error) throw new Error(upload.error);
        imageUrl = upload.url;
      }
      await addCustomerReview({ ...draft, imageUrl });
    },
    onSuccess: () => {
      toast.success(t("admin.reviews.added"));
      setDraft(EMPTY);
      setPhoto(null);
      setOpen(false);
      onAdded();
    },
    onError: (error: Error) => toast.error(error.message),
  });

  if (!open) {
    return (
      <Button variant="outline" className="self-start" onClick={() => setOpen(true)}>
        <Plus size={16} aria-hidden="true" />
        {t("admin.reviews.add")}
      </Button>
    );
  }

  return (
    <form
      className="flex flex-col gap-4 rounded-[16px] border border-outline bg-surface p-5"
      onSubmit={(event) => {
        event.preventDefault();
        save.mutate();
      }}
    >
      <div>
        <p className="font-medium">{t("admin.reviews.add")}</p>
        <p className="text-sm text-on-surface-muted">{t("admin.reviews.addHelp")}</p>
      </div>

      <Field label={t("admin.reviews.product")} required>
        <Select
          value={draft.productId}
          required
          onChange={(event) => setDraft({ ...draft, productId: event.target.value })}
        >
          <option value="">{t("admin.reviews.chooseProduct")}</option>
          {(products.data ?? []).map((product) => (
            <option key={product.id} value={product.id}>
              {product.name}
            </option>
          ))}
        </Select>
      </Field>

      <Field label={t("admin.reviews.customer")} required>
        <Input
          value={draft.name}
          required
          minLength={2}
          maxLength={120}
          placeholder={t("admin.reviews.customerHint")}
          onChange={(event) => setDraft({ ...draft, name: event.target.value })}
        />
      </Field>

      <StarRatingInput
        name="admin-rating"
        label={t("reviews.rating")}
        value={draft.rating}
        onChange={(rating) => setDraft({ ...draft, rating })}
      />

      <Field label={t("reviews.comment")} required>
        <Textarea
          value={draft.comment}
          required
          minLength={3}
          maxLength={2000}
          onChange={(event) => setDraft({ ...draft, comment: event.target.value })}
        />
      </Field>

      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
        <ImagePlus size={18} aria-hidden="true" />
        {photo ? photo.name : t("admin.reviews.photo")}
        <input
          type="file"
          accept="image/*"
          className="sr-only"
          onChange={(event) => setPhoto(event.target.files?.[0] ?? null)}
        />
      </label>

      <div className="flex gap-2">
        <Button type="submit" disabled={save.isPending}>
          {save.isPending ? t("common.saving") : t("admin.reviews.publish")}
        </Button>
        <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
          {t("common.cancel")}
        </Button>
      </div>
    </form>
  );
}
