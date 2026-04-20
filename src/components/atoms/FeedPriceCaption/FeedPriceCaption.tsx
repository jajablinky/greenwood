import * as S from "./styles"

export type FeedPriceCaptionProps = {
  priceChangePct: string
  marketCapLabel: string
  variant?: "default" | "inline"
}

export function FeedPriceCaption({
  priceChangePct,
  marketCapLabel,
  variant = "default",
}: FeedPriceCaptionProps) {
  const inline = variant === "inline"
  return (
    <S.Root $inline={inline}>
      <S.MarketRow $inline={inline}>
        <S.Abbr title="Market cap">MC</S.Abbr>${marketCapLabel}
      </S.MarketRow>
      <S.Change $change={priceChangePct} $inline={inline}>
        {priceChangePct}
      </S.Change>
    </S.Root>
  )
}
