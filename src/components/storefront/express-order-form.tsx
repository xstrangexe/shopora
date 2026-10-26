import { Field, Input } from "@/components/ui/form";
import { useI18n } from "@/lib/i18n-context";
import type { CatalogueProduct, CatalogueVariant } from "@/lib/queries";
import { isValidDzPhone } from "@/lib/express-order";
import { DeliveryChoice } from "./delivery-choice";
import { ExpressOrderSummary } from "./express-order-summary";
import { QuantityStepper, WilayaCommuneFields } from "./express-order-fields";
import { useExpressOrder } from "./use-express-order";

/** The section the "order now" buttons scroll to. */
export const ORDER_FORM_ID = "order";

/**
 * Express order form: the whole purchase on the product page, no cart.
 *
 * Name, phone, wilaya, commune and home or office — the same fields the YouCan
 * shop asked for. The order goes through `place_order()`, which prices it from
 * the catalogue, checks stock and the phone, and returns the tracking token;
 * only then does the buyer see the confirmation page. A ref guards against a
 * double tap sending two orders; see `use-express-order.ts`.
 */
export function ExpressOrderForm({
  product,
  name,
  selected,
  variantLabel,
  onMissingVariant,
}: {
  product: CatalogueProduct;
  name: string;
  selected: CatalogueVariant | null;
  variantLabel: string | null;
  /** Called when the buyer submits before picking a model or colour. */
  onMissingVariant: () => void;
}) {
  const { t } = useI18n();
  const order = useExpressOrder({ product, name, selected, onMissingVariant });
  const { fields, set } = order;

  return (
    <section
      id={ORDER_FORM_ID}
      className="scroll-mt-20 rounded-[20px] border-2 border-brand/60 bg-surface p-4 shadow-md sm:p-6"
      aria-labelledby="order-title"
    >
      <h2 id="order-title" className="font-display text-xl font-semibold">
        {t("express.title")}
      </h2>
      <p className="mb-4 mt-1 text-sm text-on-surface-muted">{t("express.subtitle")}</p>

      <form
        onSubmit={order.submit}
        onInput={order.markStarted}
        onChange={order.markStarted}
        className="flex flex-col gap-4"
      >
        <Field label={t("express.fullName")} required>
          <Input
            value={fields.customerName}
            onChange={(e) => set.setCustomerName(e.target.value)}
            autoComplete="name"
            placeholder={t("express.namePlaceholder")}
            required
            minLength={2}
            maxLength={120}
          />
        </Field>

        <Field label={t("express.phone")} error={order.phoneError} required>
          <Input
            value={fields.phone}
            onChange={(e) => {
              set.setPhone(e.target.value);
              order.setPhoneError(null);
            }}
            onBlur={() =>
              fields.phone &&
              !isValidDzPhone(fields.phone) &&
              order.setPhoneError(t("express.phoneInvalid"))
            }
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder="05 / 06 / 07 ..."
            required
            maxLength={20}
          />
        </Field>

        <WilayaCommuneFields
          wilaya={fields.wilaya}
          commune={fields.commune}
          communes={order.communes}
          onWilaya={set.chooseWilaya}
          onCommune={set.setCommune}
        />

        {fields.wilaya && order.officeFee === null && (
          <p className="rounded-[10px] bg-surface-mid px-3 py-2 text-xs text-on-surface-muted">
            {t("express.officeNone")}
          </p>
        )}
        <DeliveryChoice
          wilaya={fields.wilaya}
          homeFee={order.homeFee}
          pickupFee={order.officeFee}
          method={fields.method}
          officeId={fields.office.id}
          onChange={(next) => {
            set.setMethod(next.method);
            set.setOffice({ id: next.officeId, name: next.officeName });
          }}
        />

        {fields.method === "home" && (
          <Field label={t("express.address")} hint={t("express.addressHint")}>
            <Input
              value={fields.address}
              onChange={(e) => set.setAddress(e.target.value)}
              autoComplete="street-address"
              maxLength={500}
            />
          </Field>
        )}

        <QuantityStepper quantity={fields.quantity} max={order.maxQty} onChange={set.setQuantity} />

        <ExpressOrderSummary
          productName={name}
          variantLabel={variantLabel}
          quantity={fields.quantity}
          unitPrice={order.unitPrice}
          deliveryFee={order.fee}
          error={order.error}
          submitting={order.submitting}
        />
      </form>
    </section>
  );
}
