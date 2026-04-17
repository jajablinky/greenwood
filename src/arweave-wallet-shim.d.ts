/**
 * Wander / ArConnect expose more than @types/arconnect documents.
 */
import "arconnect"

declare global {
  interface Window {
    arweaveWallet?: Window["arweaveWallet"] & {
      getActivePublicKey?(): Promise<string>
      walletName?: string
      signature?(
        data: Uint8Array,
        algorithm: AlgorithmIdentifier | RsaPssParams | EcdsaParams,
      ): Promise<Uint8Array>
      signDataItem?(
        item: {
          data: string | Uint8Array
          tags?: { name: string; value: string }[]
          anchor?: string
        },
        options?: Record<string, unknown>,
      ): Promise<Uint8Array | ArrayBuffer | ArrayBufferView>
    }
  }
}

export {}
