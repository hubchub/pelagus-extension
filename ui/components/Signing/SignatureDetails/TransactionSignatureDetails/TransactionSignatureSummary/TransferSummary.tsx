import { selectAssetPricePoint } from "@pelagus/pelagus-background/redux-slices/assets"
import {
  getAssetsState,
  selectMainCurrencySymbol,
} from "@pelagus/pelagus-background/redux-slices/selectors"
import {
  AssetDecimalAmount,
  enrichAssetAmountWithMainCurrencyValues,
} from "@pelagus/pelagus-background/redux-slices/utils/asset-utils"
import { AssetTransfer } from "@pelagus/pelagus-background/services/enrichment"
import React, { ReactElement } from "react"
import { useTranslation } from "react-i18next"
import { AnyAssetAmount } from "@pelagus/pelagus-background/assets"
import { HexString } from "@pelagus/pelagus-background/types"
import SigningDataTransactionSummaryBody from "./TransactionSignatureSummaryBody"
import { TransactionSignatureSummaryProps } from "./TransactionSignatureSummaryProps"
import { useBackgroundSelector } from "../../../../../hooks"
import SharedAddress from "../../../../Shared/SharedAddress"

type TransferSummaryBaseProps = {
  title?: string
  assetAmount: AnyAssetAmount & AssetDecimalAmount
  recipientAddress: HexString
  recipientName?: string | undefined
}

export function TransferSummaryBase({
  title,
  assetAmount,
  recipientAddress,
  recipientName,
}: TransferSummaryBaseProps): ReactElement {
  const { t } = useTranslation("translation", {
    keyPrefix: "signTransaction.assetTransfer",
  })
  const assets = useBackgroundSelector(getAssetsState)
  const mainCurrencySymbol = useBackgroundSelector(selectMainCurrencySymbol)
  const assetPricePoint = selectAssetPricePoint(
    assets,
    assetAmount.asset,
    mainCurrencySymbol
  )
  const localizedMainCurrencyAmount =
    enrichAssetAmountWithMainCurrencyValues(assetAmount, assetPricePoint, 2)
      .localizedMainCurrencyAmount ?? "-"

  return (
    <>
      <h1 className="serif_header title">{title ?? t("title")}</h1>
      <SigningDataTransactionSummaryBody>
        <div className="container">
          <div className="label">{t("sendTo")}</div>
          <div className="send_to">
            <SharedAddress address={recipientAddress} name={recipientName} />
          </div>
        </div>
        <div className="divider" />
        <div className="container">
          <span className="label">{t("spendAmountLabel")}</span>
          <span className="spend_amount">
            {assetAmount.localizedDecimalAmount} {assetAmount.asset.symbol}
          </span>
          <span className="label">${`${localizedMainCurrencyAmount}`}</span>
        </div>

        <style jsx>
          {`
            .label {
              color: var(--green-40);
              font-size: 16px;
              line-height: 24px;
              margin-bottom: 4px;
            }
            .spend_amount {
              color: #fff;
              font-size: 28px;
              text-align: right;
              text-transform: uppercase;
            }
            .divider {
              width: 80%;
              height: 2px;
              opacity: 60%;
              background-color: var(--green-120);
            }
            .container {
              display: flex;
              margin: 20px 0;
              flex-direction: column;
              align-items: center;
            }
            .send_to {
              font-size: 16px;
            }
          `}
        </style>
      </SigningDataTransactionSummaryBody>
    </>
  )
}

export default function TransferSummary({
  annotation: { assetAmount, recipient },
}: TransactionSignatureSummaryProps<AssetTransfer>): ReactElement {
  return (
    <TransferSummaryBase
      assetAmount={assetAmount}
      recipientAddress={recipient.address}
      recipientName={
        recipient.annotation.nameRecord?.resolved.nameOnNetwork.name
      }
    />
  )
}
